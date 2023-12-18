import { Dialog } from 'primereact/dialog';
import React, { useRef, useState } from 'react';
import { Account, ModalAddAccountProps, ModalEditAccountProps } from '../../types/types';
import { InputText } from 'primereact/inputtext';
import { Field, Form, Formik, FormikValues, useFormik } from 'formik';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import * as Yup from 'yup';
import { AccountCommon } from '../../common/service/AccountService';
import { FileUpload } from 'primereact/fileupload';

const ModalAddAccount = ({ visible, setVisible, setRender, render }: ModalAddAccountProps) => {
    const toast = useRef<Toast>(null);
    const [avatarLink, setAvatarLink] = useState('');
    console.log('avatarLink: ', avatarLink);
    const headerBody = () => {
        return (
            <>
                <div className="text-center text-3xl"> Thêm tài khoản</div>
            </>
        );
    };

    const SignupSchema = Yup.object().shape({
        username: Yup.string().min(4, 'Tài khoản quá ngắn!').max(50, 'Tài khoản quá dài!').required('*Vui lòng nhập tài khoản của bạn'),
        phone: Yup.string().min(8, 'Số điện thoại quá ngắn').max(11, 'Số điện thoại quá dài').required('*Vui lòng nhập số điện thoại'),
        email: Yup.string().email('Email không hợp lệ').required('Vui lòng nhập email của bạn'),
        password: Yup.string().required('*Vui lòng nhập mật khẩu').min(6, 'Mật khẩu phải từ 6 kí tự').max(12, 'Mật khẩu tối đa là 12 kí tự'),
        rePassword: Yup.string().oneOf([Yup.ref('password')], 'Mật khẩu không khớp')
    });

    const CustomInputComponent = ({ field, form: { touched, errors }, ...props }: any) => (
        <div>
            <InputText type="text" {...field} {...props} />
        </div>
    );

    const handleSubmit = async (values: any, resetForm: any) => {
        const dataResponse = await AccountCommon.createAccount({ ...values, avatar: avatarLink });
        if (dataResponse.message) {
            console.log('dataResponse: ', dataResponse);
            if (dataResponse.response.status === 400) {
                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Tài khoản đã tồn tại', sticky: true });
            }
        } else {
            toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Tạo tài khoản mới thành công!', sticky: true });
            resetForm();
            setRender(!render);
            setVisible(!visible);
        }
    };
    return (
        <Dialog
            header={headerBody}
            visible={visible}
            maximizable
            style={{ width: '50vw' }}
            onHide={() => {
                setVisible(false);
                setAvatarLink('');
            }}
        >
            <Toast ref={toast} />
            <div className="grid">
                <div className="col-12 xl:col-6">
                    <Formik
                        initialValues={{
                            username: '',
                            phone: '',
                            email: '',
                            avatar: '',
                            password: '',
                            rePassword: ''
                        }}
                        validationSchema={SignupSchema}
                        onSubmit={(values, { resetForm }) => handleSubmit(values, resetForm)}
                    >
                        {({ errors, touched }) => (
                            <Form>
                                <div className="">
                                    <label htmlFor="username">Tài khoản</label>
                                    <Field component={CustomInputComponent} name="username" className="w-full" />
                                    {errors.username && touched.username ? <div className="text-red-600">{errors.username}</div> : null}
                                </div>
                                <div className="mt-3">
                                    <label htmlFor="email">Email </label>
                                    <Field component={CustomInputComponent} name="email" className="w-full" />
                                    {errors.email && touched.email ? <div className="text-red-600">{errors.email}</div> : null}
                                </div>

                                <div className="mt-3">
                                    <label htmlFor="phone">Số điện thoại </label>
                                    <Field component={CustomInputComponent} name="phone" className="w-full" />
                                    {errors.phone && touched.phone ? <div className="text-red-600">{errors.phone}</div> : null}
                                </div>
                                <div className="mt-3">
                                    <label htmlFor="password">Mật khẩu</label>
                                    <Field component={CustomInputComponent} type="password" name="password" className="w-full" />
                                    {errors.password && touched.password ? <div className="text-red-600">{errors.password}</div> : null}
                                </div>
                                <div className="mt-3">
                                    <label htmlFor="rePassword">Nhập lại mật khẩu </label>
                                    <Field component={CustomInputComponent} type="password" name="rePassword" className="w-full" />
                                    {errors.rePassword && touched.rePassword ? <div className="text-red-600">{errors.rePassword}</div> : null}
                                </div>

                                <Button type="submit" severity="secondary" className="mt-3">
                                    Thêm tài khoản
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </div>
                <div className="col-12 xl:col-6">
                    <div className="flex align-items-center flex-column">
                        <img
                            src={avatarLink ? avatarLink : 'https://st3.depositphotos.com/9998432/13335/v/450/depositphotos_133352156-stock-illustration-default-placeholder-profile-icon.jpg'}
                            alt="Image not found"
                            className="w-20rem h-20rem border-circle mb-5"
                        />
                        <FileUpload mode="basic" className='file-upload-custom' name="demo[]" url={'/api/upload'} accept="image/*" maxFileSize={1000000} onSelect={(e: any) => setAvatarLink(e.files[0].objectURL)} />
                    </div>
                </div>
            </div>
        </Dialog>
    );
};

export default ModalAddAccount;
