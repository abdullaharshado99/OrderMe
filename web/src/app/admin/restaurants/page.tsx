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
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Restaurants</h1>
                <button onClick={() => setShowForm(true)} className="bg-blue-600 text-white px-4 py-2 rounded">
                    + Add Restaurant
                </button>
            </div>

            {showForm && (
                <Card className="mb-6">
                    <CardHeader><CardTitle>Create New Restaurant</CardTitle></CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input type="text" placeholder="Restaurant Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full p-2 border rounded" required />
                            <input type="text" placeholder="Address" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} className="w-full p-2 border rounded" />
                            <input type="text" placeholder="Phone" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full p-2 border rounded" />
                            <div className="flex gap-2">
                                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Save</button>
                                <button type="button" onClick={() => setShowForm(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {restaurants.map((rest: any) => (
                    <Card key={rest.id}>
                        <CardHeader><CardTitle>{rest.name}</CardTitle></CardHeader>
                        <CardContent>
                            <p>{rest.address}</p>
                            <p>{rest.phone}</p>
                            <p className="text-sm text-gray-500">Plan: {rest.subscriptionPlan || 'basic'}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
