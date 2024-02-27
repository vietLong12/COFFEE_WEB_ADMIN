import React, { useState, createContext, useEffect } from 'react';
import { ChildContainerProps } from '../../types/types';
import { useRouter } from 'next/navigation';

interface AuthContextProps {}

export const AuthContext = createContext({} as AuthContextProps);

interface Token {
    accessToken: string;
    refreshToken: string;
}
export const AuthProvider = ({ children }: ChildContainerProps) => {
    const [token, setToken] = useState<Token>({ accessToken: '', refreshToken: '' });
    const value = {
        token,
        setToken
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
