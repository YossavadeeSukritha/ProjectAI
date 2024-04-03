import axios from 'axios';
import './Navbar.css'
import { FaChartBar } from "react-icons/fa";
import { FaSignOutAlt } from "react-icons/fa";

function Navbar() {
    const handleLogout = () => {
        axios.post('http://127.0.0.1:8081/Logout')
            .then(res => {
                console.log(res.data.Message); 
                window.location.href = '/'; 
            })
            .catch(err => console.log(err));
    };

    return (
        <>
            <ul>
                <li>
                    <a href='/Home'>
                        <div className='nav-icon'>
                            <i className="fa fa-home" aria-hidden="true"></i>
                        </div>
                        <div className="nav-name">หน้าแรก</div>
                    </a>
                </li>

                <li>
                    <a href='/Chart'>
                        <div className='nav-icon'>
                            <FaChartBar />
                        </div>
                        <div className="nav-name">รายงาน</div>
                    </a>
                </li>

                <li>
                    <a href='/Employee'>
                        <div className='nav-icon'>
                            <i className="fa fa-users" aria-hidden="true"></i>
                        </div>
                        <div className="nav-name">พนักงาน</div>
                    </a>
                </li>

                <li>
                    <a href='#' onClick={handleLogout}>
                        <div className='nav-icon'>
                            <FaSignOutAlt />
                        </div>
                        <div className="nav-name-end">ออกจากระบบ</div>
                    </a>
                </li>
            </ul>
        </>
    )
}

export default Navbar

