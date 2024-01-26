import axios from 'axios';
import Swal from 'sweetalert2';
import { BASE_URL } from './type';

const request = axios.create({
    baseURL: BASE_URL
});

interface QuerryString {
    page?: string;
    limit?: string;
    keyword?: string;
}

export class AccountService {
    static getAccountById = async (logReq: string) => {
        const response = await request.get(`/accounts/${logReq}`);
        return response.data;
    };
    static deleteAccountById = async (accountId: string) => {
        const response = await request.delete(`/accounts/${accountId}`);
        return response.data;
    };

    static getListAccount = async (q?: QuerryString) => {
        if (q) {
            const { page = '', limit = '', keyword = '' } = q || {};
            const response = await request.get(`/accounts?limit=${limit}&keyword=${keyword}&page=${page}`);
            return response.data;
        } else {
            const response = await request.get(`/accounts`);
            return response.data;
        }
    };

    static putAccount = async (logReq: any) => {
        try {
            const response = await request.put('/accounts', logReq);
            return response.data;
        } catch (error: any) {
            console.log('error: ', error);
            if (error.response.data.msg === 'Change password failed') {
                Swal.fire({
                    icon: 'warning',
                    title: 'Có lỗi xảy ra',
                    text: 'Mật khẩu sai'
                });
            }
            if (error.response.data.msg === 'Password is wrong') {
                Swal.fire({
                    icon: 'warning',
                    title: 'Có lỗi xảy ra',
                    text: 'Mật khẩu sai'
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Có lỗi xảy ra',
                    text: error.message
                });
            }
        }
    };

    static createAccount = async (postAccountReq: any) => {
        try {
            const response = await request.post(`/accounts`, postAccountReq);
            return response.data;
        } catch (error: any) {
            if (error.response.data.msg === 'Email is exist') {
                Swal.fire({
                    icon: 'error',
                    title: 'Có lỗi xảy ra',
                    text: 'Email đã tồn tại'
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Có lỗi xảy ra',
                    text: error.response.data.msg
                });
            }
        }
    };
    static addProductToCart = async (reqBody: any) => {
        try {
            const response = await request.post('/orders/cart', reqBody);
            return response.data;
        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'Có lỗi xảy ra',
                text: error.message
            });
        }
    };
}
