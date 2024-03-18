import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import './Chart.css';
import Navbar from './Navbar';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    BarElement, CategoryScale, LinearScale, Tooltip, Legend
)

function Chart() {
    // //dropdown
    // const [yearDropdownOpen, setYearDropdownOpen] = useState(false);
    // const toggleYearDropdown = () => setYearDropdownOpen(prevState => !prevState);

    // const [monthDropdownOpen, setMonthDropdownOpen] = useState(false);
    // const toggleMonthDropdown = () => setMonthDropdownOpen(prevState => !prevState);

    // const [feelingDropdownOpen, setFeelingDropdownOpen] = useState(false);
    // const toggleFeelingDropdown = () => setFeelingDropdownOpen(prevState => !prevState);

    //chart
    const [chartData, setChartData] = useState({ labels: [], datasets: [] }); 
    const [options, setOptions] = useState({}); 

    useEffect(() => {
        axios.get('http://localhost:8081/EmotionData')
            .then(response => {
                const dates = response.data.dates;
                const emotionCounts = response.data.emotionCounts;

                const datasets = processDataForChart(dates, emotionCounts);

                setChartData({
                    labels: dates,
                    datasets: datasets
                });
            })
            .catch(error => {
                console.error('There was an error fetching the emotion data:', error);
            });
    }, []);

    const processDataForChart = (dates, emotionCounts) => {
        // สร้าง datasets จากข้อมูล emotionCounts
        const emotions = [...new Set(emotionCounts.map(item => item.det_emo))];
        const datasets = emotions.map(emo => {
            const data = dates.map(date => {
                const countObj = emotionCounts.find(item => item.det_emo === emo && item.det_date === date);
                return countObj ? countObj.emo_count : 0;
            });

            return {
                label: emo,
                data: data,
                backgroundColor: getBackgroundColorForEmotion(emo),
                borderColor: 'black',
                borderWidth: 1
            };
        });

        return datasets;
    };

    const getBackgroundColorForEmotion = (emotion) => {
        const colors = {
            'angry': 'red',
            'fear': 'purple',
            'happy': 'yellow',
            'neutral': 'grey'
        };
        return colors[emotion] || 'blue';
    };

    // //chart
    // const data = {
    //     //แกนx
    //     labels:['2024-03-16','2024-03-17 '],
    //     datasets:[
    //         {
    //             label:'angry',
    //             data:[1,1],
    //             backgroundColor:'aqua',
    //             borderColor:'black',
    //             borderWidth:1
    //         },
    //         {
    //             label:'fear',
    //             data:[1,2],
    //             backgroundColor:'pink',
    //             borderColor:'black',
    //             borderWidth:1
    //         },
    //         {
    //             label:'happy',
    //             data:[1,0],
    //             backgroundColor:'green',
    //             borderColor:'black',
    //             borderWidth:1
    //         }
    //         ,
    //         {
    //             label:'neutral',
    //             data:[0,5],
    //             backgroundColor:'violet',
    //             borderColor:'black',
    //             borderWidth:1
    //         }
    //     ]
    // }

    // const options = {

    // }

    return (
        <>
            <Navbar />
            {/* <div className="search">
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
            </div> */}
            <div className="emotion">
                <h3 className='chart-text'>กราฟแสดงสถิติอารมณ์</h3>
                <div className="chart">

                    <Bar
                        data={chartData} options={options}
                    ></Bar>
                </div>

            </div>

        </>
    );
}

export default Chart;
