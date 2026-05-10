'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import api from '@/lib/axios';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Loader2,
    Package,
    DollarSign,
    AlertCircle,
    Truck,
    Users,
    Search,
    SlidersHorizontal,
    ClipboardList,
    Store,
    RefreshCw,
    BarChart3,
    Monitor,
    ChevronRight,
} from 'lucide-react';
import Link from 'next/link';

/** --- Types (API shapes) ---------------------------------------------- */

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
    cashier?: { name?: string | null } | null;
};

/** --- Helpers --------------------------------------------------------- */

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
            <div className="flex min-h-screen items-center justify-center bg-[#f9f7f2]">
                <Loader2 className="h-8 w-8 animate-spin text-stone-500" />
            </div>
        );
    }

    if (!user?.restaurantId && user?.role !== 'SUPER_ADMIN') {
        return (
            <div className="p-8 max-w-lg mx-auto text-center text-stone-700">
                <p className="mb-4">Your account is not linked to a restaurant, so warehouse data cannot be loaded.</p>
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
            className="min-h-screen bg-[#f9f7f2] p-4 md:p-6 text-[#1a1714] space-y-6"
            style={{ fontFamily: "'Space Grotesk', ui-sans-serif, system-ui, sans-serif" }}
        >
            {loadError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                    {loadError}
                    <Button variant="ghost" size="sm" className="ml-2" onClick={() => void fetchAll()}>
                        Retry
                    </Button>
                </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                    <Button variant="outline" onClick={exportToCSV}>📎 Export CSV</Button>
                    <Button variant="outline" onClick={() => setShowReceiveModal(true)}>📦 Receive Stock</Button>
                    <Button onClick={() => setShowPoDialog(true)}>+ New PO</Button>
                </div>
                <div className="text-sm text-stone-500">
                    Last sync: just now
                </div>
            </div>

            {/* KPI row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
                <Card className="border border-stone-200 bg-white shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-stone-600">Total SKUs</CardTitle>
                        <Package className="h-4 w-4 text-stone-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-semibold">{d.totalSkus}</div>
                        <p className="text-xs text-emerald-600 mt-1">+{d.skuAddedThisMonth} added this month</p>
                    </CardContent>
                </Card>
                <Card className="border border-stone-200 bg-white shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-stone-600">Stock Value</CardTitle>
                        <DollarSign className="h-4 w-4 text-stone-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-semibold">{formatPkr(d.stockValuePkr)}</div>
                        <p className="text-xs text-stone-500 mt-1">Warehouse inventory valuation</p>
                    </CardContent>
                </Card>
                <Card className="border border-stone-200 bg-white shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-stone-600">Active POs</CardTitle>
                        <Truck className="h-4 w-4 text-stone-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-semibold">{d.activePurchaseOrders}</div>
                        <p className="text-xs text-blue-600 mt-1">
                            {d.purchaseOrdersArrivingToday} arriving today (ETA matches today&apos;s date)
                        </p>
                    </CardContent>
                </Card>
                <Card className="border border-stone-200 bg-white shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-stone-600">Below Min Level</CardTitle>
                        <AlertCircle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-semibold text-red-600">{d.belowMinLevelCount}</div>
                        <p className="text-xs text-stone-500 mt-1">Needs reorder</p>
                    </CardContent>
                </Card>
                <Card className="border border-stone-200 bg-white shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-stone-600">Suppliers</CardTitle>
                        <Users className="h-4 w-4 text-stone-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-semibold">{d.totalSuppliers}</div>
                        <p className="text-xs text-stone-500 mt-1">{d.activeSuppliersCount} active</p>
                    </CardContent>
                </Card>
            </div>

            {/* SKU catalog table */}
            <Card className="border border-stone-200 bg-white shadow-sm overflow-hidden">
                <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <CardTitle className="text-lg">SKU Catalog — All Items</CardTitle>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                            <Input
                                placeholder="Search SKU, name…"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9 w-full sm:w-64 bg-stone-50 border-stone-200"
                            />
                        </div>
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger className="w-full sm:w-[160px] border-stone-200 bg-white">
                                <SlidersHorizontal className="h-4 w-4 mr-2 text-stone-500" />
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
                <CardContent className="overflow-x-auto p-0">
                    <Table>
                        <TableHeader className="bg-stone-50">
                            <TableRow>
                                <TableHead className="font-semibold">SKU</TableHead>
                                <TableHead className="font-semibold">Product Name</TableHead>
                                <TableHead className="font-semibold">Category</TableHead>
                                <TableHead className="font-semibold">Bin</TableHead>
                                <TableHead className="font-semibold">Qty on Hand</TableHead>
                                <TableHead className="font-semibold text-right">Min</TableHead>
                                <TableHead className="font-semibold text-right">Max</TableHead>
                                <TableHead className="font-semibold">Batch / Lot</TableHead>
                                <TableHead className="font-semibold text-right">Valuation</TableHead>
                                <TableHead className="font-semibold">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredSkus.map((sku) => {
                                const qty = Number(sku.currentStock ?? 0);
                                const min = Number(sku.minLevel ?? 0);
                                const valuation = qty * Number(sku.unitPrice ?? 0);
                                const belowMin = qty <= min;
                                return (
                                    <TableRow key={sku.id} className="border-stone-100">
                                        <TableCell className="font-mono text-sm">{sku.skuCode}</TableCell>
                                        <TableCell>
                                            <div className="font-medium">{sku.name}</div>
                                            <div className="text-xs text-stone-500">
                                                Supplier: {sku.preferredSupplier?.name?.trim() || '—'}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-stone-700">{sku.category?.trim() || '—'}</TableCell>
                                        <TableCell className="font-mono text-sm">{sku.binLocation || '—'}</TableCell>
                                        <TableCell>
                                            {qty} {sku.unit || ''}
                                        </TableCell>
                                        <TableCell className="text-right tabular-nums">{sku.minLevel}</TableCell>
                                        <TableCell className="text-right tabular-nums">{sku.maxLevel}</TableCell>
                                        <TableCell className="font-mono text-sm">
                                            {sku.batchLot?.trim() || (sku.batchTracking ? '(tracked)' : '—')}
                                        </TableCell>
                                        <TableCell className="text-right font-medium">{formatPkr(valuation)}</TableCell>
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
                        <div className="py-12 text-center text-sm text-stone-500">No SKUs match the current filters.</div>
                    )}
                </CardContent>
            </Card>

            {/* 2 × 2 activity grid */}
            <div id="warehouse-purchase-orders" className="grid gap-6 lg:grid-cols-2">
                <Card className="border border-stone-200 bg-white shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div className="flex items-center gap-2">
                            <ClipboardList className="h-5 w-5 text-blue-600" />
                            <CardTitle className="text-base">Purchase Orders</CardTitle>
                        </div>
                        <button
                            type="button"
                            className="text-sm text-blue-600 hover:underline inline-flex items-center gap-0.5"
                            onClick={() => document.getElementById('warehouse-purchase-orders')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                            View all <ChevronRight className="h-4 w-4" />
                        </button>
                    </CardHeader>
                    <CardContent className="divide-y divide-stone-100 max-h-[22rem] overflow-y-auto px-6">
                        {(purchaseOrders.length ? purchaseOrders.slice(0, 8) : []).map((po) => {
                            const itemCount = po.items?.length ?? 0;
                            const eta = po.expectedDelivery != null ? new Date(po.expectedDelivery) : null;
                            const etaTxt = eta ? `ETA ${eta.toLocaleDateString('en-PK', { weekday: 'short', day: 'numeric', month: 'short' })}` : 'No ETA';
                            return (
                                <div key={po.id} className="flex flex-wrap items-start justify-between gap-2 py-3 first:pt-0">
                                    <div className="min-w-0">
                                        <div className="font-mono text-sm text-stone-800">{po.poNumber}</div>
                                        <div className="font-semibold">{po.supplier?.name ?? '—'}</div>
                                        <div className="text-xs text-stone-500">
                                            {itemCount} items · {etaTxt}
                                        </div>
                                    </div>
                                    <div className="text-right space-y-1">
                                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs capitalize ${poStatusStyles(po.status)}`}>
                                            {(po.status ?? '').replace('-', ' ')}
                                        </span>
                                        <div className="font-semibold">{formatPkr(poLineTotal(po))}</div>
                                        {po.status !== 'received' && (
                                            <Button size="sm" variant="outline" onClick={() => void handleReceivePO(po.id)}>
                                                Receive
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                        {!purchaseOrders.length && <div className="py-8 text-center text-sm text-stone-500">No purchase orders.</div>}
                    </CardContent>
                </Card>

                <Card className="border border-stone-200 bg-white shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div className="flex items-center gap-2">
                            <Store className="h-5 w-5 text-orange-600" />
                            <CardTitle className="text-base">Supplier Directory</CardTitle>
                        </div>
                        <button type="button" className="text-sm text-blue-600 hover:underline" onClick={() => setShowSupplierDialog(true)}>
                            + Add supplier
                        </button>
                    </CardHeader>
                    <CardContent className="divide-y divide-stone-100 max-h-[22rem] overflow-y-auto px-6">
                        {(suppliers.length ? suppliers.slice(0, 8) : []).map((s) => (
                            <div key={s.id} className="flex items-center justify-between gap-3 py-3 first:pt-0">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div
                                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-xs font-bold ${initialsBg(
                                            s.name,
                                        )}`}
                                    >
                                        {supplierInitials(s.name)}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="font-semibold truncate">{s.name}</div>
                                        <div className="text-xs text-stone-500 truncate">
                                            {s.primaryCategory?.trim() || '—'} · {s.leadTimeDays ?? '—'} days lead · {s.paymentTerms || '—'}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1 shrink-0">
                                    <span className="text-sm font-medium text-orange-700">★ {Number(s.rating ?? 0).toFixed(1)}</span>
                                    <span
                                        className={`text-[11px] rounded-full px-2 py-0.5 ring-1 ${s.isActive ? 'bg-emerald-50 text-emerald-800 ring-emerald-200' : 'bg-amber-50 text-amber-900 ring-amber-200'
                                            }`}
                                    >
                                        {s.isActive ? 'Active' : 'Review'}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {!suppliers.length && <div className="py-8 text-center text-sm text-stone-500">No suppliers.</div>}
                    </CardContent>
                </Card>

                <Card className="border border-stone-200 bg-white shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div className="flex items-center gap-2">
                            <RefreshCw className="h-5 w-5 text-blue-600" />
                            <CardTitle className="text-base">Stock Transfers</CardTitle>
                        </div>
                        <button type="button" className="text-sm text-blue-600 hover:underline" onClick={() => setShowTransferDialog(true)}>
                            + New transfer
                        </button>
                    </CardHeader>
                    <CardContent className="divide-y divide-stone-100 max-h-[22rem] overflow-y-auto px-6">
                        {(transfers.length ? transfers.slice(0, 8) : []).map((t) => (
                            <div key={t.id} className="flex gap-3 py-3 first:pt-0">
                                <div className={`mt-1 h-2.5 w-2.5 rounded-full shrink-0 ${transferDotClass(t.status)}`} aria-hidden />
                                <div className="min-w-0 flex-1">
                                    <div className="font-semibold">
                                        {t.sku?.name ?? 'Item'} → {t.toLocation ?? '—'}
                                    </div>
                                    <div className="text-xs text-stone-500">
                                        {t.quantity} {t.sku?.unit ?? ''} · {t.fromLocation ?? '—'} → {t.toLocation ?? '—'} ·{' '}
                                        {t.createdAt ? new Date(t.createdAt).toLocaleString() : '—'}
                                        {t.requestedBy?.name ? ` · ${t.requestedBy.name}` : ''}
                                    </div>
                                    {String(t.status).toLowerCase() === 'pending' && (
                                        <Button size="sm" className="mt-2 h-8" variant="outline" onClick={() => void handleApproveTransfer(t.id)}>
                                            Approve
                                        </Button>
                                    )}
                                </div>
                                <span className="text-xs text-stone-500 capitalize shrink-0">{t.status}</span>
                            </div>
                        ))}
                        {!transfers.length && <div className="py-8 text-center text-sm text-stone-500">No transfers.</div>}
                    </CardContent>
                </Card>

                <Card className="border border-stone-200 bg-white shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-emerald-600" />
                            <CardTitle className="text-base">Audit Trail</CardTitle>
                        </div>
                        <button
                            type="button"
                            className="text-sm text-blue-600 hover:underline inline-flex items-center gap-0.5"
                            onClick={() => document.querySelector('[data-section="warehouse-audit"]')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                            Full log <ChevronRight className="h-4 w-4" />
                        </button>
                    </CardHeader>
                    <CardContent className="divide-y divide-stone-100 max-h-[22rem] overflow-y-auto px-6" data-section="warehouse-audit">
                        {(auditLogs.length ? auditLogs.slice(0, 8) : []).map((log) => {
                            const adj = Number(log.adjustment ?? 0);
                            const title =
                                adj < 0
                                    ? `Stock Adjusted — ${log.sku?.skuCode ?? 'SKU'}`
                                    : adj > 0
                                        ? `Stock Received — ${log.sku?.skuCode ?? 'SKU'}`
                                        : `Stock Event — ${log.sku?.skuCode ?? 'SKU'}`;
                            return (
                                <div key={log.id} className="flex gap-3 py-3 first:pt-0">
                                    <div className={`mt-1 h-2.5 w-2.5 rounded-full shrink-0 ${auditDotClass(adj)}`} aria-hidden />
                                    <div className="min-w-0">
                                        <div className="font-semibold">{title}</div>
                                        <div className="text-xs text-stone-500">
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
                        {!auditLogs.length && <div className="py-8 text-center text-sm text-stone-500">No audit entries.</div>}
                    </CardContent>
                </Card>
            </div>

            {/* Quick actions bar */}
            <div className="flex flex-wrap gap-2 pb-10">
                <Button variant="outline" onClick={() => setShowPoDialog(true)}>
                    + New Purchase Order
                </Button>
            </div>

            {/* --- Dialogs ------------------------------------------------ */}

            <Dialog open={showSkuDialog} onOpenChange={setShowSkuDialog}>
                <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>New SKU</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-3 pt-2">
                        <Label className="text-xs text-stone-500">SKU code</Label>
                        <Input value={newSku.skuCode} onChange={(e) => setNewSku({ ...newSku, skuCode: e.target.value })} />
                        <Label className="text-xs text-stone-500">Name</Label>
                        <Input value={newSku.name} onChange={(e) => setNewSku({ ...newSku, name: e.target.value })} />
                        <Label className="text-xs text-stone-500">Category</Label>
                        <Input value={newSku.category} onChange={(e) => setNewSku({ ...newSku, category: e.target.value })} />
                        <Label className="text-xs text-stone-500">Bin location</Label>
                        <Input value={newSku.binLocation} onChange={(e) => setNewSku({ ...newSku, binLocation: e.target.value })} />
                        <Label className="text-xs text-stone-500">Batch / Lot (optional)</Label>
                        <Input value={newSku.batchLot} onChange={(e) => setNewSku({ ...newSku, batchLot: e.target.value })} />
                        <Label className="text-xs text-stone-500">Unit</Label>
                        <Input value={newSku.unit} onChange={(e) => setNewSku({ ...newSku, unit: e.target.value })} />
                        <Label className="text-xs text-stone-500">Unit price (PKR)</Label>
                        <Input
                            type="number"
                            value={newSku.unitPrice || ''}
                            onChange={(e) => setNewSku({ ...newSku, unitPrice: parseFloat(e.target.value || '0') })}
                        />
                        <Label className="text-xs text-stone-500">Current stock</Label>
                        <Input
                            type="number"
                            value={newSku.currentStock || ''}
                            onChange={(e) => setNewSku({ ...newSku, currentStock: parseFloat(e.target.value || '0') })}
                        />
                        <Label className="text-xs text-stone-500">Min / Max level</Label>
                        <div className="flex gap-2">
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
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>New supplier</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-3 pt-2">
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
                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>New purchase order</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-3 pt-2">
                        <Label className="text-xs">Supplier</Label>
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
                        <Label className="text-xs">Expected delivery (yyyy-mm-dd)</Label>
                        <Input type="date" value={newPo.expectedDelivery} onChange={(e) => setNewPo({ ...newPo, expectedDelivery: e.target.value })} />
                        <div className="rounded-md border border-stone-200 p-3 space-y-2">
                            <Label className="text-xs text-stone-500">Lines</Label>
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
                            <ul className="text-xs text-stone-600 space-y-1">
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
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Stock transfer</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-3 pt-2">
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
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Receive Stock (Manual Adjustment)</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-3 pt-2">
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
