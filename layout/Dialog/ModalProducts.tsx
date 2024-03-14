import { Dialog } from 'primereact/dialog';
import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
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
import { ImageUploadService } from '../../common/service/ImageUploadService';
import { LayoutContext } from '../context/layoutcontext';
import Swal from 'sweetalert2';
import { errorToJSON } from 'next/dist/server/render';
import LoadingCustom from '../../common/components/Loading';

export interface PostProductRequest {
    productName: string;
    categoryId: string;
    sizes: [
        {
            name: string;
            price: number;
        }
    ];
    img?: string;
    desc?: string;
}

const ModalProducts = ({ visible, setVisible, isEdit, productData, setProductData, render, setRender }: ModalProductsProps) => {
    const toast = useRef<Toast>(null);
    const { loading, setLoading } = useContext(LayoutContext);
    const linkDefaultAvatar = 'https://www.testhouse.net/wp-content/uploads/2021/11/default-avatar.jpg';
    const [avatarLink, setAvatarLink] = useState('');
    const [listSizeReq, setListSizeReq] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState<Partial<Category>>({});
    const [selectedSize, setSelectedSize] = useState<any>();
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
        const fetchData = async () => {
            const listCategory = await ProductService.getListCategory();
            setCategoryList(listCategory.data);
        };
        fetchData();
    }, []);

    const headerBody = () => {
        return <h3 className="text-center truncate">{isEdit ? 'Sửa thông tin sản phẩm' : 'Thêm sản phẩm'}</h3>;
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

    const schema = Yup.object().shape({
        productName: Yup.string().required('Vui lòng nhập tên sản phẩm'),
        categoryId: Yup.string().required('Vui lòng chọn danh mục'),
        quantity: Yup.number().required('Vui lòng nhập số lượng').positive('Số lượng phải là số dương'),
        desc: Yup.string().required('Vui lòng nhập mô tả'),
        sizes: Yup.array()
            .of(
                Yup.object().shape({
                    name: Yup.string().required('Vui lòng nhập tên size'),
                    price: Yup.number().typeError('Giá phải là một số').required('Vui lòng nhập giá size').positive('Giá phải là số dương')
                })
            )
            .min(1, 'Vui lòng nhập ít nhất một size')
    });

    const handleSubmit = async (values: any, resetForm: any) => {
        setLoading(true);
        const dataSubmit = { ...values, avatar: avatarLink, categoryId: selectedCategory?._id, sizes: listSizeReq };
        if (!isEdit) {
            try {
                await schema.validate(dataSubmit, { abortEarly: false });
                if (!isEdit) {
                    const formData = new FormData();
                    formData.append('file', avatarLink);
                    const data = await ImageUploadService.postImage(formData);
                    dataSubmit.img = data.path;
                    const response = await ProductService.postProduct(dataSubmit);
                    if (response.status == 'Success') {
                        setLoading(false);
                        Swal.fire({ icon: 'success', title: 'Thêm sản phẩm thành công' });
                        setRender(!render);
                        setListSizeReq([]);
                        setSelectedCategory({});
                        setVisible(false);
                    }
                }
                // Object hợp lệ
            } catch (errors) {
                setLoading(false);
                console.log('errors: ', errors.errors);
                errors.errors.map((err) => {
                    toast.current?.show({ severity: 'error', detail: err, summary: 'Cảnh báo' });
                });
            }
        } else {
            try {
                let data;
                if (typeof avatarLink === 'string') {
                    data = await ProductService.putProduct({ productId: values._id, desc: values.desc, productName: values.productName });
                } else {
                    const formData = new FormData();
                    formData.append('file', avatarLink);
                    const image = await ImageUploadService.postImage(formData);
                    values.img = image.path;
                    data = await ProductService.putProduct({ productId: values._id, desc: values.desc, productName: values.productName, img: values.img });
                }
                if (data) {
                    setLoading(false);
                    Swal.fire({ icon: 'success', title: 'Sửa sản phẩm thành công' });
                    setRender(!render);
                    setVisible(false);
                    setListSizeReq([]);
                    setSelectedCategory({});
                }
            } catch (error) {
                console.log('error from edit product: ', error);
            }
        }
    };

    const addSizeToListSize = () => {
        const item = {
            name: '',
            price: ''
        };
        if (selectedSize.name.length < 1 || selectedSize.price.length < 1) {
            toast.current?.show({ severity: 'error', detail: 'Bạn vui lòng điền đầy đủ thông tin của size', summary: 'Cảnh báo' });
        } else {
            setListSizeReq([...listSizeReq, selectedSize]);
            setSelectedSize(item);
        }
    };

    const deleteSize = (index) => {
        const updatedList = [...listSizeReq];
        updatedList.splice(index, 1);
        setListSizeReq(updatedList);
    };

    const SignupSchema = Yup.object().shape({
        productName: Yup.string().required('*Vui lòng nhập tên sản phẩm')
    });
    return (
        <Dialog
            header={headerBody}
            visible={visible}
            style={{ width: '60vw' }}
            onHide={() => {
                setVisible(false), setSelectedCategory({});
                setProductData({});
                setListSizeReq([]);
            }}
        >
            <LoadingCustom visible={loading} />
            <Toast ref={toast} />
            <div>
                <Formik
                    initialValues={
                        !isEdit
                            ? {
                                  productName: '',
                                  categoryId: '',
                                  quantity: 1,
                                  desc: ''
                              }
                            : {
                                  ...productData,
                                  avatar: productData.img
                              }
                    }
                    validationSchema={SignupSchema}
                    onSubmit={(values, { resetForm }) => handleSubmit(values, resetForm)}
                >
                    {({ errors, touched }) => {
                        return (
                            <Form>
                                <div className="grid">
                                    <div className="col-6">
                                        <div className="flex flex-column gap-2">
                                            <label htmlFor="productName">Tên sản phẩm:</label>
                                            <Field component={CustomInputComponent} name="productName" className="w-full" />
                                            {errors.productName && touched.productName ? <div className="text-red-600">{errors.productName}</div> : null}
                                        </div>
                                        {!isEdit ? (
                                            <div className="flex flex-column gap-2 mt-3">
                                                <label htmlFor="price">Size:</label>
                                                <ul className="list-none pl-4 mt-0">
                                                    {listSizeReq?.map((item, index) => {
                                                        return (
                                                            <li key={index} className="flex align-items-center">
                                                                <span className="" style={{ minWidth: '10rem' }}>
                                                                    Size: {item?.name} - Giá: {item?.price}
                                                                </span>
                                                                <div className="ml-4 text-red-500 hover:text-red-900 cursor-pointer" onClick={() => deleteSize(index)}>
                                                                    <i className="pi pi-trash"></i>
                                                                </div>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            </div>
                                        ) : (
                                            ''
                                        )}
                                        {!isEdit ? (
                                            <div className="flex gap-3 ">
                                                <div className="">
                                                    <label htmlFor="">Tên</label>
                                                    <InputText name="name" value={selectedSize?.name} onChange={(e) => setSelectedSize({ ...selectedSize, name: e.target.value })} className="w-full" />
                                                </div>
                                                <div className="">
                                                    <label htmlFor="">Giá</label>
                                                    <InputText name="price" value={selectedSize?.price} onChange={(e) => setSelectedSize({ ...selectedSize, price: e.target.value })} className="w-full" />
                                                </div>
                                                <div className="flex align-items-end">
                                                    <Button label="Thêm" type="button" onClick={addSizeToListSize} />
                                                </div>
                                            </div>
                                        ) : (
                                            ''
                                        )}

                                        <div className="flex flex-column gap-2 mt-3">
                                            <label htmlFor="desc">Mô tả sản phẩm:</label>
                                            <Field component={CustomInputTextAreaComponent} name="desc" className={`w-full ${isEdit ? 'h-13rem' : ''}`} />
                                            {errors.desc && touched.desc ? <div className="text-red-600">{errors.desc}</div> : null}
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        {!isEdit ? (
                                            <div className="flex flex-column gap-2">
                                                <label htmlFor="category">Loại sản phẩm:</label>
                                                <Dropdown id="category" value={selectedCategory} onChange={(e) => setSelectedCategory(e.value)} options={categoryList} optionLabel="category" placeholder="Chọn một loại sản phẩm" className="w-full" />
                                            </div>
                                        ) : (
                                            ''
                                        )}
                                        <div className="flex flex-column gap-2 mt-3">
                                            <label htmlFor="productImage">Ảnh sản phẩm:</label>
                                            <div className="flex justify-content-center">
                                                <img
                                                    src={
                                                        avatarLink.objectURL
                                                            ? avatarLink.objectURL
                                                            : 'https://www.tea-tron.com/antorodriguez/blog/wp-content/uploads/2016/04/image-not-found-4a963b95bf081c3ea02923dceaeb3f8085e1a654fc54840aac61a57a60903fef.png'
                                                    }
                                                    alt="Not found"
                                                    height={140}
                                                    className="border-round-lg"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex flex-column gap-2 mt-3 align-items-center">
                                            <FileUpload mode="basic" onSelect={(e: any) => setAvatarLink(e.files[0])} className="truncate" name="avatar" />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-content-center">
                                    {isEdit ? (
                                        <Button type="submit" severity="warning" className="mt-3">
                                            Thay đổi thông tin sản phẩm
                                        </Button>
                                    ) : (
                                        <Button type="submit" severity="secondary" className="mt-3">
                                            Thêm mới sản phẩm
                                        </Button>
                                    )}
                                </div>
                            </Form>
                        );
                    }}
                </Formik>
            </div>
        </Dialog>
    );
};

export default ModalProducts;
