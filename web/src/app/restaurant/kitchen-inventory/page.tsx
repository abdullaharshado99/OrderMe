'use client';
import { useEffect, useState } from 'react';
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
    TableRow
} from '@/components/ui/table';

export default function KitchenInventoryPage() {
    const { user } = useAuth();
    const [recipes, setRecipes] = useState([]);
    const [prepTasks, setPrepTasks] = useState([]);
    const [wasteLogs, setWasteLogs] = useState([]);
    const [newPrep, setNewPrep] = useState({
        skuId: '',
        targetQuantity: '',
        date: ''
    });

    const [wasteForm, setWasteForm] = useState({
        skuId: '',
        quantity: '',
        reason: ''
    });

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

        setNewPrep({
            skuId: '',
            targetQuantity: '',
            date: ''
        });
    };

    const logWaste = async () => {
        await api.post('/kitchen-inventory/waste', wasteForm);
        fetchWasteLogs();

        setWasteForm({
            skuId: '',
            quantity: '',
            reason: ''
        });
    };

    return (
        <div className="p-6 space-y-8 min-h-screen bg-gray-50 text-gray-900">

            {/* Title */}
            <h1 className="text-2xl font-bold text-[var(--raspberry)]">
                Kitchen Inventory
            </h1>

            {/* Recipes */}
            <Card className="bg-white border border-gray-200">

                <CardHeader className="border-b border-gray-200">
                    <CardTitle className="text-[var(--brilliant-rose)]">
                        📋 Recipes (BOM)
                    </CardTitle>
                </CardHeader>

                <CardContent className="pt-4">

                    <Table>

                        <TableHeader>
                            <TableRow className="hover:bg-transparent">

                                <TableHead className="text-[var(--raspberry)]">
                                    Recipe
                                </TableHead>

                                <TableHead className="text-[var(--raspberry)]">
                                    Yield
                                </TableHead>

                                <TableHead className="text-[var(--raspberry)]">
                                    Total Cost
                                </TableHead>

                            </TableRow>
                        </TableHeader>

                        <TableBody>

                            {recipes.map((r: any) => (

                                <TableRow
                                    key={r.id}
                                    className="hover:bg-pink-50 transition"
                                >

                                    <TableCell className="font-medium">
                                        {r.name}
                                    </TableCell>

                                    <TableCell>
                                        {r.yieldQuantity} portions
                                    </TableCell>

                                    <TableCell className="text-[var(--raspberry)] font-semibold">
                                        PKR {r.totalCost}
                                    </TableCell>

                                </TableRow>
                            ))}

                        </TableBody>

                    </Table>

                </CardContent>
            </Card>

            {/* Prep Tasks */}
            <Card className="bg-white border border-gray-200">

                <CardHeader className="border-b border-gray-200">
                    <CardTitle className="text-[var(--brilliant-rose)]">
                        🔪 Prep Tasks
                    </CardTitle>
                </CardHeader>

                <CardContent className="pt-4">

                    {/* Form */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">

                        <Input
                            placeholder="SKU ID"
                            value={newPrep.skuId}
                            onChange={e =>
                                setNewPrep({
                                    ...newPrep,
                                    skuId: e.target.value
                                })
                            }
                            className="border-gray-300 focus:border-[var(--raspberry)]"
                        />

                        <Input
                            placeholder="Target Qty"
                            type="number"
                            value={newPrep.targetQuantity}
                            onChange={e =>
                                setNewPrep({
                                    ...newPrep,
                                    targetQuantity: e.target.value
                                })
                            }
                            className="border-gray-300 focus:border-[var(--raspberry)]"
                        />

                        <Input
                            type="date"
                            value={newPrep.date}
                            onChange={e =>
                                setNewPrep({
                                    ...newPrep,
                                    date: e.target.value
                                })
                            }
                            className="border-gray-300 focus:border-[var(--raspberry)]"
                        />

                        <Button
                            onClick={createPrepTask}
                            className="md:col-span-3 bg-[var(--raspberry)] hover:bg-[var(--brilliant-rose)] text-white"
                        >
                            Add Prep Task
                        </Button>

                    </div>

                    {/* Table */}
                    <Table>

                        <TableHeader>
                            <TableRow className="hover:bg-transparent">

                                <TableHead className="text-[var(--raspberry)]">
                                    Date
                                </TableHead>

                                <TableHead className="text-[var(--raspberry)]">
                                    SKU
                                </TableHead>

                                <TableHead className="text-[var(--raspberry)]">
                                    Target
                                </TableHead>

                                <TableHead className="text-[var(--raspberry)]">
                                    Completed
                                </TableHead>

                                <TableHead className="text-[var(--raspberry)]">
                                    Status
                                </TableHead>

                            </TableRow>
                        </TableHeader>

                        <TableBody>

                            {prepTasks.map((t: any) => (

                                <TableRow
                                    key={t.id}
                                    className="hover:bg-pink-50 transition"
                                >

                                    <TableCell>
                                        {new Date(t.date).toLocaleDateString()}
                                    </TableCell>

                                    <TableCell>{t.sku?.name}</TableCell>

                                    <TableCell>{t.targetQuantity}</TableCell>

                                    <TableCell>{t.completedQuantity}</TableCell>

                                    <TableCell className="font-medium text-[var(--raspberry)]">
                                        {t.status}
                                    </TableCell>

                                </TableRow>
                            ))}

                        </TableBody>

                    </Table>

                </CardContent>
            </Card>

            {/* Waste Logs */}
            <Card className="bg-white border border-gray-200">

                <CardHeader className="border-b border-gray-200">
                    <CardTitle className="text-[var(--brilliant-rose)]">
                        🗑 Waste Log
                    </CardTitle>
                </CardHeader>

                <CardContent className="pt-4">

                    {/* Form */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">

                        <Input
                            placeholder="SKU ID"
                            value={wasteForm.skuId}
                            onChange={e =>
                                setWasteForm({
                                    ...wasteForm,
                                    skuId: e.target.value
                                })
                            }
                            className="border-gray-300 focus:border-[var(--raspberry)]"
                        />

                        <Input
                            placeholder="Quantity"
                            type="number"
                            value={wasteForm.quantity}
                            onChange={e =>
                                setWasteForm({
                                    ...wasteForm,
                                    quantity: e.target.value
                                })
                            }
                            className="border-gray-300 focus:border-[var(--raspberry)]"
                        />

                        <Input
                            placeholder="Reason"
                            value={wasteForm.reason}
                            onChange={e =>
                                setWasteForm({
                                    ...wasteForm,
                                    reason: e.target.value
                                })
                            }
                            className="border-gray-300 focus:border-[var(--raspberry)]"
                        />

                        <Button
                            onClick={logWaste}
                            className="md:col-span-3 bg-[var(--raspberry)] hover:bg-[var(--brilliant-rose)] text-white"
                        >
                            Log Waste
                        </Button>

                    </div>

                    {/* Table */}
                    <Table>

                        <TableHeader>
                            <TableRow className="hover:bg-transparent">

                                <TableHead className="text-[var(--raspberry)]">
                                    Date
                                </TableHead>

                                <TableHead className="text-[var(--raspberry)]">
                                    Item
                                </TableHead>

                                <TableHead className="text-[var(--raspberry)]">
                                    Qty
                                </TableHead>

                                <TableHead className="text-[var(--raspberry)]">
                                    Reason
                                </TableHead>

                                <TableHead className="text-[var(--raspberry)]">
                                    Cost
                                </TableHead>

                            </TableRow>
                        </TableHeader>

                        <TableBody>

                            {wasteLogs.map((w: any) => (

                                <TableRow
                                    key={w.id}
                                    className="hover:bg-pink-50 transition"
                                >

                                    <TableCell>
                                        {new Date(w.createdAt).toLocaleString()}
                                    </TableCell>

                                    <TableCell>{w.sku?.name}</TableCell>

                                    <TableCell>{w.quantity}</TableCell>

                                    <TableCell>{w.reason}</TableCell>

                                    <TableCell className="text-[var(--raspberry)] font-semibold">
                                        PKR {w.estimatedCost}
                                    </TableCell>

                                </TableRow>
                            ))}

                        </TableBody>

                    </Table>

                </CardContent>
            </Card>
        </div>
    );
}