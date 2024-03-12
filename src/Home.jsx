import './Home.css'
import Navbar from './Navbar'
import { MdArrowBackIosNew } from "react-icons/md";
import { MdArrowForwardIos } from "react-icons/md";
import test from './assets/test.jpeg';


function Home() {

    return (
        <>
            <Navbar />
            <div className="search">
                <div className="second-search">
                    <input type="text" placeholder="ค้นหา" />
                </div>
                <button type='button' className='search-button'>ค้นหา</button>
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
                        <tr>
                            <td>1</td>
                            <td>2024</td>
                            <td>Yossavadee Sukritha</td>
                            <td><img src={test} /></td>
                            <td><img src={test} /></td>
                            <td>24</td>
                            <td>Female</td>
                            <td>มีความสุข</td>
                            <td>01/01/2011 9:00:01</td>         
                        </tr>

                        <tr>
                            <td>1</td>
                            <td>2024</td>
                            <td>Yossavadee Sukritha</td>
                            <td><img src={test} /></td>
                            <td><img src={test} /></td>
                            <td>24</td>
                            <td>Female</td>
                            <td>มีความสุข</td>
                            <td>01/01/2011 9:00:01</td>         
                        </tr>

                        <tr>
                            <td>1</td>
                            <td>2024</td>
                            <td>Yossavadee Sukritha</td>
                            <td><img src={test} /></td>
                            <td><img src={test} /></td>
                            <td>24</td>
                            <td>Female</td>
                            <td>มีความสุข</td>
                            <td>01/01/2011 9:00:01</td>         
                        </tr>

                        <tr>
                            <td>1</td>
                            <td>2024</td>
                            <td>Yossavadee Sukritha</td>
                            <td><img src={test} /></td>
                            <td><img src={test} /></td>
                            <td>24</td>
                            <td>Female</td>
                            <td>มีความสุข</td>
                            <td>01/01/2011 9:00:01</td>         
                        </tr>

                        <tr>
                            <td>1</td>
                            <td>2024</td>
                            <td>Yossavadee Sukritha</td>
                            <td><img src={test} /></td>
                            <td><img src={test} /></td>
                            <td>24</td>
                            <td>Female</td>
                            <td>มีความสุข</td>
                            <td>01/01/2011 9:00:01</td>         
                        </tr>

                        <tr>
                            <td>1</td>
                            <td>2024</td>
                            <td>Yossavadee Sukritha</td>
                            <td><img src={test} /></td>
                            <td><img src={test} /></td>
                            <td>24</td>
                            <td>Female</td>
                            <td>มีความสุข</td>
                            <td>01/01/2011 9:00:01</td>         
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

export default Home
