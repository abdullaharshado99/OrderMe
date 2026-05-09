'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function RestaurantsPage() {
    const { user } = useAuth();
    const [restaurants, setRestaurants] = useState<any[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ name: '', address: '', phone: '' });

    useEffect(() => {
        fetchRestaurants();
    }, []);

    const fetchRestaurants = async () => {
        try {
            const { data } = await api.get('/restaurants');
            setRestaurants(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await api.post('/restaurants', formData);
            setShowForm(false);
            setFormData({ name: '', address: '', phone: '' });
            fetchRestaurants();
        } catch (err) {
            alert('Failed to create restaurant');
        }
    };

    return (
        <div className="p-6 min-h-screen bg-gray-50 text-gray-900" style={{ fontFamily: 'var(--font-quicksand)' }}>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-[var(--raspberry)]">Restaurants</h1>

                <button
                    onClick={() => setShowForm(true)}
                    className="bg-[var(--raspberry)] hover:bg-[var(--brilliant-rose)] text-white px-4 py-2 rounded transition"
                >
                    + Add Restaurant
                </button>
            </div>

            {showForm && (
                <Card className="bg-white border border-gray-200">
                    <CardHeader>
                        <CardTitle className="text-[var(--brilliant-rose)]">
                            Create New Restaurant
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="text-gray-700">
                        <form onSubmit={handleSubmit} className="space-y-4">

                            <input
                                type="text"
                                placeholder="Restaurant Name"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full p-2 rounded bg-white border border-gray-300 text-brilliant-rose focus:border-[var(--raspberry)] outline-none" required
                            />

                            <input
                                type="text"
                                placeholder="Address"
                                value={formData.address}
                                onChange={e => setFormData({ ...formData, address: e.target.value })}
                                className="w-full p-2 rounded bg-white border border-gray-300 text-brilliant-rose focus:border-[var(--raspberry)] outline-none" />

                            <input
                                type="text"
                                placeholder="Phone"
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full p-2 rounded bg-white border border-gray-300 text-brilliant-rose focus:border-[var(--raspberry)] outline-none" />

                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    className="bg-[var(--raspberry)] hover:bg-[var(--brilliant-rose)] text-white px-4 py-2 rounded transition"
                                >
                                    Save
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {restaurants.map((rest: any) => (
                    <Card
                        key={rest.id}
                        className="bg-white border border-gray-200 hover:border-[var(--brilliant-rose)] transition"                    >
                        <CardHeader>
                            <CardTitle className="text-[var(--brilliant-rose)]">
                                {rest.name}
                            </CardTitle>
                        </CardHeader>

                        <CardContent>
                            <p>{rest.address}</p>
                            <p>{rest.phone}</p>
                            <p className="text-sm text-gray-400">
                                Plan: {rest.subscriptionPlan || 'basic'}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}