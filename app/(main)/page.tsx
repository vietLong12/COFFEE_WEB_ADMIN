'use client';
import React, { useState, useEffect, useContext } from 'react';
import { Chart } from 'primereact/chart';
import { Card } from 'primereact/card';
import { Calendar } from 'primereact/calendar';
import { convertToVND, getDaysInMonth, numberWithCommas } from '../../common/utils/util';
import { Button } from 'primereact/button';
import Link from 'next/link';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Menu } from 'primereact/menu';
import { DashboardService } from '../../common/service/DashboardService';
import { AuthContext, AuthProvider } from '../../layout/context/authContext';
import Swal from 'sweetalert2';

interface ResponseInfor {
    orders: {
        total: number | string;
        new: number | string;
    };
    revenue: {
        data: number | string;
        increase: boolean;
        percent: number | string;
    };
    users: {
        total: number | string;
        new: number | string;
    };
    comment: {
        present: number | string;
        old: number | string;
    };
}
interface Product {
    [index: number]: string;
    productName: string;
    category: string;
}

interface Notification {
    username: string;
    totalBill: number;
}

interface ResponseInfor2 {
    bestSeller: Product[];
    productToday: { [category: string]: number };
    chart: {
        dataOldMonth: number[];
        dataPresent: number[];
    };
    notification: Notification[];
}

