'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Pencil, Trash2, ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MenuPage() {
    const { user } = useAuth();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        cuisine: '',
        foodCategory: '',
        description: '',
        isAvailable: true,
    });
    const [expandedCuisines, setExpandedCuisines] = useState({});

    const fetchMenu = async () => {
        if (!user?.restaurantId) return;
        try {
            const { data } = await api.get(`/menus/restaurant/${user.restaurantId}`);
            setItems(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.restaurantId) fetchMenu();
    }, [user]);

    // Extract unique cuisines for datalist
    const uniqueCuisines = [...new Set(items.map(i => i.cuisine).filter(Boolean))];

    // Group items by cuisine then foodCategory
    const grouped = items.reduce((acc, item) => {
        const cuisine = item.cuisine?.trim() || 'Uncategorized';
        const foodCat = item.foodCategory?.trim() || 'General';
        if (!acc[cuisine]) acc[cuisine] = {};
        if (!acc[cuisine][foodCat]) acc[cuisine][foodCat] = [];
        acc[cuisine][foodCat].push(item);
        return acc;
    }, {});

    const toggleCuisine = (cuisine) => {
        setExpandedCuisines(prev => ({ ...prev, [cuisine]: !prev[cuisine] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.cuisine.trim()) {
            alert('Cuisine is required');
            return;
        }
        if (!formData.foodCategory.trim()) {
            alert('Food Category is required');
            return;
        }
        if (!formData.name.trim() || !formData.price) {
            alert('Name and price are required');
            return;
        }
        try {
            const payload = {
                name: formData.name,
                price: parseFloat(formData.price),
                cuisine: formData.cuisine.trim(),
                foodCategory: formData.foodCategory.trim(),
                description: formData.description,
                isAvailable: formData.isAvailable,
            };
            if (editingId) {
                await api.patch(`/menus/${editingId}`, payload);
            } else {
                await api.post(`/menus/restaurant/${user.restaurantId}`, payload);
            }
            resetForm();
            fetchMenu();
        } catch (err) {
            alert('Failed to save menu item');
        }
    };

    const resetForm = () => {
        setEditingId(null);
        setFormData({
            name: '',
            price: '',
            cuisine: '',
            foodCategory: '',
            description: '',
            isAvailable: true,
        });
    };

    const handleEdit = (item) => {
        setEditingId(item.id);
        setFormData({
            name: item.name,
            price: item.price,
            cuisine: item.cuisine || '',
            foodCategory: item.foodCategory || '',
            description: item.description || '',
            isAvailable: item.isAvailable,
        });
        // Scroll to form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (confirm('Delete this item?')) {
            await api.delete(`/menus/${id}`);
            fetchMenu();
            if (editingId === id) resetForm();
        }
    };

    if (loading) return <div className="p-6">Loading menu...</div>;

    return (
        <div className="p-6 min-h-screen bg-gray-50 text-gray-900" style={{ fontFamily: 'var(--font-quicksand)' }}>
            <h1 className="text-2xl font-bold text-[var(--raspberry)] mb-6">Menu Items</h1>

            {/* Inline Form */}
            <Card className="mb-8 bg-white border border-gray-200">
                <CardHeader>
                    <CardTitle className="text-[var(--brilliant-rose)]">
                        {editingId ? 'Edit Menu Item' : 'Add New Item'}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label>Cuisine</Label>
                                <Input
                                    list="cuisine-list"
                                    value={formData.cuisine}
                                    onChange={(e) => setFormData({ ...formData, cuisine: e.target.value })}
                                    placeholder="e.g., Pakistani, Italian, Japanese"
                                    required
                                />
                                <datalist id="cuisine-list">
                                    {uniqueCuisines.map((c) => (
                                        <option key={c} value={c} />
                                    ))}
                                    <option value="Pakistani" />
                                    <option value="Italian" />
                                    <option value="Japanese" />
                                    <option value="Chinese" />
                                </datalist>
                            </div>
                            <div>
                                <Label>Food Category</Label>
                                <Input
                                    value={formData.foodCategory}
                                    onChange={(e) => setFormData({ ...formData, foodCategory: e.target.value })}
                                    placeholder="e.g., Karahi, Pizza, Biryani"
                                    required
                                />
                            </div>
                            <div>
                                <Label>Item Name</Label>
                                <Input
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g., Chicken Karahi, Margherita Pizza"
                                    required
                                />
                            </div>
                            <div>
                                <Label>Price (PKR)</Label>
                                <Input
                                    type="number"
                                    step="1"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    placeholder="e.g., 1200"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <Label>Description (optional)</Label>
                            <Input
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Any details about the dish"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="available"
                                checked={formData.isAvailable}
                                onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                                className="h-4 w-4"
                            />
                            <Label htmlFor="available" className="cursor-pointer">Available</Label>
                        </div>
                        <div className="flex gap-3">
                            <Button type="submit" className="bg-[var(--raspberry)] hover:bg-[var(--brilliant-rose)]">
                                {editingId ? 'Update Item' : 'Add Item'}
                            </Button>
                            {editingId && (
                                <Button type="button" variant="outline" onClick={resetForm}>
                                    Cancel Edit
                                </Button>
                            )}
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Menu Display Grouped by Cuisine → Food Category */}
            {Object.entries(grouped).map(([cuisine, categories]) => (
                <Card key={cuisine} className="mb-6 bg-white border border-gray-200 overflow-hidden">
                    <button
                        onClick={() => toggleCuisine(cuisine)}
                        className="w-full flex justify-between items-center p-4 bg-gray-100 hover:bg-gray-200 transition"
                    >
                        <h2 className="text-xl font-bold text-[var(--brilliant-rose)]">{cuisine}</h2>
                        {expandedCuisines[cuisine] ? <ChevronUp /> : <ChevronDown />}
                    </button>
                    {expandedCuisines[cuisine] !== false && (
                        <div className="p-4 space-y-6">
                            {Object.entries(categories).map(([foodCat, itemsList]) => (
                                <div key={`${cuisine}-${foodCat}`}>
                                    <h3 className="text-lg font-semibold text-[var(--raspberry)] mb-3 border-b pb-1">
                                        {foodCat}
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {itemsList.map((item) => (
                                            <Card key={item.id} className={`bg-white border border-gray-200 ${!item.isAvailable ? 'opacity-60' : ''}`}>
                                                <CardHeader>
                                                    <CardTitle className="text-[var(--brilliant-rose)]">{item.name}</CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <p className="text-lg font-bold text-[var(--raspberry)]">PKR {item.price}</p>
                                                    {item.description && <p className="text-sm text-gray-500">{item.description}</p>}
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
                            ))}
                        </div>
                    )}
                </Card>
            ))}

            {items.length === 0 && (
                <div className="text-center py-12 text-gray-500">No menu items yet. Use the form above to add items.</div>
            )}
        </div>
    );
}