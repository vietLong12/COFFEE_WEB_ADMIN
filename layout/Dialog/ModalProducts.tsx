import { Dialog } from 'primereact/dialog';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Category, ModalProductsProps, Product } from '../../types/types';
import { InputText } from 'primereact/inputtext';
import * as Yup from 'yup';
import { Field, Form, Formik } from 'formik';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { ProductService } from '../../common/service/ProductService';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';

const ModalProducts = ({ visible, setVisible, isEdit, productData, setProductData, render, setRender }: ModalProductsProps) => {
    const toast = useRef<Toast>(null);
    const linkDefaultAvatar = 'https://www.testhouse.net/wp-content/uploads/2021/11/default-avatar.jpg';
    const [avatarLink, setAvatarLink] = useState('');

    const [selectedCategory, setSelectedCategory] = useState<Partial<Category>>({});
    const [selectedSize, setSelectedSize] = useState<Product>();
    const [categoryList, setCategoryList] = useState<Category[]>([]);
    const [listSize, setListSize] = useState<Category[]>([]);

    useLayoutEffect(() => {
        if (!isEdit) {
            setAvatarLink(linkDefaultAvatar);
        } else {
            if (productData.img) {
                setAvatarLink(productData.img);
            }
        }
    }, [visible]);

    useEffect(() => {
        ProductService.getListCategory().then((data) => setCategoryList(data.data));
        if (selectedCategory._id) {
            ProductService.getListSizeByCategoryId(selectedCategory._id).then((data) => {
                setListSize(data.data);
            });
        }
    }, [selectedSize, selectedCategory]);

    const headerBody = () => {
        return <h3 className="text-center">{isEdit ? 'Sửa thông tin sản phẩm' : 'Thêm sản phẩm'}</h3>;
    };
    const CustomInputComponent = ({ field, form: { touched, errors }, ...props }: any) => (
        <div>
            <InputText type="text" {...field} {...props} />
        </div>
    );
    const CustomInputNumberComponent = ({ field, form: { touched, errors }, ...props }: any) => (
        <div>
            <InputText type="text" {...field} {...props} />
        </div>
    );
    const CustomInputTextAreaComponent = ({ field, form: { touched, errors }, ...props }: any) => {
        return (
            <div>
                <InputTextarea type="text" value={props.defaultValue} defaultValue={props.defaultValue} {...field} {...props} />
            </div>
        );
    };

    const handleSubmit = async (values: any, resetForm: any) => {
        const dataSubmit = { ...values, avatar: avatarLink, categoryId: selectedCategory?._id };
        if (!isEdit) {
            const response = await ProductService.createProduct(dataSubmit);
            if (response.data) {
                setVisible(false);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Thêm sản phẩm thành công',
                    life: 3000,
                    sticky: true
                });
                setRender(!render);
            }
        } else {
            try {
                const response = await ProductService.updateProduct(dataSubmit);
                if (response.data) {
                    setVisible(false);
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Sửa thành công',
                        life: 3000,
                        sticky: true
                    });
                    setRender(!render);
                }
            } catch (error: any) {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: error.message,
                    life: 3000,
                    sticky: true
                });
            }
        }
    };

    const SignupSchema = Yup.object().shape({
        productName: Yup.string().required('*Vui lòng nhập tên sản phẩm'),
        price: Yup.number().required('*Vui lòng nhập giá'),
        quantity: Yup.number()
            .required('*Vui lòng nhập số nguyên')
            .typeError('*Hãy nhập một số hợp lệ ☻')
            .transform((value, originalValue) => (/\s/.test(originalValue) ? NaN : value))
    });
    return (
        <Dialog
            header={headerBody}
            visible={visible}
            style={{ width: '40vw' }}
            onHide={() => {
                setVisible(false), setSelectedCategory({});
                setProductData({});
            }}
        >
            <Toast ref={toast} />
            <div>
                <Formik
                    initialValues={
                        !isEdit
                            ? {
                                  productName: '',
                                  desc: '',
                                  price: '',
                                  avatar: '',
                                  quantity: 1
                              }
                            : {
                                  ...productData,
                                  avatar: productData.img
                              }
                    }
                    validationSchema={SignupSchema}
                    onSubmit={(values, { resetForm }) => handleSubmit(values, resetForm)}
                >
                    {({ errors, touched }) => (
                        <Form>
                            <div className="grid">
                                <div className="col-6">
                                    <div className="flex flex-column gap-2">
                                        <label htmlFor="productName">Tên sản phẩm:</label>
                                        <Field component={CustomInputComponent} name="productName" className="w-full" />
                                        {errors.productName && touched.productName ? <div className="text-red-600">{errors.productName}</div> : null}
                                    </div>
                                    <div className="flex flex-column gap-2 mt-3">
                                        <label htmlFor="price">Giá:</label>
                                        <Field component={CustomInputComponent} name="price" className="w-full" />
                                        {errors.price && touched.price ? <div className="text-red-600">{errors.price}</div> : null}
                                    </div>

                                    <div className="flex flex-column gap-2 mt-3">
                                        <label htmlFor="desc">Mô tả sản phẩm:</label>
                                        <Field component={CustomInputTextAreaComponent} name="desc" className="w-full" />
                                        {errors.desc && touched.desc ? <div className="text-red-600">{errors.desc}</div> : null}
                                    </div>
                                    <div className="flex flex-column gap-2 mt-3">
                                        <label htmlFor="quantity">Số lượng</label>
                                        <Field component={CustomInputNumberComponent} type="text" name="quantity" className="w-full" />
                                        {errors.quantity && touched.quantity ? <div className="text-red-600">{errors.quantity}</div> : null}
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="flex flex-column gap-2">
                                        <label htmlFor="category">Loại sản phẩm:</label>
                                        <Dropdown id="category" value={selectedCategory} onChange={(e) => setSelectedCategory(e.value)} options={categoryList} optionLabel="category" placeholder="Chọn một loại sản phẩm" className="w-full" />
                                    </div>
                                    <div className="flex flex-column gap-2 mt-3">
                                        <label htmlFor="productImage">Ảnh sản phẩm:</label>
                                        <div>
                                            <img src={avatarLink ? avatarLink : productData.img} alt="Not found" width={140} className="border-round-lg" />
                                        </div>
                                    </div>
                                    <div className="flex flex-column gap-2 mt-3">
                                        <FileUpload mode="basic" onSelect={(e: any) => setAvatarLink(e.files[0].objectURL)} />
                                    </div>
                                </div>
                            </div>

                            {isEdit ? (
                                <Button type="submit" severity="warning" className="mt-3">
                                    Thay đổi thông tin sản phẩm
                                </Button>
                            ) : (
                                <Button type="submit" severity="secondary" className="mt-3">
                                    Thêm mới sản phẩm
                                </Button>
                            )}
                        </Form>
                    )}
                </Formik>
            </div>
        </Dialog>
    );
};

export default ModalProducts;
