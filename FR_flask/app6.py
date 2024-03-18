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
from concurrent.futures import ThreadPoolExecutor, as_completed


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


def insert_face(emp_id, emotion, age, gender, imgS_blob, imgL_blob):

    # Convert the image to a binary format
    _, imgS_encoded = cv2.imencode('.jpg', imgS_blob)
    imgS_blob = imgS_encoded.tobytes()

    _, imgL_encoded = cv2.imencode('.jpg', imgL_blob)
    imgL_blob = imgL_encoded.tobytes()

    try:
        mycursor.execute("INSERT INTO detection (det_date, det_person, det_img_face, det_img_env, det_emo, det_age, det_gender) VALUES (%s, %s, %s, %s, %s, %s, %s)",
                        (str(date.today()), emp_id, imgS_blob, imgL_blob, emotion, age, gender, ))
        mydb.commit()
        print("Image path saved in the database.")
    except Exception as e:
        mydb.rollback()
        print("Error executing INSERT:", e)

executor = ThreadPoolExecutor(max_workers=2)
def analyze_face(face_roi, x, y, w, h, img_flipped, saved_faces):
    try:
        analysis = DeepFace.analyze(face_roi, actions=['emotion', 'age', 'gender'], enforce_detection=False)
        emotion = analysis[0]['dominant_emotion']
        age = analysis[0]['age']
        gender = analysis[0]['dominant_gender']

        result = DeepFace.find(face_roi, db_path="dataset/", enforce_detection=False)
        if len(result[0]['identity']) > 0:
            img_id = result['identity'][0].split('/')[-1].split('.')[0]
            emp_id = None  # Initialize emp_id
            try:
                mycursor.execute("SELECT img_person FROM img_dataset WHERE img_id = %s", (img_id,))
                row = mycursor.fetchone()
                if row:
                    emp_id = row[0]
                else:
                    emp_id = -1  # Unknown person
            except Exception as e:
                print("Error executing SQL query or fetching data:", e)
                emp_id = -1  # Fallback in case of query error
        else:
            emp_id = -1  # Unknown person
               
        insert_face(emp_id, emotion, age, gender, face_roi, img_flipped)

        face_id = f"{x}-{y}-{w}-{h}"
        saved_faces.add(face_id)
    except Exception as e:
        print("Error in processing:", e)


def gen_frames():
    global executor
    trackers = []  
    saved_faces = set()  
    futures = []
    wCam, hCam = 400, 400
    cap = cv2.VideoCapture(0)
    cap.set(3, wCam)
    cap.set(4, hCam)

    
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
            cv2.rectangle(img_flipped, (x, y), (x+w, y+h), (255, 0, 0), 2)

       
        
        if not trackers:
            for (x, y, w, h) in faces:
                face_roi = img_flipped[y:y+h, x:x+w]
                # Submit tasks to the executor instead of starting new threads directly
                future = executor.submit(analyze_face, face_roi, x, y, w, h, img_flipped, saved_faces)
                futures.append(future)
                tracker = cv2.legacy.TrackerKCF_create()
                tracker.init(img_flipped, (x, y, w, h))
                trackers.append(tracker)

        # Optionally, handle completed futures if you need to process results
        for future in as_completed(futures):
            try:
                # Result handling if necessary...
                future.result()
            except Exception as exc:
                print(f'Generated an exception: {exc}')


    
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


@app.route('/countTodayScan', methods=['GET'])
def countTodayScan():
    mydb = mysql.connector.connect(
        host="localhost",
        user="root",
        passwd="",
        database="flask_db"
    )
    mycursor = mydb.cursor()
    try:
        mycursor.execute("SELECT COUNT(*) FROM detection WHERE det_date = CURDATE()")
        rowcount = mycursor.fetchone()[0]
        return jsonify({'rowcount': rowcount})
    except Exception as e:
        print(f"Error in countTodayScan: {e}")
        return jsonify({'error': str(e)}), 500

 

@app.route('/loadData', methods=['GET', 'POST'])
def load_data():
    mycursor.execute("SELECT a.det_person, a.det_img_face, IFNULL(b.emp_name, 'unknown') AS emp_name, a.det_emo, a.det_age, a.det_gender "
                     "FROM detection a "
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


if __name__ == '__main__':
    try:
        app.run(host='127.0.0.1', port=5000, debug=True)
    finally:
        executor.shutdown(wait=True)  # Properly shutdown the executor when the app closes
        