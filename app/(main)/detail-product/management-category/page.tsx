"use client"
import React, { useEffect } from 'react';
import { ProductService } from '../../../../common/service/ProductService';

const page = () => {
    useEffect(() => {
        ProductService.getListCategory().then((listCategory) => {
            console.log(listCategory);
        });
    }, []);
    return <div>Trang quản lí category sản phẩm</div>;
};

export default page;
