import axios from 'axios';
import Swal from 'sweetalert2';
import { BASE_URL } from './type';

const request = axios.create({
    baseURL: 'http://localhost:5000'
});

interface LoginRequest {
    username: string;
    password: string;
}

interface LoginTokenRequest {
    token: string;
}

interface LogoutRequest {
    email: string;
}

export class LoginService {
    static loginAccount = async (logReq: LoginRequest) => {
        try {
            const response = await request.post(`/login`, logReq);
            return response.data;
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Có lỗi xảy ra',
                text: 'Đăng nhập thất bại, vui lòng kiểm tra lại thông tin'
            });
        }
    };

    static logoutAccount = async (username: string) => {
        const response = await request.post(`/logout`, username);
        return response.data;
    };

    static getVerifyToken = async (refreshToken: string) => {
        const response = await request.post(`/token`, { refreshToken: refreshToken });
        return response.data;
    };
}
