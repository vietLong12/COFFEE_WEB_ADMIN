import Swal from 'sweetalert2';
import axios, { AxiosResponse } from 'axios';
import { BASE_URL } from './type';
import axiosInterceptor from '../axiosInterceptors';

const request = axios.create({
    baseURL: BASE_URL
});

interface QuerryParamGetData {
    page?: string;
    limit?: string;
    keyword?: string;
    depth?: string;
}

interface ReqPostProduct {
    productName: string;
    categoryId: string;
    sizes: [
        {
            name: string;
            price: string;
        }
    ];
    desc?: string;
    img?: string;
}

interface PutProductReq {
    productId: string;
    productName?: string;
    desc?: string;
    img?: string;
}
axiosInterceptor(request);

export class ProductService {
    static async postCategory(category: string) {
        try {
            const response: AxiosResponse = await request.post(`/products/category`, { category: category });
            return response.data;
        } catch (error) {
            ProductService.handleApiError(error);
        }
    }

    static async getListProduct(q?: QuerryParamGetData) {
        try {
            const { page = '', limit = '', keyword = '', depth = '3' } = q || {};
            const response: AxiosResponse = await request.get(`/products?page=${page}&limit=${limit}&keyword=${keyword}&depth=${depth}`);
            return response.data;
        } catch (error) {
            ProductService.handleApiError(error);
        }
    }
    static async postProduct(req: ReqPostProduct) {
        try {
            const response: AxiosResponse = await request.post(`/products`, req);
            return response.data;
        } catch (error) {
            ProductService.handleApiError(error);
        }
    }

    static async getListCategory() {
        try {
            const response: AxiosResponse = await request.get('/products/category');
            return response.data;
        } catch (error) {
            ProductService.handleApiError(error);
        }
    }

    static async getProductById(_id: string) {
        try {
            const response: AxiosResponse = await request.get(`/products/${_id}`);
            return response.data;
        } catch (error) {
            ProductService.handleApiError(error);
        }
    }

    static async getListCommentById(_id: string) {
        try {
            const response: AxiosResponse = await request.get(`/products/rate/${_id}`);
            return response.data;
        } catch (error) {
            ProductService.handleApiError(error);
        }
    }

    static async postComment(reqBody: any) {
        try {
            const response: AxiosResponse = await request.post('/products/rate', reqBody);
            return response.data;
        } catch (error) {
            ProductService.handleApiError(error);
        }
    }

    static async deleteProduct(productId: string) {
        try {
            const response: AxiosResponse = await request.delete(`/products/${productId}`);
            return response.data;
        } catch (error) {
            ProductService.handleApiError(error);
        }
    }

    static async putProduct(reqBody: PutProductReq) {
        try {
            const response: AxiosResponse = await request.put('/products', reqBody);
            return response.data;
        } catch (error) {
            ProductService.handleApiError(error);
        }
    }

    private static handleApiError(error: any) {
        console.log('error: ', error.response.data.message);
        if (error.response.data.message === 'Category is exits') {
            Swal.fire({
                icon: 'warning',
                title: 'Bad Request',
                text: 'Tên phân loại đã tồn tại vui lòng kiểm tra lại'
            });
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Bad Request',
                text: error.message === 'Request failed with status code 400' ? 'Yêu cầu không hợp lệ' : error.message
            });
        }
    }
}
