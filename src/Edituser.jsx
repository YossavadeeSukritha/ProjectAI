import './Edituser.css'
import Navbar from './Navbar';
import test from './assets/test.jpeg';
import { Link, useNavigate  } from 'react-router-dom';
import React, { useState } from 'react';
import axios from 'axios';

function Edituser() {
    const [formData, setFormData] = useState({
        emp_id: '',
        emp_name: '',
        emp_dob: '',
        emp_gender: '',
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const navigate = useNavigate();

    const handleSubmit = async () => {
        try {
            await axios.post('http://localhost:8081/EditEmployee', formData);
            alert('อัปเดตข้อมูลเรียบร้อยแล้ว');
            navigate('/Employee');
        } catch (error) {
            console.error('Error updating employee:', error);
        }
    };

    return (
        <>
            <Navbar />
            <div className="container-xl px-4 mt-4">
                <div className="row">
                    <div className="col-xl-4">
                        {/* Profile picture card*/}
                        <div className="card mb-4 mb-xl-0">
                            <div className="card-header">Profile Picture</div>
                            <div className="card-body text-center">
                                {/* Profile picture image*/}
                                <img className="img-account-profile rounded-circle mb-2" src={test} />
                                {/* Profile picture help block*/}
                                <div className="small font-italic text-muted mb-4">Upload Picture</div>
                                {/* Profile picture upload button*/}
                                <input type="file" className="form-control" />
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-8">
                        {/* Account details card*/}
                        <div className="card mb-4">
                            <div className="card-header">Profile Details</div>
                            <div className="card-body">
                                <form>
                                    {/*ID*/}
                                    <div className="d-flex align-items-center justify-content-between mb-3 mt-4 ">
                                        <p className="mb-0">ID&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
                                        <div className="flex-grow-1 ms-3">
                                            <input className="form-control" type="text" name="emp_id" onChange={handleChange}/>
                                        </div>
                                    </div>

                                    {/* ชื่อ-นามสกุล*/}
                                    <div className="d-flex align-items-center justify-content-between mb-3">
                                        <p className="mb-0">ชื่อ-นามสกุล&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
                                        <div className="flex-grow-1 ms-3">
                                            <input className="form-control" type="text" name="emp_name" onChange={handleChange}/>
                                        </div>
                                    </div>

                                    {/* วัน/เดือน/ปีเกิด*/}
                                    <div className="d-flex align-items-center justify-content-between mb-3">
                                        <p className="mb-0">วัน/เดือน/ปีเกิด&nbsp;&nbsp;&nbsp;</p>
                                        <div className="flex-grow-1 ms-3">
                                            <input className="form-control" type="text" name="emp_dob" onChange={handleChange}/>
                                        </div>
                                    </div>

                                    {/* เพศ*/}
                                    <div className="d-flex align-items-center justify-content-between mb-3">
                                        <p className="mb-0">เพศ&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
                                        <div className="flex-grow-1 ms-3">
                                            <input className="form-control" type="text" name="emp_gender" onChange={handleChange}/>
                                        </div>
                                    </div>

                                    {/* button*/}
                                    <div className="btn-edit">
                                        <button type="button" className="btn-confirm" onClick={handleSubmit}>ยืนยัน</button>
                                        <Link to="/Employee">
                                        <button type="button" className="btn-cancle">ยกเลิก</button>
                                        </Link>
                                    </div>

                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Edituser
