import axios from 'axios';
import { BASE_URL, DELETE_PRODUCT, GET_LIST_CATEGORY, GET_LIST_SIZE_BY_CATEGORY, GET_PRODUCT, POST_PRODUCT, PUT_PRODUCT } from './url';
import { Product } from '../../types/types';

const request = axios.create({
    baseURL: BASE_URL
});

export class ProductService {
    static getListProduct = async () => {
        const respone = await request.get(GET_PRODUCT);
        return respone.data;
    };
    static getListCategory = async () => {
        const response = await request.get(GET_LIST_CATEGORY);
        return response.data;
    };
    static getListSizeByCategoryId = async (categoryId: string) => {
        const response = await request.get(GET_LIST_SIZE_BY_CATEGORY + categoryId);
        return response.data;
    };
    static createProduct = async (body: Partial<Product>) => {
        const response = await request.post(POST_PRODUCT, body);
        return response.data;
    };
    static deleteProductById = async (id: string) => {
        const response = await request.delete(DELETE_PRODUCT + id);
        return response.data;
    };
    static updateProduct = async (body: Partial<Product>) => {
        const bodyReq = { ...body, id: body._id };
        const response = await request.put(PUT_PRODUCT, bodyReq);
        return response.data;
    };
}
