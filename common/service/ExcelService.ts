import axios from 'axios';
import Swal from 'sweetalert2';
import { BASE_URL } from './type';
import axiosInterceptor from '../axiosInterceptors';

const request = axios.create({
    baseURL: BASE_URL
});
axiosInterceptor(request);

export class ExcelService {
    static exportAccount = async () => {
        try {
            const response = await request.get(`/export/accounts`);
            return response.data;
        } catch (error: any) {
            Swal.fire({ icon: 'error', title: error.message });
        }
    };
    static exportProduct = async () => {
        try {
            const response = await request.get(`/export/accounts`);
            return response.data;
        } catch (error: any) {
            Swal.fire({ icon: 'error', title: error.message });
        }
    };
    static exportOrder = async () => {
        try {
            const response = await request.get(`/export/orders`);
            return response.data;
        } catch (error: any) {
            Swal.fire({ icon: 'error', title: error.message });
        }
    };
}
