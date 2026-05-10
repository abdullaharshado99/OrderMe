'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function KitchenInventoryPage() {
    const { user } = useAuth();
    const [recipes, setRecipes] = useState([]);
    const [prepTasks, setPrepTasks] = useState([]);
    const [wasteLogs, setWasteLogs] = useState([]);
    const [newPrep, setNewPrep] = useState({ skuId: '', targetQuantity: '', date: '' });
    const [wasteForm, setWasteForm] = useState({ skuId: '', quantity: '', reason: '' });

    useEffect(() => {
        fetchRecipes();
        fetchPrepTasks();
        fetchWasteLogs();
    }, []);

    const fetchRecipes = async () => {
        const { data } = await api.get('/kitchen-inventory/recipes');
        setRecipes(data);
    };
    const fetchPrepTasks = async () => {
        const { data } = await api.get('/kitchen-inventory/prep-tasks');
        setPrepTasks(data);
    };
    const fetchWasteLogs = async () => {
        const { data } = await api.get('/kitchen-inventory/waste');
        setWasteLogs(data);
    };

    const createPrepTask = async () => {
        await api.post('/kitchen-inventory/prep-tasks', newPrep);
        fetchPrepTasks();
        setNewPrep({ skuId: '', targetQuantity: '', date: '' });
    };

    const logWaste = async () => {
        await api.post('/kitchen-inventory/waste', wasteForm);
        fetchWasteLogs();
        setWasteForm({ skuId: '', quantity: '', reason: '' });
    };

    return (
        <div className="p-6 space-y-8">
            <h1 className="text-2xl font-bold">Kitchen Inventory</h1>

            {/* Recipes Section */}
            <Card>
                <CardHeader><CardTitle>📋 Recipes (BOM)</CardTitle></CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader><TableRow><TableHead>Recipe</TableHead><TableHead>Yield</TableHead><TableHead>Total Cost</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {recipes.map((r: any) => (
                                <TableRow key={r.id}>
                                    <TableCell>{r.name}</TableCell>
                                    <TableCell>{r.yieldQuantity} portions</TableCell>
                                    <TableCell>PKR {r.totalCost}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Prep Tasks */}
            <Card>
                <CardHeader><CardTitle>🔪 Prep Tasks</CardTitle></CardHeader>
                <CardContent>
                    <div className="grid grid-cols-3 gap-2 mb-4">
                        <Input placeholder="SKU ID" value={newPrep.skuId} onChange={e => setNewPrep({ ...newPrep, skuId: e.target.value })} />
                        <Input placeholder="Target Qty" type="number" value={newPrep.targetQuantity} onChange={e => setNewPrep({ ...newPrep, targetQuantity: e.target.value })} />
                        <Input type="date" value={newPrep.date} onChange={e => setNewPrep({ ...newPrep, date: e.target.value })} />
                        <Button onClick={createPrepTask} className="col-span-3">Add Prep Task</Button>
                    </div>
                    <Table>
                        <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>SKU</TableHead><TableHead>Target</TableHead><TableHead>Completed</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {prepTasks.map((t: any) => (
                                <TableRow key={t.id}>
                                    <TableCell>{new Date(t.date).toLocaleDateString()}</TableCell>
                                    <TableCell>{t.sku?.name}</TableCell>
                                    <TableCell>{t.targetQuantity}</TableCell>
                                    <TableCell>{t.completedQuantity}</TableCell>
                                    <TableCell>{t.status}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Waste Log */}
            <Card>
                <CardHeader><CardTitle>🗑 Waste Log</CardTitle></CardHeader>
                <CardContent>
                    <div className="grid grid-cols-3 gap-2 mb-4">
                        <Input placeholder="SKU ID" value={wasteForm.skuId} onChange={e => setWasteForm({ ...wasteForm, skuId: e.target.value })} />
                        <Input placeholder="Quantity" type="number" value={wasteForm.quantity} onChange={e => setWasteForm({ ...wasteForm, quantity: e.target.value })} />
                        <Input placeholder="Reason" value={wasteForm.reason} onChange={e => setWasteForm({ ...wasteForm, reason: e.target.value })} />
                        <Button onClick={logWaste} className="col-span-3">Log Waste</Button>
                    </div>
                    <Table>
                        <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Item</TableHead><TableHead>Qty</TableHead><TableHead>Reason</TableHead><TableHead>Cost</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {wasteLogs.map((w: any) => (
                                <TableRow key={w.id}>
                                    <TableCell>{new Date(w.createdAt).toLocaleString()}</TableCell>
                                    <TableCell>{w.sku?.name}</TableCell>
                                    <TableCell>{w.quantity}</TableCell>
                                    <TableCell>{w.reason}</TableCell>
                                    <TableCell>PKR {w.estimatedCost}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}