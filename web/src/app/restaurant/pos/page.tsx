'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface MenuItemDto {
    id: number;
    name: string;
    price: number;
    category?: string | null;
}

interface CartLine {
    menuItemId: number;
    name?: string;
    quantity: number;
    price?: number;
}

interface CartDto {
    id: number;
    items: CartLine[];
    discountPercent?: number;
    tax?: number;
    serviceCharge?: number;
}

export default function PosPage() {
    const { user } = useAuth();
    const [cart, setCart] = useState<CartDto | null>(null);
    const [cartId, setCartId] = useState<number | null>(null);
    const [menu, setMenu] = useState<MenuItemDto[]>([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [categories, setCategories] = useState<string[]>(['All']);

    useEffect(() => {
        if (user?.restaurantId) {
            api.get<MenuItemDto[]>(`/menus/restaurant/${user.restaurantId}`).then(res => {
                setMenu(res.data);
                const cats: string[] = ['All', ...new Set(res.data.map((i: MenuItemDto) => i.category).filter((c): c is string => Boolean(c)))];
                setCategories(cats);
            });
            api.post<CartDto>('/pos/cart').then(res => {
                setCartId(res.data.id);
                setCart(res.data);
            });
        }
    }, [user]);

    const addToCart = async (item: MenuItemDto) => {
        if (cartId == null) return;
        const res = await api.post<CartDto>(`/pos/cart/${cartId}/item`, {
            menuItemId: item.id,
            name: item.name,
            quantity: 1,
            price: item.price,
        });
        setCart(res.data);
    };

    const updateQty = async (menuItemId: number, delta: number) => {
        if (cartId == null || cart == null) return;
        const item = cart.items.find(i => i.menuItemId === menuItemId);
        const newQty = (item?.quantity ?? 0) + delta;
        if (newQty <= 0) {
            await api.patch(`/pos/cart/${cartId}/quantity`, { menuItemId, quantity: 0 });
        } else {
            await api.patch(`/pos/cart/${cartId}/quantity`, { menuItemId, quantity: newQty });
        }
        const { data } = await api.get<CartDto>(`/pos/cart/${cartId}`);
        setCart(data);
    };

    const checkout = async () => {
        if (cartId == null) return;
        await api.post(`/pos/cart/${cartId}/checkout`, { paymentMethod: 'cash' });
        const res = await api.post<CartDto>('/pos/cart');
        setCartId(res.data.id);
        setCart(res.data);
    };

    if (!cart) return <div>Loading...</div>;

    const items = cart.items ?? [];
    const subtotal = items.reduce((s, i) => s + ((i.price ?? 0) * (i.quantity ?? 0)), 0);
    const discount = (subtotal * (cart.discountPercent ?? 0)) / 100;
    const total = subtotal - discount + (cart.tax ?? 0) + (cart.serviceCharge ?? 0);

    return (
        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                <div className="flex gap-2 mb-4 overflow-x-auto">
                    {categories.map(cat => (
                        <Button
                            key={cat}
                            variant={selectedCategory === cat ? 'default' : 'outline'}
                            onClick={() => setSelectedCategory(cat)}
                        >
                            {cat}
                        </Button>
                    ))}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {menu
                        .filter(i => selectedCategory === 'All' || i.category === selectedCategory)
                        .map(item => (
                            <Card
                                key={item.id}
                                className="cursor-pointer hover:shadow-md"
                                onClick={() => addToCart(item)}
                            >
                                <CardHeader>
                                    <CardTitle>{item.name}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-lg font-bold">PKR {item.price}</p>
                                </CardContent>
                            </Card>
                        ))}
                </div>
            </div>
            <div>
                <Card>
                    <CardHeader>
                        <CardTitle>Current Order</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {items.map(item => (
                            <div key={item.menuItemId} className="flex justify-between items-center mb-2">
                                <span>
                                    {item.name} x{item.quantity}
                                </span>
                                <div className="flex gap-1">
                                    <Button size="sm" variant="outline" onClick={() => updateQty(item.menuItemId, -1)}>
                                        -
                                    </Button>
                                    <span className="w-8 text-center">{item.quantity}</span>
                                    <Button size="sm" variant="outline" onClick={() => updateQty(item.menuItemId, 1)}>
                                        +
                                    </Button>
                                </div>
                                <span>PKR {(item.price ?? 0) * item.quantity}</span>
                            </div>
                        ))}
                        <hr className="my-2" />
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>PKR {subtotal}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Discount</span>
                            <span>-PKR {discount}</span>
                        </div>
                        <div className="flex justify-between font-bold">
                            <span>Total</span>
                            <span>PKR {total}</span>
                        </div>
                        <Button className="w-full mt-4" onClick={checkout}>
                            Checkout (Cash)
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
