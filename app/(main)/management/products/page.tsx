'use client';
import React, { useState, useEffect, useRef } from 'react';
import { FilterMatchMode } from 'primereact/api';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Account, Category, Product } from '../../../../types/types';
import ModalProducts from '../../../../layout/Dialog/ModalProducts';
import { ProductService } from '../../../../common/service/ProductService';
import { convertDateTimeFormat } from '../../../../common/utils/util';
import { Toast } from 'primereact/toast';

export default function Products() {
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [data, setData] = useState<Product[]>([]);
    const toast = useRef<Toast>(null);
    const [render, setRender] = useState<Boolean>(false);
    console.log('data: ', data);

    const [listCategory, setListCategory] = useState<Category[]>([]);
    const [visible, setVisible] = useState(false);
    const [productData, setProductData] = useState<Partial<Product>>({});
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
        const fetch1 = ProductService.getListProduct();
        Promise.all([fetch1]).then((data) => {
            console.log('data: ', data);
            setData(data[0].products);
            setLoading(false);
        });
    }, [render]);

    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        let _filters = { ...filters };

        // @ts-ignore
        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
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
                            setVisible(true);
                        }}
                    />
                    <Button
                        type="button"
                        icon="pi pi-file-excel"
                        severity="success"
                        rounded
                        onClick={() => {
                            setVisible(true);
                        }}
                    />
                </div>
            </div>
        );
    };

    const idBodyTemplate = (rowData: Product) => {
        console.log('rowData: ', rowData);
        return (
            <div className="flex align-items-center gap-2">
                <p className="line" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {rowData._id}
                </p>
            </div>
        );
    };

    const createdAtBodyTemplate = (rowData: Product) => {
        return (
            <div className="flex align-items-center gap-2">
                <span>{convertDateTimeFormat(rowData.createdAt)}</span>
            </div>
        );
    };

    const inStockBodyTemplate = (rowData: Product) => {
        return <div>{rowData.inStock ? <p className="bg-red-400 text-xs text-center text-white border-round-sm	p-1">Còn hàng</p> : <p className=" p-1 bg-gray-500 text-xs text-center text-white border-round-sm	">Hết hàng</p>}</div>;
    };

    const sizeBodyTemplate = (rowData: Product) => {
        return rowData.sizes?.map((item, index) => {
            if (index + 1 == rowData?.sizes.length) {
                return (
                    <span key={index} className="uppercase">
                        {item.name}
                    </span>
                );
            }
            return (
                <span key={index} className="uppercase">
                    {item.name},{' '}
                </span>
            );
        });
    };

    const categoryBodyTemplate = (rowData: Product) => {
        const category = listCategory.find((category: Category) => rowData.categoryId === category._id);
        if (!category) {
            return (
                <div className="flex align-items-center gap-2">
                    <span>Category</span>
                </div>
            );
        } else {
            return (
                <div className="flex align-items-center gap-2">
                    <span className="capitalize">{category.category}</span>
                </div>
            );
        }
    };

    const updatedAtBodyTemplate = (rowData: Account) => {
        return (
            <div className="flex align-items-center gap-2">
                <span>{convertDateTimeFormat(rowData.updatedAt)}</span>
            </div>
        );
    };

    const actionBodyTemplate = (rowData: Account) => {
        const handleDelete = async (id: string) => {
            const response = await ProductService.deleteProductById(id);
            if (response.dataRemoved) {
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Deleted',
                    life: 3000
                });
                setRender(!render);
            }
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
                        setProductData(rowData);
                    }}
                />
                <Button severity="danger" icon="pi pi-trash" rounded onClick={() => handleDelete(rowData._id)} />
            </div>
        );
    };

    const header = renderHeader();

    return (
        <div className="card">
            <Toast ref={toast} />
            <DataTable
                rowsPerPageOptions={[5, 10, 25, 50]}
                removableSort
                value={data}
                paginator
                rows={10}
                dataKey="_id"
                showGridlines
                filters={filters}
                loading={loading}
                globalFilterFields={['productName', 'category', 'quantity', 'rating', '_id']}
                header={header}
                emptyMessage="No user found."
            >
                <Column field="_id" filterField="_id" body={idBodyTemplate} header="Mã sản phẩm" style={{ maxWidth: '8rem' }} />
                <Column field="productName" sortable header="Tên sản phẩm" style={{ minWidth: '12rem' }} />
                <Column header="Category" field="category" sortable filterField="category" body={categoryBodyTemplate} />
                <Column header="Size" field="size" sortable filterField="size" body={sizeBodyTemplate} className="text-center" />
                <Column header="Tình trạng" field="inStock" sortable filterField="inStock" body={inStockBodyTemplate} />
                <Column header="Ngày thêm sản phẩm" field="createdAt" sortable filterField="createdAt" body={createdAtBodyTemplate} />
                <Column header="Ngày chỉnh sửa gần nhất" field="updatedAt" sortable filterField="updatedAt" body={updatedAtBodyTemplate} />
                <Column header="Chỉnh sửa" body={actionBodyTemplate} />
            </DataTable>
            <ModalProducts visible={visible} setVisible={setVisible} isEdit={isEdit} productData={productData} render={render} setRender={setRender} setProductData={setProductData} />
        </div>
    );
}
