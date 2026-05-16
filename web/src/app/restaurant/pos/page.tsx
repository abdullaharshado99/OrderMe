'use client';
import { useEffect, useState, useCallback } from 'react';
import api from '@/lib/axios';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
    Search,
    ChevronDown,
    ChevronUp,
    Plus,
    Minus,
    Trash2,
    Receipt,
    Printer,
    Send,
    CreditCard,
    DollarSign,
    Smartphone,
    Landmark,
} from 'lucide-react';

// ==================== Types ====================
type MenuItem = {
    id: number;
    name: string;
    price: number;
    category?: string | null;
    description?: string | null;
    isAvailable: boolean;
    foodCategory?: string | null;
};

type CartLine = {
    menuItemId: number;
    name: string;
    quantity: number;
    price: number;
    modifiers?: string[];
};

type Cart = {
    id: number;
    tableId?: number;
    orderType?: string;
    items: CartLine[];
    discountPercent: number;
    discountAmount: number;
    tax: number;
    serviceCharge: number;
};

type TableStatus = 'free' | 'occupied' | 'reserved';

type FloorTable = {
    id: number;
    number: number;
    status: TableStatus;
};

type Staff = {
    id: number;
    name: string;
};

// ==================== Helper ====================
const formatPrice = (price: number) => `PKR ${price.toLocaleString()}`;

