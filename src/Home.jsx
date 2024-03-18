import './Home.css'
import Navbar from './Navbar'
import React, { useEffect, useState } from 'react';
import axios from 'axios';


function Home() {

    const [detections, setDetections] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8081/DetectionDetails');
                setDetections(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    //search
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // กรองผลลัพธ์ตามคำค้นหา
    const filteredDetections = detections.filter(det =>
        det.det_person.toString().includes(searchTerm) || 
        det.emp_name.toLowerCase().includes(searchTerm.toLowerCase()) 
    );

    return (
        <>
            <Navbar />
            <div className="search">
                <div className="second-search">
                    <input type="text" placeholder="ค้นหา" onChange={handleSearchChange} />
                </div>
                {/* <button type='button' className='search-button'>ค้นหา</button> */}
            </div>

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
                        {filteredDetections.map((det, index) =>(
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{det.det_person}</td>
                                <td>{det.emp_name}</td>
                                <td><img src={det.det_img_face} alt="Face" /></td>
                                <td><img src={det.det_img_env} alt="Environment" /></td>
                                <td>{det.det_age}</td>
                                <td>{det.det_gender}</td>
                                <td>{det.det_emo}</td>
                                <td>{det.det_added}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </>
    )
}

export default Home
