import './Adduser.css'
import Navbar from './Navbar'
import { Link } from 'react-router-dom';
import axios from 'axios';

function Adduser() {
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('emp_id', e.target.emp_id.value);
        formData.append('emp_name', e.target.emp_name.value);
        formData.append('emp_dob', e.target.emp_dob.value);
        formData.append('emp_gender', e.target.emp_gender.value);
        formData.append('emp_image', e.target.emp_image.files[0]);

        try {
            // ส่งไป server.js
            await axios.post('http://localhost:8081/addEmployee', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('Employee added successfully!');
            window.location.href = "/Employee";
        } catch (error) {
            console.error('Failed to add employee:', error);
            alert('Failed to add employee');
        }
    };

    return (
        <>
            <Navbar />
            <div className="add-form">
                <div className="add-bar">
                    <h4>เพิ่มพนักงาน</h4>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="all-form">
                        <div className="all-text">
                            <div className="form-group row">
                                <p className="col-sm-2 col-form-label">ID</p>
                                <div className="col-sm-10">
                                    <input type="text" className="form" name="emp_id" />
                                </div>
                            </div>
                        </div>

                        <div className="all-text">
                            <div className="form-group row">
                                <p className="col-sm-2 col-form-label">ชื่อ-นามสกุล</p>
                                <div className="col-sm-10">
                                    <input type="text" className="form" name="emp_name" />
                                </div>
                            </div>
                        </div>

                        <div className="all-text">
                            <div className="form-group row">
                                <p className="col-sm-2 col-form-label">วัน/เดือน/ปี</p>
                                <div className="col-sm-10">
                                    <input type="text" className="form" name="emp_dob" />
                                </div>
                            </div>
                        </div>

                        <div className="all-text">
                            <div className="form-group row">
                                <p className="col-sm-2 col-form-label">เพศ</p>
                                <div className="col-sm-10">
                                    <input type="text" className="form" name="emp_gender" />
                                </div>
                            </div>
                        </div>

                        <div className="all-text-end">
                            <div className="form-group row">
                                <p className="col-sm-2 col-form-label">รูป</p>
                                <div className="col-sm-10">
                                    <input type="file" className="form" name="emp_image" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="btn-add">
                        <div className="col-sm-10">
                            <button type="submit" className="btn-confirm">ยืนยัน</button>
                            <Link to="/Employee">
                                <button type="submit" className="btn-cancle">ยกเลิก</button>
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Adduser



