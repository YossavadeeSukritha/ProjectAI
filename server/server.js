import express from 'express'
import mysql from 'mysql'
import cors from 'cors'
import fileUpload from 'express-fileupload';
import axios from 'axios';

const app = express();
//default ตัว Express ไม่สามารถอ่าน req.body ได้ถ้าอยากให้อ่านได้ คือใช้ body-parser หรือใช้ตัว express.json()
app.use(express.json());
app.use(fileUpload());

app.use(cors(
    {
        origin: ["http://127.0.0.1:5173"],
        methods: ["POST, GET, DELETE, PUT"],
        credentials: true
    }
))

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "flask_db"
})

app.post('/Login', (req, res) => {
    const sql = "SELECT * FROM admin WHERE admin_email = ? AND admin_password = ?";
    db.query(sql, [req.body.email, req.body.password], (err, data) => {
        if (err) {
            return res.status(500).json({ Message: "Server Side Error", Error: err.message });
          }          
        if (data.length > 0) {
            return res.json({ Status: "Success" })
        } else {
            return res.json({ Message: "ไม่มีข้อมูล" });
        }
    })
})

app.post('/Logout', (req, res) => {
    res.json({ Message: "User logged out successfully" });
});

// แปลงformatวันที่
function formatDateToISO(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = `${d.getMonth() + 1}`.padStart(2, '0');
    const day = `${d.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
}

app.get('/Employee', (req, res) => {
    const sql = "SELECT * FROM employee";
    const search = req.query.search;

    if (search) {
        sql += ` WHERE emp_id LIKE '%${search}%' OR emp_name LIKE '%${search}%'`;
    }

    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Server side error" });
        }
        // แปลงformatวันที่
        const formattedResult = result.map(emp => ({
            ...emp,
            emp_dob: formatDateToISO(emp.emp_dob)
        }));
        res.json(formattedResult);
    });
});

app.post('/addEmployee', (req, res) => {
    const { emp_id, emp_name, emp_dob, emp_gender } = req.body;
    const emp_image = req.files.emp_image;

    // บันทึกข้อมูล emp_id, emp_name, emp_dob, emp_gender ลงในฐานข้อมูล
    const sql = 'INSERT INTO employee (emp_id, emp_name, emp_dob, emp_gender) VALUES (?, ?, ?, ?)';
    db.query(sql, [emp_id, emp_name, emp_dob, emp_gender], (err, result) => {
        if (err) {
            console.error('Error inserting user:', err);
            return res.status(500).json({ message: "Failed to add user" });
        }

        // แปลงรูปภาพเป็น Base64
        const imageBase64 = `data:${emp_image.mimetype};base64,${emp_image.data.toString('base64')}`;

        // จัดการกับ emp_image: ส่งไปยัง app.py
        axios.post('http://127.0.0.1:5001/saveImage', {
            emp_id: emp_id,
            imageBase64: imageBase64
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(flaskRes => {
            console.log('Image saved successfully on Flask');
            res.status(200).json({ message: "User and image added successfully" });
        }).catch(flaskErr => {
            console.error('Failed to save image on Flask:', flaskErr);
            res.status(500).json({ message: "Failed to save image" });
        });
    });
});

app.delete('/Employee/:empId', async (req, res) => {
    const { empId } = req.params;
    const sql = "DELETE FROM employee WHERE emp_id = ?";

    try {
        await axios.delete(`http://127.0.0.1:5001/deleteFolder/${empId}`);
    } catch (error) {
        return res.status(500).json({ message: "Failed to delete user's folder" });
    }

    db.query(sql, [empId], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Failed to delete user" });
        }
        res.json({ message: "User and folder deleted successfully" });
    });
});

