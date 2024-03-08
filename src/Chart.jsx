import React, { useState } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import './Chart.css';
import Navbar from './Navbar';

function Chart() {
    // State for year dropdown
    const [yearDropdownOpen, setYearDropdownOpen] = useState(false);
    const toggleYearDropdown = () => setYearDropdownOpen(prevState => !prevState);

    // State for month dropdown
    const [monthDropdownOpen, setMonthDropdownOpen] = useState(false);
    const toggleMonthDropdown = () => setMonthDropdownOpen(prevState => !prevState);

    // State for feeling dropdown
    const [feelingDropdownOpen, setFeelingDropdownOpen] = useState(false);
    const toggleFeelingDropdown = () => setFeelingDropdownOpen(prevState => !prevState);

    return (
        <>
            <Navbar />
            <div className="search">
                <div className="second-search">
                    <input type="text" placeholder="ค้นหา" />
                </div>
                <button type='button' className='search-button'>ค้นหา</button>

                <div className="year">
                    <Dropdown isOpen={yearDropdownOpen} toggle={toggleYearDropdown}>
                        <DropdownToggle caret className='title'>
                            ปี
                        </DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem>2024</DropdownItem>
                            <DropdownItem>2023</DropdownItem>
                            <DropdownItem>2022</DropdownItem>
                            <DropdownItem>2021</DropdownItem>
                            <DropdownItem>2020</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>

                <div className="month">
                    <Dropdown isOpen={monthDropdownOpen} toggle={toggleMonthDropdown}>
                        <DropdownToggle caret className='title'>
                            เดือน
                        </DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem>มกราคม</DropdownItem>
                            <DropdownItem>กุมภาพันธ์</DropdownItem>
                            <DropdownItem>มีนาคม</DropdownItem>
                            <DropdownItem>เมษายน</DropdownItem>
                            <DropdownItem>พฤษภาคม</DropdownItem>
                            <DropdownItem>มิถุนายน</DropdownItem>
                            <DropdownItem>กรกฎาคม</DropdownItem>
                            <DropdownItem>สิงหาคม</DropdownItem>
                            <DropdownItem>กันยายน</DropdownItem>
                            <DropdownItem>ตุลาคม</DropdownItem>
                            <DropdownItem>พฤศจิกายน</DropdownItem>
                            <DropdownItem>ธันวาคม</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>

                <div className="feeling">
                    <Dropdown isOpen={feelingDropdownOpen} toggle={toggleFeelingDropdown}>
                        <DropdownToggle caret className='title'>
                            อารมณ์
                        </DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem>ดีใจ</DropdownItem>
                            <DropdownItem>เสียใจ</DropdownItem>
                            <DropdownItem>โกรธ</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </div>
            
        </>
    );
}

export default Chart;
