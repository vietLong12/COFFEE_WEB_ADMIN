'use client';
import React, { useState, useEffect } from 'react';
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
import { AccountCommon } from '../../../../common/service/AccountService';
import { exportDataAccount } from '../../../../common/excel.';
import { convertDateTimeFormat } from '../../../../common/utils/util';

export default function BasicFilterDemo() {
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [data, setData] = useState<Account[]>([]);
    const [visible, setVisible] = useState(false);
    const [render, setRender] = useState(true);
    const [accountData, setAccountData] = useState<Partial<Account>>({});
    const [filters, setFilters] = useState<DataTableFilterMeta>({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        username: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        email: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        phone: { value: null, matchMode: FilterMatchMode.IN },
        status: { value: null, matchMode: FilterMatchMode.EQUALS }
    });
    const [loading, setLoading] = useState<boolean>(true);
    const [globalFilterValue, setGlobalFilterValue] = useState<string>('');

    useEffect(() => {
        setLoading(true);
        AccountCommon.getListAccount().then((data) => {
            setData(data.list);
        });
        setLoading(false);
    }, [render]);

    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        let _filters = { ...filters };

        // @ts-ignore
        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const handleDeleteAccount = (rowData: Account) => {
        setAccountData(rowData);
        AccountCommon.deleteAccount(rowData._id);
        setRender(!render);
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between pr-5 mr-5">
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
                    <Button
                        type="button"
                        icon="pi pi-file-excel"
                        severity="success"
                        rounded
                        onClick={() => {
                            exportDataAccount(data);
                        }}
                    />
                </div>
            </div>
        );
    };

    const idBodyTemplate = (rowData: Account) => {
        return (
            <div className="flex align-items-center gap-2">
                <p>{rowData._id}</p>
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
                <Button severity="danger" icon="pi pi-trash" rounded onClick={() => handleDeleteAccount(rowData)} />
            </div>
        );
    };

    const header = renderHeader();

    return (
        <div className="card">
            <DataTable
                rowsPerPageOptions={[5, 10, 25, 50]}
                removableSort
                value={data}
                paginator
                showGridlines
                rows={5}
                dataKey="_id"
                filters={filters}
                loading={loading}
                globalFilterFields={['username', 'email', 'phone', 'status', '_id']}
                header={header}
                emptyMessage="No user found."
            >
                <Column field="_id" sortable filterField="_id" body={idBodyTemplate} header="ID" style={{ minWidth: '12rem' }} />
                <Column field="username" sortable header="Tên tài khoản" style={{ minWidth: '12rem' }} />
                <Column header="Email" field="email" sortable filterField="email" style={{ minWidth: '12rem' }} body={emailBodyTemplate} />
                <Column header="Số điện thoại" field="phone" sortable filterField="phone" body={phoneBodyTemplate} />
                <Column header="Ngày đăng kí" field="createdAt" sortable filterField="createdAt" body={createdAtBodyTemplate} />
                <Column header="Ngày chỉnh sửa gần nhất" field="updatedAt" sortable filterField="updatedAt" body={updatedAtBodyTemplate} />
                <Column header="Chỉnh sửa" body={actionBodyTemplate} />
            </DataTable>
            {isEdit ? (
                <ModalEditAccount isEdit={isEdit} visible={visible} setVisible={setVisible} accountData={accountData} setAccountData={setAccountData} render={render} setRender={setRender} />
            ) : (
                <ModalAddAccount visible={visible} setVisible={setVisible} render={render} setRender={setRender} />
            )}
        </div>
    );
}