app.put('/Employee/:empId', async (req, res) => {
    const { empId } = req.params;
    const { emp_name, emp_dob, emp_gender } = req.body;
    const emp_image = req.files ? req.files.emp_image : null;

    // อัปเดตข้อมูลในฐานข้อมูล
    const sqlUpdate = 'UPDATE employee SET emp_name = ?, emp_dob = ?, emp_gender = ? WHERE emp_id = ?';
    db.query(sqlUpdate, [emp_name, emp_dob, emp_gender, empId], async (err, result) => {
        if (err) {
            console.error('Error updating user:', err);
            return res.status(500).json({ message: "Failed to update user" });
        }
        
        // ถ้ามีรูปภาพ ส่งไปยัง app.py เพื่ออัปเดต
        if (emp_image) {
            const imageBase64 = `data:${emp_image.mimetype};base64,${emp_image.data.toString('base64')}`;
            try {
                await axios.put(`http://127.0.0.1:5001/updateImage/${empId}`, {
                    imageBase64: imageBase64
                }, {
                    headers: { 'Content-Type': 'application/json' },
                });
            } catch (error) {
                console.error('Failed to update image on Flask:', error);
            }
        }
        
        res.json({ message: "User and image updated successfully" });
    });
});



// ตั้งแต่ตรงนี้ไปต้องแก้ดึงapiจากหุสลงdbก่อน
app.get('/DetectionDetails', (req, res) => {
    const sql = `
    SELECT 
        detection.det_id,
        detection.det_date,
        detection.det_img_face,
        detection.det_img_env,
        detection.det_person,
        CASE 
            WHEN detection.det_person = -1 THEN 'Unknown'
            ELSE employee.emp_name
        END AS emp_name,
        detection.det_age,
        detection.det_gender,
        emotion.emo_name,
        detection.det_added,
        emotion_text.text
    FROM
        detection
    LEFT JOIN 
        employee ON detection.det_person = employee.emp_id
    LEFT JOIN 
        emotion_text ON detection.text_id = emotion_text.text_id
    LEFT JOIN 
        emotion ON emotion_text.emo_id = emotion.emo_id;
    `;

    const search = req.query.search;

    if (search) {
        sql += ` WHERE emp_id LIKE '%${search}%' OR emp_name LIKE '%${search}%'`;
    }

    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Server side error');
        }

        // แปลง BLOB เป็น Base64
        const detections = results.map(det => {
            const imgFaceBase64 = Buffer.from(det.det_img_face).toString('base64');
            const imgEnvBase64 = Buffer.from(det.det_img_env).toString('base64');
            const formattedDate = formatDateToISO(det.det_added);

            return {
                ...det,
                det_img_face: `data:image/jpeg;base64,${imgFaceBase64}`,
                det_img_env: `data:image/jpeg;base64,${imgEnvBase64}`,
                det_added: formattedDate,
            };
        });

        res.json(detections);
    });

});

app.get('/EmotionData', (req, res) => {
    const sqlDates = `SELECT DISTINCT det_date FROM detection ORDER BY det_date;`;
    const sqlEmotionCounts = `
        SELECT 
            detection.det_date,
            emotion.emo_name AS det_emo,
            COUNT(*) AS emo_count
        FROM 
            detection
        INNER JOIN 
            emotion_text ON detection.text_id = emotion_text.text_id
        INNER JOIN 
            emotion ON emotion_text.emo_id = emotion.emo_id
        GROUP BY 
            detection.det_date, 
            emotion.emo_name
        ORDER BY 
            detection.det_date, 
            emotion.emo_name;
    `;

    // ดึงวันที่ที่ไม่ซ้ำกัน
    db.query(sqlDates, (err, datesResults) => {
        if (err) {
            console.error(err);
            return res.status(500).send('เกิดข้อผิดพลาดทางด้านเซิร์ฟเวอร์');
        }

        // ดึงจำนวนอารมณ์แยกตามวันที่
        db.query(sqlEmotionCounts, (err, emotionCountsResults) => {
            if (err) {
                console.error(err);
                return res.status(500).send('เกิดข้อผิดพลาดทางด้านเซิร์ฟเวอร์');
            }

            res.json({
                dates: datesResults.map(item => item.det_date),
                emotionCounts: emotionCountsResults
            });
        });
    });
});

app.listen(8081, () => {
    console.log("Server is running on port 8081")
})