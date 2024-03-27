import React, { useEffect, useState } from 'react';
import { OrderService } from '../../common/service/OrderService';
import { ProductService } from '../../common/service/ProductService';
import { Dialog } from 'primereact/dialog';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';

interface DetailOrderProps {
    orderId: string;
    visible: boolean;
    setVisible: any;
}

const ModalDetailOrder = ({ orderId, visible, setVisible }: DetailOrderProps) => {
    const [order, setOrder] = useState<any>(null);

    function convertVND(money: number | string) {
        try {
            money = parseFloat(money.toString());
            money = Math.round(money * 1000);
            return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(money);
        } catch (error) {
            return 'Số tiền không hợp lệ';
        }
    }

    const totalBodyTemplate = (data: any) => {
        return <p>{convertVND(data.price * data.quantity)}</p>;
    };

    const quantityBodyTemplate = (data: any) => {
        return <p>{convertVND(data.price)}</p>;
    }

    useEffect(() => {
        const fetchData = async () => {
            const res = await OrderService.getOrderById(orderId);
            let items = [...res.order.items];
            ('items: ', items);
            items = items.map(async (item) => {
                const res = await ProductService.getProductById(item.productId);
                const sizes = [...res.product.sizes];
                const size = sizes.filter((s) => s._id === item.sizeId);
                return { ...size[0], ...res.product, ...item };
            });
            const result = await Promise.all(items);
            res.order.items = result;
            setOrder(res.order);
        };

        if (orderId != '') {
            fetchData();
        }
    }, [orderId]);
    return (
        <Dialog header={<p className="text-3xl text-center">Chi tiết đơn hàng</p>} visible={visible} onHide={() => setVisible(false)} style={{ width: '50vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
            <div className="border border-bottom-1 mb-2 pb-2">
                <h2 className="mb-3">
                    1. Thông tin khách hàng: <span className="text-xl">#{order?.orderNumber}</span>
                </h2>
                <div className="grid">
                    <div className="col">
                        <p className="mb-1 ">
                            <span className="font-bold">Tên khách hàng: </span>
                            {order?.customer.username}
                        </p>
                        <p className="mb-1">
                            <span className="font-bold">Email: </span>
                            {order?.customer.email}
                        </p>
                        <p className="mb-1">
                            <span className="font-bold">Số điện thoại: </span>
                            {order?.customer.phone}
                        </p>
                    </div>
                    <div className="col-7">
                        <p className="mb-1">
                            <span className="font-bold">Địa chỉ: </span>
                            {order?.customer.address}
                        </p>
                        <p className="mb-1">
                            <span className="font-bold">Ghi chú: </span>
                            {order?.note}
                        </p>
                    </div>
                </div>
            </div>

            <div className="border border-bottom-1 mb-4">
                <h2>2. Thông tin sản phẩm</h2>
                <DataTable value={order?.items}>
                    <Column field="productName" header="Tên sản phẩm"></Column>
                    <Column field="price" header="Giá" body={quantityBodyTemplate}></Column>
                    <Column field="quantity" header="Số lượng"></Column>
                    <Column field="name" header="Size" bodyClassName="uppercase"></Column>
                    <Column field="total" header="Tổng" body={totalBodyTemplate}></Column>
                </DataTable>
            </div>
            <div className="flex flex-column align-items-end mr-4">
                <table className="text-xl">
                    <tbody>
                        <tr>
                            <td className="text-right">
                                <span className="font-bold mr-4">Phí vận chuyển:</span>
                            </td>
                            <td>{convertVND(order?.freightCost)}</td>
                        </tr>
                        <tr className="font-bold text-2xl">
                            <td className="text-right">
                                <span className="font-bold mr-4">Tổng giá trị đơn hàng:</span>
                            </td>
                            <td>{convertVND(order?.totalAmount)}</td>
                        </tr>
                        <tr>
                            <td className="text-right">
                                <span className="font-bold mr-4">Phương thức thanh toán:</span>
                            </td>
                            <td>
                                <span className="uppercase">{order?.paymentMethod}</span>
                            </td>
                        </tr>
                        <tr>
                            <td className="text-right">
                                <span className="font-bold mr-4">Trạng thái đơn hàng:</span>
                            </td>
                            <td>
                                <span className="uppercase">{order?.status}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </Dialog>
    );
};

export default ModalDetailOrder;
