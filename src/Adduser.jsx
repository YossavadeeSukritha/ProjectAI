import './Adduser.css'
import Navbar from './Navbar'
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';

function Adduser() {
    const [formData, setFormData] = useState({
        emp_id: '',
        emp_name: '',
        emp_dob: '',
        emp_gender: '',
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8081/Adduser', formData)
            .then(res => {
                console.log(res.data.message); 
            })
            .catch(err => console.log(err));
    };


    return (
        <>
            <Navbar />
            <div className="add-form">
                <form>
                    <div className="add-bar">
                        <h4>เพิ่มพนักงาน</h4>
                    </div>
                    <div className="all-form">
                        <div className="all-text">
                            <div className="form-group row">
                                <p className="col-sm-2 col-form-label">ID</p>
                                <div className="col-sm-10">
                                    <input type="text" className="form"name="emp_id" onChange={handleChange}/>
                                </div>
                            </div>
                        </div>

                        <div className="all-text">
                            <div className="form-group row">
                                <p className="col-sm-2 col-form-label">ชื่อ-นามสกุล</p>
                                <div className="col-sm-10">
                                    <input type="text" className="form" name="emp_name" onChange={handleChange}/>
                                </div>
                            </div>
                        </div>

                        <div className="all-text">
                            <div className="form-group row">
                                <p className="col-sm-2 col-form-label">วัน/เดือน/ปี</p>
                                <div className="col-sm-10">
                                    <input type="text" className="form" name="emp_dob" onChange={handleChange}/>
                                </div>
                            </div>
                        </div>

                        <div className="all-text">
                            <div className="form-group row">
                                <p className="col-sm-2 col-form-label">เพศ</p>
                                <div className="col-sm-10">
                                    <input type="text" className="form" name="emp_gender" onChange={handleChange}/>
                                </div>
                            </div>
                        </div>

                        <div className="all-text">
                            <div className="form-group row">
                                <p className="col-sm-2 col-form-label">email</p>
                                <div className="col-sm-10">
                                    <input type="text" className="form" name="email" onChange={handleChange}/>
                                </div>
                            </div>
                        </div>

                        <div className="all-text">
                            <div className="form-group row">
                                <p className="col-sm-2 col-form-label">password</p>
                                <div className="col-sm-10">
                                    <input type="text" className="form" name="password" onChange={handleChange}/>
                                </div>
                            </div>
                        </div>

                        {/* <div className="all-text-end">
                            <div className="form-group row">
                                <p className="col-sm-2 col-form-label">รูป</p>
                                <div className="col-sm-10">
                                    <input type="file" className="form" />
                                </div>
                            </div>
                        </div> */}
                    </div>

                    <div className="btn-add">
                        <div className="col-sm-10">
                            <button type="button" className="btn-confirm" onClick={handleSubmit}>ยืนยัน</button>
                            <Link to="/Employee">
                                <button type="button" className="btn-cancle">ยกเลิก</button>
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Adduser
