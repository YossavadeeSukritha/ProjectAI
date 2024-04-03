from flask import Flask, request, render_template,Response, jsonify
from werkzeug.utils import secure_filename
import mysql.connector
import cv2
import os
import time
import base64
from datetime import date,datetime
from deepface import DeepFace
from gtts import gTTS
from pygame import mixer
import threading
from flask_cors import CORS
import shutil

app = Flask(__name__)
CORS(app)

mydb = mysql.connector.connect(
    host="localhost",
    user="root",
    passwd="",
    database="flask_db"
)
mycursor = mydb.cursor()


face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
def sound(name, emotion):
    query = """
    SELECT emotion_text.text, IFNULL(employee.emp_name, 'unknown') AS emp_name
    FROM detection 
    JOIN emotion_text ON detection.text_id = emotion_text.text_id 
    JOIN emotion ON emotion_text.emo_id = emotion.emo_id 
    JOIN employee ON detection.det_person = employee.emp_id
    WHERE emotion.emo_name = %s AND detection.det_person = %s
    ORDER BY detection.det_id DESC 
    LIMIT 1
    """
    val = (emotion, name)  

    mycursor.execute(query, val)
    result = mycursor.fetchone()  
    print(result)
    if result is None:
        file = gTTS(text='คุณคือใครฉันไม่รู้จักคุณ' ,lang='th')
    if result:
        text_to_speak, user_name = result    
        file = gTTS(text='คุณ' + user_name + ' ' + text_to_speak, lang='th')
    else:
        print("No records found.")
  
    filename = 'output.mp3'
    file.save(filename)
    mixer.init()

    mixer.music.load(filename)
    mixer.music.play()

    time.sleep(5)
    os.remove(filename)
 


def insert_face(emp_id, emotion, age, gender, imgS_blob, imgL_blob):

    # Convert the image to a binary format
    _, imgS_encoded = cv2.imencode('.jpg', imgS_blob)
    imgS_blob = imgS_encoded.tobytes()

    _, imgL_encoded = cv2.imencode('.jpg', imgL_blob)
    imgL_blob = imgL_encoded.tobytes()

    try:
        mycursor.execute("INSERT INTO detection (det_date, det_person, det_img_face, det_img_env, text_id, det_age, det_gender) "
                        "VALUES (%s, %s, %s, %s, (SELECT text_id FROM emotion_text "
                        "JOIN emotion ON emotion_text.emo_id = emotion.emo_id "
                        "WHERE emotion.emo_name = %s ORDER BY RAND() LIMIT 1), %s, %s)",
                        (str(date.today()), emp_id, imgS_blob, imgL_blob, emotion, age, gender))
        mydb.commit()
        print("Image path saved in the database.")
    except Exception as e:
        mydb.rollback()
        print("Error executing INSERT:", e)


def analyze_face(face_roi, x, y, w, h, img_flipped, saved_faces):
    emp_id = -1  # กำหนดค่าเริ่มต้นให้กับ emp_id
    try:
        analysis = DeepFace.analyze(face_roi, actions=['emotion', 'age', 'gender'], enforce_detection=False)
        emotion = analysis['emotion']['dominant_emotion']
        age = analysis['age']
        gender = analysis['gender']

        result = DeepFace.find(face_roi, db_path="dataset/", enforce_detection=False)
        if len(result['identity']) > 0:
            img_id = result['identity'][0].split('/')[-1].split('.')[0]
            try:
                mycursor.execute("SELECT img_person FROM img_dataset a LEFT JOIN employee b ON a.img_person = b.emp_id WHERE img_id = %s", (img_id,))
                row = mycursor.fetchone()
                if row:
                    emp_id = row[0]
            except Exception as e:
                print("Error executing SQL query or fetching data:", e)
        
        insert_face(emp_id, emotion, age, gender, face_roi, img_flipped)
        sound(emp_id, emotion)
        face_id = f"{x}-{y}-{w}-{h}"
        saved_faces.add(face_id)
    except Exception as e:
        print("Error in processing:", e)

