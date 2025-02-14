'use client';
import React, { useState, useEffect, useRef, useContext } from 'react';
import { classNames } from 'primereact/utils';
import { FilterMatchMode } from 'primereact/api';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { Column, ColumnFilterElementTemplateOptions } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect';
import { Tag } from 'primereact/tag';
import { TriStateCheckbox, TriStateCheckboxChangeEvent } from 'primereact/tristatecheckbox';
import { data } from '../fakeData/DataAccount';
import { Button } from 'primereact/button';
import ModalEditAccount from '../../../../layout/Dialog/ModalEditAccount';
import { Account, ModalEditAccountProps } from '../../../../types/types';
import ModalAddAccount from '../../../../layout/Dialog/ModalAddAccount';
//@ts-ignore
import { AccountCommon, AccountService } from '../../../../common/service/AccountService';
//@ts-ignore
import { exportDataAccount } from '../../../../common/excel.';
import { convertDateTimeFormat } from '../../../../common/utils/util';
import { Paginator } from 'primereact/paginator';
import ModalDetailAccount from '../../../../layout/Dialog/ModalDetailAccount';
import { Toast } from 'primereact/toast';
import Loading from '../loading';
import LoadingCustom from '../../../../common/components/Loading';
import { LayoutContext } from '../../../../layout/context/layoutcontext';
import { ExcelService } from '../../../../common/service/ExcelService';
import axios from 'axios';
import download from 'downloadjs';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { BASE_URL } from '../../../../common/service/type';

