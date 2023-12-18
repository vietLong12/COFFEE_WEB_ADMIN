import axios from 'axios';
import { CreateAccountRequest, UpdateAccountRequest } from '../../types/request.type';
import { BASE_URL, CREATE_ACCOUNT, DELETE_ACCOUNT, EDIT_ACCOUNT, GET_ACCOUNT } from './url';

const request = axios.create({
    baseURL: BASE_URL
});

export class AccountCommon {
    static getListAccount = async () => {
        const respone = await request.get(GET_ACCOUNT);
        return respone.data;
    };
    static deleteAccount = async (idAccount: string) => {
        const response = await request.delete(DELETE_ACCOUNT + idAccount);
        return response;
    };
    static createAccount = async (body: CreateAccountRequest) => {
        try {
            const response = await request.post(CREATE_ACCOUNT, body);
            return response.data;
        } catch (error) {
            return error;
        }
    };
    static updateAccount = async (body: UpdateAccountRequest) => {
        try {
            const response = await request.put(EDIT_ACCOUNT, body);
            return response.data;
        } catch (error) {
            return error;
        }
    };
}
