from flask import Flask, request, render_template,Response, jsonify
import numpy as np
from werkzeug.utils import secure_filename
import mysql.connector
import cv2
import os
import time
import base64
from datetime import date,datetime,timedelta
from deepface import DeepFace
from gtts import gTTS
from pygame import mixer
import threading
from flask_cors import CORS
import shutil
import requests
import json
from parinya import LINE

mytoken = 'OyoWkSxi7Do5vSCHUc3wYlIJd6I66KX6yQz3dYm7tjI'
line = LINE(mytoken)

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
    url = "http://localhost:8081/Speak"
    data = {"name": name, "emotion": emotion}
    response = requests.post(url, json=data)
    
    try:
        if response.status_code == 200:
            response_data = response.json()
            text_to_speak = response_data.get('text_to_speak')
            user_name = response_data.get('user_name')
            
            if user_name: 
                text_to_speak = f"คุณ{user_name} {text_to_speak}"
            else:
                text_to_speak = 'คุณคือใครฉันไม่รู้จักคุณ'
            
            file = gTTS(text=text_to_speak, lang='th')
            filename = 'output.mp3'
            file.save(filename)
            mixer.init()
            mixer.music.load(filename)
            mixer.music.play()
            time.sleep(5)
            os.remove(filename)
        else:
            print("Failed to get response from API, status code:", response.status_code)
    except Exception as e:
        print(f"Error during text-to-speech process: {e}")

def analyze_face(face_roi, x, y, w, h, img_flipped, saved_faces):
    try:
        analysis = DeepFace.analyze(face_roi, actions=['emotion', 'age', 'gender'], enforce_detection=False)
        emotion = analysis[0]['dominant_emotion']
        age = analysis[0]['age']
        gender = analysis[0]['dominant_gender']

        result = DeepFace.find(face_roi, db_path="user_img/", enforce_detection=False)
        if len(result[0]['identity']) > 0:
            img_id = result[0]['identity'][0].split('/')[-1].split('.')[0]
        else:
            img_id = -1
            # line.sendtext("พบผู้บุกรุก")

        face_image_base64 = base64.b64encode(cv2.imencode('.jpg', face_roi)[1]).decode()
        full_image_base64 = base64.b64encode(cv2.imencode('.jpg', img_flipped)[1]).decode()
        
        api_url = 'http://localhost:8081/AddDetection'
        data = {
            "name": img_id,
            "emotion": emotion,
            "age": age,
            "gender": gender,
            "face_image": face_image_base64,
            "full_image": full_image_base64
        }

        response = requests.post(api_url, json=data)
        print("detection",response.status_code)
        if response.status_code == 200:
            print("Face inserted successfully")
        else:
            print("Failed to insert face")

        sound(img_id, emotion)

        face_id = f"{x}-{y}-{w}-{h}"
        saved_faces.add(face_id)

    except Exception as e:
        print("Error in processing:", e)


def gen_frames():
    saved_faces = set()  

    wCam, hCam = 400, 400
    cap = cv2.VideoCapture(0)
    cap.set(3, wCam)
    cap.set(4, hCam)

    tracker = cv2.legacy.TrackerKCF_create()
    onTracking = False


    while True:
        success, img = cap.read()
        if not success:
            break

        img_resized = cv2.resize(img, (640, 480))
        img_flipped = cv2.flip(img_resized, 1)

        if not onTracking:

            gray_scale = cv2.cvtColor(img_flipped, cv2.COLOR_BGR2GRAY)
            faces = face_cascade.detectMultiScale(gray_scale, 1.1, 4)
        
            for (x, y, w, h) in faces:
                cv2.rectangle(img_flipped, (x, y), (x+w, y+h), (255, 255, 0), 2)    
                cv2.putText(img_flipped, 'please wait...', (x + 20, y + h + 28), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (153, 255, 255), 2, cv2.LINE_AA)
                face_roi = img_flipped[y:y+h, x:x+w]
                threading.Thread(target=analyze_face, args=(face_roi, x, y, w, h, img_flipped, saved_faces)).start()
                if tracker.init(img_flipped, (x, y, w, h)):
                    onTracking = True
        else:
            ok, bbox = tracker.update(img_flipped)
            if ok:
                p1 = (int(bbox[0]), int(bbox[1]))
                p2 = (int(bbox[0] + bbox[2]), int(bbox[1] + bbox[3]))
                cv2.rectangle(img_flipped, p1, p2, (0, 255, 0), 2)
                cv2.putText(img_flipped, 'tracking...', (x + 20, y + h + 28), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (153, 255, 255), 2, cv2.LINE_AA)
            else:
                onTracking = False
                tracker = cv2.legacy.TrackerKCF_create()

        ret, buffer = cv2.imencode('.jpg', img_flipped)
        frame = buffer.tobytes()
        yield (b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/video_feed')
def video_feed():
    return Response(gen_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

# ---------------------- web_admin -------------------------------------------

#addimg
@app.route('/saveImage', methods=['POST'])
def save_image():
    data = request.get_json()
    # print(data)
    if 'emp_id' not in data or 'imageBase64' not in data:
        return jsonify({"message": "Missing emp_id or imageBase64"}), 400
    
    emp_id = data['emp_id']
    image_base64 = data['imageBase64'].split(",")[1]

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