export default function BasicFilterDemo() {
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const toast = useRef<Toast>(null);
    const { loading, setLoading } = useContext(LayoutContext);

    const [data, setData] = useState<Account[]>([]);
    const [visible, setVisible] = useState(false);
    const [render, setRender] = useState(true);
    const [first, setFirst] = useState(0);
    const [totalPages, setTotalPages] = useState(100);
    const [currentPage, setCurrentPage] = useState(1);
    const [rows, setRows] = useState(5);
    const [accountData, setAccountData] = useState<Partial<Account>>({});
    const [accountProp, setAccountProp] = useState<any>(null);
    const [visibleDetailAccount, setVisibleDetailAccount] = useState(false);
    const [globalFilterValue, setGlobalFilterValue] = useState<string>('');

    useEffect(() => {
        setLoading(false);
        const fetchData = async () => {
            const accounts = await AccountService.getListAccount({ page: currentPage + '', limit: '5', keyword: globalFilterValue });
            setData(accounts.accounts);
            setRows(5);
            setTotalPages(accounts.pagination.totalDocuments);
            setLoading(false);
        };
        fetchData();
    }, [first, rows, globalFilterValue, render]);

    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setGlobalFilterValue(value);
    };

    const handleDeleteAccount = async (rowData: Account) => {
        setLoading(true);
        setAccountData(rowData);
        const account = await AccountService.deleteAccountById(rowData._id);
        if (account.status === 'success') {
            setTimeout(() => {
                setLoading(false);
                setRender(!render);
                toast.current?.show({ severity: 'success', summary: 'Thành công', detail: 'Xóa thành công', life: 3000 });
            }, 2000);
        } else {
            toast.current?.show({ severity: 'error', summary: 'Đã xảy ra lỗi', detail: 'Xóa thất bại', life: 3000 });
        }
    };

    const handleExportFile = async () => {
        fetch(`${BASE_URL}/export/accounts`)
            .then((res) => res.blob())
            .then((blob) => download(blob, 'danh_sach_tai_khoan_' + new Date().toLocaleDateString())) // this line automatically starts a download operation
            .catch((err) => console.log(err));
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between pr-5 mr-5">
                <LoadingCustom visible={loading} />
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
                </span>
                <div>
                    <Button
                        type="button"
                        icon="pi pi-user-plus"
                        className="mr-5"
                        severity="secondary"
                        rounded
                        onClick={() => {
                            setIsEdit(false);
                            setAccountData({ username: '', password: '', _id: '', avatar: '', email: '', phone: '' });
                            setVisible(true);
                        }}
                    />
                    <Button type="button" icon="pi pi-file-excel" severity="success" rounded onClick={handleExportFile} />
                </div>
            </div>
        );
    };

    const idBodyTemplate = (rowData: Account) => {
        return (
            <div className="flex align-items-center gap-2">
                <p
                    onClick={() => {
                        setVisibleDetailAccount(!visibleDetailAccount);
                        setAccountProp(rowData);
                    }}
                    className="hover:text-purple-600 cursor-pointer"
                >
                    {rowData._id}
                </p>
            </div>
        );
    };

    const emailBodyTemplate = (rowData: Account) => {
        return (
            <div className="flex align-items-center gap-2">
                <p>{rowData.email}</p>
            </div>
        );
    };

    const phoneBodyTemplate = (rowData: Account) => {
        return (
            <div className="flex align-items-center gap-2">
                <span>{rowData.phone}</span>
            </div>
        );
    };

    const createdAtBodyTemplate = (rowData: Account) => {
        return (
            <div className="flex align-items-center gap-2">
                <span>{convertDateTimeFormat(rowData.createdAt)}</span>
            </div>
        );
    };

    const updatedAtBodyTemplate = (rowData: Account) => {
        return (
            <div className="flex align-items-center gap-2">
                <span>{convertDateTimeFormat(rowData.updatedAt)}</span>
            </div>
        );
    };

    const actionBodyTemplate = (rowData: Account) => {
        const accept = () => {
            handleDeleteAccount(rowData);
        };

        const reject = () => {
            toast.current.show({ severity: 'warn', summary: 'Hủy thành công', detail: 'Bạn đã hủy bỏ ', life: 3000 });
        };
        const confirm2 = (event) => {
            confirmPopup({
                target: event.currentTarget,
                message: 'Bạn có chắc là sẽ xóa tài khoản này?',
                icon: 'pi pi-info-circle',
                //@ts-ignore
                defaultFocus: 'reject',
                acceptClassName: 'p-button-danger',
                accept,
                reject
            });
        };
        return (
            <div className="">
                <Button
                    severity="warning"
                    icon="pi pi-user-edit"
                    rounded
                    className="mr-2"
                    onClick={() => {
                        setVisible(true);
                        setIsEdit(true);
                        setAccountData(rowData);
                    }}
                />
                <ConfirmPopup />
                <Button onClick={confirm2} icon="pi pi-trash" label="" rounded className="p-button-danger"></Button>
            </div>
        );
    };
    const onPageChange = (event) => {
        setFirst(event.first);
        setRows(event.rows);
        setCurrentPage(event.page + 1);
    };
    const header = renderHeader();

    return (
        <div className="card">
            <DataTable rowsPerPageOptions={[5, 10, 25, 50]} removableSort value={data} showGridlines rows={5} dataKey="_id" loading={loading} header={header} emptyMessage="No user found.">
                <Column field="_id" sortable filterField="_id" body={idBodyTemplate} header="ID" style={{ minWidth: '12rem' }} />
                <Column field="username" sortable header="Tên tài khoản" style={{ minWidth: '12rem' }} />
                <Column header="Email" field="email" sortable filterField="email" style={{ minWidth: '12rem' }} body={emailBodyTemplate} />
                <Column header="Số điện thoại" field="phone" sortable filterField="phone" body={phoneBodyTemplate} />
                <Column header="Ngày đăng kí" field="createdAt" sortable filterField="createdAt" body={createdAtBodyTemplate} />
                <Column header="Chỉnh sửa" body={actionBodyTemplate} />
            </DataTable>
            <Toast ref={toast} />

            <Paginator first={first} rows={rows} totalRecords={totalPages} onPageChange={onPageChange} />
            <ModalDetailAccount account={accountProp} visible={visibleDetailAccount} setVisible={setVisibleDetailAccount} />
            {isEdit ? (
                <ModalEditAccount isEdit={isEdit} visible={visible} setVisible={setVisible} accountData={accountData} setAccountData={setAccountData} render={render} setRender={setRender} />
            ) : (
                <ModalAddAccount visible={visible} setVisible={setVisible} render={render} setRender={setRender} />
            )}
        </div>
    );
}
