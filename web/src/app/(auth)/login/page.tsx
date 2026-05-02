'use client';
import { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(email, password);
            const token = localStorage.getItem('accessToken');
            const decoded = JSON.parse(atob(token!.split('.')[1]));
            if (decoded.role === 'SUPER_ADMIN') router.push('/admin/dashboard');
            else if (decoded.role === 'RESTAURANT_OWNER') router.push('/restaurant/dashboard');
            else router.push('/menu');
        } catch (err) {
            alert('Login failed');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-20 p-6 border rounded">
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full p-2 border mb-4" required />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="w-full p-2 border mb-4" required />
            <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Login</button>
        </form>
    );
}