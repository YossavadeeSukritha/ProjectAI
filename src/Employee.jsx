import { Link } from 'react-router-dom';
import './Employee.css'
import Navbar from './Navbar'
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { MdArrowBackIosNew } from "react-icons/md";
import { MdArrowForwardIos } from "react-icons/md";
import test from './assets/test.jpeg';

function Employee() {
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
                        <tr>
                            <td>1</td>
                            <td>2024</td>
                            <td>Yossavadee Sukritha</td>
                            <td><img src={test} /></td>
                            <td>01/01/2011</td>
                            <td>Female</td>
                            <td>
                                <Link to="/Edituser">
                                    <button className='btn-emp'>
                                        <FaEdit />
                                    </button>
                                </Link>
                                <button className='btn-emp'>
                                    <RiDeleteBin5Fill />
                                </button>
                            </td>
                        </tr>

                        <tr>
                            <td>1</td>
                            <td>2024</td>
                            <td>Yossavadee Sukritha</td>
                            <td><img src={test} /></td>
                            <td>01/01/2011</td>
                            <td>Female</td>
                            <td>
                                <Link to="/Edituser">
                                    <button className='btn-emp'>
                                        <FaEdit />
                                    </button>
                                </Link>
                                <button className='btn-emp'>
                                    <RiDeleteBin5Fill />
                                </button>
                            </td>
                        </tr>

                        <tr>
                            <td>1</td>
                            <td>2024</td>
                            <td>Yossavadee Sukritha</td>
                            <td><img src={test} /></td>
                            <td>01/01/2011</td>
                            <td>Female</td>
                            <td>
                                <Link to="/Edituser">
                                    <button className='btn-emp'>
                                        <FaEdit />
                                    </button>
                                </Link>
                                <button className='btn-emp'>
                                    <RiDeleteBin5Fill />
                                </button>
                            </td>
                        </tr>

                        <tr>
                            <td>1</td>
                            <td>2024</td>
                            <td>Yossavadee Sukritha</td>
                            <td><img src={test} /></td>
                            <td>01/01/2011</td>
                            <td>Female</td>
                            <td>
                                <Link to="/Edituser">
                                    <button className='btn-emp'>
                                        <FaEdit />
                                    </button>
                                </Link>
                                <button className='btn-emp'>
                                    <RiDeleteBin5Fill />
                                </button>
                            </td>
                        </tr>

                        <tr>
                            <td>1</td>
                            <td>2024</td>
                            <td>Yossavadee Sukritha</td>
                            <td><img src={test} /></td>
                            <td>01/01/2011</td>
                            <td>Female</td>
                            <td>
                                <Link to="/Edituser">
                                    <button className='btn-emp'>
                                        <FaEdit />
                                    </button>
                                </Link>
                                <button className='btn-emp'>
                                    <RiDeleteBin5Fill />
                                </button>
                            </td>
                        </tr>
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


