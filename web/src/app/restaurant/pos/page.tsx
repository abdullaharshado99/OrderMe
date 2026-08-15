'use client';
import styles from './pos.module.css';
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
import { Textarea } from '@/components/ui/textarea';
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
            <div className={styles.flex_items_center_justify_center_min_h_screen}>
                <div className={styles.text_center}>Loading POS...</div>
            </div>
        );
    }

    return (
        <div className={styles.flex_flex_col_lg_flex_row_gap_4_p_4_bg_gray_50_min}>
            {/* LEFT PANEL: Menu & Categories */}
            <div className={styles.flex_1_space_y_4}>
                {/* Order Context Bar */}
                <div className={styles.bg_white_rounded_lg_shadow_p_3_flex_flex_wrap_item}>
                    <div className={styles.flex_items_center_gap_2}>
                        <span className={styles.text_sm_font_semibold}>Table:</span>
                        <Select value={selectedTable?.toString()} onValueChange={(v) => setSelectedTable(Number(v))}>
                            <SelectTrigger className={styles.w_24}><SelectValue placeholder="Select" /></SelectTrigger>
                            <SelectContent>
                                {tables.map(t => <SelectItem key={t.id} value={String(t.id)}>Table {t.number}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <Separator orientation="vertical" className={styles.h_8} />
                    <Tabs value={orderType} onValueChange={(v) => setOrderType(v as any)}>
                        <TabsList>
                            <TabsTrigger value="dine-in">Dine-In</TabsTrigger>
                            <TabsTrigger value="takeaway">Takeaway</TabsTrigger>
                            <TabsTrigger value="delivery">Delivery</TabsTrigger>
                        </TabsList>
                    </Tabs>
                    <Separator orientation="vertical" className={styles.h_8} />
                    <div className={styles.flex_items_center_gap_2}>
                        <span className={styles.text_sm_font_semibold}>Waiter:</span>
                        <Select value={selectedWaiter?.toString()} onValueChange={(v) => setSelectedWaiter(Number(v))}>
                            <SelectTrigger className={styles.w_28}><SelectValue placeholder="Select" /></SelectTrigger>
                            <SelectContent>
                                {staff.map(s => <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <Button variant="outline" size="sm">Shift Close</Button>
                </div>

                {/* Search & Categories */}
                <div className={styles.relative}>
                    <Search className={styles.absolute_left_3_top_1_2_translate_y_1_2_h_4_w_4_te} />
                    <Input
                        placeholder="Search menu..."
                        className={styles.pl_9}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <ScrollArea className={styles.whitespace_nowrap_pb_2}>
                    <div className={styles.flex_gap_2}>
                        {categories.map(cat => (
                            <Button
                                key={cat}
                                variant={selectedCategory === cat ? 'default' : 'outline'}
                                onClick={() => setSelectedCategory(cat)}
                                className={styles.rounded_full}
                            >
                                {cat}
                            </Button>
                        ))}
                    </div>
                </ScrollArea>

                {/* Menu Grid */}
                <ScrollArea className={styles.h_calc_100vh_280px}>
                    {Object.entries(groupedByCategory).map(([cat, items]) => (
                        <div key={cat} className={styles.mb_4}>
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => toggleSection(cat)}
                                className={styles.flex_items_center_justify_between_w_full_text_left}
                            >
                                <span>{cat}</span>
                                {expandedSections[cat] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                            </Button>
                            {expandedSections[cat] !== false && (
                                <div className={styles.grid_grid_cols_2_sm_grid_cols_3_lg_grid_cols_4_gap}>
                                    {items.map(item => (
                                        <Card
                                            key={item.id}
                                            className={styles.cursor_pointer_hover_shadow_md_transition}
                                            onClick={() => addToCart(item)}
                                        >
                                            <CardHeader className={styles.p_3}>
                                                <CardTitle className={styles.text_sm_font_semibold}>{item.name}</CardTitle>
                                            </CardHeader>
                                            <CardContent className={styles.p_3_pt_0}>
                                                <p className={styles.text_lg_font_bold}>{formatPrice(item.price)}</p>
                                                {item.description && <p className={styles.text_xs_text_gray_500_truncate}>{item.description}</p>}
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
            <div className={styles.w_full_lg_w_96_space_y_4}>
                <Card>
                    <CardHeader className={styles.pb_2}>
                        <CardTitle className={styles.text_lg}>Current Order</CardTitle>
                        <div className={styles.text_xs_text_gray_500}>
                            Order #{cart.id} · {orderType} · Table {selectedTable || '—'} · Waiter {selectedWaiter || '—'}
                        </div>
                    </CardHeader>
                    <CardContent className={styles.space_y_4}>
                        {/* Cart Items */}
                        <ScrollArea className={styles.max_h_96}>
                            {cart.items.length === 0 ? (
                                <p className={styles.text_center_text_gray_500_py_8}>No items added</p>
                            ) : (
                                cart.items.map((item) => (
                                    <div key={item.menuItemId} className={styles.flex_justify_between_items_start_py_2_border_b}>
                                        <div className={styles.flex_1}>
                                            <div className={styles.font_medium}>{item.name}</div>
                                            {item.modifiers && item.modifiers.length > 0 && (
                                                <div className={styles.text_xs_text_gray_500}>{item.modifiers.join(' · ')}</div>
                                            )}
                                            <div className={styles.text_sm_text_gray_600}>PKR {item.price} × {item.quantity}</div>
                                        </div>
                                        <div className={styles.flex_items_center_gap_2}>
                                            <Button size="icon" variant="outline" className={styles.h_7_w_7} onClick={() => updateQuantity(item.menuItemId, -1)}>
                                                <Minus size={14} />
                                            </Button>
                                            <span className={styles.w_6_text_center}>{item.quantity}</span>
                                            <Button size="icon" variant="outline" className={styles.h_7_w_7} onClick={() => updateQuantity(item.menuItemId, 1)}>
                                                <Plus size={14} />
                                            </Button>
                                            <Button size="icon" variant="ghost" className={styles.h_7_w_7_text_red_500} onClick={() => removeItem(item.menuItemId)}>
                                                <Trash2 size={14} />
                                            </Button>
                                            <Button size="icon" variant="ghost" className={styles.h_7_w_7} onClick={() => openModifierModal(item)}>
                                                <span className={styles.text_xs}>mod</span>
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </ScrollArea>

                        {/* Actions */}
                        <div className={styles.flex_gap_2_flex_wrap}>
                            <Button variant="outline" size="sm" onClick={() => setShowDiscountModal(true)}>🏷 Discount</Button>
                            <Button variant="outline" size="sm" onClick={() => setShowNoteModal(true)}>📝 Note</Button>
                            <Button variant="outline" size="sm">👤 CRM</Button>
                            <Button variant="outline" size="sm" onClick={() => setShowSplitModal(true)}>➕ Split Bill</Button>
                        </div>

                        {/* Bill Summary */}
                        <div className={styles.space_y_1_text_sm}>
                            <div className={styles.flex_justify_between}><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                            <div className={styles.flex_justify_between}><span>Discount ({cart.discountPercent}%)</span><span>-{formatPrice(discount)}</span></div>
                            <div className={styles.flex_justify_between}><span>Tax (GST 17%)</span><span>{formatPrice(cart.tax || 0)}</span></div>
                            <div className={styles.flex_justify_between}><span>Service Charge (5%)</span><span>{formatPrice(cart.serviceCharge || 0)}</span></div>
                            <Separator />
                            <div className={styles.flex_justify_between_font_bold_text_lg}><span>Total</span><span>{formatPrice(total)}</span></div>
                        </div>

                        {/* Payment Methods */}
                        <div className={styles.grid_grid_cols_4_gap_2}>
                            {(['cash', 'card', 'jazzcash', 'easypaisa'] as const).map(method => (
                                <Button
                                    key={method}
                                    variant={paymentMethod === method ? 'default' : 'outline'}
                                    className={styles.flex_flex_col_items_center_py_2_h_auto}
                                    onClick={() => setPaymentMethod(method)}
                                >
                                    {method === 'cash' && <DollarSign size={20} />}
                                    {method === 'card' && <CreditCard size={20} />}
                                    {method === 'jazzcash' && <Smartphone size={20} />}
                                    {method === 'easypaisa' && <Landmark size={20} />}
                                    <span className={styles.text_xs_capitalize}>{method}</span>
                                </Button>
                            ))}
                        </div>

                        <Button className={styles.w_full_bg_green_600_hover_bg_green_700} onClick={() => setShowPaymentModal(true)}>
                            Charge {formatPrice(total)}
                        </Button>
                        <div className={styles.flex_gap_2}>
                            <Button variant="outline" className={styles.flex_1}><Printer size={16} /> Print Bill</Button>
                            <Button variant="outline" className={styles.flex_1}><Send size={16} /> Send Receipt</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Discount Modal */}
            <Dialog open={showDiscountModal} onOpenChange={setShowDiscountModal}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Apply Discount</DialogTitle></DialogHeader>
                    <div className={styles.space_y_3}>
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
                    <Textarea
                        className={styles.w_full_border_rounded_p_2}
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
                    <div className={styles.space_y_2}>
                        <Label className={styles.flex_items_center_gap_2}>
                            <Input
                                type="checkbox"
                                id="mod1"
                                checked={tempModifiers.includes('No olives')}
                                onChange={(e) =>
                                    setTempModifiers((prev) =>
                                        e.target.checked
                                            ? [...prev, 'No olives']
                                            : prev.filter((m) => m !== 'No olives')
                                    )
                                }
                            />
                            No olives
                        </Label>
                        <Label className={styles.flex_items_center_gap_2}>
                            <Input
                                type="checkbox"
                                id="mod2"
                                checked={tempModifiers.includes('Extra cheese')}
                                onChange={(e) =>
                                    setTempModifiers((prev) =>
                                        e.target.checked
                                            ? [...prev, 'Extra cheese']
                                            : prev.filter((m) => m !== 'Extra cheese')
                                    )
                                }
                            />
                            Extra cheese
                        </Label>
                        <Label className={styles.flex_items_center_gap_2}>
                            <Input
                                type="checkbox"
                                id="mod3"
                                checked={tempModifiers.includes('Less spicy')}
                                onChange={(e) =>
                                    setTempModifiers((prev) =>
                                        e.target.checked
                                            ? [...prev, 'Less spicy']
                                            : prev.filter((m) => m !== 'Less spicy')
                                    )
                                }
                            />
                            Less spicy
                        </Label>
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
                    <div className={styles.space_y_3}>
                        <Label>Number of ways</Label>
                        <Input type="number" value={splitCount} onChange={(e) => setSplitCount(Math.max(1, Number(e.target.value)))} />
                        <p className={styles.text_sm}>Each person pays: {formatPrice(total / splitCount)}</p>
                        <Button onClick={() => setShowSplitModal(false)}>Apply Split</Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Payment Confirmation Modal */}
            <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Confirm Payment</DialogTitle></DialogHeader>
                    <p>Method: {paymentMethod.toUpperCase()}</p>
                    <p className={styles.font_bold_text_xl}>Total: {formatPrice(total)}</p>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowPaymentModal(false)}>Cancel</Button>
                        <Button onClick={handleCheckout}>Confirm & Pay</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}