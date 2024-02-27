import axios from 'axios';
import Swal from 'sweetalert2';
import { BASE_URL } from './type';
import axiosInterceptor from '../axiosInterceptors';

const request = axios.create({
    baseURL: BASE_URL
});
axiosInterceptor(request);
export class DashboardService {
    static getDashboardInfor = async (accessToken: string) => {
        try {
            const response = await request.get(`/dashboard/infor`, { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` } });

            return response.data;
        } catch (error: any) {
            Swal.fire({ icon: 'error', title: error.message });
        }
    };
    static getDashboardChart = async (accessToken: string) => {
        try {
            const response = await request.get(`/dashboard/chart`, { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` } });
            return response.data;
        } catch (error: any) {
            Swal.fire({ icon: 'error', title: error.message });
        }
    };
}
