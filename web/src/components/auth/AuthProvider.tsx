'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@/lib/axios';
import { jwtDecode } from 'jwt-decode';
import { AuthUser, RoleName } from '@/lib/auth';

interface AuthContextType {
    user: AuthUser | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            try {
                const decoded: any = jwtDecode(token);
                setUser({
                    id: decoded.sub,
                    email: decoded.email,
                    name: decoded.name || '',
                    role: decoded.role as RoleName,
                    restaurantId: decoded.restaurantId || null,
                });
            } catch (error) {
                console.error('Invalid token');
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        const { data } = await api.post('/auth/login', { email, password });
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        const decoded: any = jwtDecode(data.accessToken);
        setUser({
            id: decoded.sub,
            email: decoded.email,
            name: data.user.name,
            role: decoded.role as RoleName,
            restaurantId: decoded.restaurantId || null,
        });
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setUser(null);
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};