import './Home.css'
import Navbar from './Navbar'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TfiMenu } from "react-icons/tfi";
import { TfiLayoutGrid2 } from "react-icons/tfi";

function Home() {
    //table or card
    const [viewMode, setViewMode] = useState('table');

    //ดึงที่ได้จากการ detect มาแสดง
    const [detections, setDetections] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:8081/DetectionDetails');
            setDetections(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    //search
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // กรองผลลัพธ์ตามคำค้นหา
    const filteredDetections = detections.filter(
        (det) =>
            det.det_person.toString().includes(searchTerm) || det.emp_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <Navbar />
            <div className="search">
                <div className="second-search">
                    <input type="text" placeholder="ค้นหา" onChange={handleSearchChange} />
                </div>
                <div className="button-container">
                    <button className='btn-row' onClick={() => setViewMode('table')}><TfiMenu /></button>
                    <button className='btn-card' onClick={() => setViewMode('card')}><TfiLayoutGrid2 /></button>
                </div>
            </div>

            {viewMode === 'table' ? (
                <div className="table-section">
                    <table>
                        <thead>
                            <tr>
                                <th>ลำดับ</th>
                                <th>ID</th>
                                <th>ชื่อ-นามสกุล</th>
                                <th>รูปหน้า</th>
                                <th>สภาพแวดล้อม</th>
                                <th>อายุ</th>
                                <th>เพศ</th>
                                <th>อารมณ์</th>
                                <th>วันที่และเวลา</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDetections.map((det, index) => (
                                <tr key={index}>
                                    <td>{det.det_id}</td>
                                    <td>{det.det_person}</td>
                                    <td>{det.emp_name}</td>
                                    <td><img src={det.det_img_face} alt="Face" /></td>
                                    <td><img src={det.det_img_env} alt="Environment" /></td>
                                    <td>{det.det_age}</td>
                                    <td>{det.det_gender}</td>
                                    <td>{det.emo_name}</td>
                                    <td>{det.det_added}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="card-section">
                    {filteredDetections.map((det, index) => (
                        <div className="card" key={index}>
                            <div className="card-image-container">
                                        <img src={det.det_img_face} alt="Face" className="card-image" />      
                            </div>

                            <div className="card-content">
                                <h6>ชื่อ: {det.emp_name}</h6>
                                <h6>ID: {det.det_person}</h6>
                                <h6>อายุ: {det.det_age}</h6>
                                <h6>เพศ: {det.det_gender}</h6>
                                <h6>อารมณ์: {det.emo_name}</h6>
                                <h6>วันที่และเวลา: {det.det_added}</h6>
                            </div>
                        </div>
                    ))}
                </div>
            )}

        </>
    )
}

export default Home