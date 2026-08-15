'use client';
import styles from './kitchen-inventory.module.css';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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
    DialogFooter,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

type Sku = {
    id: number;
    skuCode?: string;
    name?: string;
    category?: string;
    unit?: string;
    currentStock?: number;
    minLevel?: number;
    maxLevel?: number;
    unitPrice?: number;
    batchLot?: string;
};

type Recipe = {
    id: number;
    name: string;
    description?: string;
    yieldQuantity: number;
    prepTimeMinutes?: number;
    totalCost: number;
    ingredients?: { sku?: Sku; quantity: number }[];
};

type PrepTask = {
    id: number;
    date: string;
    sku: Sku;
    targetQuantity: number;
    completedQuantity: number;
    status: string;
};

type WasteLog = {
    id: number;
    createdAt: string;
    sku: Sku;
    quantity: number;
    reason: string;
    estimatedCost: number;
};

export default function KitchenInventoryPage() {
    const { user } = useAuth();

    // State
    const [skus, setSkus] = useState<Sku[]>([]);
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [prepTasks, setPrepTasks] = useState<PrepTask[]>([]);
    const [wasteLogs, setWasteLogs] = useState<WasteLog[]>([]);
    const [loading, setLoading] = useState(true);

    // Filter & Search
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [lowStockFilter, setLowStockFilter] = useState(false);

    // Dialogs
    const [showWasteDialog, setShowWasteDialog] = useState(false);
    const [wasteForm, setWasteForm] = useState({ skuId: '', quantity: '', reason: '' });
    const [showPrepDialog, setShowPrepDialog] = useState(false);
    const [prepForm, setPrepForm] = useState({ skuId: '', targetQuantity: '', date: '' });

    const fetchAll = async () => {
        if (!user?.restaurantId) return;
        setLoading(true);
        try {
            const [skusRes, recipesRes, prepRes, wasteRes] = await Promise.all([
                api.get('/warehouse/skus'),
                api.get('/kitchen-inventory/recipes'),
                api.get('/kitchen-inventory/prep-tasks'),
                api.get('/kitchen-inventory/waste'),
            ]);
            setSkus(skusRes.data);
            setRecipes(recipesRes.data);
            setPrepTasks(prepRes.data);
            setWasteLogs(wasteRes.data);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchAll();
    }, [user]);

    // Compute KPIs
    const totalIngredients = skus.length;
    const lowStockItems = skus.filter((s) => (s.currentStock ?? 0) <= (s.minLevel ?? 0)).length;
    const expiringSoon = 0; // placeholder; you can add expiry date to SKUs later
    const dailyWaste = wasteLogs
        .filter((w) => new Date(w.createdAt).toDateString() === new Date().toDateString())
        .reduce((sum, w) => sum + w.estimatedCost, 0);

    // Filter SKUs
    const filteredSkus = skus.filter((sku) => {
        const matchesSearch =
            sku.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            sku.skuCode?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || sku.category === categoryFilter;
        const matchesLowStock = !lowStockFilter || (sku.currentStock ?? 0) <= (sku.minLevel ?? 0);
        return matchesSearch && matchesCategory && matchesLowStock;
    });

    // Stock level percentage for progress bar
    const getStockPercentage = (sku: Sku) => {
        const current = sku.currentStock ?? 0;
        const max = sku.maxLevel ?? 100;
        const percentage = (current / max) * 100;
        return Math.min(100, Math.max(0, percentage));
    };

    const getStatusBadge = (sku: Sku) => {
        const current = sku.currentStock ?? 0;
        const min = sku.minLevel ?? 0;
        if (current <= min) return { label: 'Critical', className: 'bg-red-100 text-red-800' };
        if (current <= min * 1.2) return { label: 'Low', className: 'bg-yellow-100 text-yellow-800' };
        return { label: 'Good', className: 'bg-green-100 text-green-800' };
    };

    // Handle waste submission
    const handleLogWaste = async () => {
        await api.post('/kitchen-inventory/waste', {
            skuId: parseInt(wasteForm.skuId),
            quantity: parseFloat(wasteForm.quantity),
            reason: wasteForm.reason,
        });
        setShowWasteDialog(false);
        setWasteForm({ skuId: '', quantity: '', reason: '' });
        fetchAll();
    };

    // Handle prep task creation
    const handleCreatePrepTask = async () => {
        await api.post('/kitchen-inventory/prep-tasks', {
            date: prepForm.date,
            skuId: parseInt(prepForm.skuId),
            targetQuantity: parseFloat(prepForm.targetQuantity),
        });
        setShowPrepDialog(false);
        setPrepForm({ skuId: '', targetQuantity: '', date: '' });
        fetchAll();
    };

    // Update prep task completion (for demonstration, we'll add a simple inline update later)
    const updatePrepCompletion = async (id: number, completed: number) => {
        await api.patch(`/kitchen-inventory/prep-tasks/${id}`, { completedQuantity: completed });
        fetchAll();
    };

    if (loading) return <div className={styles.p_6}>Loading kitchen inventory...</div>;

    return (
        <div className={styles.p_6_space_y_6_bg_gray_50_min_h_screen}>
            {/* Header with buttons */}
            <div className={styles.flex_justify_between_items_center}>
                <div>
                    <h1 className={styles.text_2xl_font_bold_text_stone_800}>Kitchen Inventory</h1>
                    <p className={styles.text_sm_text_stone_500}>Last sync: {new Date().toLocaleString()} · Station: Main Kitchen</p>
                </div>
                <div className={styles.flex_gap_2}>
                    <Button variant="outline">📊 Export</Button>
                    <Button variant="outline" onClick={() => fetchAll()}>🔄 Sync</Button>
                    <Button onClick={() => setShowPrepDialog(true)}>+ Add Ingredient</Button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className={styles.grid_grid_cols_1_sm_grid_cols_2_lg_grid_cols_4_gap}>
                <Card><CardHeader className={styles.pb_2}><CardTitle className={styles.text_sm}>Total Ingredients</CardTitle></CardHeader><CardContent><div className={styles.text_2xl_font_bold}>{totalIngredients}</div><p className={styles.text_xs_text_green_600}>+8 this week</p></CardContent></Card>
                <Card><CardHeader className={styles.pb_2}><CardTitle className={styles.text_sm}>Low Stock</CardTitle></CardHeader><CardContent><div className={styles.text_2xl_font_bold_text_yellow_600}>{lowStockItems}</div><p className={styles.text_xs}>Reorder needed</p></CardContent></Card>
                <Card><CardHeader className={styles.pb_2}><CardTitle className={styles.text_sm}>Expiring Soon</CardTitle></CardHeader><CardContent><div className={styles.text_2xl_font_bold_text_red_600}>{expiringSoon}</div><p className={styles.text_xs}>Within 48 hrs</p></CardContent></Card>
                <Card><CardHeader className={styles.pb_2}><CardTitle className={styles.text_sm}>Daily Waste</CardTitle></CardHeader><CardContent><div className={styles.text_2xl_font_bold}>PKR {dailyWaste.toLocaleString()}</div><p className={styles.text_xs_text_green_600}>↓ 18% vs yesterday</p></CardContent></Card>
            </div>

            {/* Search and Filters */}
            <div className={styles.flex_flex_wrap_gap_3_items_center}>
                <div className={styles.relative_flex_1}>
                    <Input
                        placeholder="Search ingredients, SKUs, categories..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.pl_8}
                    />
                    <span className={styles.absolute_left_3_top_1_2_translate_y_1_2_text_gray_}>🔍</span>
                </div>
                <div className={styles.flex_gap_2}>
                    {['all', 'Produce', 'Dairy', 'Proteins', 'Dry Goods'].map((cat) => (
                        <Button
                            key={cat}
                            variant={categoryFilter === cat ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setCategoryFilter(cat)}
                            className={categoryFilter === cat ? 'bg-stone-800' : ''}
                        >
                            {cat === 'all' ? 'All' : cat}
                        </Button>
                    ))}
                    <Button
                        variant={lowStockFilter ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setLowStockFilter(!lowStockFilter)}
                        className={lowStockFilter ? 'bg-red-600' : ''}
                    >
                        ⚠ Low Stock
                    </Button>
                </div>
            </div>

            {/* Main Table */}
            <Card>
                <CardContent className={styles.p_0_overflow_x_auto}>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Ingredient</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Unit</TableHead>
                                <TableHead>In Stock</TableHead>
                                <TableHead>Reorder At</TableHead>
                                <TableHead>Stock Level</TableHead>
                                <TableHead>Shelf Life</TableHead>
                                <TableHead>Cost/Unit</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredSkus.map((sku) => {
                                const status = getStatusBadge(sku);
                                return (
                                    <TableRow key={sku.id}>
                                        <TableCell className={styles.font_medium}>{sku.name}<div className={styles.text_xs_text_gray_500}>{sku.skuCode}</div></TableCell>
                                        <TableCell>{sku.category}</TableCell>
                                        <TableCell>{sku.unit}</TableCell>
                                        <TableCell>{sku.currentStock}</TableCell>
                                        <TableCell>{sku.minLevel}</TableCell>
                                        <TableCell className={styles.w_32}>
                                            <Progress value={getStockPercentage(sku)} className={styles.h_2} />
                                            <span className={styles.text_xs}>{((sku.currentStock ?? 0) / (sku.maxLevel ?? 100) * 100).toFixed(0)}%</span>
                                        </TableCell>
                                        <TableCell>—</TableCell>
                                        <TableCell>PKR {sku.unitPrice}</TableCell>
                                        <TableCell><Badge className={status.className}>{status.label}</Badge></TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Bottom Grid: Recipes, Waste Log, Reorder Alerts, Prep Tracking */}
            <div className={styles.grid_grid_cols_1_lg_grid_cols_2_gap_6}>
                {/* Recipes */}
                <Card>
                    <CardHeader className={styles.flex_flex_row_justify_between}><CardTitle>📋 Recipes / Bill of Materials</CardTitle><Button variant="link">View all →</Button></CardHeader>
                    <CardContent className={styles.space_y_4_max_h_80_overflow_y_auto}>
                        {recipes.map((recipe) => (
                            <div key={recipe.id} className={styles.border_b_pb_3}>
                                <div className={styles.font_semibold}>{recipe.name}</div>
                                <div className={styles.text_sm_text_gray_500}>{recipe.ingredients?.length} ingredients · Prep: {recipe.prepTimeMinutes} min · Yield: {recipe.yieldQuantity} portions</div>
                                <div className={styles.font_bold}>PKR {recipe.totalCost}</div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Waste Log (Today) */}
                <Card>
                    <CardHeader className={styles.flex_flex_row_justify_between}><CardTitle>🗑 Waste Log — Today</CardTitle><Button variant="ghost" size="sm" onClick={() => setShowWasteDialog(true)}>+ Log waste</Button></CardHeader>
                    <CardContent className={styles.space_y_3_max_h_80_overflow_y_auto}>
                        {wasteLogs.filter(w => new Date(w.createdAt).toDateString() === new Date().toDateString()).map((w) => (
                            <div key={w.id} className={styles.flex_items_center_justify_between_border_b_pb_2}>
                                <div><div className={styles.font_medium}>{w.sku?.name}</div><div className={styles.text_xs_text_gray_500}>{w.reason} · {new Date(w.createdAt).toLocaleTimeString()}</div></div>
                                <div className={styles.text_red_500}>-{w.quantity} {w.sku?.unit}</div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Reorder Alerts */}
                <Card>
                    <CardHeader><CardTitle>⚠ Reorder Alerts</CardTitle></CardHeader>
                    <CardContent className={styles.space_y_3}>
                        {skus.filter(s => (s.currentStock ?? 0) <= (s.minLevel ?? 0)).slice(0, 4).map((sku) => (
                            <div key={sku.id} className={styles.flex_justify_between_items_center}>
                                <div><div className={styles.font_medium}>{sku.name}</div><div className={styles.text_xs}>{sku.currentStock} {sku.unit} remaining · Reorder: {sku.minLevel}</div></div>
                                <Button size="sm" variant="outline">Order</Button>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Prep Tracking */}
                <Card>
                    <CardHeader className={styles.flex_flex_row_justify_between}><CardTitle>🔪 Prep Tracking</CardTitle><Button variant="link" onClick={() => setShowPrepDialog(true)}>Today's schedule</Button></CardHeader>
                    <CardContent className={styles.space_y_3}>
                        {prepTasks.slice(0, 4).map((task) => (
                            <div key={task.id} className={styles.flex_justify_between_items_center}>
                                <div><div className={styles.font_medium}>{task.sku?.name}</div><div className={styles.text_xs}>Target: {task.targetQuantity} {task.sku?.unit} · Done: {task.completedQuantity} {task.sku?.unit}</div></div>
                                <Badge className={task.status === 'done' ? 'bg-green-100 text-green-800' : task.status === 'in-progress' ? 'bg-yellow-100' : 'bg-gray-100'}>
                                    {task.status === 'done' ? '✓ Done' : task.status === 'in-progress' ? 'In Progress' : 'Not Started'}
                                </Badge>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* Waste Dialog */}
            <Dialog open={showWasteDialog} onOpenChange={setShowWasteDialog}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Log Waste</DialogTitle></DialogHeader>
                    <div className={styles.space_y_3}>
                        <Label>Ingredient</Label>
                        <Select
                            value={wasteForm.skuId}
                            onValueChange={(value) => setWasteForm({ ...wasteForm, skuId: value })}
                        >
                            <SelectTrigger className={styles.w_full_border_p_2_rounded}>
                                <SelectValue placeholder="Select SKU" />
                            </SelectTrigger>
                            <SelectContent>
                                {skus.map((s) => (
                                    <SelectItem key={s.id} value={String(s.id)}>
                                        {s.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Label>Quantity</Label>
                        <Input type="number" value={wasteForm.quantity} onChange={e => setWasteForm({ ...wasteForm, quantity: e.target.value })} />
                        <Label>Reason</Label>
                        <Input value={wasteForm.reason} onChange={e => setWasteForm({ ...wasteForm, reason: e.target.value })} />
                    </div>
                    <DialogFooter><Button onClick={handleLogWaste}>Log Waste</Button></DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Prep Task Dialog */}
            <Dialog open={showPrepDialog} onOpenChange={setShowPrepDialog}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Add Prep Task</DialogTitle></DialogHeader>
                    <div className={styles.space_y_3}>
                        <Label>Ingredient</Label>
                        <Select
                          value={prepForm.skuId}
                          onValueChange={(value) => setPrepForm({ ...prepForm, skuId: value })}
                        >
                          <SelectTrigger className={styles.w_full_border_p_2_rounded}>
                            <SelectValue placeholder="Select SKU" />
                          </SelectTrigger>
                          <SelectContent>
                            {skus.map((s) => (
                              <SelectItem key={s.id} value={String(s.id)}>
                                {s.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Label>Target Quantity</Label>
                        <Input type="number" value={prepForm.targetQuantity} onChange={e => setPrepForm({ ...prepForm, targetQuantity: e.target.value })} />
                        <Label>Date</Label>
                        <Input type="date" value={prepForm.date} onChange={e => setPrepForm({ ...prepForm, date: e.target.value })} />
                    </div>
                    <DialogFooter><Button onClick={handleCreatePrepTask}>Create Prep Task</Button></DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}