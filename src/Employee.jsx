import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Employee.css'
import Navbar from './Navbar'
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";
import no_picture from './assets/no_picture.png';
// import image101 from './assets/101.jpeg';
// import image102 from './assets/102.png';
// import image103 from './assets/103.jpg';


function Employee() {
    // const images = [image101, image102,image103];

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

    //search
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // กรองผลลัพธ์ตามคำค้นหา
    const filteredEmployees = employees.filter(
        (employee) =>
            employee.emp_id.toString().includes(searchTerm) ||
            employee.emp_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <Navbar />
            <div className="search">
                <div className="second-search">
                    <input type="text" placeholder="ค้นหา" onChange={handleSearchChange} />
                </div>
                {/* <button type='button' className='search-button'>ค้นหา</button> */}
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
                            {/* <th>รูป</th> */}
                            <th>วัน/เดือน/ปีเกิด</th>
                            <th>เพศ</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEmployees.map((employee, index) => (
                            <tr key={employee.emp_id}>
                                <td>{index + 1}</td>
                                <td>{employee.emp_id}</td>
                                <td>{employee.emp_name}</td>
                                {/* <td>
                                    <img src={index < images.length ? images[index] : no_picture} alt="Employee" />
                                    <img src={no_picture} alt="Employee" />
                                </td> */}
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

        </>
    )
}

export default Employee





