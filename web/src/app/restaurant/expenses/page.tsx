'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, DollarSign, Utensils, Users, Zap, CheckCircle, XCircle, Plus } from 'lucide-react';

type Expense = {
    id: number;
    date: string;
    description: string;
    category: string;
    vendor?: string;
    tax?: string;
    amount: number;
    status: string;
};

type Budget = {
    id: number;
    category: string;
    amount: number;
    month: string;
};

type BudgetUtil = {
    category: string;
    budget: number;
    spent: number;
    month: string;
};

type Approval = {
    id: number;
    expense: Expense;
    status: string;
    comment?: string;
};

type Recurring = {
    id: number;
    category: string;
    amount: number;
    frequency: string;
    dayOfMonth?: number;
};

export default function ExpensesPage() {
    const { user } = useAuth();
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [period, setPeriod] = useState('month');
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [budgetUtil, setBudgetUtil] = useState<BudgetUtil[]>([]);
    const [approvals, setApprovals] = useState<Approval[]>([]);
    const [recurring, setRecurring] = useState<Recurring[]>([]);
    const [showBudgetDialog, setShowBudgetDialog] = useState(false);
    const [showRecurringDialog, setShowRecurringDialog] = useState(false);
    const [newBudget, setNewBudget] = useState({ category: '', amount: '', month: '' });
    const [newRecurring, setNewRecurring] = useState({ category: '', amount: '', frequency: 'monthly', dayOfMonth: '' });
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, foodCost: 0, labour: 0, utilities: 0 });

    const fetchAll = async () => {
        if (!user?.restaurantId) return;
        setLoading(true);
        try {
            const [expensesRes, budgetsRes, budgetUtilRes, approvalsRes, recurringRes] = await Promise.all([
                api.get(`/expenses/restaurant/${user.restaurantId}`),
                api.get('/expenses/budgets'),
                api.get('/expenses/budgets/utilization'),
                api.get('/expenses/approvals/pending'),
                api.get('/expenses/recurring'),
            ]);
            setExpenses(expensesRes.data);
            setBudgets(budgetsRes.data);
            setBudgetUtil(budgetUtilRes.data);
            setApprovals(approvalsRes.data);
            setRecurring(recurringRes.data);

            // Calculate KPI summary (simplified – you can compute from expenses)
            const total = expensesRes.data.reduce((s: number, e: Expense) => s + e.amount, 0);
            const foodCost = expensesRes.data.filter((e: Expense) => e.category === 'Food Cost').reduce((s: number, e: Expense) => s + e.amount, 0);
            const labour = expensesRes.data.filter((e: Expense) => e.category === 'Labour').reduce((s: number, e: Expense) => s + e.amount, 0);
            const utilities = expensesRes.data.filter((e: Expense) => e.category === 'Utilities').reduce((s: number, e: Expense) => s + e.amount, 0);
            setStats({ total, foodCost, labour, utilities });
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchAll();
    }, [user]);

    const createBudget = async () => {
        await api.post('/expenses/budgets', newBudget);
        setShowBudgetDialog(false);
        setNewBudget({ category: '', amount: '', month: '' });
        fetchAll();
    };

    const createRecurring = async () => {
        await api.post('/expenses/recurring', newRecurring);
        setShowRecurringDialog(false);
        setNewRecurring({ category: '', amount: '', frequency: 'monthly', dayOfMonth: '' });
        fetchAll();
    };

    const approveExpense = async (approvalId: number) => {
        await api.post(`/expenses/approvals/${approvalId}/approve`, { comment: 'Approved' });
        fetchAll();
    };

    const formatCurrency = (amount: number) => `PKR ${amount.toLocaleString()}`;

    if (loading) return <div className="p-6">Loading expenses...</div>;

    return (
        <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-[var(--raspberry)]">Expense Management</h1>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setShowBudgetDialog(true)}>+ Add Budget</Button>
                    <Button variant="outline" onClick={() => setShowRecurringDialog(true)}>+ Add Recurring</Button>
                </div>
            </div>

            {/* Period Tabs */}
            <Tabs value={period} onValueChange={setPeriod} className="w-full">
                <TabsList className="bg-white border">
                    <TabsTrigger value="today">Today</TabsTrigger>
                    <TabsTrigger value="week">This Week</TabsTrigger>
                    <TabsTrigger value="month">This Month</TabsTrigger>
                    <TabsTrigger value="quarter">Quarter</TabsTrigger>
                    <TabsTrigger value="year">Year</TabsTrigger>
                </TabsList>
                <TabsContent value={period} className="space-y-6">
                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Total Expenses</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{formatCurrency(stats.total)}</div><Badge className="bg-green-100 text-green-800">↑ 12% vs last month</Badge></CardContent></Card>
                        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Food Cost</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{formatCurrency(stats.foodCost)}</div><div className="text-xs text-gray-500">49% of revenue</div></CardContent></Card>
                        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Labour Cost</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{formatCurrency(stats.labour)}</div><Badge className="bg-green-100 text-green-800">↓ 3% vs last month</Badge></CardContent></Card>
                        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Utilities</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{formatCurrency(stats.utilities)}</div><Badge className="bg-red-100 text-red-800">↑ 8% – peak summer</Badge></CardContent></Card>
                    </div>

                    {/* Recent Expenses Table */}
                    <Card>
                        <CardHeader><CardTitle>Recent Expenses</CardTitle></CardHeader>
                        <CardContent className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow><TableHead>Date</TableHead><TableHead>Description</TableHead><TableHead>Category</TableHead><TableHead>Vendor</TableHead><TableHead>Tax</TableHead><TableHead>Amount</TableHead><TableHead>Status</TableHead></TableRow>
                                </TableHeader>
                                <TableBody>
                                    {expenses.slice(0, 10).map(exp => (
                                        <TableRow key={exp.id}>
                                            <TableCell>{new Date(exp.date).toLocaleDateString()}</TableCell>
                                            <TableCell><div className="font-medium">{exp.description}</div><div className="text-xs text-gray-400">INV-{exp.id}</div></TableCell>
                                            <TableCell><Badge variant="outline">{exp.category}</Badge></TableCell>
                                            <TableCell>{exp.vendor || '—'}</TableCell>
                                            <TableCell>{exp.tax || '—'}</TableCell>
                                            <TableCell className="text-red-600">{formatCurrency(exp.amount)}</TableCell>
                                            <TableCell><Badge className={exp.status === 'Approved' ? 'bg-green-100' : exp.status === 'Pending' ? 'bg-yellow-100' : 'bg-gray-100'}>{exp.status}</Badge></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {/* Bottom Grid: P&L, Approvals, Recurring, Budget vs Actual */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* P&L Snapshot */}
                        <Card><CardHeader><CardTitle>P&L Snapshot</CardTitle></CardHeader><CardContent className="space-y-2">
                            <div className="flex justify-between"><span>Revenue</span><span className="text-green-600">+PKR 16.8M</span></div>
                            <div className="flex justify-between"><span>Food Cost</span><span className="text-red-600">-{formatCurrency(stats.foodCost)}</span></div>
                            <div className="flex justify-between"><span>Labour</span><span className="text-red-600">-{formatCurrency(stats.labour)}</span></div>
                            <div className="flex justify-between"><span>Rent</span><span className="text-red-600">-PKR 650,000</span></div>
                            <div className="flex justify-between"><span>Utilities</span><span className="text-red-600">-{formatCurrency(stats.utilities)}</span></div>
                            <div className="flex justify-between"><span>Other Costs</span><span className="text-red-600">-PKR 870,000</span></div>
                            <div className="border-t pt-2 font-bold flex justify-between"><span>Net Profit</span><span className="text-green-600">{formatCurrency(stats.total * 0.1)}</span></div>
                        </CardContent></Card>

                        {/* Approval Queue */}
                        <Card><CardHeader><CardTitle>Approval Queue</CardTitle></CardHeader><CardContent className="space-y-3">
                            {approvals.map(ap => (
                                <div key={ap.id} className="border-b pb-2 flex justify-between items-center">
                                    <div><div className="font-semibold">{ap.expense.description}</div><div className="text-xs text-gray-500">{ap.expense.category} · {new Date(ap.expense.date).toLocaleDateString()}</div><div className="font-mono">{formatCurrency(ap.expense.amount)}</div></div>
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="ghost" className="text-green-600" onClick={() => approveExpense(ap.id)}><CheckCircle size={16} /></Button>
                                        <Button size="sm" variant="ghost" className="text-red-600"><XCircle size={16} /></Button>
                                    </div>
                                </div>
                            ))}
                            {approvals.length === 0 && <div className="text-gray-500">No pending approvals</div>}
                        </CardContent></Card>

                        {/* Budget vs Actual */}
                        <Card><CardHeader><CardTitle>Budget vs Actual</CardTitle></CardHeader><CardContent className="space-y-4">
                            {budgetUtil.map(b => {
                                const percent = (b.spent / b.budget) * 100;
                                return (
                                    <div key={b.category}>
                                        <div className="flex justify-between text-sm"><span>{b.category}</span><span>{formatCurrency(b.spent)} / {formatCurrency(b.budget)}</span></div>
                                        <Progress value={Math.min(100, percent)} className="h-2" />
                                        <div className={`text-xs ${percent > 100 ? 'text-red-600' : 'text-green-600'}`}>{percent.toFixed(0)}% – {percent > 100 ? 'Over budget' : percent > 90 ? 'Near limit' : 'On track'}</div>
                                    </div>
                                );
                            })}
                        </CardContent></Card>

                        {/* Recurring Costs */}
                        <Card><CardHeader><CardTitle>Recurring Costs</CardTitle></CardHeader><CardContent className="space-y-3">
                            {recurring.map(r => (
                                <div key={r.id} className="flex justify-between items-center border-b pb-2">
                                    <div><div className="font-semibold">{r.category}</div><div className="text-xs text-gray-500">{r.frequency} · Due {r.dayOfMonth ? `on day ${r.dayOfMonth}` : 'variable'}</div></div>
                                    <div className="font-mono">{formatCurrency(r.amount)}</div>
                                </div>
                            ))}
                        </CardContent></Card>
                    </div>
                </TabsContent>
            </Tabs>

            {/* Dialogs */}
            <Dialog open={showBudgetDialog} onOpenChange={setShowBudgetDialog}>
                <DialogContent><DialogHeader><DialogTitle>Add Budget</DialogTitle></DialogHeader>
                    <div className="space-y-3">
                        <Input placeholder="Category" value={newBudget.category} onChange={e => setNewBudget({ ...newBudget, category: e.target.value })} />
                        <Input placeholder="Amount" type="number" value={newBudget.amount} onChange={e => setNewBudget({ ...newBudget, amount: e.target.value })} />
                        <Input type="month" value={newBudget.month} onChange={e => setNewBudget({ ...newBudget, month: e.target.value })} />
                        <Button onClick={createBudget}>Save</Button>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={showRecurringDialog} onOpenChange={setShowRecurringDialog}>
                <DialogContent><DialogHeader><DialogTitle>Add Recurring Expense</DialogTitle></DialogHeader>
                    <div className="space-y-3">
                        <Input placeholder="Category" value={newRecurring.category} onChange={e => setNewRecurring({ ...newRecurring, category: e.target.value })} />
                        <Input placeholder="Amount" type="number" value={newRecurring.amount} onChange={e => setNewRecurring({ ...newRecurring, amount: e.target.value })} />
                        <select className="w-full border p-2 rounded" value={newRecurring.frequency} onChange={e => setNewRecurring({ ...newRecurring, frequency: e.target.value })}>
                            <option value="monthly">Monthly</option>
                            <option value="quarterly">Quarterly</option>
                            <option value="yearly">Yearly</option>
                        </select>
                        <Input placeholder="Day of month (1-31)" type="number" value={newRecurring.dayOfMonth} onChange={e => setNewRecurring({ ...newRecurring, dayOfMonth: e.target.value })} />
                        <Button onClick={createRecurring}>Save</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}