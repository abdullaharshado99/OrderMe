'use client';
import styles from './warehouse.module.css';

import { useCallback, useEffect, useMemo, useState } from 'react';
import api from '@/lib/axios';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Package, DollarSign, AlertCircle, Truck, Users, Search, SlidersHorizontal, ClipboardList, Store, RefreshCw, BarChart3, ChevronRight } from 'lucide-react';
import Link from 'next/link';

type WarehouseDashboard = {
    totalSkus: number;
    skuAddedThisMonth: number;
    stockValuePkr: number;
    activePurchaseOrders: number;
    purchaseOrdersArrivingToday: number;
    belowMinLevelCount: number;
    totalSuppliers: number;
    activeSuppliersCount: number;
};

type WarehouseSku = {
    id: number;
    skuCode?: string;
    name?: string;
    binLocation?: string;
    category?: string;
    batchLot?: string | null;
    batchTracking?: boolean;
    currentStock?: number;
    unit?: string;
    minLevel?: number;
    maxLevel?: number;
    unitPrice?: number;
    preferredSupplier?: { name?: string } | null;
};

type PurchaseOrderItemRow = {
    skuId?: number;
    orderedQuantity?: number;
    unitPrice?: number;
    sku?: { name?: string; skuCode?: string };
};

type PurchaseOrderRow = {
    id: number;
    poNumber?: string;
    supplier?: { name?: string };
    expectedDelivery?: string | Date;
    status?: string;
    items?: PurchaseOrderItemRow[];
};

type SupplierRow = {
    id: number;
    name?: string;
    contactPerson?: string;
    phone?: string;
    leadTimeDays?: number;
    paymentTerms?: string;
    rating?: number;
    isActive?: boolean;
    primaryCategory?: string | null;
};

type StockTransferRow = {
    id: number;
    fromLocation?: string;
    toLocation?: string;
    quantity?: number;
    status?: string;
    createdAt?: string | Date;
    sku?: Pick<WarehouseSku, 'name' | 'unit'>;
    requestedBy?: { name?: string | null };
};

type AuditLogRow = {
    id: number;
    adjustment?: number;
    reason?: string;
    createdAt?: string | Date;
    sku?: Pick<WarehouseSku, 'name' | 'skuCode' | 'unit'>;
    user?: { name?: string | null };
};

type PoLineDraft = {
    skuId: number;
    orderedQuantity: number;
    unitPrice: number;
};

type NewSkuForm = {
    skuCode: string;
    name: string;
    category: string;
    binLocation: string;
    batchLot: string;
    unit: string;
    unitPrice: number;
    currentStock: number;
    minLevel: number;
    maxLevel: number;
};

type PosCartItem = {
    menuItemId: number;
    name: string;
    quantity: number;
    price: number;
};

type PosActiveSession = {
    id: number;
    tableId?: number | null;
    terminalLabel?: string | null;
    items?: PosCartItem[];
    updatedAt?: string;
    createdAt?: string;
};

function formatPkr(amount: number) {
    return `PKR ${Math.round(amount).toLocaleString('en-PK', { maximumFractionDigits: 0 })}`;
}

function poLineTotal(po: PurchaseOrderRow) {
    return (po.items ?? []).reduce(
        (s, i) => s + Number(i.orderedQuantity ?? 0) * Number(i.unitPrice ?? 0),
        0,
    );
}

function supplierInitials(name?: string) {
    if (!name?.trim()) return '?';
    const parts = name.trim().split(/\s+/);
    const a = parts[0]?.[0];
    const b = parts[parts.length - 1]?.[0];
    return `${a ?? ''}${parts.length > 1 ? (b ?? '') : ''}`.toUpperCase().slice(0, 2);
}

function initialsBg(name?: string): string {
    const palette = ['bg-blue-100 text-blue-800', 'bg-emerald-100 text-emerald-800', 'bg-amber-100 text-amber-900', 'bg-pink-100 text-pink-800'];
    let h = 0;
    for (let i = 0; i < (name ?? '').length; i++) h = (h + name!.charCodeAt(i) * i) % palette.length;
    return palette[Math.abs(h) % palette.length];
}

function poStatusStyles(status?: string): string {
    const s = (status ?? '').toLowerCase();
    if (s === 'received') return 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200';
    if (s === 'in-transit') return 'bg-blue-50 text-blue-800 ring-1 ring-blue-200';
    if (s === 'pending' || s === 'draft') return 'bg-orange-50 text-orange-900 ring-1 ring-orange-200';
    if (s === 'cancelled') return 'bg-gray-100 text-gray-600 ring-1 ring-gray-200';
    return 'bg-stone-100 text-stone-700 ring-1 ring-stone-200';
}

function transferDotClass(status?: string): string {
    const s = (status ?? '').toLowerCase();
    if (s === 'completed') return 'bg-emerald-500';
    if (s === 'pending') return 'bg-blue-500';
    if (s === 'approved') return 'bg-amber-500';
    return 'bg-stone-300';
}

function auditDotClass(adjustment: number): string {
    if (adjustment > 0) return 'bg-emerald-500';
    if (adjustment < 0) return 'bg-blue-500';
    return 'bg-stone-300';
}

/** --- Page ------------------------------------------------------------ */

