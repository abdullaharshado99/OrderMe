'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function RestaurantsPage() {
    const { user } = useAuth();
    const [restaurants, setRestaurants] = useState<any[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingRestaurantId, setEditingRestaurantId] = useState<number | null>(null);
    const [formData, setFormData] = useState({ name: '', address: '', phone: '', email: '', subscriptionPlan: 'basic', isActive: true });
    const [submitting, setSubmitting] = useState(false);

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

    const openCreateForm = () => {
        setEditingRestaurantId(null);
        setFormData({ name: '', address: '', phone: '', email: '', subscriptionPlan: 'basic', isActive: true });
        setShowForm(true);
    };

    const openEditForm = (restaurant: any) => {
        setEditingRestaurantId(restaurant.id);
        setFormData({
            name: restaurant.name ?? '',
            address: restaurant.address ?? '',
            phone: restaurant.phone ?? '',
            email: restaurant.email ?? '',
            subscriptionPlan: restaurant.subscriptionPlan ?? 'basic',
            isActive: restaurant.isActive ?? true,
        });
        setShowForm(true);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            if (editingRestaurantId) {
                await api.patch(`/restaurants/${editingRestaurantId}`, formData);
                toast({ title: 'Restaurant updated', description: `${formData.name} changes have been saved`, variant: 'success' });
            } else {
                await api.post('/restaurants', formData);
                toast({ title: 'Restaurant created', description: `${formData.name} was added successfully`, variant: 'success' });
            }
            setShowForm(false);
            setEditingRestaurantId(null);
            setFormData({ name: '', address: '', phone: '', email: '', subscriptionPlan: 'basic', isActive: true });
            await fetchRestaurants();
        } catch (err) {
            console.error(err);
            const msg = (err as any)?.response?.data?.message || 'Failed to save restaurant';
            toast({ title: 'Save failed', description: msg, variant: 'destructive' });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="p-6 min-h-screen bg-gray-50 text-gray-900" style={{ fontFamily: 'var(--font-quicksand)' }}>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-[var(--raspberry)]">Restaurants</h1>

                <button
                    onClick={openCreateForm}
                    className="bg-[var(--raspberry)] hover:bg-[var(--brilliant-rose)] text-white px-4 py-2 rounded transition"
                >
                    + Add Restaurant
                </button>
            </div>

            {showForm && (
                <Card className="bg-white border border-gray-200">
                    <CardHeader>
                        <CardTitle className="text-[var(--brilliant-rose)]">
                            {editingRestaurantId ? 'Edit Restaurant' : 'Create New Restaurant'}
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

                            <input
                                type="email"
                                placeholder="Owner Email"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                className="w-full p-2 rounded bg-white border border-gray-300 text-brilliant-rose focus:border-[var(--raspberry)] outline-none" required
                            />

                            <label className="block text-sm font-medium text-gray-600">Subscription Plan</label>
                            <select
                                value={formData.subscriptionPlan}
                                onChange={e => setFormData({ ...formData, subscriptionPlan: e.target.value })}
                                className="w-full p-2 rounded bg-white border border-gray-300 text-gray-800 focus:border-[var(--raspberry)] outline-none"
                            >
                                <option value="basic">Basic (per month)</option>
                                <option value="pro">Pro (per month)</option>
                                <option value="enterprise">Enterprise (per month)</option>
                            </select>

                            {editingRestaurantId && (
                                <label className="flex items-center gap-3 text-sm text-gray-700">
                                    <input
                                        type="checkbox"
                                        checked={formData.isActive}
                                        onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                                        className="h-4 w-4 rounded border-gray-300 text-[var(--raspberry)] focus:ring-[var(--raspberry)]"
                                    />
                                    Active restaurant
                                </label>
                            )}

                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    className="bg-[var(--raspberry)] hover:bg-[var(--brilliant-rose)] text-white px-4 py-2 rounded transition flex items-center gap-2"
                                    disabled={submitting}
                                >
                                    {submitting ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                                            Saving...
                                        </>
                                    ) : (
                                        'Save'
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowForm(false);
                                        setEditingRestaurantId(null);
                                    }}
                                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
                            <p>{rest.email}</p>
                            <p className="text-sm text-gray-400">
                                Plan: {rest.subscriptionPlan || 'basic'}
                            </p>
                            <p className="text-sm text-gray-400">
                                Active: {rest.isActive ? 'Yes' : 'No'}
                            </p>
                            <div className="mt-4 flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => openEditForm(rest)}
                                    className="text-[var(--raspberry)] hover:text-[var(--brilliant-rose)] text-sm font-semibold"
                                >
                                    Edit
                                </button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}