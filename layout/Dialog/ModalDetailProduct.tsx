import { Dialog } from 'primereact/dialog';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Field, Form, Formik, FormikValues, useFormik } from 'formik';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import * as Yup from 'yup';
//@ts-ignore
import { AccountCommon, AccountService } from '../../common/service/AccountService';
import { FileUpload } from 'primereact/fileupload';
import { ImageUploadService } from '../../common/service/ImageUploadService';
import { LayoutContext } from '../context/layoutcontext';
import { InputNumber } from 'primereact/inputnumber';
import { ProductService } from '../../common/service/ProductService';
import { Rating } from 'primereact/rating';
import { InputTextarea } from 'primereact/inputtextarea';

interface ModalDetailProductProps {
    product: any;
    visible: boolean;
    setVisible: any;
    listCategory: any;
}
const ModalDetailProduct = ({ product, visible, setVisible, listCategory }: ModalDetailProductProps) => {
    const [productData, setProductData] = useState(null);
    const toast = useRef<Toast>(null);
    useEffect(() => {
        const fetchData = async () => {
            if (product._id) {
                const data = await ProductService.getListCommentById(product._id);
                setProductData({ ...product, ...data.data });
            }
        };
        fetchData();
    }, [product]);
    const headerBody = () => {
        return (
            <>
                <div className="text-center text-3xl">Chi tiết sản phẩm</div>
            </>
        );
    };

    return (
        <Dialog
            header={headerBody}
            visible={visible}
            maximizable
            style={{ width: '60vw', zIndex: '999' }}
            onHide={() => {
                setVisible(false);
            }}
        >
            <Toast ref={toast} />
            <div className="grid">
                <div className="col-5">
                    <div className="flex flex-column mb-3">
                        <label htmlFor="id">Mã sản phẩm:</label>
                        <InputText id="id" value={productData?._id} aria-describedby="id-help" className="disabled-input" />
                    </div>
                    <div className="flex flex-column mb-3">
                        <label htmlFor="productName">Tên sản phẩm:</label>
                        <InputText id="productName" value={productData?.productName} aria-describedby="productName-help" className="disabled-input" />
                    </div>
                    <div className="flex flex-column mb-3">
                        <label htmlFor="inStock">Tình trạng:</label>
                        <InputText id="inStock" value={productData?.inStock ? 'Đang bán' : 'Ngừng bán'} aria-describedby="inStock-help" className="disabled-input" />
                    </div>

                    <div className="flex flex-row gap-2 mb-3">
                        <div className="flex flex-column w-6">
                            <label htmlFor="token">Số lượng đánh giá:</label>
                            <InputNumber id="token" value={productData?.listComment.length} aria-describedby="token-help" disabled />
                        </div>
                        <div className="flex flex-column gap-2 w-6 ">
                            <label htmlFor="token" className="h-2rem">
                                Vote: <span className="text-red-500 font-bold">{productData?.averageVote}</span>
                            </label>
                            <div className="flex align-items-center">
                                <Rating value={productData?.averageVote} readOnly cancel={false} />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-rơw gap-2 mb-3">
                        <div className="flex flex-column gap-2 w-6">
                            <label htmlFor="token">Ngày thêm sản phẩm:</label>
                            <InputText id="token" value={new Date(productData?.createdAt).toLocaleDateString()} aria-describedby="token-help" className="disabled-input" />
                        </div>
                        <div className="flex flex-column gap-2 w-6">
                            <label htmlFor="token">Ngày sửa đổi gần nhất:</label>
                            <InputText id="token" value={new Date(productData?.updatedAt).toLocaleDateString()} aria-describedby="token-help" className="disabled-input" />
                        </div>
                    </div>
                </div>
                <div className="col-4 flex flex-column">
                    <label htmlFor="">Mô tả sản phẩm:</label>
                    <InputTextarea value={productData?.desc} className="disabled-input" rows={17} cols={30} />
                </div>
                <div className="col-3 justify-content-center align-items-center flex">
                    <img src={productData?.img} alt="" className="w-10 h-fit" />
                </div>
            </div>
        </Dialog>
    );
};

export default ModalDetailProduct;
