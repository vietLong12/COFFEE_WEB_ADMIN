/* eslint-disable @next/next/no-img-element */

import Link from 'next/link';
import { classNames } from 'primereact/utils';
import React, { forwardRef, useContext, useImperativeHandle, useRef } from 'react';
import { AppTopbarRef } from '../types/types';
import { LayoutContext } from './context/layoutcontext';
import AppConfig from './AppConfig';
import { usePathname } from 'next/navigation';

const AppTopbar = forwardRef<AppTopbarRef>((props, ref) => {
    const { layoutConfig, setLayoutConfig, layoutState, onMenuToggle, showProfileSidebar, setLayoutState } = useContext(LayoutContext);
    const menubuttonRef = useRef(null);
    const topbarmenuRef = useRef(null);
    const topbarmenubuttonRef = useRef(null);

    let pathName = usePathname().split('/').splice(1);
    const breadcumb = pathName
        .map((path) => {
            switch (path) {
                case '':
                    return 'Trang chủ';
                case 'management':
                    return 'Quản lí cửa hàng';
                case 'accounts':
                    return 'Tài khoản';
                case 'products':
                    return 'Sản phẩm';
                case 'orders':
                    return 'Đơn hàng';
                case 'management-category':
                    return 'Danh mục sản phẩm';
                case 'detail-product':
                    return 'Quản lí chi tiết sản phẩm';
                default:
                    break;
            }
        })
        .join(' > ');

    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current,
        topbarmenu: topbarmenuRef.current,
        topbarmenubutton: topbarmenubuttonRef.current
    }));

    return (
        <div className="layout-topbar align-content-center flex">
            <Link href="/" className="layout-topbar-logo" style={{ width: '240px' }}>
                <img src="https://bizweb.dktcdn.net/100/451/095/themes/894906/assets/logo.png?1701916321147" width="" alt="logo" />
                <span>MONSTER COFFEE</span>
            </Link>

            <button ref={menubuttonRef} type="button" className="p-link layout-menu-button layout-topbar-button" style={{ marginRight: '20px' }} onClick={onMenuToggle}>
                <i className="pi pi-bars" />
            </button>
            <p className="p-0 m-0 font-bold" style={{ textTransform: 'capitalize' }}>
                {breadcumb}
            </p>

            <button ref={topbarmenubuttonRef} type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={showProfileSidebar}>
                <i className="pi pi-ellipsis-v" />
            </button>

            <div ref={topbarmenuRef} className={classNames('layout-topbar-menu', { 'layout-topbar-menu-mobile-active': layoutState.profileSidebarVisible })}>
                <button type="button" className="p-link layout-topbar-button">
                    <i className="pi pi-user"></i>
                    <span>Profile</span>
                </button>
                <button type="button" className="p-link layout-topbar-button" onClick={() => setLayoutState((prevState: LayoutState) => ({ ...prevState, configSidebarVisible: true }))}>
                    <i className="pi pi-cog"></i>
                    <span>Settings</span>
                </button>
            </div>
            <AppConfig />
        </div>
    );
});

AppTopbar.displayName = 'AppTopbar';

export default AppTopbar;
