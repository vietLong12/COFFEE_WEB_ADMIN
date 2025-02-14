'use client';
import React, { useContext, useEffect, useState } from 'react';
import { OrderService } from '../../../../common/service/OrderService';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Tag } from 'primereact/tag';
import { InputText } from 'primereact/inputtext';
import { Paginator } from 'primereact/paginator';
import { Button } from 'primereact/button';
import ModalDetailOrder from '../../../../layout/Dialog/ModalDetailOrder';
import { LayoutContext } from '../../../../layout/context/layoutcontext';
import Swal from 'sweetalert2';
import { Dropdown } from 'primereact/dropdown';
import LoadingCustom from '../../../../common/components/Loading';
import download from 'downloadjs';
import { BASE_URL } from '../../../../common/service/type';

const Orders = () => {
    const [render, setRender] = useState(false);
    const [orders, setOrders] = useState([]);
    const [totalPages, setTotalPages] = useState(100);
    const [search, setSearch] = useState('');
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(5);
    const [orderId, setOrderId] = useState('');
    const [visible, setVisible] = useState(false);
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        loadOrders();
    }, [first, rows, search, render]);

    const loadOrders = () => {
        //@ts-ignore
        OrderService.getListOrder({ keyword: search, page: first / rows + 1 }).then((res) => {
            setOrders(res.orders);
            setTotalPages(res.pagination.totalDocuments);
        });
    };

    const handleChangeStatus = async (orderId: string, statusOrder: '1' | '2' | '3' | '4') => {
        setLoading(true);
        const res = await OrderService.putOrder({ orderId: orderId, statusOrder: statusOrder });
        if (res) {
            setRender(!render);
            setLoading(false);
            Swal.fire({ icon: 'success', title: 'Thay đổi thành công' });
        } else {
            Swal.fire({ icon: 'error', title: 'Thay đổi thất bại' });
            setLoading(false);
        }
    };

    const statusBodyTemplate = (order) => {
        const arr = [
            { name: 'In progress', code: '2', bg: 'bg-yellow-200' },
            { name: 'Pending', code: '1', bg: 'bg-cyan-200	' },
            { name: 'Completed', code: '3', bg: 'bg-primary-200	' },
            { name: 'Cancel', code: '4', bg: 'bg-red-200' }
        ];
        const filt = arr.filter((item) => item.name === order.status);
        return <Dropdown value={filt[0]} options={arr} optionLabel="name" onChange={(e) => handleChangeStatus(order._id, e.target.value.code)} className={`${filt[0].bg} w-full`} />;
    };

    const totalAmountTemplate = (order) => {
        return <p className="font-bold">{order.totalAmount}.000đ</p>;
    };

    const onPageChange = (e) => {
        setFirst(e.first);
        setRows(e.rows);
    };

    const handleDetailOrder = (orderId) => {
        setOrderId(orderId);
        setVisible(true);
    };

    const handleDeleteOrder = async (orderId) => {
        const res = await OrderService.putOrder({ orderId: orderId, statusOrder: '4' });
        if (res) {
            Swal.fire({ icon: 'success', title: 'Xóa thành công' });
            setRender(!render);
        } else {
            Swal.fire({ icon: 'error', title: 'Xóa thất bại' });
        }
    };
    const idTemplate = (order) => {
        return (
            <p onClick={() => handleDetailOrder(order._id)} className="hover:text-blue-600 cursor-pointer">
                {order.orderNumber}
            </p>
        );
    };

    const headerTemplate = () => {
        return (
            <div className="flex justify-content-between">
                <InputText type="search" placeholder="Tìm kiếm" value={search} onChange={(e) => setSearch(e.target.value)} />
                <Button
                    type="button"
                    icon="pi pi-file-excel"
                    severity="success"
                    rounded
                    className="mr-5"
                    onClick={() => {
                        fetch(BASE_URL + '/export/orders')
                            .then((res) => res.blob())
                            .then((blob) => download(blob, 'danh_sach_don_hang_' + new Date().toLocaleDateString())) // this line automatically starts a download operation
                            .catch((err) => console.log(err));
                    }}
                />
            </div>
        );
    };

    const actionBodyTemplate = (order) => {
        return <Button severity="danger" onClick={() => handleDeleteOrder(order._id)} icon="pi pi-trash" />;
    };

    return (
        <div>
            <div className="card">
                <LoadingCustom visible={isLoading} />
                <DataTable value={orders} stripedRows tableStyle={{ minWidth: '50rem' }} header={headerTemplate}>
                    <Column field="index" header="STT" align="center" body={(rowData, rowIndex) => rowIndex.rowIndex + 1} style={{ maxWidth: '3rem' }} />
                    <Column field="orderNumber" header="Mã đơn hàng" align="center" body={idTemplate} />
                    <Column field="customer.username" header="Tên khách hàng" align="center" />
                    <Column field="customer.phone" header="Số điện thoại" align="center" />
                    <Column field="items.length" header="Số lượng" align="center" />
                    <Column field="totalAmount" header="Tổng đơn hàng" align="center" body={totalAmountTemplate} />
                    <Column field="status" header="Status" body={statusBodyTemplate} align="center" />
                    <Column field="action" header="" body={actionBodyTemplate} align="center" />
                </DataTable>
                <ModalDetailOrder orderId={orderId} visible={visible} setVisible={setVisible} />
                <Paginator first={first} rows={rows} totalRecords={totalPages} onPageChange={onPageChange} />
            </div>
        </div>
    );
};

export default Orders;
