// axiosInterceptor.ts

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import Cookies from 'js-cookie';

const axiosInterceptor = (http: AxiosInstance) => {
    http.interceptors.request.use(
        (request) => {
            const token = Cookies.get('tokenAdmin');
            if (token) {
                const tokenJson = JSON.parse(token);
                request.headers.setAccept('application/json');
                request.headers.setAuthorization('Bearer ' + tokenJson.accessToken);
                // Thực hiện bất kỳ thay đổi nào bạn muốn vào config trước khi gửi request
            }
            return request;
        },
        (error: AxiosError) => {
            console.error('Request interceptor error:', error);
            return Promise.reject(error);
        }
    );

    // Thêm interceptor cho response
    http.interceptors.response.use(
        (response: AxiosResponse) => {
            // Thực hiện bất kỳ thay đổi nào bạn muốn vào response trước khi nó được trả về
            console.log('Get API Successfully');
            return response;
        },
        (error: AxiosError) => {
            console.error('Response interceptor error:', error);
            Cookies.remove('tokenAdmin');
            window.location.assign('/auth/login');

            return Promise.reject(error);
        }
    );
};

export default axiosInterceptor;
