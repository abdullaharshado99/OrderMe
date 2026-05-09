'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Pencil, Trash2 } from 'lucide-react';

export default function MenuPage() {
    const { user } = useAuth();
    const [items, setItems] = useState<any[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [formData, setFormData] = useState({ name: '', description: '', price: '', category: '', isAvailable: true });
    const [loading, setLoading] = useState(true);

    const fetchMenu = async () => {
        try {
            const { data } = await api.get(`/menus/restaurant/${user?.restaurantId}`);
            setItems(data);
            setLoading(false);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { if (user?.restaurantId) fetchMenu(); }, [user]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (editingItem) {
                await api.patch(`/menus/${editingItem.id}`, formData);
            } else {
                await api.post(`/menus/restaurant/${user?.restaurantId}`, formData);
            }
            setShowForm(false);
            setEditingItem(null);
            setFormData({ name: '', description: '', price: '', category: '', isAvailable: true });
            fetchMenu();
        } catch (err) { alert('Failed to save menu item'); }
    };

    const handleDelete = async (id: number) => {
        if (confirm('Delete this item?')) {
            await api.delete(`/menus/${id}`);
            fetchMenu();
        }
    };

    const handleEdit = (item: any) => {
        setEditingItem(item);
        setFormData({
            name: item.name,
            description: item.description || '',
            price: item.price,
            category: item.category || '',
            isAvailable: item.isAvailable
        });
        setShowForm(true);
    };

    if (loading) return <div className="p-6">Loading menu...</div>;

    return (
        <div className="p-6 min-h-screen bg-gray-50 text-gray-900" style={{ fontFamily: 'var(--font-quicksand)' }}>

            {/* Header */}
            <div className="flex justify-between items-center mb-6 ">
                <h1 className="text-2xl font-bold text-[var(--raspberry)]">Menu Items</h1>

                <button
                    onClick={() => {
                        setEditingItem(null);
                        setFormData({ name: '', description: '', price: '', category: '', isAvailable: true });
                        setShowForm(true);
                    }}
                    className="bg-[var(--raspberry)] hover:bg-[var(--brilliant-rose)] text-white px-4 py-2 rounded flex items-center gap-2 transition"
                >
                    <Plus size={16} /> Add Item
                </button>
            </div>

            {/* Form */}
            {showForm && (
                <Card className="mb-6 bg-white border border-gray-200">
                    <CardHeader>
                        <CardTitle className="text-[var(--brilliant-rose)]">
                            {editingItem ? 'Edit Item' : 'New Item'}
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">

                            <input
                                type="text"
                                placeholder="Name"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full p-2 rounded border border-gray-300 bg-white focus:border-[var(--raspberry)] outline-none"
                                required
                            />

                            <textarea
                                placeholder="Description"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                className="w-full p-2 rounded border border-gray-300 bg-white focus:border-[var(--raspberry)] outline-none"
                            />

                            <input
                                type="number"
                                placeholder="Price"
                                value={formData.price}
                                onChange={e => setFormData({ ...formData, price: e.target.value })}
                                className="w-full p-2 rounded border border-gray-300 bg-white focus:border-[var(--raspberry)] outline-none"
                                required
                            />

                            <input
                                type="text"
                                placeholder="Category"
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                                className="w-full p-2 rounded border border-gray-300 bg-white focus:border-[var(--raspberry)] outline-none"
                            />

                            <label className="flex items-center gap-2 text-gray-700">
                                <input
                                    type="checkbox"
                                    checked={formData.isAvailable}
                                    onChange={e => setFormData({ ...formData, isAvailable: e.target.checked })}
                                />
                                Available
                            </label>

                            <div className="flex gap-2">
                                <button className="bg-[var(--raspberry)] hover:bg-[var(--brilliant-rose)] text-white px-4 py-2 rounded transition">
                                    Save
                                </button>

                                <button
                                    type="button"
                                    onClick={() => { setShowForm(false); setEditingItem(null); }}
                                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition"
                                >
                                    Cancel
                                </button>
                            </div>

                        </form>
                    </CardContent>
                </Card>
            )}

            {/* Items */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map(item => (
                    <Card
                        key={item.id}
                        className={`bg-white border border-gray-200 transition hover:border-[var(--brilliant-rose)] ${!item.isAvailable ? 'opacity-60' : ''}`}
                    >
                        <CardHeader>
                            <CardTitle className="text-[var(--brilliant-rose)]">
                                {item.name}
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="text-gray-700">
                            <p className="text-sm text-gray-500">{item.category}</p>
                            <p className="text-lg font-bold text-[var(--raspberry)]">${item.price}</p>
                            <p className="text-sm">{item.description}</p>

                            <div className="flex gap-3 mt-4">
                                <button onClick={() => handleEdit(item)} className="text-[var(--raspberry)] hover:text-[var(--brilliant-rose)]">
                                    <Pencil size={16} />
                                </button>

                                <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-600">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}