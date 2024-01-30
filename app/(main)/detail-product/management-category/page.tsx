'use client';
import React, { useEffect, useState } from 'react';
import { ProductService } from '../../../../common/service/ProductService';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { boolean } from 'yup';

const page = () => {
    const [list, setList] = useState<any>();
    const [render, setRender] = useState<any>(false);
    const [visible, setVisible] = useState(false);
    const [category, setCategory] = useState('');
    console.log('list: ', list);
    useEffect(() => {
        console.log('fetching data...');
        ProductService.getListCategory().then((listCategory) => {
            setList(listCategory.data);
        });
    }, [render]);

    const header = (
        <div className="flex flex-wrap align-items-center justify-content-between gap-2">
            <span className="text-xl text-900 font-bold">Phân loại sản phẩm</span>
            <Button icon="pi pi-plus" rounded raised onClick={() => setVisible(true)} />
        </div>
    );
    const footer = `Có tất cả ${list ? list.length : 0} loại sản phẩm.`;

    const handleSubmit = async () => {
        const data = await ProductService.postCategory(category.trim());
        setVisible(false);
    };
    return (
        <div className="card">
            <DataTable value={list} header={header} footer={footer} tableStyle={{ minWidth: '60rem' }}>
                <Column header="Mã phân loại" field="_id"></Column>
                <Column field="category" header="Phân loại sản phẩm"></Column>
            </DataTable>

            <Dialog header={<h2 className="text-center">Thêm loại sản phẩm</h2>} visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)}>
                <div className="grid w-full">
                    <div className="col-8">
                        <InputText placeholder="Mời bạn nhập loại sản phẩm" className="w-full" onChange={(e) => setCategory(e.target.value)} />
                    </div>
                    <div className="col">
                        <Button className="ml-4" label="Thêm" icon="pi pi-plus" onClick={handleSubmit} />
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default page;
