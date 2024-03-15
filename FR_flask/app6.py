from flask import Flask, jsonify, Response, render_template
from flask_cors import CORS
import json
import os
import cv2
from deepface import DeepFace
import os
from datetime import date
import numpy as np 
import base64
import mysql.connector
import threading
from concurrent.futures import ThreadPoolExecutor  # เพิ่มเข้ามา


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


def insert_face(img_id, emotion, age, gender, imgS_blob, imgL_blob):

    # Convert the image to a binary format
    _, imgS_encoded = cv2.imencode('.jpg', imgS_blob)
    imgS_blob = imgS_encoded.tobytes()

    _, imgL_encoded = cv2.imencode('.jpg', imgL_blob)
    imgL_blob = imgL_encoded.tobytes()

    try:
        mycursor.execute("SELECT a.img_person, b.emp_name "
                        "FROM img_dataset a "
                        "LEFT JOIN employee b ON a.img_person = b.emp_id "
                        "WHERE img_id = %s", (img_id,))
        row = mycursor.fetchone()
        if row:
            emp_id, emp_name = row
        else:
            emp_id = -1
            emp_name = "unknown"
        
        mycursor.execute("INSERT INTO detection (det_date, det_person, det_img_face, det_img_env, det_emo, det_age, det_gender) VALUES (%s, %s, %s, %s, %s, %s, %s)",
                        (str(date.today()), emp_id, imgS_blob, imgL_blob, emotion, age, gender))
        mydb.commit()
        print("Image path saved in the database.")
    except Exception as e:
        mydb.rollback()
        print("Error executing INSERT:", e)




def analyze_face(face_roi, x, y, w, h, cam_flip, saved_faces):
    try:
        analysis = DeepFace.analyze(face_roi, actions=['emotion', 'age', 'gender'], enforce_detection=False)
        emotion = analysis[0]['dominant_emotion']
        age = analysis[0]['age']
        gender = analysis[0]['dominant_gender']
        print(emotion,age,gender)
        result = DeepFace.find(face_roi, db_path="dataset/", enforce_detection=False, model_name="VGG-Face")
        if len(result[0]['identity']) > 0:
            img_id = result[0]['identity'][0].split('/')[-1].split('.')[0]
            print("img_id"+img_id)
    
        else:
            img_id = -1
        
               
        insert_face(img_id, emotion, age, gender, face_roi, cam_flip)

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

    
    while True:
        success, img = cap.read()
        if not success:
            break

        cam_resize = cv2.resize(img, (640, 480))
        cam_flip = cv2.flip(cam_resize, 1)

       
        trackers = [tracker for tracker in trackers if tracker.update(cam_flip)[0]]

        gray_scale = cv2.cvtColor(cam_flip, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray_scale, 1.1, 4)

        for (x, y, w, h) in faces:
            cv2.rectangle(cam_flip, (x, y), (x+w, y+h), (255, 255, 0), 2)

       
        
        if not trackers:
            for (x, y, w, h) in faces:
                face_roi = cam_flip[y:y+h, x:x+w]
                threading.Thread(target=analyze_face, args=(face_roi, x, y, w, h, cam_flip, saved_faces)).start()
                tracker = cv2.TrackerKCF_create()
                tracker.init(cam_flip, (x, y, w, h))
                trackers.append(tracker)


    
        ret, buffer = cv2.imencode('.jpg', cam_flip)
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
    mycursor.execute(" SELECT a.det_person, a.det_img_face, IF(a.det_person = -1, 'unknown', IFNULL(b.emp_name, 'unknown')) AS emp_name, a.det_emo, a.det_age, a.det_gender "
                    " FROM detection a "
                    " LEFT JOIN employee b ON a.det_person = b.emp_id "
                    " WHERE a.det_date = CURDATE() "
                    " ORDER BY a.det_added DESC "
                    )
    data = mycursor.fetchall()

    result = []
    for row in data:
        det_person, det_img_face, emp_name, det_emo, det_age, det_gender = row

        img_base64 = base64.b64encode(det_img_face).decode('utf-8')

        result.append((det_person, img_base64, emp_name, det_emo, det_age, det_gender))

    return jsonify(response=result)


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5001, debug=True)
