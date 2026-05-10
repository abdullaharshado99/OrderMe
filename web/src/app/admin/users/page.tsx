'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function UsersPage() {
    const [restaurants, setRestaurants] = useState([]);
    const [plans, setPlans] = useState([]);
    const [formData, setFormData] = useState({
        email: '', password: '', name: '', phone: '', role: 'RESTAURANT_OWNER', restaurantId: '', plan: ''
    });
    const [message, setMessage] = useState('');

    useEffect(() => {
        api.get('/restaurants').then(res => setRestaurants(res.data)).catch(console.error);
        api.get('/subscriptions/plans').then(res => setPlans(res.data)).catch(console.error);
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const payload = { ...formData, restaurantId: parseInt(formData.restaurantId) };
            await api.post('/auth/register', payload);
            setMessage('Restaurant Owner created with subscription!');
            setFormData({ email: '', password: '', name: '', phone: '', role: 'RESTAURANT_OWNER', restaurantId: '', plan: '' });
        } catch (err: any) {
            setMessage(err.response?.data?.message || 'Failed to create user');
        }
    };

    return (
        <div className="p-6 max-w-2xl mx-auto bg-gray-50 text-gray-900" style={{ fontFamily: 'var(--font-quicksand)' }}>
            <h1 className="text-2xl font-bold mb-6 text-[var(--raspberry)]">Register Restaurant Owner</h1>
            <Card className="bg-white border border-gray-200">
                <CardHeader><CardTitle className="text-[var(--brilliant-rose)]">Owner Details & Plan</CardTitle></CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full p-2 border rounded" required />
                        <input type="password" placeholder="Password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} className="w-full p-2 border rounded" required />
                        <input type="text" placeholder="Full Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full p-2 border rounded" required />
                        <input type="tel" placeholder="Phone" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full p-2 border rounded" />
                        <select value={formData.restaurantId} onChange={e => setFormData({ ...formData, restaurantId: e.target.value })} className="w-full p-2 border rounded" required>
                            <option value="">Select Restaurant</option>
                            {restaurants.map((r: any) => <option key={r.id} value={r.id}>{r.name}</option>)}
                        </select>
                        <select value={formData.plan} onChange={e => setFormData({ ...formData, plan: e.target.value })} className="w-full p-2 border rounded" required>
                            <option value="">Select Plan</option>
                            {plans.map((p: any) => <option key={p.id} value={p.name}>{p.name} - ${p.price}/month</option>)}
                        </select>
                        <button type="submit" className="bg-[var(--raspberry)] text-white px-4 py-2 rounded">Register Owner & Activate Plan</button>
                    </form>
                    {message && <p className="mt-4 text-green-600">{message}</p>}
                </CardContent>
            </Card>
        </div>
    );
}