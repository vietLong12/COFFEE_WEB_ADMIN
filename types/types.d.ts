import React, { ReactNode } from 'react';
import {
    Page,
    AppBreadcrumbProps,
    Breadcrumb,
    BreadcrumbItem,
    MenuProps,
    MenuModel,
    AppSubMenuProps,
    LayoutConfig,
    LayoutState,
    AppBreadcrumbState,
    Breadcrumb,
    LayoutContextProps,
    MailContextProps,
    MenuContextProps,
    ChatContextProps,
    TaskContextProps,
    AppConfigProps,
    NodeRef,
    AppTopbarRef,
    MenuModelItem,
    AppMenuItemProps,
    AppMenuItem
} from './layout';
import { Demo, LayoutType, SortOrderType, CustomEvent, ChartDataState, ChartOptionsState, AppMailSidebarItem, AppMailReplyProps, AppMailProps } from './demo';

type ChildContainerProps = {
    children: ReactNode;
};

export type {
    Page,
    AppBreadcrumbProps,
    Breadcrumb,
    BreadcrumbItem,
    MenuProps,
    MenuModel,
    LayoutConfig,
    LayoutState,
    Breadcrumb,
    LayoutContextProps,
    MailContextProps,
    MenuContextProps,
    ChatContextProps,
    TaskContextProps,
    AppConfigProps,
    NodeRef,
    AppTopbarRef,
    AppMenuItemProps,
    ChildContainerProps,
    Demo,
    LayoutType,
    SortOrderType,
    CustomEvent,
    ChartDataState,
    ChartOptionsState,
    AppMailSidebarItem,
    AppMailReplyProps,
    AppMailProps,
    AppMenuItem
};

export interface ModalEditAccountProps {
    visible: boolean;
    setVisible: (visible: boolean) => void;
    accountData: Partial<Account>;
    setAccountData: (accountData) => void;
    render: boolean;
    setRender: (boolean: boolean) => void;
    isEdit: boolean;
}

export interface ModalAddAccountProps {
    visible: boolean;
    render: boolean;
    setVisible: (visible: boolean) => void;
    setRender: (boolean: boolean) => void;
}

export interface ModalProductsProps {
    isEdit: boolean;
    visible: boolean;
    render: boolean;
    setRender: (boolean: boolean) => void;
    setVisible: (visible: boolean) => void;
    productData: Partial<Product>;
    setProductData: (data: Partial<Product>) => void;
}

export interface Account {
    _id: string;
    username: string;
    password: string;
    avatar: string;
    email: string;
    phone: string;
    createdAt: string;
    updatedAt: string;
    cart?: {
        items: [
            {
                productId: string;
                sizeId: string;
                quantity: number;
            }
        ];
    };
}

export interface Product {
    index?: number;
    _id: string;
    productName: string;
    price: number;
    size: string[];
    img: string;
    desc?: string;
    rating: number;
    quantity: number;
    inStock: boolean;
    categoryId: string;
    createdAt: string;
    updatedAt: string;
}

export interface Category {
    _id: string;
    category: string;
    createdAt: string;
    updatedAt: string;
    __v?: 0;
}
interface MyCustomEventsMap {
    // Define your custom event names and payloads here
}

declare module 'socket.io-client' {
    interface Socket<CustomEventsMap extends Record<string, any>, DefaultEventsMap extends Record<string, any>> {
        connect(): this;
        // Add any additional properties or methods that you need here
    }
}
