import axios from 'axios';
import Swal from 'sweetalert2';
import { BASE_URL } from './type';

const request = axios.create({
    baseURL: BASE_URL
});

export class DashboardService {
    static getDashboardInfor = async () => {
        try {
            const response = await request.get(`/dashboard/infor`);
            return response.data;
        } catch (error: any) {
            Swal.fire({ icon: 'error', title: error.message });
        }
    };
    static getDashboardChart = async () => {
        try {
            const response = await request.get(`/dashboard/chart`);
            return response.data;
        } catch (error: any) {
            Swal.fire({ icon: 'error', title: error.message });
        }
    };
}
