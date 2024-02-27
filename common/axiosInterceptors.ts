// axiosInterceptor.ts

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import Cookies from 'js-cookie';

const axiosInterceptor = (http: AxiosInstance) => {
    http.interceptors.request.use(
        (request) => {
            const token = Cookies.get('token');
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

            if (error.response?.status === 403) {
                const token = Cookies.get('token');
                if (token) {
                    let tokenJson = JSON.parse(token);
                    axios.post('http://localhost:5000/token', { refreshToken: tokenJson.refreshToken }).then((res: any) => {
                        console.log('resfreshToken return: ', res);
                        tokenJson = { ...tokenJson, refreshToken: res.data.refreshToken, accessToken: res.data.accessToken };
                        console.log('tokenJson: ', tokenJson);
                        Cookies.set('token', JSON.stringify(tokenJson));
                        window.location.assign('/');
                    });
                } else {
                    window.location.assign('/auth/login');
                }
            } else {
                window.location.assign('/auth/login');
            }
            return Promise.reject(error);
        }
    );
};

export default axiosInterceptor;