export default function StackedBarDemo() {
    //@ts-ignore
    const { token } = useContext(AuthContext);

    const [dataFetch, setDataFetch] = useState<ResponseInfor | null>(null);
    const [dataFetch2, setDataFetch2] = useState<ResponseInfor2 | null>(null);
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    const [chartDonutData, setChartDonutData] = useState({});
    const [chartDonutOptions, setChartDonutOptions] = useState({});

    const [chartLineData, setChartLineData] = useState({});
    const [chartLineOptions, setChartLineOptions] = useState({});

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
        const fetchData = async () => {
            const data1 = await DashboardService.getDashboardInfor(token.accessToken);
            const data2 = await DashboardService.getDashboardChart(token.accessToken);
            setDataFetch(data1.data);
            setDataFetch2(data2.data);

            const documentStyle = getComputedStyle(document.documentElement);
            const listProductToday = Object.keys(data2.data?.productToday);
            const listData = Object.values(data2.data?.productToday);

            const data = {
                labels: listProductToday,
                datasets: [
                    {
                        data: listData
                    }
                ]
            };
            const options = {
                cutout: '40%'
            };
            setChartDonutData(data);
            setChartDonutOptions(options);

            //Chart 2:
            const chart2 = (present, old) => {
                const documentStyle = getComputedStyle(document.documentElement);
                const textColor = documentStyle.getPropertyValue('--text-color');
                const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
                const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
                const dayNumber = getDaysInMonth(new Date().getFullYear(), new Date().getMonth() + 1);
                const listDay = [];
                for (let i = 1; i <= dayNumber; i++) {
                    listDay.push(i);
                }

                const data = {
                    labels: listDay,
                    datasets: [
                        {
                            label: 'Tháng trước',
                            data: old,
                            fill: false,
                            borderColor: documentStyle.getPropertyValue('--yellow-500'),
                            tension: 0.4,
                            backgroundColor: documentStyle.getPropertyValue('--yellow-500')
                        },
                        {
                            label: 'Hiện tại',
                            data: present,
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
            };
            chart2(data2.data.chart.dataPresent, data2.data.chart.dataOldMonth);
        };
        fetchData();
    }, []);

    return (
        <>
            <div className="grid">
                <div className="col-12 lg:col-6 xl:col-3">
                    <div className="card mb-0 h-full">
                        <div className="flex justify-content-between mb-3">
                            <div>
                                <span className="block text-500 font-medium mb-3">Đơn hàng</span>
                                <div className="text-900 font-medium text-xl">{dataFetch?.orders.total}</div>
                            </div>
                            <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                <i className="pi pi-shopping-cart text-blue-500 text-xl" />
                            </div>
                        </div>
                        <span className="text-green-500 font-medium">{dataFetch?.orders.new} đơn mới </span>
                        <span className="text-500">kể từ 30 ngày trước</span>
                    </div>
                </div>
                <div className="col-12 lg:col-6 xl:col-3">
                    <div className="card mb-0 h-full">
                        <div className="flex justify-content-between mb-3">
                            <div>
                                <span className="block text-500 font-medium mb-3">Doanh thu</span>
                                <div className="text-900 font-medium text-xl">{convertToVND(dataFetch?.revenue.data)}</div>
                            </div>
                            <div className="flex align-items-center justify-content-center bg-orange-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                <i className="pi pi-map-marker text-orange-500 text-xl" />
                            </div>
                        </div>
                        <span className="text-green-500 font-medium">
                            {dataFetch?.revenue.increase ? 'Tăng' : 'Giảm'} {dataFetch?.revenue.percent}%{' '}
                        </span>
                        <span className="text-500">kể từ tháng trước </span>
                    </div>
                </div>
                <div className="col-12 lg:col-6 xl:col-3">
                    <div className="card mb-0 h-full">
                        <div className="flex justify-content-between mb-3">
                            <div>
                                <span className="block text-500 font-medium mb-3">Người dùng</span>
                                <div className="text-900 font-medium text-xl">{dataFetch?.users.total}</div>
                            </div>
                            <div className="flex align-items-center justify-content-center bg-cyan-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                <i className="pi pi-inbox text-cyan-500 text-xl" />
                            </div>
                        </div>
                        <span className="text-green-500 font-medium">{dataFetch?.users.new} </span>
                        <span className="text-500">người đăng kí mới trong 7 ngày qua</span>
                    </div>
                </div>
                <div className="col-12 lg:col-6 xl:col-3">
                    <div className="card mb-0 h-full">
                        <div className="flex justify-content-between mb-3">
                            <div>
                                <span className="block text-500 font-medium mb-3">Bình luận</span>
                                <div className="text-900 font-medium text-xl">{dataFetch?.comment.present} Mới</div>
                            </div>
                            <div className="flex align-items-center justify-content-center bg-purple-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                <i className="pi pi-comment text-purple-500 text-xl" />
                            </div>
                        </div>
                        <span className="text-500">{dataFetch?.comment.present > dataFetch?.comment.old ? 'Nhiều' : 'Ít'} hơn so với tháng trước:</span>
                        <span className="text-green-500 font-medium"> {dataFetch?.comment.old}</span>
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
                            {dataFetch2?.notification.map((u, i) => {
                                return (
                                    <li className="flex align-items-center py-2 border-bottom-1 surface-border" key={i}>
                                        <div className="w-3rem h-3rem flex align-items-center justify-content-center bg-blue-100 border-circle mr-3 flex-shrink-0">
                                            <i className="pi pi-dollar text-xl text-blue-500" />
                                        </div>
                                        <span className="text-900 line-height-3">
                                            {u.username}{' '}
                                            <span className="text-700">
                                                đã đặt một đơn hàng trị giá <span className="text-blue-500">{u.totalBill}.000đ</span>
                                            </span>
                                        </span>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
                <div className="col-12 xl:col-6">
                    <div className="card max-h-30rem">
                        <div className="flex justify-content-between align-items-center mb-5">
                            <h5>Sản phẩm bán chạy</h5>
                        </div>
                        <ul className="list-none p-0 m-0">
                            {dataFetch2?.bestSeller.map((p, i) => {
                                return (
                                    <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4" key={i}>
                                        <div>
                                            <span className="text-900 font-medium mr-2 mb-1 md:mb-0">{p.productName}</span>
                                            <div className="mt-1 text-600 capitalize">{p.category}</div>
                                        </div>
                                        <div className="mt-2 md:mt-0 flex align-items-center">
                                            <span className="text-orange-500 ml-3 font-medium">BEST SELLER!!!</span>
                                        </div>
                                    </li>
                                );
                            })}
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
