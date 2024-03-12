import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Employee.css'
import Navbar from './Navbar'
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { MdArrowBackIosNew } from "react-icons/md";
import { MdArrowForwardIos } from "react-icons/md";
import test from './assets/test.jpeg';

function Employee() {
    //ดึงจากฐานข้อมูลมาแสดง
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:8081/Employee'); 
            setEmployees(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    //ลบ employee ในฐานข้อมูล
    const handleDelete = async (emp_id) => {
        try {
            await axios.post('http://localhost:8081/DeleteEmployee', { emp_id });
            fetchData(); 
        } catch (error) {
            console.error('Error deleting employee:', error);
        }
    };

    return (
        <>
            <Navbar />
            <div className="search">
                <div className="second-search">
                    <input type="text" placeholder="ค้นหา" />
                </div>
                <button type='button' className='search-button'>ค้นหา</button>
                <Link to="/Adduser">
                    <button type='button' className='add-button'>เพิ่ม</button>
                </Link>
            </div>

            <div className="table-section">
                <table>
                    <thead>
                        <tr>
                            <th>ลำดับ</th>
                            <th>ID</th>
                            <th>ชื่อ-นามสกุล</th>
                            <th>รูป</th>
                            <th>วัน/เดือน/ปีเกิด</th>
                            <th>เพศ</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>

                        {employees.map((employee, index) => (
                            <tr key={employee.emp_id}>
                                <td>{index + 1}</td>
                                <td>{employee.emp_id}</td>
                                <td>{employee.emp_name}</td>
                                <td><img src={test} alt="Employee" /></td>
                                <td>{employee.emp_dob}</td>
                                <td>{employee.emp_gender}</td>
                                <td>
                                <Link to="/Edituser">
                                    <button className='btn-emp'>
                                        <FaEdit />
                                    </button>
                                </Link>
                                <button className='btn-emp' onClick={() => handleDelete(employee.emp_id)}>
                                    <RiDeleteBin5Fill />
                                </button>
                            </td>
                            </tr>
                        ))}

                    </tbody>
                </table>
            </div>

            <div className="pagination">
                <div><MdArrowBackIosNew /></div>
                <div>1</div>
                <div>2</div>
                <div><MdArrowForwardIos /></div>
            </div>
        </>
    )
}

export default Employee


