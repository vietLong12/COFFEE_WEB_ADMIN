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
import { Paginator } from 'primereact/paginator';
import { useDebounce } from 'primereact/hooks';
import ModalDetailAccount from '../../../../layout/Dialog/ModalDetailAccount';
import ModalDetailProduct from '../../../../layout/Dialog/ModalDetailProduct';
import Loading from '../loading';
import download from 'downloadjs';
import LoadingCustom from '../../../../common/components/Loading';
import Swal from 'sweetalert2';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';

export default function Products() {
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [data, setData] = useState<Product[]>([]);
    const toast = useRef<Toast>(null);
    const [render, setRender] = useState<Boolean>(false);
    const [first, setFirst] = useState(0);
    const [totalPages, setTotalPages] = useState(100);
    const [currentPage, setCurrentPage] = useState(1);
    const [rows, setRows] = useState(5);
    const [listCategory, setListCategory] = useState<Category[]>([]);
    const [visible, setVisible] = useState(false);
    const [visibleDetailProduct, setVisibleDetailProduct] = useState<boolean>(false);
    const [productData, setProductData] = useState<Partial<Product>>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [globalFilterValue, debouncedValue, setGlobalFilterValue] = useDebounce('', 1000);
    const onPageChange = (event: any) => {
        setFirst(event.first);
        setRows(event.rows);
        setCurrentPage(event.page + 1);
    };
    useEffect(() => {
        setLoading(true);
        const fetch2 = ProductService.getListCategory();
        const fetch1 = ProductService.getListProduct({ page: currentPage + '', keyword: debouncedValue, limit: '10' });
        Promise.all([fetch1, fetch2]).then((data) => {
            setListCategory(data[1].data);
            setRows(10);
            setTotalPages(data[0].pagination.totalDocuments);
            setData(data[0].products);
            setLoading(false);
        });
    }, [render, currentPage, debouncedValue]);

    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setGlobalFilterValue(value);
    };

    const renderHeader = () => {
        return (
            <div className="md:flex justify-content-between pr-5 mr-5">
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
                </span>
                <div className='mt-2 md:mt-0'>
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
                            fetch('http://localhost:5500/export/products')
                                .then((res) => res.blob())
                                .then((blob) => download(blob, 'danh_sach_san_pham_' + new Date().toLocaleDateString())) // this line automatically starts a download operation
                                .catch((err) => console.log(err));
                        }}
                    />
                </div>
            </div>
        );
    };

    const idBodyTemplate = (rowData: Product) => {
        return (
            <div className="flex align-items-center gap-2">
                <p
                    className="line underline cursor-pointer hover:text-blue-500"
                    style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                    onClick={() => {
                        setProductData(rowData);
                        setVisibleDetailProduct(true);
                    }}
                >
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
        return (
            <div className="flex justify-content-start">
                {rowData.sizes?.map((item, index) => {
                    if (index + 1 == rowData?.sizes.length) {
                        return (
                            <span key={index} className="uppercase text-left block">
                                {item.name}
                            </span>
                        );
                    }
                    return (
                        <span key={index} className="uppercase text-left block">
                            {item.name},{' '}
                        </span>
                    );
                })}
            </div>
        );
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
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'pi pi-trash',
                cancelButton: 'pi pi-times'
            },
            buttonsStyling: false
        });

        const accept = async () => {
            const response = await ProductService.deleteProduct(rowData._id);
            if (response) {
                toast.current.show({ severity: 'info', summary: 'Confirmed', detail: 'Xóa sản phẩm thành công', life: 3000 });
                setRender(!render);
            }
        };

        const reject = () => {
            toast?.current.show({ severity: 'warn', summary: 'Rejected', detail: 'Hủy bỏ thành công', life: 3000 });
        };
        const confirm2 = (event) => {
            confirmPopup({
                target: event.currentTarget,
                message: 'Bạn có chắc rằng muốn xóa sản phẩm không?',
                icon: 'pi pi-info-circle',
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
                        setProductData(rowData);
                    }}
                />
                <ConfirmPopup />

                <Button onClick={confirm2} icon="pi pi-trash" label="" className="p-button-danger" rounded></Button>
            </div>
        );
    };

    const header = renderHeader();

    return (
        <div className="card">
            <Toast ref={toast} />
            <LoadingCustom visible={loading} />
            <DataTable
                rowsPerPageOptions={[5, 10, 25, 50]}
                removableSort
                value={data}
                rows={10}
                dataKey="_id"
                showGridlines
                loading={loading}
                globalFilterFields={['productName', 'category', 'quantity', 'rating', '_id']}
                header={header}
                emptyMessage="No user found."
            >
                <Column field="_id" filterField="_id" body={idBodyTemplate} header="Mã sản phẩm" style={{ maxWidth: '12rem' }} />
                <Column field="productName" header="Tên sản phẩm" style={{ maxWidth: '10rem' }} />
                <Column header="Phân loại" field="category" filterField="category" style={{ maxWidth: '5rem' }} body={categoryBodyTemplate} />
                <Column header="Size" field="size" filterField="size" body={sizeBodyTemplate} style={{ maxWidth: '8rem' }} className="text-center" />
                <Column header="Tình trạng" field="inStock" filterField="inStock" body={inStockBodyTemplate} />
                <Column header="Ngày thêm sản phẩm" field="createdAt" filterField="createdAt" body={createdAtBodyTemplate} />
                <Column header="Ngày chỉnh sửa gần nhất" field="updatedAt" filterField="updatedAt" body={updatedAtBodyTemplate} />
                <Column header="Chỉnh sửa" headerClassName="" body={actionBodyTemplate} />
            </DataTable>
            <Paginator first={first} rows={rows} totalRecords={totalPages} onPageChange={onPageChange} />
            <ModalDetailProduct product={productData} visible={visibleDetailProduct} setVisible={setVisibleDetailProduct} listCategory={listCategory} />
            <ModalProducts visible={visible} setVisible={setVisible} isEdit={isEdit} productData={productData} render={render} setRender={setRender} setProductData={setProductData} />
        </div>
    );
}
