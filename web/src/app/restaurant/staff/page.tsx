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
        <div className="p-6 max-w-2xl mx-auto min-h-screen bg-gray-50 text-gray-900" style={{ fontFamily: 'var(--font-quicksand)' }}>

            {/* Title */}
            <h1 className="text-2xl font-bold mb-6 text-[var(--raspberry)]">
                Add New Chef
            </h1>

            <Card className="bg-white border border-gray-200">
                <CardHeader>
                    <CardTitle className="text-[var(--brilliant-rose)]">
                        Chef Details
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">

                        <input
                            type="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            className="w-full p-2 rounded border border-gray-300 bg-white focus:border-[var(--raspberry)] outline-none"
                            required
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                            className="w-full p-2 rounded border border-gray-300 bg-white focus:border-[var(--raspberry)] outline-none"
                            required
                        />

                        <input
                            type="tel"
                            placeholder="Phone Number"
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full p-2 rounded border border-gray-300 bg-white focus:border-[var(--raspberry)] outline-none"
                        />

                        <input
                            type="text"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            className="w-full p-2 rounded border border-gray-300 bg-white focus:border-[var(--raspberry)] outline-none"
                            required
                        />

                        <button
                            type="submit"
                            className="bg-[var(--raspberry)] hover:bg-[var(--brilliant-rose)] text-white px-4 py-2 rounded transition"
                        >
                            Add Chef
                        </button>

                    </form>

                    {/* Message */}
                    {message && (
                        <p className={`mt-4 ${message.includes('success') ? 'text-green-600' : 'text-red-500'}`}>
                            {message}
                        </p>
                    )}

                </CardContent>
            </Card>
        </div>
    );
}