export default function RestaurantWarehousePage() {
    const { user, isLoading: authLoading } = useAuth();
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);

    const [dashboard, setDashboard] = useState<WarehouseDashboard | null>(null);
    const [skus, setSkus] = useState<WarehouseSku[]>([]);
    const [suppliers, setSuppliers] = useState<SupplierRow[]>([]);
    const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrderRow[]>([]);
    const [transfers, setTransfers] = useState<StockTransferRow[]>([]);
    const [auditLogs, setAuditLogs] = useState<AuditLogRow[]>([]);
    const [posSessions, setPosSessions] = useState<PosActiveSession[]>([]);

    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');

    const [showReceiveModal, setShowReceiveModal] = useState(false);
    const [receiveData, setReceiveData] = useState({
        skuId: '',
        adjustment: 0,
        reason: '',
    });

    const [showSkuDialog, setShowSkuDialog] = useState(false);
    const [newSku, setNewSku] = useState<NewSkuForm>({
        skuCode: '',
        name: '',
        category: '',
        binLocation: '',
        batchLot: '',
        unit: 'kg',
        unitPrice: 0,
        currentStock: 0,
        minLevel: 0,
        maxLevel: 0,
    });

    const [showSupplierDialog, setShowSupplierDialog] = useState(false);
    const [newSupplier, setNewSupplier] = useState({
        name: '',
        contactPerson: '',
        phone: '',
        email: '',
        primaryCategory: '',
        leadTimeDays: '',
        paymentTerms: '',
    });

    const [showPoDialog, setShowPoDialog] = useState(false);
    const [newPo, setNewPo] = useState<{
        supplierId: string;
        expectedDelivery: string;
        items: PoLineDraft[];
    }>({ supplierId: '', expectedDelivery: '', items: [] });
    const [poItemForm, setPoItemForm] = useState({ skuId: '', orderedQuantity: '', unitPrice: '' });

    const [showTransferDialog, setShowTransferDialog] = useState(false);
    const [newTransfer, setNewTransfer] = useState({
        skuId: '',
        quantity: '',
        fromLocation: 'Warehouse A',
        toLocation: 'Main Kitchen',
        notes: '',
    });

    const fetchAll = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        setLoadError(null);
        try {
            const [
                dashRes,
                skusRes,
                supRes,
                poRes,
                trRes,
                auditRes,
            ] = await Promise.all([
                api.get<WarehouseDashboard>('/warehouse/dashboard'),
                api.get<WarehouseSku[]>('/warehouse/skus'),
                api.get<SupplierRow[]>('/warehouse/suppliers'),
                api.get<PurchaseOrderRow[]>('/warehouse/purchase-orders'),
                api.get<StockTransferRow[]>('/warehouse/transfers'),
                api.get<AuditLogRow[]>('/warehouse/audit'),
            ]);
            setDashboard(dashRes.data);
            setSkus(skusRes.data);
            setSuppliers(supRes.data);
            setPurchaseOrders(poRes.data);
            setTransfers(trRes.data);
            setAuditLogs(auditRes.data);

            try {
                const posRes = await api.get<PosActiveSession[]>('/pos/active-sessions');
                setPosSessions(posRes.data);
            } catch {
                setPosSessions([]);
            }
        } catch (e: unknown) {
            console.error(e);
            setLoadError('Could not load warehouse data. Check that you are signed in and the API is running.');
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (authLoading) return;
        if (!user?.restaurantId && user?.role !== 'SUPER_ADMIN') {
            setLoading(false);
            return;
        }
        void fetchAll();
    }, [user, authLoading, fetchAll]);

    const categories = useMemo(() => {
        const set = new Set<string>();
        skus.forEach((s) => {
            if (s.category?.trim()) set.add(s.category.trim());
        });
        return Array.from(set).sort();
    }, [skus]);

    const filteredSkus = useMemo(() => {
        const q = search.trim().toLowerCase();
        return skus.filter((sku) => {
            if (categoryFilter !== 'all' && (sku.category ?? '').trim() !== categoryFilter) return false;
            if (!q) return true;
            const blob = `${sku.skuCode ?? ''} ${sku.name ?? ''} ${sku.category ?? ''} ${sku.binLocation ?? ''}`.toLowerCase();
            return blob.includes(q);
        });
    }, [skus, search, categoryFilter]);

    const handleCreateSku = async () => {
        if (!user?.restaurantId) return;
        await api.post('/warehouse/skus', {
            ...newSku,
            restaurantId: user.restaurantId,
            batchLot: newSku.batchLot || undefined,
            category: newSku.category || undefined,
        });
        setShowSkuDialog(false);
        setNewSku({
            skuCode: '',
            name: '',
            category: '',
            binLocation: '',
            batchLot: '',
            unit: 'kg',
            unitPrice: 0,
            currentStock: 0,
            minLevel: 0,
            maxLevel: 0,
        });
        void fetchAll();
    };

    const handleCreateSupplier = async () => {
        if (!user?.restaurantId) return;
        await api.post('/warehouse/suppliers', {
            name: newSupplier.name,
            contactPerson: newSupplier.contactPerson || undefined,
            phone: newSupplier.phone,
            email: newSupplier.email,
            primaryCategory: newSupplier.primaryCategory || undefined,
            leadTimeDays: newSupplier.leadTimeDays ? Number(newSupplier.leadTimeDays) : undefined,
            paymentTerms: newSupplier.paymentTerms || undefined,
            restaurantId: user.restaurantId,
        });
        setShowSupplierDialog(false);
        setNewSupplier({
            name: '',
            contactPerson: '',
            phone: '',
            email: '',
            primaryCategory: '',
            leadTimeDays: '',
            paymentTerms: '',
        });
        void fetchAll();
    };

    const addPoItem = () => {
        setNewPo((prev) => ({
            ...prev,
            items: [
                ...prev.items,
                {
                    skuId: parseInt(poItemForm.skuId, 10),
                    orderedQuantity: parseFloat(poItemForm.orderedQuantity),
                    unitPrice: parseFloat(poItemForm.unitPrice),
                },
            ],
        }));
        setPoItemForm({ skuId: '', orderedQuantity: '', unitPrice: '' });
    };

    const handleCreatePO = async () => {
        if (!user?.restaurantId) return;
        await api.post('/warehouse/purchase-orders', {
            supplierId: Number(newPo.supplierId),
            restaurantId: user.restaurantId,
            orderDate: new Date().toISOString().split('T')[0],
            expectedDelivery: newPo.expectedDelivery,
            items: newPo.items,
        });
        setShowPoDialog(false);
        setNewPo({ supplierId: '', expectedDelivery: '', items: [] });
        void fetchAll();
    };

    const handleReceivePO = async (poId: number) => {
        const po = purchaseOrders.find((p) => p.id === poId);
        if (!po?.items?.length) return;
        const receivedItems = po.items.map((item) => ({
            skuId: item.skuId,
            receivedQuantity: item.orderedQuantity,
        }));
        await api.post('/warehouse/purchase-orders/receive', { purchaseOrderId: poId, receivedItems });
        void fetchAll();
    };

    const handleCreateTransfer = async () => {
        await api.post('/warehouse/transfers', {
            fromLocation: newTransfer.fromLocation,
            toLocation: newTransfer.toLocation,
            skuId: parseInt(newTransfer.skuId, 10),
            quantity: parseFloat(newTransfer.quantity),
            notes: newTransfer.notes || undefined,
        });
        setShowTransferDialog(false);
        setNewTransfer({
            skuId: '',
            quantity: '',
            fromLocation: 'Warehouse A',
            toLocation: 'Main Kitchen',
            notes: '',
        });
        void fetchAll();
    };

    const handleApproveTransfer = async (transferId: number) => {
        await api.patch(`/warehouse/transfers/${transferId}`, { status: 'approved' });
        void fetchAll();
    };

    if (authLoading || loading) {
        return (
            <div className={styles.flex_min_h_screen_items_center_justify_center_bg_f}>
                <Loader2 className={styles.h_8_w_8_animate_spin_text_stone_500} />
            </div>
        );
    }

    if (!user?.restaurantId && user?.role !== 'SUPER_ADMIN') {
        return (
            <div className={styles.p_8_max_w_lg_mx_auto_text_center_text_stone_700}>
                <p className={styles.mb_4}>Your account is not linked to a restaurant, so warehouse data cannot be loaded.</p>
                <Button asChild variant="outline">
                    <Link href="/restaurant">Back</Link>
                </Button>
            </div>
        );
    }

    const d = dashboard ?? {
        totalSkus: 0,
        skuAddedThisMonth: 0,
        stockValuePkr: 0,
        activePurchaseOrders: 0,
        purchaseOrdersArrivingToday: 0,
        belowMinLevelCount: 0,
        totalSuppliers: 0,
        activeSuppliersCount: 0,
    };

    const exportToCSV = () => {
        const headers = ['SKU', 'Product Name', 'Category', 'Bin Location', 'Qty on Hand', 'Min', 'Max', 'Batch/Lot', 'Valuation', 'Status'];
        const rows = filteredSkus.map(sku => [
            sku.skuCode || '',
            sku.name || '',
            sku.category || '',
            sku.binLocation || '',
            `${sku.currentStock ?? 0} ${sku.unit || ''}`,
            sku.minLevel ?? 0,
            sku.maxLevel ?? 0,
            sku.batchLot || '',
            formatPkr((sku.currentStock ?? 0) * (sku.unitPrice ?? 0)),
            (sku.currentStock ?? 0) <= (sku.minLevel ?? 0) ? 'Below Min' : 'Good',
        ]);
        const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `warehouse_skus_${new Date().toISOString().slice(0, 19)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleReceiveStock = async () => {
        if (!receiveData.skuId || receiveData.adjustment === 0) return;
        await api.patch(`/warehouse/skus/${receiveData.skuId}/stock`, {
            adjustment: receiveData.adjustment,
            reason: receiveData.reason,
        });
        setShowReceiveModal(false);
        setReceiveData({ skuId: '', adjustment: 0, reason: '' });
        fetchAll();
    };

    return (
        <div
            className={styles.min_h_screen_bg_f9f7f2_p_4_md_p_6_text_1a1714_spac}
            style={{ fontFamily: "'Space Grotesk', ui-sans-serif, system-ui, sans-serif" }}
        >
            {loadError && (
                <div className={styles.rounded_lg_border_border_red_200_bg_red_50_px_4_py}>
                    {loadError}
                    <Button variant="ghost" size="sm" className={styles.ml_2} onClick={() => void fetchAll()}>
                        Retry
                    </Button>
                </div>
            )}

            {/* Action buttons */}
            <div className={styles.flex_flex_wrap_items_center_justify_between_gap_3}>
                <div className={styles.flex_flex_wrap_gap_2}>
                    <Button variant="outline" onClick={exportToCSV}>📎 Export CSV</Button>
                    <Button variant="outline" onClick={() => setShowReceiveModal(true)}>📦 Receive Stock</Button>
                    <Button onClick={() => setShowPoDialog(true)}>+ New PO</Button>
                </div>
                <div className={styles.text_sm_text_stone_500}>
                    Last sync: just now
                </div>
            </div>

            {/* KPI row */}
            <div className={styles.grid_grid_cols_1_sm_grid_cols_2_xl_grid_cols_5_gap}>
                <Card className={styles.border_border_stone_200_bg_white_shadow_sm}>
                    <CardHeader className={styles.flex_flex_row_items_center_justify_between_space_y}>
                        <CardTitle className={styles.text_sm_font_medium_text_stone_600}>Total SKUs</CardTitle>
                        <Package className={styles.h_4_w_4_text_stone_400} />
                    </CardHeader>
                    <CardContent>
                        <div className={styles.text_2xl_font_semibold}>{d.totalSkus}</div>
                        <p className={styles.text_xs_text_emerald_600_mt_1}>+{d.skuAddedThisMonth} added this month</p>
                    </CardContent>
                </Card>
                <Card className={styles.border_border_stone_200_bg_white_shadow_sm}>
                    <CardHeader className={styles.flex_flex_row_items_center_justify_between_space_y}>
                        <CardTitle className={styles.text_sm_font_medium_text_stone_600}>Stock Value</CardTitle>
                        <DollarSign className={styles.h_4_w_4_text_stone_400} />
                    </CardHeader>
                    <CardContent>
                        <div className={styles.text_2xl_font_semibold}>{formatPkr(d.stockValuePkr)}</div>
                        <p className={styles.text_xs_text_stone_500_mt_1}>Warehouse inventory valuation</p>
                    </CardContent>
                </Card>
                <Card className={styles.border_border_stone_200_bg_white_shadow_sm}>
                    <CardHeader className={styles.flex_flex_row_items_center_justify_between_space_y}>
                        <CardTitle className={styles.text_sm_font_medium_text_stone_600}>Active POs</CardTitle>
                        <Truck className={styles.h_4_w_4_text_stone_400} />
                    </CardHeader>
                    <CardContent>
                        <div className={styles.text_2xl_font_semibold}>{d.activePurchaseOrders}</div>
                        <p className={styles.text_xs_text_blue_600_mt_1}>
                            {d.purchaseOrdersArrivingToday} arriving today (ETA matches today&apos;s date)
                        </p>
                    </CardContent>
                </Card>
                <Card className={styles.border_border_stone_200_bg_white_shadow_sm}>
                    <CardHeader className={styles.flex_flex_row_items_center_justify_between_space_y}>
                        <CardTitle className={styles.text_sm_font_medium_text_stone_600}>Below Min Level</CardTitle>
                        <AlertCircle className={styles.h_4_w_4_text_red_500} />
                    </CardHeader>
                    <CardContent>
                        <div className={styles.text_2xl_font_semibold_text_red_600}>{d.belowMinLevelCount}</div>
                        <p className={styles.text_xs_text_stone_500_mt_1}>Needs reorder</p>
                    </CardContent>
                </Card>
                <Card className={styles.border_border_stone_200_bg_white_shadow_sm}>
                    <CardHeader className={styles.flex_flex_row_items_center_justify_between_space_y}>
                        <CardTitle className={styles.text_sm_font_medium_text_stone_600}>Suppliers</CardTitle>
                        <Users className={styles.h_4_w_4_text_stone_400} />
                    </CardHeader>
                    <CardContent>
                        <div className={styles.text_2xl_font_semibold}>{d.totalSuppliers}</div>
                        <p className={styles.text_xs_text_stone_500_mt_1}>{d.activeSuppliersCount} active</p>
                    </CardContent>
                </Card>
            </div>

            {/* SKU catalog table */}
            <Card className={styles.border_border_stone_200_bg_white_shadow_sm_overflo}>
                <CardHeader className={styles.flex_flex_col_gap_4_sm_flex_row_sm_items_center_sm}>
                    <CardTitle className={styles.text_lg}>SKU Catalog — All Items</CardTitle>
                    <div className={styles.flex_flex_col_gap_2_sm_flex_row_sm_items_center}>
                        <div className={styles.relative}>
                            <Search className={styles.absolute_left_3_top_1_2_translate_y_1_2_h_4_w_4_te} />
                            <Input
                                placeholder="Search SKU, name…"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className={styles.pl_9_w_full_sm_w_64_bg_stone_50_border_stone_200}
                            />
                        </div>
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger className={styles.w_full_sm_w_160px_border_stone_200_bg_white}>
                                <SlidersHorizontal className={styles.h_4_w_4_mr_2_text_stone_500} />
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All categories</SelectItem>
                                {categories.map((c) => (
                                    <SelectItem key={c} value={c}>
                                        {c}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button onClick={() => setShowSkuDialog(true)}>+ Add SKU</Button>
                    </div>
                </CardHeader>
                <CardContent className={styles.overflow_x_auto_p_0}>
                    <Table>
                        <TableHeader className={styles.bg_stone_50}>
                            <TableRow>
                                <TableHead className={styles.font_semibold}>SKU</TableHead>
                                <TableHead className={styles.font_semibold}>Product Name</TableHead>
                                <TableHead className={styles.font_semibold}>Category</TableHead>
                                <TableHead className={styles.font_semibold}>Bin</TableHead>
                                <TableHead className={styles.font_semibold}>Qty on Hand</TableHead>
                                <TableHead className={styles.font_semibold_text_right}>Min</TableHead>
                                <TableHead className={styles.font_semibold_text_right}>Max</TableHead>
                                <TableHead className={styles.font_semibold}>Batch / Lot</TableHead>
                                <TableHead className={styles.font_semibold_text_right}>Valuation</TableHead>
                                <TableHead className={styles.font_semibold}>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredSkus.map((sku) => {
                                const qty = Number(sku.currentStock ?? 0);
                                const min = Number(sku.minLevel ?? 0);
                                const valuation = qty * Number(sku.unitPrice ?? 0);
                                const belowMin = qty <= min;
                                return (
                                    <TableRow key={sku.id} className={styles.border_stone_100}>
                                        <TableCell className={styles.font_mono_text_sm}>{sku.skuCode}</TableCell>
                                        <TableCell>
                                            <div className={styles.font_medium}>{sku.name}</div>
                                            <div className={styles.text_xs_text_stone_500}>
                                                Supplier: {sku.preferredSupplier?.name?.trim() || '—'}
                                            </div>
                                        </TableCell>
                                        <TableCell className={styles.text_stone_700}>{sku.category?.trim() || '—'}</TableCell>
                                        <TableCell className={styles.font_mono_text_sm}>{sku.binLocation || '—'}</TableCell>
                                        <TableCell>
                                            {qty} {sku.unit || ''}
                                        </TableCell>
                                        <TableCell className={styles.text_right_tabular_nums}>{sku.minLevel}</TableCell>
                                        <TableCell className={styles.text_right_tabular_nums}>{sku.maxLevel}</TableCell>
                                        <TableCell className={styles.font_mono_text_sm}>
                                            {sku.batchLot?.trim() || (sku.batchTracking ? '(tracked)' : '—')}
                                        </TableCell>
                                        <TableCell className={styles.text_right_font_medium}>{formatPkr(valuation)}</TableCell>
                                        <TableCell>
                                            <span
                                                className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${belowMin ? 'bg-red-50 text-red-800 ring-1 ring-red-200' : 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200'
                                                    }`}
                                            >
                                                {belowMin ? 'Below Min' : 'Good'}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                    {filteredSkus.length === 0 && (
                        <div className={styles.py_12_text_center_text_sm_text_stone_500}>No SKUs match the current filters.</div>
                    )}
                </CardContent>
            </Card>

            {/* 2 × 2 activity grid */}
            <div id="warehouse-purchase-orders" className={styles.grid_gap_6_lg_grid_cols_2}>
                <Card className={styles.border_border_stone_200_bg_white_shadow_sm}>
                    <CardHeader className={styles.flex_flex_row_items_center_justify_between_pb_2}>
                        <div className={styles.flex_items_center_gap_2}>
                            <ClipboardList className={styles.h_5_w_5_text_blue_600} />
                            <CardTitle className={styles.text_base}>Purchase Orders</CardTitle>
                        </div>
                        <Button
                            type="button"
                            variant="link"
                            className={styles.text_sm_text_blue_600_hover_underline_inline_flex_}
                            onClick={() => document.getElementById('warehouse-purchase-orders')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                            View all <ChevronRight className={styles.h_4_w_4} />
                        </Button>
                    </CardHeader>
                    <CardContent className={styles.divide_y_divide_stone_100_max_h_22rem_overflow_y_a}>
                        {(purchaseOrders.length ? purchaseOrders.slice(0, 8) : []).map((po) => {
                            const itemCount = po.items?.length ?? 0;
                            const eta = po.expectedDelivery != null ? new Date(po.expectedDelivery) : null;
                            const etaTxt = eta ? `ETA ${eta.toLocaleDateString('en-PK', { weekday: 'short', day: 'numeric', month: 'short' })}` : 'No ETA';
                            return (
                                <div key={po.id} className={styles.flex_flex_wrap_items_start_justify_between_gap_2_p}>
                                    <div className={styles.min_w_0}>
                                        <div className={styles.font_mono_text_sm_text_stone_800}>{po.poNumber}</div>
                                        <div className={styles.font_semibold}>{po.supplier?.name ?? '—'}</div>
                                        <div className={styles.text_xs_text_stone_500}>
                                            {itemCount} items · {etaTxt}
                                        </div>
                                    </div>
                                    <div className={styles.text_right_space_y_1}>
                                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs capitalize ${poStatusStyles(po.status)}`}>
                                            {(po.status ?? '').replace('-', ' ')}
                                        </span>
                                        <div className={styles.font_semibold}>{formatPkr(poLineTotal(po))}</div>
                                        {po.status !== 'received' && (
                                            <Button size="sm" variant="outline" onClick={() => void handleReceivePO(po.id)}>
                                                Receive
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                        {!purchaseOrders.length && <div className={styles.py_8_text_center_text_sm_text_stone_500}>No purchase orders.</div>}
                    </CardContent>
                </Card>

                <Card className={styles.border_border_stone_200_bg_white_shadow_sm}>
                    <CardHeader className={styles.flex_flex_row_items_center_justify_between_pb_2}>
                        <div className={styles.flex_items_center_gap_2}>
                            <Store className={styles.h_5_w_5_text_orange_600} />
                            <CardTitle className={styles.text_base}>Supplier Directory</CardTitle>
                        </div>
                        <Button type="button" variant="link" className={styles.text_sm_text_blue_600_hover_underline} onClick={() => setShowSupplierDialog(true)}>
                            + Add supplier
                        </Button>
                    </CardHeader>
                    <CardContent className={styles.divide_y_divide_stone_100_max_h_22rem_overflow_y_a}>
                        {(suppliers.length ? suppliers.slice(0, 8) : []).map((s) => (
                            <div key={s.id} className={styles.flex_items_center_justify_between_gap_3_py_3_first}>
                                <div className={styles.flex_items_center_gap_3_min_w_0}>
                                    <div
                                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-xs font-bold ${initialsBg(
                                            s.name,
                                        )}`}
                                    >
                                        {supplierInitials(s.name)}
                                    </div>
                                    <div className={styles.min_w_0}>
                                        <div className={styles.font_semibold_truncate}>{s.name}</div>
                                        <div className={styles.text_xs_text_stone_500_truncate}>
                                            {s.primaryCategory?.trim() || '—'} · {s.leadTimeDays ?? '—'} days lead · {s.paymentTerms || '—'}
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.flex_flex_col_items_end_gap_1_shrink_0}>
                                    <span className={styles.text_sm_font_medium_text_orange_700}>★ {Number(s.rating ?? 0).toFixed(1)}</span>
                                    <span
                                        className={`text-[11px] rounded-full px-2 py-0.5 ring-1 ${s.isActive ? 'bg-emerald-50 text-emerald-800 ring-emerald-200' : 'bg-amber-50 text-amber-900 ring-amber-200'
                                            }`}
                                    >
                                        {s.isActive ? 'Active' : 'Review'}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {!suppliers.length && <div className={styles.py_8_text_center_text_sm_text_stone_500}>No suppliers.</div>}
                    </CardContent>
                </Card>

                <Card className={styles.border_border_stone_200_bg_white_shadow_sm}>
                    <CardHeader className={styles.flex_flex_row_items_center_justify_between_pb_2}>
                        <div className={styles.flex_items_center_gap_2}>
                            <RefreshCw className={styles.h_5_w_5_text_blue_600} />
                            <CardTitle className={styles.text_base}>Stock Transfers</CardTitle>
                        </div>
                        <Button type="button" variant="link" className={styles.text_sm_text_blue_600_hover_underline} onClick={() => setShowTransferDialog(true)}>
                            + New transfer
                        </Button>
                    </CardHeader>
                    <CardContent className={styles.divide_y_divide_stone_100_max_h_22rem_overflow_y_a}>
                        {(transfers.length ? transfers.slice(0, 8) : []).map((t) => (
                            <div key={t.id} className={styles.flex_gap_3_py_3_first_pt_0}>
                                <div className={`mt-1 h-2.5 w-2.5 rounded-full shrink-0 ${transferDotClass(t.status)}`} aria-hidden />
                                <div className={styles.min_w_0_flex_1}>
                                    <div className={styles.font_semibold}>
                                        {t.sku?.name ?? 'Item'} → {t.toLocation ?? '—'}
                                    </div>
                                    <div className={styles.text_xs_text_stone_500}>
                                        {t.quantity} {t.sku?.unit ?? ''} · {t.fromLocation ?? '—'} → {t.toLocation ?? '—'} ·{' '}
                                        {t.createdAt ? new Date(t.createdAt).toLocaleString() : '—'}
                                        {t.requestedBy?.name ? ` · ${t.requestedBy.name}` : ''}
                                    </div>
                                    {String(t.status).toLowerCase() === 'pending' && (
                                        <Button size="sm" className={styles.mt_2_h_8} variant="outline" onClick={() => void handleApproveTransfer(t.id)}>
                                            Approve
                                        </Button>
                                    )}
                                </div>
                                <span className={styles.text_xs_text_stone_500_capitalize_shrink_0}>{t.status}</span>
                            </div>
                        ))}
                        {!transfers.length && <div className={styles.py_8_text_center_text_sm_text_stone_500}>No transfers.</div>}
                    </CardContent>
                </Card>

                <Card className={styles.border_border_stone_200_bg_white_shadow_sm}>
                    <CardHeader className={styles.flex_flex_row_items_center_justify_between_pb_2}>
                        <div className={styles.flex_items_center_gap_2}>
                            <BarChart3 className={styles.h_5_w_5_text_emerald_600} />
                            <CardTitle className={styles.text_base}>Audit Trail</CardTitle>
                        </div>
                        <Button
                            type="button"
                            variant="link"
                            className={styles.text_sm_text_blue_600_hover_underline_inline_flex_}
                            onClick={() => document.querySelector('[data-section="warehouse-audit"]')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                            Full log <ChevronRight className={styles.h_4_w_4} />
                        </Button>
                    </CardHeader>
                    <CardContent className={styles.divide_y_divide_stone_100_max_h_22rem_overflow_y_a} data-section="warehouse-audit">
                        {(auditLogs.length ? auditLogs.slice(0, 8) : []).map((log) => {
                            const adj = Number(log.adjustment ?? 0);
                            const title =
                                adj < 0
                                    ? `Stock Adjusted — ${log.sku?.skuCode ?? 'SKU'}`
                                    : adj > 0
                                        ? `Stock Received — ${log.sku?.skuCode ?? 'SKU'}`
                                        : `Stock Event — ${log.sku?.skuCode ?? 'SKU'}`;
                            return (
                                <div key={log.id} className={styles.flex_gap_3_py_3_first_pt_0}>
                                    <div className={`mt-1 h-2.5 w-2.5 rounded-full shrink-0 ${auditDotClass(adj)}`} aria-hidden />
                                    <div className={styles.min_w_0}>
                                        <div className={styles.font_semibold}>{title}</div>
                                        <div className={styles.text_xs_text_stone_500}>
                                            {log.sku?.name ?? 'SKU'} · {adj > 0 ? '+' : ''}{adj}{' '}
                                            {log.sku?.unit ? `${log.sku.unit} · ` : ''}
                                            {log.reason ?? ''} · {log.user?.name ?? 'System'} ·{' '}
                                            {log.createdAt ? new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}{' '}
                                            {log.createdAt ? new Date(log.createdAt).toLocaleDateString() : ''}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        {!auditLogs.length && <div className={styles.py_8_text_center_text_sm_text_stone_500}>No audit entries.</div>}
                    </CardContent>
                </Card>
            </div>

            {/* Quick actions bar */}
            <div className={styles.flex_flex_wrap_gap_2_pb_10}>
                <Button variant="outline" onClick={() => setShowPoDialog(true)}>
                    + New Purchase Order
                </Button>
            </div>

            {/* --- Dialogs ------------------------------------------------ */}

            <Dialog open={showSkuDialog} onOpenChange={setShowSkuDialog}>
                <DialogContent className={styles.max_w_md_max_h_90vh_overflow_y_auto}>
                    <DialogHeader>
                        <DialogTitle>New SKU</DialogTitle>
                    </DialogHeader>
                    <div className={styles.grid_gap_3_pt_2}>
                        <Label className={styles.text_xs_text_stone_500}>SKU code</Label>
                        <Input value={newSku.skuCode} onChange={(e) => setNewSku({ ...newSku, skuCode: e.target.value })} />
                        <Label className={styles.text_xs_text_stone_500}>Name</Label>
                        <Input value={newSku.name} onChange={(e) => setNewSku({ ...newSku, name: e.target.value })} />
                        <Label className={styles.text_xs_text_stone_500}>Category</Label>
                        <Input value={newSku.category} onChange={(e) => setNewSku({ ...newSku, category: e.target.value })} />
                        <Label className={styles.text_xs_text_stone_500}>Bin location</Label>
                        <Input value={newSku.binLocation} onChange={(e) => setNewSku({ ...newSku, binLocation: e.target.value })} />
                        <Label className={styles.text_xs_text_stone_500}>Batch / Lot (optional)</Label>
                        <Input value={newSku.batchLot} onChange={(e) => setNewSku({ ...newSku, batchLot: e.target.value })} />
                        <Label className={styles.text_xs_text_stone_500}>Unit</Label>
                        <Input value={newSku.unit} onChange={(e) => setNewSku({ ...newSku, unit: e.target.value })} />
                        <Label className={styles.text_xs_text_stone_500}>Unit price (PKR)</Label>
                        <Input
                            type="number"
                            value={newSku.unitPrice || ''}
                            onChange={(e) => setNewSku({ ...newSku, unitPrice: parseFloat(e.target.value || '0') })}
                        />
                        <Label className={styles.text_xs_text_stone_500}>Current stock</Label>
                        <Input
                            type="number"
                            value={newSku.currentStock || ''}
                            onChange={(e) => setNewSku({ ...newSku, currentStock: parseFloat(e.target.value || '0') })}
                        />
                        <Label className={styles.text_xs_text_stone_500}>Min / Max level</Label>
                        <div className={styles.flex_gap_2}>
                            <Input
                                type="number"
                                value={newSku.minLevel || ''}
                                onChange={(e) => setNewSku({ ...newSku, minLevel: parseFloat(e.target.value || '0') })}
                            />
                            <Input
                                type="number"
                                value={newSku.maxLevel || ''}
                                onChange={(e) => setNewSku({ ...newSku, maxLevel: parseFloat(e.target.value || '0') })}
                            />
                        </div>
                        <Button onClick={() => void handleCreateSku()}>Save SKU</Button>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={showSupplierDialog} onOpenChange={setShowSupplierDialog}>
                <DialogContent className={styles.max_w_md}>
                    <DialogHeader>
                        <DialogTitle>New supplier</DialogTitle>
                    </DialogHeader>
                    <div className={styles.grid_gap_3_pt_2}>
                        <Input placeholder="Name" value={newSupplier.name} onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })} />
                        <Input
                            placeholder="Contact person"
                            value={newSupplier.contactPerson}
                            onChange={(e) => setNewSupplier({ ...newSupplier, contactPerson: e.target.value })}
                        />
                        <Input placeholder="Phone" value={newSupplier.phone} onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })} />
                        <Input placeholder="Email" value={newSupplier.email} onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })} />
                        <Input
                            placeholder="Primary category (e.g. Proteins)"
                            value={newSupplier.primaryCategory}
                            onChange={(e) => setNewSupplier({ ...newSupplier, primaryCategory: e.target.value })}
                        />
                        <Input
                            placeholder="Lead time (days)"
                            value={newSupplier.leadTimeDays}
                            onChange={(e) => setNewSupplier({ ...newSupplier, leadTimeDays: e.target.value })}
                        />
                        <Input
                            placeholder="Payment terms (e.g. Net 30)"
                            value={newSupplier.paymentTerms}
                            onChange={(e) => setNewSupplier({ ...newSupplier, paymentTerms: e.target.value })}
                        />
                        <Button onClick={() => void handleCreateSupplier()}>Save supplier</Button>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={showPoDialog} onOpenChange={setShowPoDialog}>
                <DialogContent className={styles.max_w_lg_max_h_90vh_overflow_y_auto}>
                    <DialogHeader>
                        <DialogTitle>New purchase order</DialogTitle>
                    </DialogHeader>
                    <div className={styles.grid_gap_3_pt_2}>
                        <Label className={styles.text_xs}>Supplier</Label>
                        <Select value={newPo.supplierId} onValueChange={(v) => setNewPo({ ...newPo, supplierId: v })}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pick supplier" />
                            </SelectTrigger>
                            <SelectContent>
                                {suppliers.map((s) => (
                                    <SelectItem key={s.id} value={String(s.id)}>
                                        {s.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Label className={styles.text_xs}>Expected delivery (yyyy-mm-dd)</Label>
                        <Input type="date" value={newPo.expectedDelivery} onChange={(e) => setNewPo({ ...newPo, expectedDelivery: e.target.value })} />
                        <div className={styles.rounded_md_border_border_stone_200_p_3_space_y_2}>
                            <Label className={styles.text_xs_text_stone_500}>Lines</Label>
                            <Select value={poItemForm.skuId || undefined} onValueChange={(v) => setPoItemForm({ ...poItemForm, skuId: v })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="SKU" />
                                </SelectTrigger>
                                <SelectContent>
                                    {skus.map((sku) => (
                                        <SelectItem key={sku.id} value={String(sku.id)}>
                                            {sku.skuCode} — {sku.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Input
                                placeholder="Ordered qty"
                                type="number"
                                value={poItemForm.orderedQuantity}
                                onChange={(e) => setPoItemForm({ ...poItemForm, orderedQuantity: e.target.value })}
                            />
                            <Input
                                placeholder="Unit price"
                                type="number"
                                value={poItemForm.unitPrice}
                                onChange={(e) => setPoItemForm({ ...poItemForm, unitPrice: e.target.value })}
                            />
                            <Button type="button" variant="outline" size="sm" onClick={() => poItemForm.skuId && addPoItem()}>
                                Add line
                            </Button>
                            <ul className={styles.text_xs_text_stone_600_space_y_1}>
                                {newPo.items.map((l, idx) => (
                                    <li key={`${l.skuId}-${idx}`}>
                                        SKU #{l.skuId} × {l.orderedQuantity} @ {formatPkr(l.unitPrice)}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <Button onClick={() => void handleCreatePO()} disabled={!newPo.supplierId || !newPo.expectedDelivery}>
                            Create PO
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={showTransferDialog} onOpenChange={setShowTransferDialog}>
                <DialogContent className={styles.max_w_md}>
                    <DialogHeader>
                        <DialogTitle>Stock transfer</DialogTitle>
                    </DialogHeader>
                    <div className={styles.grid_gap_3_pt_2}>
                        <Select value={newTransfer.skuId || undefined} onValueChange={(v) => setNewTransfer({ ...newTransfer, skuId: v })}>
                            <SelectTrigger>
                                <SelectValue placeholder="SKU" />
                            </SelectTrigger>
                            <SelectContent>
                                {skus.map((sku) => (
                                    <SelectItem key={sku.id} value={String(sku.id)}>
                                        {sku.skuCode} — {sku.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Input
                            placeholder="Quantity"
                            type="number"
                            value={newTransfer.quantity}
                            onChange={(e) => setNewTransfer({ ...newTransfer, quantity: e.target.value })}
                        />
                        <Input
                            placeholder="From"
                            value={newTransfer.fromLocation}
                            onChange={(e) => setNewTransfer({ ...newTransfer, fromLocation: e.target.value })}
                        />
                        <Input
                            placeholder="To"
                            value={newTransfer.toLocation}
                            onChange={(e) => setNewTransfer({ ...newTransfer, toLocation: e.target.value })}
                        />
                        <Input
                            placeholder="Notes"
                            value={newTransfer.notes}
                            onChange={(e) => setNewTransfer({ ...newTransfer, notes: e.target.value })}
                        />
                        <Button onClick={() => void handleCreateTransfer()}>Submit transfer</Button>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={showReceiveModal} onOpenChange={setShowReceiveModal}>
                <DialogContent className={styles.max_w_md}>
                    <DialogHeader>
                        <DialogTitle>Receive Stock (Manual Adjustment)</DialogTitle>
                    </DialogHeader>
                    <div className={styles.grid_gap_3_pt_2}>
                        <Label>SKU</Label>
                        <Select value={receiveData.skuId} onValueChange={(v) => setReceiveData({ ...receiveData, skuId: v })}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select SKU" />
                            </SelectTrigger>
                            <SelectContent>
                                {skus.map((sku) => (
                                    <SelectItem key={sku.id} value={String(sku.id)}>
                                        {sku.skuCode} – {sku.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Label>Adjustment (+ for receive, - for issue)</Label>
                        <Input
                            type="number"
                            value={receiveData.adjustment || ''}
                            onChange={(e) => setReceiveData({ ...receiveData, adjustment: parseFloat(e.target.value) || 0 })}
                            placeholder="e.g., 10 or -5"
                        />

                        <Label>Reason</Label>
                        <Input
                            value={receiveData.reason}
                            onChange={(e) => setReceiveData({ ...receiveData, reason: e.target.value })}
                            placeholder="e.g., purchase order, damaged, stock take"
                        />

                        <Button onClick={handleReceiveStock}>Confirm Adjustment</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
