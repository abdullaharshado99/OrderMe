'use client';
import { useState } from 'react';
import api from '@/lib/axios';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function StaffPage() {
    const { user } = useAuth();
    const [formData, setFormData] = useState({ email: '', password: '', name: '', phone: '' });
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await api.post('/auth/register', {
                ...formData,
                role: 'CHEF',
                restaurantId: user?.restaurantId
            });
            setMessage('Chef created successfully!');
            setFormData({ email: '', password: '', name: '', phone: '' });
        } catch (err: any) {
            setMessage(err.response?.data?.message || 'Failed to create chef');
        }
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Add New Chef</h1>
            <Card>
                <CardHeader><CardTitle>Chef Details</CardTitle></CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full p-2 border rounded" required />
                        <input type="password" placeholder="Password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} className="w-full p-2 border rounded" required />
                        <input type="tel" placeholder="Phone Number" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full p-2 border rounded" />
                        <input type="text" placeholder="Full Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full p-2 border rounded" required />
                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Add Chef</button>
                    </form>
                    {message && <p className="mt-4 text-green-600">{message}</p>}
                </CardContent>
            </Card>
        </div>
    );
}