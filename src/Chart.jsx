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
    //chart
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });
    const [options, setOptions] = useState({
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    // กำหนดให้แกน Y มีค่าเป็นเลขจำนวนเต็ม
                    precision: 0
                }
            }
        }
    });

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
                console.error('Error fetching:', error);
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
            'happy': 'yellow',
            'sad': 'grey',
            'surprise': 'orange',
            'neutral': 'aqua',
            'angry': 'red',
            'fear': 'purple'
        };
        return colors[emotion] || 'blue';
    };

    return (
        <>
            <Navbar />
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
