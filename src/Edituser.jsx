import './Edituser.css'
import Navbar from './Navbar';
import test from './assets/test.jpeg'
import { Link } from 'react-router-dom';
import React from 'react';
import axios from 'axios';

function Edituser() {
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const empId = formData.get('emp_id');

        try {
            await axios.put(`http://localhost:8081/Employee/${empId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('Employee updated successfully!');
            window.location.href = "/Employee";
        } catch (error) {
            console.error('Error updating employee:', error);
            alert('Failed to update employee');
        }
    };
    return (
        <>
            <Navbar />
            <form onSubmit={handleSubmit}>
                <div className="container-xl px-4 mt-4">
                    <div className="row">

                        <div className="col-xl-4">
                            <div className="card mb-4 mb-xl-0">
                                <div className="card-header">Profile Picture</div>
                                <div className="card-body text-center">
                                    <img className="img-account-profile rounded-circle mb-2" src={test} />
                                    <div className="small font-italic text-muted mb-4">Upload Picture</div>
                                    <input type="file" className="form-control" name="emp_image" />
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-8">
                            {/* Account details card*/}
                            <div className="card mb-4">
                                <div className="card-header">Profile Details</div>
                                <div className="card-body">

                                    {/*ID*/}
                                    <div className="d-flex align-items-center justify-content-between mb-3 mt-4 ">
                                        <p className="mb-0">ID&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
                                        <div className="flex-grow-1 ms-3">
                                            <input className="form-control" type="text" name="emp_id" />
                                        </div>
                                    </div>

                                    {/* ชื่อ-นามสกุล*/}
                                    <div className="d-flex align-items-center justify-content-between mb-3">
                                        <p className="mb-0">ชื่อ-นามสกุล&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
                                        <div className="flex-grow-1 ms-3">
                                            <input className="form-control" type="text" name="emp_name" />
                                        </div>
                                    </div>

                                    {/* วัน/เดือน/ปีเกิด*/}
                                    <div className="d-flex align-items-center justify-content-between mb-3">
                                        <p className="mb-0">วัน/เดือน/ปีเกิด&nbsp;&nbsp;&nbsp;</p>
                                        <div className="flex-grow-1 ms-3">
                                            <input className="form-control" type="text" name="emp_dob" />
                                        </div>
                                    </div>

                                    {/* เพศ*/}
                                    <div className="d-flex align-items-center justify-content-between mb-3">
                                        <p className="mb-0">เพศ&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
                                        <div className="flex-grow-1 ms-3">
                                            <input className="form-control" type="text" name="emp_gender" />
                                        </div>
                                    </div>

                                    {/* button*/}
                                    <div className="btn-edit">
                                        <button type="submit" className="btn-confirm">ยืนยัน</button>
                                        <Link to="/Employee">
                                            <button type="button" className="btn-cancle">ยกเลิก</button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </>
    )
}

export default Edituser