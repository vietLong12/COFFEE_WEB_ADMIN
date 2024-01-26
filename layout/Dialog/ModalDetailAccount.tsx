import { Dialog } from 'primereact/dialog';
import React, { useContext, useRef, useState } from 'react';
import { Account, ModalDetailAccountProps, ModalEditAccountProps } from '../../types/types';
import { InputText } from 'primereact/inputtext';
import { Field, Form, Formik, FormikValues, useFormik } from 'formik';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import * as Yup from 'yup';
import { AccountCommon, AccountService } from '../../common/service/AccountService';
import { FileUpload } from 'primereact/fileupload';
import { ImageUploadService } from '../../common/service/ImageUploadService';
import { LayoutContext } from '../context/layoutcontext';
import { InputNumber } from 'primereact/inputnumber';

interface ModalDetailAccountProps {
    account: {
        address: any[];
        avatar: string;
        cart: {
            items: any[];
        };
        createdAt: string;
        email: string;
        password: string;
        phone: string;
        token: string;
        updatedAt: string;
        username: string;
        _id: string;
    };
    visible: boolean;
    setVisible: any;
}
const ModalDetailAccount = ({ account, visible, setVisible }: ModalDetailAccountProps) => {
    const toast = useRef<Toast>(null);
    const headerBody = () => {
        return (
            <>
                <div className="text-center text-3xl">Chi tiết người dùng</div>
            </>
        );
    };

    return (
        <Dialog
            header={headerBody}
            visible={visible}
            maximizable
            style={{ width: '50vw', zIndex: '999' }}
            onHide={() => {
                setVisible(false);
            }}
        >
            <Toast ref={toast} />
            <div className="grid">
                <div className="col-7">
                    <div className="flex flex-column gap-2 mb-3">
                        <label htmlFor="username">Tên tài khoản:</label>
                        <InputText id="username" value={account?.username} aria-describedby="username-help" disabled />
                    </div>
                    <div className="flex flex-column gap-2 mb-3">
                        <label htmlFor="email">Email:</label>
                        <InputText id="email" value={account?.email} aria-describedby="email-help" disabled />
                    </div>
                    <div className="flex flex-column gap-2 mb-3">
                        <label htmlFor="phone">Số điện thoại:</label>
                        <InputText id="phone" value={account?.phone} aria-describedby="phone-help" disabled />
                    </div>
                    <div className="flex flex-column gap-2 mb-3">
                        <label htmlFor="token">Ghi nhớ đăng nhập:</label>
                        <InputText id="token" value={account?.token != '' ? 'Có' : 'Không'} aria-describedby="token-help" disabled />
                    </div>
                    <div className="flex flex-row gap-2 mb-3">
                        <div className="flex flex-column gap-2 w-6">
                            <label htmlFor="token">Số lượng sản phẩm trong giỏ:</label>
                            <InputNumber id="token" value={account?.cart.items.length} aria-describedby="token-help" disabled />
                        </div>
                        <div className="flex flex-column gap-2 w-6">
                            <label htmlFor="token">Số địa chỉ lưu trữ:</label>
                            <InputNumber id="token" value={account?.address.length} aria-describedby="token-help" disabled />
                        </div>
                    </div>
                    <div className="flex flex-rơw gap-2 mb-3">
                        <div className="flex flex-column gap-2 w-6">
                            <label htmlFor="token">Ngày tạo tài khoản:</label>
                            <InputText id="token" value={new Date(account?.createdAt).toLocaleDateString()} aria-describedby="token-help" disabled />
                        </div>
                        <div className="flex flex-column gap-2 w-6">
                            <label htmlFor="token">Ngày sửa đổi gần nhất:</label>
                            <InputText id="token" value={new Date(account?.updatedAt).toLocaleDateString()} aria-describedby="token-help" disabled />
                        </div>
                    </div>
                    <div className="flex flex-column gap-2 mb-3">
                        <label htmlFor="token">Mật khẩu:</label>
                        <InputText id="token" value={account?.password} aria-describedby="token-help" disabled />
                    </div>
                </div>
                <div className="col-5 justify-content-center align-items-center flex">
                    <img src={account?.avatar} alt="" className="w-10 h-fit" />
                </div>
            </div>
        </Dialog>
    );
};

export default ModalDetailAccount;
