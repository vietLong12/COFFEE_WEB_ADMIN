'use client';
import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import { Card } from 'primereact/card';
import { Calendar } from 'primereact/calendar';
import { getDaysInMonth, numberWithCommas } from '../../common/utils/util';
import { Button } from 'primereact/button';
import Link from 'next/link';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Menu } from 'primereact/menu';

export default function StackedBarDemo() {
    const [chartData, setChartData] = useState({});
    console.log('chartData: ', chartData);
    const [chartOptions, setChartOptions] = useState({});

    const [chartDonutData, setChartDonutData] = useState({});
    console.log('chartDonutData: ', chartDonutData);
    const [chartDonutOptions, setChartDonutOptions] = useState({});

    const [chartLineData, setChartLineData] = useState({});
    console.log('chartLineData: ', chartLineData);
    const [chartLineOptions, setChartLineOptions] = useState({});

    const [numberProductsPerDay, setNumberProductsPerDay] = useState(0);
    console.log('numberProductsPerDay: ', numberProductsPerDay);
    const [orderProductsPerDay, setOrderProductsPerDay] = useState(0);
    const [revenue, setRevenue] = useState(0);
    console.log('revenue: ', revenue);

    //Chart statistical by year
    useEffect(() => {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
        const listTea = [];
        const listCake = [];
        const listCoffee = [];
        const monthList = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
        const monthPre = new Date().getMonth();
        for (let i = 0; i < 12; i++) {
            if (i <= monthPre) {
                monthList[i] = monthList[i] + '/' + new Date().getFullYear();
            } else {
                monthList[i] = monthList[i] + '/' + (new Date().getFullYear() - 1);
            }
            listTea.push(Math.floor(Math.random() * 3000));
            listCake.push(Math.floor(Math.random() * 3000));
            listCoffee.push(Math.floor(Math.random() * 3000));
        }
        const data = {
            labels: monthList,
            datasets: [
                {
                    type: 'bar',
                    label: 'Trà',
                    backgroundColor: documentStyle.getPropertyValue('--blue-500'),
                    data: listTea
                },
                {
                    type: 'bar',
                    label: 'Bánh ngọt',
                    backgroundColor: documentStyle.getPropertyValue('--green-500'),
                    data: listCake
                },
                {
                    type: 'bar',
                    label: 'Cà phê',
                    backgroundColor: documentStyle.getPropertyValue('--yellow-500'),
                    data: listCoffee
                }
            ]
        };
        const options = {
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                tooltips: {
                    mode: 'index',
                    intersect: false
                },
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    stacked: true,
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    }
                },
                y: {
                    stacked: true,
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    }
                }
            }
        };

        setChartData(data);
        setChartOptions(options);
    }, []);

    //Donut chart
    useEffect(() => {
        const documentStyle = getComputedStyle(document.documentElement);
        const listDataDay = [];
        let sum = 0;
        for (let i = 0; i < 3; i++) {
            const temp = Math.floor(Math.random() * 100);
            listDataDay.push(temp);
            sum += temp;
        }
        setRevenue(sum * 40000);
        setOrderProductsPerDay(Math.floor(Math.random() * sum));
        setNumberProductsPerDay(sum);
        const data = {
            labels: ['Trà', 'Cà phê', 'Bánh ngọt'],
            datasets: [
                {
                    data: listDataDay,
                    backgroundColor: [documentStyle.getPropertyValue('--blue-500'), documentStyle.getPropertyValue('--yellow-500'), documentStyle.getPropertyValue('--green-500')],
                    hoverBackgroundColor: [documentStyle.getPropertyValue('--blue-400'), documentStyle.getPropertyValue('--yellow-400'), documentStyle.getPropertyValue('--green-400')]
                }
            ]
        };
        const options = {
            cutout: '40%'
        };

        setChartDonutData(data);
        console.log('data: ', data);
        setChartDonutOptions(options);
    }, []);

    //Chart compare by month
    useEffect(() => {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
        const dayNumber = getDaysInMonth(new Date().getFullYear(), new Date().getMonth() + 1);
        const listDay = [];
        const listDataPresent = [];
        const listDataOld = [];
        const today = new Date().getDate();
        for (let i = 1; i <= dayNumber; i++) {
            listDay.push(i);
            if (i < today) {
                listDataPresent.push(Math.floor(Math.random() * 100));
            }
            listDataOld.push(Math.floor(Math.random() * 100));
        }

        const data = {
            labels: listDay,
            datasets: [
                {
                    label: 'Tháng trước',
                    data: listDataOld,
                    fill: false,
                    borderColor: documentStyle.getPropertyValue('--yellow-500'),
                    tension: 0.4,
                    backgroundColor: documentStyle.getPropertyValue('--yellow-500')
                },
                {
                    label: 'Hiện tại',
                    data: listDataPresent,
                    fill: false,
                    borderColor: documentStyle.getPropertyValue('--blue-500'),
                    tension: 0.4,
                    backgroundColor: documentStyle.getPropertyValue('--blue-500')
                }
            ]
        };
        const options = {
            maintainAspectRatio: false,
            aspectRatio: 0.6,
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    }
                }
            }
        };

        setChartLineData(data);
        setChartLineOptions(options);
    }, []);

    return (
        <>
            <div className="grid">
                <div className="col-12 lg:col-6 xl:col-3">
                    <div className="card mb-0">
                        <div className="flex justify-content-between mb-3">
                            <div>
                                <span className="block text-500 font-medium mb-3">Đơn hàng</span>
                                <div className="text-900 font-medium text-xl">{orderProductsPerDay}</div>
                            </div>
                            <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                <i className="pi pi-shopping-cart text-blue-500 text-xl" />
                            </div>
                        </div>
                        <span className="text-green-500 font-medium">24 đơn mới </span>
                        <span className="text-500">kể từ 30 ngày trước</span>
                    </div>
                </div>
                <div className="col-12 lg:col-6 xl:col-3">
                    <div className="card mb-0">
                        <div className="flex justify-content-between mb-3">
                            <div>
                                <span className="block text-500 font-medium mb-3">Doanh thu</span>
                                <div className="text-900 font-medium text-xl">{numberWithCommas(revenue)}đ</div>
                            </div>
                            <div className="flex align-items-center justify-content-center bg-orange-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                <i className="pi pi-map-marker text-orange-500 text-xl" />
                            </div>
                        </div>
                        <span className="text-green-500 font-medium">Tăng 52% </span>
                        <span className="text-500">kể từ tháng trước</span>
                    </div>
                </div>
                <div className="col-12 lg:col-6 xl:col-3">
                    <div className="card mb-0">
                        <div className="flex justify-content-between mb-3">
                            <div>
                                <span className="block text-500 font-medium mb-3">Người dùng</span>
                                <div className="text-900 font-medium text-xl">2534</div>
                            </div>
                            <div className="flex align-items-center justify-content-center bg-cyan-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                <i className="pi pi-inbox text-cyan-500 text-xl" />
                            </div>
                        </div>
                        <span className="text-green-500 font-medium">68 </span>
                        <span className="text-500">người đăng kí mới trong 7 ngày qua</span>
                    </div>
                </div>
                <div className="col-12 lg:col-6 xl:col-3">
                    <div className="card mb-0">
                        <div className="flex justify-content-between mb-3">
                            <div>
                                <span className="block text-500 font-medium mb-3">Bình luận</span>
                                <div className="text-900 font-medium text-xl">152 Mới</div>
                            </div>
                            <div className="flex align-items-center justify-content-center bg-purple-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                <i className="pi pi-comment text-purple-500 text-xl" />
                            </div>
                        </div>
                        <span className="text-500">Nhiều hơn so với tháng trước:</span>
                        <span className="text-green-500 font-medium">{" "}73</span>
                    </div>
                </div>
            </div>

            <div className="grid">
                <div className="col-12 xl:col-4">
                    <div className="card mb-2">
                        <h5>Số lượng sản phẩm trong ngày</h5>
                        <Chart type="doughnut" data={chartDonutData} options={chartDonutOptions} height="45vh" className="flex justify-content-center" />
                    </div>
                </div>
                <div className="col-12 xl:col-8">
                    <div className="card mb-2">
                        <h5>Bảng thống kê theo tháng</h5>
                        <Chart type="bar" data={chartLineData} options={chartLineOptions} height="45vh" />
                    </div>
                </div>
            </div>

            <div className="grid">
                <div className="col-12 xl:col-6">
                    <div className="card max-h-30rem overflow-y-scroll">
                        <div className="flex align-items-center justify-content-between mb-4">
                            <h5>Thông báo</h5>
                            <div>
                                <Menu
                                    popup
                                    model={[
                                        { label: 'Add New', icon: 'pi pi-fw pi-plus' },
                                        { label: 'Remove', icon: 'pi pi-fw pi-minus' }
                                    ]}
                                />
                            </div>
                        </div>

                        <span className="block text-600 font-medium mb-3">Mới nhất</span>
                        <ul className="p-0 mx-0 mt-0 mb-4 list-none">
                            <li className="flex align-items-center py-2 border-bottom-1 surface-border">
                                <div className="w-3rem h-3rem flex align-items-center justify-content-center bg-blue-100 border-circle mr-3 flex-shrink-0">
                                    <i className="pi pi-dollar text-xl text-blue-500" />
                                </div>
                                <span className="text-900 line-height-3">
                                    Nguyễn Việt Long{' '}
                                    <span className="text-700">
                                        đã mua một Bạc xỉu <span className="text-blue-500">30.000đ</span>
                                    </span>
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="col-12 xl:col-6">
                    <div className="card max-h-30rem">
                        <div className="flex justify-content-between align-items-center mb-5">
                            <h5>Sản phẩm bán chạy</h5>
                        </div>
                        <ul className="list-none p-0 m-0">
                            <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                                <div>
                                    <span className="text-900 font-medium mr-2 mb-1 md:mb-0">Trà đào cam sả</span>
                                    <div className="mt-1 text-600">Trà</div>
                                </div>
                                <div className="mt-2 md:mt-0 flex align-items-center">
                                    <div className="surface-300 border-round overflow-hidden w-10rem lg:w-6rem" style={{ height: '8px' }}>
                                        <div className="bg-orange-500 h-full" style={{ width: '50%' }} />
                                    </div>
                                    <span className="text-orange-500 ml-3 font-medium">%50</span>
                                </div>
                            </li>
                            <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                                <div>
                                    <span className="text-900 font-medium mr-2 mb-1 md:mb-0">Cà phê đen</span>
                                    <div className="mt-1 text-600">Coffee</div>
                                </div>
                                <div className="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                                    <div className="surface-300 border-round overflow-hidden w-10rem lg:w-6rem" style={{ height: '8px' }}>
                                        <div className="bg-cyan-500 h-full" style={{ width: '16%' }} />
                                    </div>
                                    <span className="text-cyan-500 ml-3 font-medium">%16</span>
                                </div>
                            </li>
                            <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                                <div>
                                    <span className="text-900 font-medium mr-2 mb-1 md:mb-0">Bánh kem</span>
                                    <div className="mt-1 text-600">Cake</div>
                                </div>
                                <div className="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                                    <div className="surface-300 border-round overflow-hidden w-10rem lg:w-6rem" style={{ height: '8px' }}>
                                        <div className="bg-pink-500 h-full" style={{ width: '67%' }} />
                                    </div>
                                    <span className="text-pink-500 ml-3 font-medium">%67</span>
                                </div>
                            </li>
                            <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                                <div>
                                    <span className="text-900 font-medium mr-2 mb-1 md:mb-0">Bạc xỉu</span>
                                    <div className="mt-1 text-600">Coffee</div>
                                </div>
                                <div className="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                                    <div className="surface-300 border-round overflow-hidden w-10rem lg:w-6rem" style={{ height: '8px' }}>
                                        <div className="bg-green-500 h-full" style={{ width: '35%' }} />
                                    </div>
                                    <span className="text-green-500 ml-3 font-medium">%35</span>
                                </div>
                            </li>
                            <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                                <div>
                                    <span className="text-900 font-medium mr-2 mb-1 md:mb-0">Trà sữa kem trứng</span>
                                    <div className="mt-1 text-600">Trà</div>
                                </div>
                                <div className="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                                    <div className="surface-300 border-round overflow-hidden w-10rem lg:w-6rem" style={{ height: '8px' }}>
                                        <div className="bg-purple-500 h-full" style={{ width: '75%' }} />
                                    </div>
                                    <span className="text-purple-500 ml-3 font-medium">%75</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="card">
                <h5>Bảng thống kê theo năm</h5>
                <Chart type="bar" data={chartData} options={chartOptions} height="30vh" />
            </div>
        </>
    );
}