def gen_frames():
    trackers = []  
    saved_faces = set()  
    wCam, hCam = 400, 400
    cap = cv2.VideoCapture(0)
    cap.set(3, wCam)
    cap.set(4, hCam)

    cnt = 0
    while True:
        success, img = cap.read()
        if not success:
            break

        img_resized = cv2.resize(img, (640, 480))
        img_flipped = cv2.flip(img_resized, 1)

       
        trackers = [tracker for tracker in trackers if tracker.update(img_flipped)[0]]

        gray_scale = cv2.cvtColor(img_flipped, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray_scale, 1.1, 4)
        
        for (x, y, w, h) in faces:
            cv2.rectangle(img_flipped, (x, y), (x+w, y+h), (255, 255, 0), 2)    
            cv2.putText(img_flipped, 'please wait...', (x + 20, y + h + 28), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (153, 255, 255), 2, cv2.LINE_AA)

            
        if not trackers:
            for (x, y, w, h) in faces:
                face_roi = img_flipped[y:y+h, x:x+w]                
                threading.Thread(target=analyze_face, args=(face_roi, x, y, w, h, img_flipped, saved_faces)).start()
                tracker = cv2.legacy.TrackerKCF_create()

                tracker.init(img_flipped, (x, y, w, h))
                trackers.append(tracker)


    
        ret, buffer = cv2.imencode('.jpg', img_flipped)
        frame = buffer.tobytes()
        yield (b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')


@app.route('/')
def home():
    mycursor.execute("select a.det_id, a.det_person, b.emp_name, a.det_added "
                     "  from detection a "
                     "  left join employee b on a.det_person = b.emp_id "
                     " where a.det_date = curdate() "
                     " order by 1 desc")
    data = mycursor.fetchall()
 
    return render_template('index.html', data=data)


@app.route('/video_feed')
def video_feed():
    return Response(gen_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')


@app.route('/countTodayScan')
def countTodayScan():
    mycursor.execute("select count(*) "
                     "  from detection "
                     " where det_date = curdate() ")
    row = mycursor.fetchone()
    rowcount = row[0]
 
    return jsonify({'rowcount': rowcount})
 

@app.route('/loadData', methods=['GET', 'POST'])
def load_data():
    mycursor.execute("SELECT a.det_person, a.det_img_face, IFNULL(b.emp_name, 'unknown') AS emp_name, e.emo_name, a.det_age, a.det_gender "
                     "FROM detection a "
                     "JOIN emotion_text ON emotion_text.text_id = a.text_id "
                     "JOIN emotion e ON emotion_text.emo_id = e.emo_id "
                     "LEFT JOIN employee b ON a.det_person = b.emp_id "
                     "WHERE a.det_date = CURDATE() "
                     "ORDER BY a.det_added DESC")
    data = mycursor.fetchall()

    result = []
    for row in data:
        det_person, det_img_face, emp_name, det_emo, det_age, det_gender = row

        img_base64 = base64.b64encode(det_img_face).decode('utf-8')

        result.append((det_person, img_base64, emp_name, det_emo, det_age, det_gender))

    return jsonify(response=result)

# ---------------------- admin -------------------------------------------

#addimg
@app.route('/saveImage', methods=['POST'])
def save_image():
    data = request.get_json()
    if 'emp_id' not in data or 'imageBase64' not in data:
        return jsonify({"message": "Missing emp_id or imageBase64"}), 400
    
    emp_id = data['emp_id']
    image_base64 = data['imageBase64'].split(",")[1]

    # ตอนนี้ใช้ emp_id แทน emp_name สำหรับชื่อโฟลเดอร์และไฟล์
    folder_path = os.path.join('user_img', emp_id)
    if not os.path.exists(folder_path):
        os.makedirs(folder_path)

    filename = secure_filename(f"{emp_id}.jpg")
    image_path = os.path.join(folder_path, filename)
    with open(image_path, 'wb') as image_file:
        image_file.write(base64.b64decode(image_base64))

    return jsonify({"message": "Image saved successfully", "image_path": image_path}), 200

#deleteimg
@app.route('/deleteFolder/<empId>', methods=['DELETE'])
def delete_folder(empId):
    folder_path = os.path.join('user_img', empId) 
    try:
        if os.path.exists(folder_path):
            shutil.rmtree(folder_path)
        return jsonify({"message": "Folder deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
#editimg
@app.route('/updateImage/<empId>', methods=['PUT'])
def update_image(empId):
    data = request.get_json()
    image_base64 = data['imageBase64'].split(",")[1]
    folder_path = os.path.join('user_img', empId)
    
    if not os.path.exists(folder_path):
        os.makedirs(folder_path)
    
    filename = secure_filename(f"{empId}.jpg")
    image_path = os.path.join(folder_path, filename)
    with open(image_path, 'wb') as image_file:
        image_file.write(base64.b64decode(image_base64))

    return jsonify({"message": "Image updated successfully", "image_path": image_path}), 200


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5001, debug=True)
