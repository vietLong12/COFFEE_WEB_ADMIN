'use client';
import { LayoutProvider } from '../layout/context/layoutcontext';
import { PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import '../styles/layout/layout.scss';
import '../styles/demo/Demos.scss';
import { AuthProvider } from '../layout/context/authContext';
import { useEffect } from 'react';
import { LoginService } from '../common/service/LoginService';
import Cookies from 'js-cookie';
import axios from 'axios';

interface RootLayoutProps {
    children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
    useEffect(() => {
        const timeout = setInterval(() => {
            const token = Cookies.get('tokenAdmin');
            if (token) {
                let tokenJson = JSON.parse(token);
                axios.post('http://localhost:5000/token', { refreshToken: tokenJson.refreshToken }).then((res: any) => {
                    tokenJson = { ...tokenJson, refreshToken: res.data.refreshToken, accessToken: res.data.accessToken };
                    Cookies.set('tokenAdmin', JSON.stringify(tokenJson));
                });
            }
        }, 25000);
        return () => clearTimeout(timeout);
    }, []);
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link id="theme-css" href={`/themes/lara-light-indigo/theme.css`} rel="stylesheet"></link>
            </head>
            <body>
                <PrimeReactProvider>
                    <AuthProvider>
                        <LayoutProvider>{children}</LayoutProvider>
                    </AuthProvider>
                </PrimeReactProvider>
            </body>
        </html>
    );
}