// ==================== Component ====================
export default function PosPage() {
    const { user } = useAuth();

    // UI State
    const [cart, setCart] = useState<Cart | null>(null);
    const [cartId, setCartId] = useState<number | null>(null);
    const [menu, setMenu] = useState<MenuItem[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [categories, setCategories] = useState<string[]>(['All']);
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

    // Order context
    const [orderType, setOrderType] = useState<'dine-in' | 'takeaway' | 'delivery'>('dine-in');
    const [selectedTable, setSelectedTable] = useState<number | null>(null);
    const [tables, setTables] = useState<FloorTable[]>([]);
    const [staff, setStaff] = useState<Staff[]>([]);
    const [selectedWaiter, setSelectedWaiter] = useState<number | null>(null);

    // Modals
    const [showDiscountModal, setShowDiscountModal] = useState(false);
    const [discountPercent, setDiscountPercent] = useState(0);
    const [showNoteModal, setShowNoteModal] = useState(false);
    const [orderNote, setOrderNote] = useState('');
    const [showModifierModal, setShowModifierModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState<CartLine | null>(null);
    const [tempModifiers, setTempModifiers] = useState<string[]>([]);
    const [showSplitModal, setShowSplitModal] = useState(false);
    const [splitCount, setSplitCount] = useState(2);

    // Payment
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'jazzcash' | 'easypaisa'>('cash');
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    // ========== Data Fetching ==========
    const fetchMenu = useCallback(async () => {
        if (!user?.restaurantId) return;
        try {
            const { data } = await api.get<MenuItem[]>(`/menus/restaurant/${user.restaurantId}`);
            setMenu(data);
            const cats = ['All', ...new Set(data.map(i => i.foodCategory).filter(Boolean) as string[])];
            setCategories(cats);
        } catch (err) {
            console.error(err);
        }
    }, [user]);

    const fetchActiveCart = useCallback(async () => {
        if (!user?.restaurantId) return;
        try {
            // Check if there's an active cart for the current table/order type
            // For simplicity, we'll just create a new cart if none exists.
            // You could store cartId in localStorage for the session.
            const storedCartId = localStorage.getItem(`pos_cart_${user.restaurantId}`);
            if (storedCartId) {
                const { data } = await api.get<Cart>(`/pos/cart/${storedCartId}`);
                setCart(data);
                setCartId(data.id);
                setSelectedTable(data.tableId || null);
                setOrderType((data.orderType as any) || 'dine-in');
                return;
            }
        } catch (err) {
            // Cart not found or expired – create new
        }
        createNewCart();
    }, [user]);

    const createNewCart = async () => {
        if (!user?.restaurantId) return;
        try {
            const payload: any = { tableId: selectedTable, terminalLabel: `POS-${Date.now()}` };
            if (orderType) payload.orderType = orderType;
            const { data } = await api.post<Cart>('/pos/cart', payload);
            setCart(data);
            setCartId(data.id);
            localStorage.setItem(`pos_cart_${user.restaurantId}`, String(data.id));
        } catch (err) {
            console.error(err);
        }
    };

    const fetchWaiters = useCallback(async () => {
        if (!user?.restaurantId) return;
        try {
            const { data } = await api.get<Staff[]>(`/waiters/restaurant/${user.restaurantId}`);
            setStaff(data);
        } catch (err) {
            console.error('Failed to fetch waiters', err);
        }
    }, [user]);

    const fetchTables = useCallback(async () => {
        if (!user?.restaurantId) return;
        try {
            const { data } = await api.get<FloorTable[]>(`/tables/restaurant/${user.restaurantId}`);
            setTables(data);
        } catch (err) {
            console.error('Failed to fetch tables', err);
        }
    }, [user]);

    useEffect(() => {
        if (user?.restaurantId) {
            fetchMenu();
            fetchTables();
            fetchWaiters();
            fetchActiveCart();
        }
    }, [user, fetchMenu, fetchActiveCart, fetchTables, fetchWaiters]);

    // ========== Cart Operations ==========
    const addToCart = async (item: MenuItem) => {
        if (!cartId) return;
        try {
            const { data } = await api.post<Cart>(`/pos/cart/${cartId}/item`, {
                menuItemId: item.id,
                name: item.name,
                quantity: 1,
                price: item.price,
            });
            setCart(data);
        } catch (err) {
            console.error(err);
        }
    };

    const updateQuantity = async (menuItemId: number, delta: number) => {
        if (!cartId || !cart) return;
        const item = cart.items.find(i => i.menuItemId === menuItemId);
        const newQty = (item?.quantity || 0) + delta;
        try {
            const { data } = await api.patch<Cart>(`/pos/cart/${cartId}/quantity`, {
                menuItemId,
                quantity: newQty,
            });
            setCart(data);
        } catch (err) {
            console.error(err);
        }
    };

    const removeItem = async (menuItemId: number) => {
        if (!cartId) return;
        await updateQuantity(menuItemId, -Infinity); // force zero
    };

    const applyDiscount = async () => {
        if (!cartId) return;
        try {
            const { data } = await api.patch<Cart>(`/pos/cart/${cartId}/discount`, {
                percent: discountPercent,
            });
            setCart(data);
            setShowDiscountModal(false);
            setDiscountPercent(0);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCheckout = async () => {
        if (!cartId) return;
        try {
            await api.post(`/pos/cart/${cartId}/checkout`, { paymentMethod });
            // Reset UI
            localStorage.removeItem(`pos_cart_${user?.restaurantId}`);
            setCart(null);
            setCartId(null);
            createNewCart();
            setShowPaymentModal(false);
            alert('Order placed successfully!');
        } catch (err) {
            console.error(err);
        }
    };

    // ========== Helpers ==========
    const subtotal = cart?.items.reduce((sum, i) => sum + i.price * i.quantity, 0) || 0;
    const discount = (subtotal * (cart?.discountPercent || 0)) / 100;
    const total = subtotal - discount + (cart?.tax || 0) + (cart?.serviceCharge || 0);

    const filteredMenu = menu.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || item.foodCategory === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const groupedByCategory = filteredMenu.reduce((acc, item) => {
        const cat = item.foodCategory || 'Other';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(item);
        return acc;
    }, {} as Record<string, MenuItem[]>);

    const toggleSection = (cat: string) => {
        setExpandedSections(prev => ({ ...prev, [cat]: !prev[cat] }));
    };

    // Show modifier modal (just for demo, you can implement actual modifiers)
    const openModifierModal = (item: CartLine) => {
        setSelectedItem(item);
        setTempModifiers(item.modifiers || []);
        setShowModifierModal(true);
    };

    const saveModifiers = async () => {
        if (!cartId || !selectedItem) return;
        // Update cart item with modifiers – you may need a backend endpoint.
        // For simplicity, we just close the modal.
        setShowModifierModal(false);
        setSelectedItem(null);
    };

    // ========== Render ==========
    if (!cart) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">Loading POS...</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row gap-4 p-4 bg-gray-50 min-h-screen">
            {/* LEFT PANEL: Menu & Categories */}
            <div className="flex-1 space-y-4">
                {/* Order Context Bar */}
                <div className="bg-white rounded-lg shadow p-3 flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">Table:</span>
                        <Select value={selectedTable?.toString()} onValueChange={(v) => setSelectedTable(Number(v))}>
                            <SelectTrigger className="w-24"><SelectValue placeholder="Select" /></SelectTrigger>
                            <SelectContent>
                                {tables.map(t => <SelectItem key={t.id} value={String(t.id)}>Table {t.number}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <Separator orientation="vertical" className="h-8" />
                    <Tabs value={orderType} onValueChange={(v) => setOrderType(v as any)}>
                        <TabsList>
                            <TabsTrigger value="dine-in">Dine-In</TabsTrigger>
                            <TabsTrigger value="takeaway">Takeaway</TabsTrigger>
                            <TabsTrigger value="delivery">Delivery</TabsTrigger>
                        </TabsList>
                    </Tabs>
                    <Separator orientation="vertical" className="h-8" />
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">Waiter:</span>
                        <Select value={selectedWaiter?.toString()} onValueChange={(v) => setSelectedWaiter(Number(v))}>
                            <SelectTrigger className="w-28"><SelectValue placeholder="Select" /></SelectTrigger>
                            <SelectContent>
                                {staff.map(s => <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <Button variant="outline" size="sm">Shift Close</Button>
                </div>

                {/* Search & Categories */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search menu..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <ScrollArea className="whitespace-nowrap pb-2">
                    <div className="flex gap-2">
                        {categories.map(cat => (
                            <Button
                                key={cat}
                                variant={selectedCategory === cat ? 'default' : 'outline'}
                                onClick={() => setSelectedCategory(cat)}
                                className="rounded-full"
                            >
                                {cat}
                            </Button>
                        ))}
                    </div>
                </ScrollArea>

                {/* Menu Grid */}
                <ScrollArea className="h-[calc(100vh-280px)]">
                    {Object.entries(groupedByCategory).map(([cat, items]) => (
                        <div key={cat} className="mb-4">
                            <button
                                onClick={() => toggleSection(cat)}
                                className="flex items-center justify-between w-full text-left font-bold text-lg py-2"
                            >
                                <span>{cat}</span>
                                {expandedSections[cat] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                            </button>
                            {expandedSections[cat] !== false && (
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                                    {items.map(item => (
                                        <Card
                                            key={item.id}
                                            className="cursor-pointer hover:shadow-md transition"
                                            onClick={() => addToCart(item)}
                                        >
                                            <CardHeader className="p-3">
                                                <CardTitle className="text-sm font-semibold">{item.name}</CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-3 pt-0">
                                                <p className="text-lg font-bold">{formatPrice(item.price)}</p>
                                                {item.description && <p className="text-xs text-gray-500 truncate">{item.description}</p>}
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </ScrollArea>
            </div>

            {/* RIGHT PANEL: Cart & Checkout */}
            <div className="w-full lg:w-96 space-y-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Current Order</CardTitle>
                        <div className="text-xs text-gray-500">
                            Order #{cart.id} · {orderType} · Table {selectedTable || '—'} · Waiter {selectedWaiter || '—'}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Cart Items */}
                        <ScrollArea className="max-h-96">
                            {cart.items.length === 0 ? (
                                <p className="text-center text-gray-500 py-8">No items added</p>
                            ) : (
                                cart.items.map((item) => (
                                    <div key={item.menuItemId} className="flex justify-between items-start py-2 border-b">
                                        <div className="flex-1">
                                            <div className="font-medium">{item.name}</div>
                                            {item.modifiers && item.modifiers.length > 0 && (
                                                <div className="text-xs text-gray-500">{item.modifiers.join(' · ')}</div>
                                            )}
                                            <div className="text-sm text-gray-600">PKR {item.price} × {item.quantity}</div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => updateQuantity(item.menuItemId, -1)}>
                                                <Minus size={14} />
                                            </Button>
                                            <span className="w-6 text-center">{item.quantity}</span>
                                            <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => updateQuantity(item.menuItemId, 1)}>
                                                <Plus size={14} />
                                            </Button>
                                            <Button size="icon" variant="ghost" className="h-7 w-7 text-red-500" onClick={() => removeItem(item.menuItemId)}>
                                                <Trash2 size={14} />
                                            </Button>
                                            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => openModifierModal(item)}>
                                                <span className="text-xs">mod</span>
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </ScrollArea>

                        {/* Actions */}
                        <div className="flex gap-2 flex-wrap">
                            <Button variant="outline" size="sm" onClick={() => setShowDiscountModal(true)}>🏷 Discount</Button>
                            <Button variant="outline" size="sm" onClick={() => setShowNoteModal(true)}>📝 Note</Button>
                            <Button variant="outline" size="sm">👤 CRM</Button>
                            <Button variant="outline" size="sm" onClick={() => setShowSplitModal(true)}>➕ Split Bill</Button>
                        </div>

                        {/* Bill Summary */}
                        <div className="space-y-1 text-sm">
                            <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                            <div className="flex justify-between"><span>Discount ({cart.discountPercent}%)</span><span>-{formatPrice(discount)}</span></div>
                            <div className="flex justify-between"><span>Tax (GST 17%)</span><span>{formatPrice(cart.tax || 0)}</span></div>
                            <div className="flex justify-between"><span>Service Charge (5%)</span><span>{formatPrice(cart.serviceCharge || 0)}</span></div>
                            <Separator />
                            <div className="flex justify-between font-bold text-lg"><span>Total</span><span>{formatPrice(total)}</span></div>
                        </div>

                        {/* Payment Methods */}
                        <div className="grid grid-cols-4 gap-2">
                            {(['cash', 'card', 'jazzcash', 'easypaisa'] as const).map(method => (
                                <Button
                                    key={method}
                                    variant={paymentMethod === method ? 'default' : 'outline'}
                                    className="flex flex-col items-center py-2 h-auto"
                                    onClick={() => setPaymentMethod(method)}
                                >
                                    {method === 'cash' && <DollarSign size={20} />}
                                    {method === 'card' && <CreditCard size={20} />}
                                    {method === 'jazzcash' && <Smartphone size={20} />}
                                    {method === 'easypaisa' && <Landmark size={20} />}
                                    <span className="text-xs capitalize">{method}</span>
                                </Button>
                            ))}
                        </div>

                        <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => setShowPaymentModal(true)}>
                            Charge {formatPrice(total)}
                        </Button>
                        <div className="flex gap-2">
                            <Button variant="outline" className="flex-1"><Printer size={16} /> Print Bill</Button>
                            <Button variant="outline" className="flex-1"><Send size={16} /> Send Receipt</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Discount Modal */}
            <Dialog open={showDiscountModal} onOpenChange={setShowDiscountModal}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Apply Discount</DialogTitle></DialogHeader>
                    <div className="space-y-3">
                        <Label>Discount Percentage</Label>
                        <Input type="number" value={discountPercent} onChange={(e) => setDiscountPercent(Number(e.target.value))} />
                        <Button onClick={applyDiscount}>Apply</Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Note Modal */}
            <Dialog open={showNoteModal} onOpenChange={setShowNoteModal}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Order Note</DialogTitle></DialogHeader>
                    <textarea
                        className="w-full border rounded p-2"
                        rows={3}
                        value={orderNote}
                        onChange={(e) => setOrderNote(e.target.value)}
                        placeholder="Special instructions..."
                    />
                    <DialogFooter>
                        <Button onClick={() => setShowNoteModal(false)}>Save Note</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Modifier Modal */}
            <Dialog open={showModifierModal} onOpenChange={setShowModifierModal}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Modifiers for {selectedItem?.name}</DialogTitle></DialogHeader>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <input type="checkbox" id="mod1" checked={tempModifiers.includes('No olives')} onChange={e => setTempModifiers(prev => e.target.checked ? [...prev, 'No olives'] : prev.filter(m => m !== 'No olives'))} />
                            <label htmlFor="mod1">No olives</label>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="checkbox" id="mod2" checked={tempModifiers.includes('Extra cheese')} onChange={e => setTempModifiers(prev => e.target.checked ? [...prev, 'Extra cheese'] : prev.filter(m => m !== 'Extra cheese'))} />
                            <label htmlFor="mod2">Extra cheese</label>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="checkbox" id="mod3" checked={tempModifiers.includes('Less spicy')} onChange={e => setTempModifiers(prev => e.target.checked ? [...prev, 'Less spicy'] : prev.filter(m => m !== 'Less spicy'))} />
                            <label htmlFor="mod3">Less spicy</label>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={saveModifiers}>Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Split Bill Modal */}
            <Dialog open={showSplitModal} onOpenChange={setShowSplitModal}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Split Bill</DialogTitle></DialogHeader>
                    <div className="space-y-3">
                        <Label>Number of ways</Label>
                        <Input type="number" value={splitCount} onChange={(e) => setSplitCount(Math.max(1, Number(e.target.value)))} />
                        <p className="text-sm">Each person pays: {formatPrice(total / splitCount)}</p>
                        <Button onClick={() => setShowSplitModal(false)}>Apply Split</Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Payment Confirmation Modal */}
            <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Confirm Payment</DialogTitle></DialogHeader>
                    <p>Method: {paymentMethod.toUpperCase()}</p>
                    <p className="font-bold text-xl">Total: {formatPrice(total)}</p>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowPaymentModal(false)}>Cancel</Button>
                        <Button onClick={handleCheckout}>Confirm & Pay</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}