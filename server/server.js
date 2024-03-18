import express from 'express'
import mysql from 'mysql'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(cors(
    {
        origin: ["http://127.0.0.1:5173"],
        methods: ["POST, GET"],
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
        if (err) return res.json({ Message: "Server Side Error" });
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

app.post('/Adduser', (req, res) => {
    const { emp_id, emp_name, emp_dob, emp_gender } = req.body;

    const sql = "INSERT INTO employee (emp_id, emp_name, emp_dob, emp_gender) VALUES (?, ?, ?, ?)";
    db.query(sql, [emp_id, emp_name, emp_dob, emp_gender], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Server side error" });
        }
        console.log("Employee added successfully");
        return res.json({ message: "เพิ่ม user เรียบร้อยแล้ว" });
    });
});

app.get('/Employee', (req, res) => {
    let sql = "SELECT * FROM employee";
    const search = req.query.search;

    if (search) {
        sql += ` WHERE emp_id LIKE '%${search}%' OR emp_name LIKE '%${search}%'`;
    }

    db.query(sql, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Server side error" });
        }
        res.json(result);
    });
});


app.post('/DeleteEmployee', (req, res) => {
    const emp_id = req.body.emp_id;

    const sql = "DELETE FROM employee WHERE emp_id = ?";
    db.query(sql, [emp_id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Server side error" });
        }
        console.log("Employee deleted successfully");
        return res.json({ message: "Employee deleted successfully" });
    });
});

app.post('/EditEmployee', (req, res) => {
   
    try {
        const { emp_id, emp_name, emp_dob, emp_gender } = req.body;
        const sql = "UPDATE employee SET emp_name = ?, emp_dob = ?, emp_gender = ? WHERE emp_id = ?";
        db.query(sql, [emp_name, emp_dob, emp_gender, emp_id], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Server error' });
            }
            console.log('Employee data updated successfully');
            return res.status(200).json({ message: 'Employee data updated successfully' });
        });
    } catch (error) {
        console.error('Error updating employee:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

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

            return {
                ...det,
                det_img_face: `data:image/jpeg;base64,${imgFaceBase64}`,
                det_img_env: `data:image/jpeg;base64,${imgEnvBase64}`,
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
