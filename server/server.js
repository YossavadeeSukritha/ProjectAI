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
    const sql = "SELECT * FROM employee WHERE email = ? AND password = ?";
    db.query(sql, [req.body.email, req.body.password], (err, data) => {
        if (err) return res.json({ Message: "Server Side Error" });
        if (data.length > 0) {
            return res.json({ Status: "Success" })
        } else {
            return res.json({ Message: "NO Records existed" });
        }
    })
})

app.post('/Logout', (req, res) => {
    res.json({ Message: "User logged out successfully" });
});

app.post('/Adduser', (req, res) => {
    const { emp_id, emp_name, emp_dob, emp_gender, email, password } = req.body;

    const sql = "INSERT INTO employee (emp_id, emp_name, emp_dob, emp_gender, email, password) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(sql, [emp_id, emp_name, emp_dob, emp_gender, email, password], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Server side error" });
        }
        console.log("Employee added successfully");
        return res.json({ message: "Employee added successfully" });
    });
});

app.get('/Employee', (req, res) => {
    const sql = "SELECT * FROM employee";
    db.query(sql, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Server side error" });
        }
        return res.json(result);
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
        const { emp_id, emp_name, emp_dob, emp_gender, email, password } = req.body;
        const sql = "UPDATE employee SET emp_name = ?, emp_dob = ?, emp_gender = ?, email = ?, password = ? WHERE emp_id = ?";
        db.query(sql, [emp_name, emp_dob, emp_gender, email, password, emp_id], (err, result) => {
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



app.listen(8081, () => {
    console.log("Server is running on port 8081")
})