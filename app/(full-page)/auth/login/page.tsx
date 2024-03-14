/* eslint-disable @next/next/no-img-element */
'use client';
import { redirect, useRouter } from 'next/navigation';
import React, { useContext, useState } from 'react';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { LayoutContext } from '../../../../layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import Cookies from 'js-cookie';
import { LoginService } from '../../../../common/service/LoginService';
import Swal from 'sweetalert2';
import { AuthContext } from '../../../../layout/context/authContext';
const LoginPage = () => {
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [checked, setChecked] = useState(false);
    const { layoutConfig } = useContext(LayoutContext);
    const { setToken } = useContext(AuthContext);
    const router = useRouter();
    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });
    async function handleLogin() {
        const dataLogin = await LoginService.loginAccount({ username, password });
        if (dataLogin) {
            Cookies.set('tokenAdmin', JSON.stringify(dataLogin));
            router.push('/');
        }
    }
    return (
        <div className={containerClassName}>
            <div className="flex flex-column align-items-center justify-content-center">
                <img src="https://bizweb.dktcdn.net/100/451/095/themes/894906/assets/logo.png?1701916321147" alt="Sakai logo" className="mb-5 w-6rem flex-shrink-0" />
                <div
                    style={{
                        borderRadius: '56px',
                        padding: '0.3rem',
                        background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)'
                    }}
                >
                    <div className="w-full surface-card pt-5 pb-7 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                        <div className="text-center mb-5 text-5xl">Monster Coffee</div>

                        <div>
                            <label htmlFor="email1" className="block text-900 text-xl font-medium mb-2">
                                Tên đăng nhập:
                            </label>
                            <InputText id="email1" value={username} onChange={(e) => setUsername(e.target.value)} type="text" placeholder="Nhập tên đăng nhập..." className="w-full mb-5" style={{ padding: '1rem' }} />

                            <label htmlFor="password1" className="block text-900 font-medium text-xl mb-2">
                                Mật khẩu :
                            </label>
                            <Password inputId="password1" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Nhập mật khẩu..." className="w-full mb-5" inputClassName="w-full p-3"></Password>

                            <Button label="Đăng nhập" className="w-full p-3 text-xl" onClick={handleLogin}></Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
