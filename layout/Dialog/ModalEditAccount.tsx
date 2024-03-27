import { Dialog } from 'primereact/dialog';
import React, { useContext, useRef, useState } from 'react';
import { Account, ModalEditAccountProps } from '../../types/types';
import { InputText } from 'primereact/inputtext';
import { Field, Form, Formik, useFormik } from 'formik';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import * as Yup from 'yup';
import { AccountCommon, AccountService } from '../../common/service/AccountService';
import { FileUpload } from 'primereact/fileupload';
import { LayoutContext } from '../context/layoutcontext';
import Swal from 'sweetalert2';
import { ImageUploadService } from '../../common/service/ImageUploadService';

const ModalEditAccount = ({ visible, setVisible, accountData, setAccountData, isEdit, render, setRender }: ModalEditAccountProps) => {
    const toast = useRef<Toast>(null);
    const [visibleChangePassword, setVisibleChangePassword] = useState(false);
    const [file, setFile] = useState<any>(null);
    const { setLoading } = useContext(LayoutContext);
    const handleEditAccount = async () => {
        setLoading(true);
        const req = {
            user_id: accountData._id,
            password: accountData.password,
            email: accountData.email,
            avatar: accountData.avatar,
            phone: accountData.phone,
            username: accountData.username
        };
        if (file) {
            const formData = new FormData();
            formData.append('file', file);
            const data = await ImageUploadService.postImage(formData);
            req.avatar = data.path;
        }
        const data = await AccountService.putAccount(req);
        if (data.status == 'success') {
            setTimeout(() => {
                setLoading(false);
                Swal.fire({
                    icon: 'success',
                    title: 'Cập nhật thành công'
                });
                setVisible(false);
                setRender(!render);
            }, 2000);
        } else {
            setTimeout(() => {
                setLoading(false);
                Swal.fire({
                    icon: 'error',
                    title: 'Cập nhật thất bại'
                });
                setVisible(false);
            }, 2000);
        }
    };

    const handleSubmitFormPassword = async (values: any) => {
        const req = {
            user_id: accountData._id,
            password: accountData.password,
            newPassword: values.rePassword
        };
        const data = await AccountService.putAccount(req);
        if (data.status == 'success') {
            setTimeout(() => {
                setLoading(false);
                Swal.fire({
                    icon: 'success',
                    title: 'Cập nhật thành công'
                });
                setVisible(false);
                setRender(!render);
            }, 2000);
        } else {
            setTimeout(() => {
                setLoading(false);
                Swal.fire({
                    icon: 'error',
                    title: 'Cập nhật thất bại'
                });
                setVisible(false);
            }, 2000);
        }
    };

    const headerBody = () => {
        return (
            <>
                <div className="text-center text-3xl">{isEdit ? 'Sửa thông tin tài khoản' : 'Thêm tài khoản'}</div>
            </>
        );
    };

    const SignupSchema = Yup.object().shape({
        password: Yup.string().required('*Vui lòng nhập mật khẩu').min(6, 'Mật khẩu phải từ 6 kí tự').max(12, 'Mật khẩu tối đa là 12 kí tự'),
        rePassword: Yup.string().oneOf([Yup.ref('password')], 'Mật khẩu không khớp')
    });

    const CustomInputComponent = ({ field, form: { touched, errors }, ...props }: any) => (
        <div>
            <InputText type="text" {...field} {...props} />
        </div>
    );

    return (
        <Dialog
            header={headerBody}
            visible={visible}
            maximizable
            style={{ width: '50vw' }}
            onHide={() => {
                setVisible(false);
            }}
        >
            <div className="grid">
                <div className="col-12 md:col-6">
                    <span className="flex flex-column gap-2">
                        <label htmlFor="username" className="text-black z-5">
                            Tài khoản
                        </label>
                        <InputText id="username" name="username" type="text" onChange={(e) => setAccountData({ ...accountData, username: e.target.value })} value={accountData.username} />
                        {accountData.username == '' ? <p className="text-red-600">*Tài khoản không được để trống</p> : ''}
                    </span>

                    <span className="flex flex-column gap-2 mt-3">
                        <label htmlFor="email" className="text-black z-5">
                            Email
                        </label>
                        <InputText id="email" name="email" type="text" onChange={(e) => setAccountData({ ...accountData, email: e.target.value })} value={accountData.email} />
                        {!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(accountData.email!) ? <p className="text-red-600">*Email không hợp lệ</p> : ''}
                    </span>

                    <span className="flex flex-column gap-2 mt-3">
                        <label htmlFor="phone" className="text-black z-5">
                            Số điện thoại
                        </label>
                        <InputText id="phone" name="phone" type="text" onChange={(e) => setAccountData({ ...accountData, phone: e.target.value })} value={accountData.phone} />
                        {!/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/.test(accountData.phone!) ? <p className="text-red-600">*Số điện thoại không hợp lệ</p> : ''}
                    </span>

                    <Button type="submit" className="mt-3" severity="warning" onClick={handleEditAccount}>
                        Sửa thông tin
                    </Button>

                    <Dialog header="Mời bạn nhập mật khẩu mới" visible={visibleChangePassword} style={{ width: '50vw' }} onHide={() => setVisibleChangePassword(false)}>
                        <Formik
                            initialValues={{
                                password: '',
                                rePassword: ''
                            }}
                            validationSchema={SignupSchema}
                            onSubmit={(values) => handleSubmitFormPassword(values)}
                        >
                            {({ errors, touched }) => (
                                <Form>
                                    <div className="flex flex-column gap-2 mt-3">
                                        <label htmlFor="password">Mật khẩu</label>
                                        <Field component={CustomInputComponent} type="password" name="password" className="w-full" />
                                        {errors.password && touched.password ? <div>{errors.password}</div> : null}
                                    </div>
                                    <div className="flex flex-column gap-2 mt-3">
                                        <label htmlFor="rePassword">Nhập lại mật khẩu </label>
                                        <Field component={CustomInputComponent} type="password" name="rePassword" className="w-full" />
                                        {errors.rePassword && touched.rePassword ? <div>{errors.rePassword}</div> : null}
                                    </div>

                                    <Button type="submit" severity="danger" className="mt-3">
                                        Đổi mật khẩu
                                    </Button>
                                </Form>
                            )}
                        </Formik>
                    </Dialog>
                </div>

                <div className="col-12 md:col-6">
                    <div className="flex align-items-center flex-column">
                        <img
                            src={accountData.avatar ? accountData.avatar : 'https://st3.depositphotos.com/9998432/13335/v/450/depositphotos_133352156-stock-illustration-default-placeholder-profile-icon.jpg'}
                            alt="Image not found"
                            className="w-12rem h-12rem border-circle mb-5"
                        />
                        <FileUpload
                            mode="basic"
                            className="file-upload-custom"
                            name="demo[]"
                            url={'/api/upload'}
                            accept="image/*"
                            maxFileSize={1000000}
                            onSelect={(e: any) => {
                                setAccountData({ ...accountData, avatar: e.files[0].objectURL });
                                setFile(e.files[0]);
                            }}
                        />
                    </div>
                </div>
            </div>
            <Toast ref={toast} />
        </Dialog>
    );
};

export default ModalEditAccount;
