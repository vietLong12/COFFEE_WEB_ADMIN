export interface CreateAccountRequest {
    username: string;
    phone: string;
    password: string;
    email: string;
    avatar?: string;
}

export interface UpdateAccountRequest {
    id?: string;
    password?: string;
    email?: string;
    avatar?: string;
    phone?: string;
}
