'use client';
import styles from './expenses.module.css';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
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

    if (loading) return <div className={styles.p_6}>Loading expenses...</div>;

    return (
        <div className={styles.p_6_space_y_6_bg_gray_50_min_h_screen}>
            <div className={styles.flex_justify_between_items_center}>
                <h1 className={styles.text_2xl_font_bold_text_var}>Expense Management</h1>
                <div className={styles.flex_gap_2}>
                    <Button variant="outline" onClick={() => setShowBudgetDialog(true)}>+ Add Budget</Button>
                    <Button variant="outline" onClick={() => setShowRecurringDialog(true)}>+ Add Recurring</Button>
                </div>
            </div>

            {/* Period Tabs */}
            <Tabs value={period} onValueChange={setPeriod} className={styles.w_full}>
                <TabsList className={styles.bg_white_border}>
                    <TabsTrigger value="today">Today</TabsTrigger>
                    <TabsTrigger value="week">This Week</TabsTrigger>
                    <TabsTrigger value="month">This Month</TabsTrigger>
                    <TabsTrigger value="quarter">Quarter</TabsTrigger>
                    <TabsTrigger value="year">Year</TabsTrigger>
                </TabsList>
                <TabsContent value={period} className={styles.space_y_6}>
                    {/* KPI Cards */}
                    <div className={styles.grid_grid_cols_1_md_grid_cols_4_gap_4}>
                        <Card><CardHeader className={styles.pb_2}><CardTitle className={styles.text_sm}>Total Expenses</CardTitle></CardHeader><CardContent><div className={styles.text_2xl_font_bold}>{formatCurrency(stats.total)}</div><Badge className={styles.bg_green_100_text_green_800}>↑ 12% vs last month</Badge></CardContent></Card>
                        <Card><CardHeader className={styles.pb_2}><CardTitle className={styles.text_sm}>Food Cost</CardTitle></CardHeader><CardContent><div className={styles.text_2xl_font_bold}>{formatCurrency(stats.foodCost)}</div><div className={styles.text_xs_text_gray_500}>49% of revenue</div></CardContent></Card>
                        <Card><CardHeader className={styles.pb_2}><CardTitle className={styles.text_sm}>Labour Cost</CardTitle></CardHeader><CardContent><div className={styles.text_2xl_font_bold}>{formatCurrency(stats.labour)}</div><Badge className={styles.bg_green_100_text_green_800}>↓ 3% vs last month</Badge></CardContent></Card>
                        <Card><CardHeader className={styles.pb_2}><CardTitle className={styles.text_sm}>Utilities</CardTitle></CardHeader><CardContent><div className={styles.text_2xl_font_bold}>{formatCurrency(stats.utilities)}</div><Badge className={styles.bg_red_100_text_red_800}>↑ 8% – peak summer</Badge></CardContent></Card>
                    </div>

                    {/* Recent Expenses Table */}
                    <Card>
                        <CardHeader><CardTitle>Recent Expenses</CardTitle></CardHeader>
                        <CardContent className={styles.overflow_x_auto}>
                            <Table>
                                <TableHeader>
                                    <TableRow><TableHead>Date</TableHead><TableHead>Description</TableHead><TableHead>Category</TableHead><TableHead>Vendor</TableHead><TableHead>Tax</TableHead><TableHead>Amount</TableHead><TableHead>Status</TableHead></TableRow>
                                </TableHeader>
                                <TableBody>
                                    {expenses.slice(0, 10).map(exp => (
                                        <TableRow key={exp.id}>
                                            <TableCell>{new Date(exp.date).toLocaleDateString()}</TableCell>
                                            <TableCell><div className={styles.font_medium}>{exp.description}</div><div className={styles.text_xs_text_gray_400}>INV-{exp.id}</div></TableCell>
                                            <TableCell><Badge variant="outline">{exp.category}</Badge></TableCell>
                                            <TableCell>{exp.vendor || '—'}</TableCell>
                                            <TableCell>{exp.tax || '—'}</TableCell>
                                            <TableCell className={styles.text_red_600}>{formatCurrency(exp.amount)}</TableCell>
                                            <TableCell><Badge className={exp.status === 'Approved' ? 'bg-green-100' : exp.status === 'Pending' ? 'bg-yellow-100' : 'bg-gray-100'}>{exp.status}</Badge></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {/* Bottom Grid: P&L, Approvals, Recurring, Budget vs Actual */}
                    <div className={styles.grid_grid_cols_1_lg_grid_cols_2_gap_6}>
                        {/* P&L Snapshot */}
                        <Card><CardHeader><CardTitle>P&L Snapshot</CardTitle></CardHeader><CardContent className={styles.space_y_2}>
                            <div className={styles.flex_justify_between}><span>Revenue</span><span className={styles.text_green_600}>+PKR 16.8M</span></div>
                            <div className={styles.flex_justify_between}><span>Food Cost</span><span className={styles.text_red_600}>-{formatCurrency(stats.foodCost)}</span></div>
                            <div className={styles.flex_justify_between}><span>Labour</span><span className={styles.text_red_600}>-{formatCurrency(stats.labour)}</span></div>
                            <div className={styles.flex_justify_between}><span>Rent</span><span className={styles.text_red_600}>-PKR 650,000</span></div>
                            <div className={styles.flex_justify_between}><span>Utilities</span><span className={styles.text_red_600}>-{formatCurrency(stats.utilities)}</span></div>
                            <div className={styles.flex_justify_between}><span>Other Costs</span><span className={styles.text_red_600}>-PKR 870,000</span></div>
                            <div className={styles.border_t_pt_2_font_bold_flex_justify_between}><span>Net Profit</span><span className={styles.text_green_600}>{formatCurrency(stats.total * 0.1)}</span></div>
                        </CardContent></Card>

                        {/* Approval Queue */}
                        <Card><CardHeader><CardTitle>Approval Queue</CardTitle></CardHeader><CardContent className={styles.space_y_3}>
                            {approvals.map(ap => (
                                <div key={ap.id} className={styles.border_b_pb_2_flex_justify_between_items_center}>
                                    <div><div className={styles.font_semibold}>{ap.expense.description}</div><div className={styles.text_xs_text_gray_500}>{ap.expense.category} · {new Date(ap.expense.date).toLocaleDateString()}</div><div className={styles.font_mono}>{formatCurrency(ap.expense.amount)}</div></div>
                                    <div className={styles.flex_gap_2}>
                                        <Button size="sm" variant="ghost" className={styles.text_green_600} onClick={() => approveExpense(ap.id)}><CheckCircle size={16} /></Button>
                                        <Button size="sm" variant="ghost" className={styles.text_red_600}><XCircle size={16} /></Button>
                                    </div>
                                </div>
                            ))}
                            {approvals.length === 0 && <div className={styles.text_gray_500}>No pending approvals</div>}
                        </CardContent></Card>

                        {/* Budget vs Actual */}
                        <Card><CardHeader><CardTitle>Budget vs Actual</CardTitle></CardHeader><CardContent className={styles.space_y_4}>
                            {budgetUtil.map(b => {
                                const percent = (b.spent / b.budget) * 100;
                                return (
                                    <div key={b.category}>
                                        <div className={styles.flex_justify_between_text_sm}><span>{b.category}</span><span>{formatCurrency(b.spent)} / {formatCurrency(b.budget)}</span></div>
                                        <Progress value={Math.min(100, percent)} className={styles.h_2} />
                                        <div className={`text-xs ${percent > 100 ? 'text-red-600' : 'text-green-600'}`}>{percent.toFixed(0)}% – {percent > 100 ? 'Over budget' : percent > 90 ? 'Near limit' : 'On track'}</div>
                                    </div>
                                );
                            })}
                        </CardContent></Card>

                        {/* Recurring Costs */}
                        <Card><CardHeader><CardTitle>Recurring Costs</CardTitle></CardHeader><CardContent className={styles.space_y_3}>
                            {recurring.map(r => (
                                <div key={r.id} className={styles.flex_justify_between_items_center_border_b_pb_2}>
                                    <div><div className={styles.font_semibold}>{r.category}</div><div className={styles.text_xs_text_gray_500}>{r.frequency} · Due {r.dayOfMonth ? `on day ${r.dayOfMonth}` : 'variable'}</div></div>
                                    <div className={styles.font_mono}>{formatCurrency(r.amount)}</div>
                                </div>
                            ))}
                        </CardContent></Card>
                    </div>
                </TabsContent>
            </Tabs>

            {/* Dialogs */}
            <Dialog open={showBudgetDialog} onOpenChange={setShowBudgetDialog}>
                <DialogContent><DialogHeader><DialogTitle>Add Budget</DialogTitle></DialogHeader>
                    <div className={styles.space_y_3}>
                        <Input placeholder="Category" value={newBudget.category} onChange={e => setNewBudget({ ...newBudget, category: e.target.value })} />
                        <Input placeholder="Amount" type="number" value={newBudget.amount} onChange={e => setNewBudget({ ...newBudget, amount: e.target.value })} />
                        <Input type="month" value={newBudget.month} onChange={e => setNewBudget({ ...newBudget, month: e.target.value })} />
                        <Button onClick={createBudget}>Save</Button>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={showRecurringDialog} onOpenChange={setShowRecurringDialog}>
                <DialogContent><DialogHeader><DialogTitle>Add Recurring Expense</DialogTitle></DialogHeader>
                    <div className={styles.space_y_3}>
                        <Input placeholder="Category" value={newRecurring.category} onChange={e => setNewRecurring({ ...newRecurring, category: e.target.value })} />
                        <Input placeholder="Amount" type="number" value={newRecurring.amount} onChange={e => setNewRecurring({ ...newRecurring, amount: e.target.value })} />
                        <Select
                            value={newRecurring.frequency}
                            onValueChange={(value) =>
                                setNewRecurring({ ...newRecurring, frequency: value })
                            }
                        >
                            <SelectTrigger className={styles.w_full_border_p_2_rounded}>
                                <SelectValue placeholder="Frequency" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="monthly">Monthly</SelectItem>
                                <SelectItem value="quarterly">Quarterly</SelectItem>
                                <SelectItem value="yearly">Yearly</SelectItem>
                            </SelectContent>
                        </Select>
                        <Input placeholder="Day of month (1-31)" type="number" value={newRecurring.dayOfMonth} onChange={e => setNewRecurring({ ...newRecurring, dayOfMonth: e.target.value })} />
                        <Button onClick={createRecurring}>Save</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}