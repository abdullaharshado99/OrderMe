'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function AdminExpensesPage() {
    const [expenses, setExpenses] = useState([]);
    const [budgets, setBudgets] = useState([]);
    const [recurring, setRecurring] = useState([]);
    const [newBudget, setNewBudget] = useState({ category: '', amount: '', month: '' });

    useEffect(() => {
        api.get('/expenses/restaurant/all').then(res => setExpenses(res.data));
        api.get('/expenses/budgets').then(res => setBudgets(res.data));
        api.get('/expenses/recurring').then(res => setRecurring(res.data));
    }, []);

    const createBudget = async () => {
        await api.post('/expenses/budgets', newBudget);
        const { data } = await api.get('/expenses/budgets');
        setBudgets(data);
        setNewBudget({ category: '', amount: '', month: '' });
    };

    return (
        <div className="p-6 space-y-8">
            <h1 className="text-2xl font-bold">Expense Management</h1>
            <div className="grid grid-cols-3 gap-4">
                <Card><CardHeader><CardTitle>Total Expenses</CardTitle></CardHeader><CardContent>PKR 8.4M</CardContent></Card>
                <Card><CardHeader><CardTitle>Food Cost</CardTitle></CardHeader><CardContent>PKR 4.1M</CardContent></Card>
                <Card><CardHeader><CardTitle>Labour Cost</CardTitle></CardHeader><CardContent>PKR 2.3M</CardContent></Card>
            </div>
            <Card>
                <CardHeader><CardTitle>Budgets</CardTitle></CardHeader>
                <CardContent>
                    <div className="flex gap-2 mb-4">
                        <Input placeholder="Category" value={newBudget.category} onChange={e => setNewBudget({ ...newBudget, category: e.target.value })} />
                        <Input placeholder="Amount" type="number" value={newBudget.amount} onChange={e => setNewBudget({ ...newBudget, amount: e.target.value })} />
                        <Input type="month" value={newBudget.month} onChange={e => setNewBudget({ ...newBudget, month: e.target.value })} />
                        <Button onClick={createBudget}>Add Budget</Button>
                    </div>
                    <Table>
                        <TableHeader><TableRow><TableHead>Category</TableHead><TableHead>Month</TableHead><TableHead>Amount</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {budgets.map((b: any) => (
                                <TableRow key={b.id}><TableCell>{b.category}</TableCell><TableCell>{new Date(b.month).toLocaleDateString()}</TableCell><TableCell>PKR {b.amount}</TableCell></TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <Card>
                <CardHeader><CardTitle>Recurring Expenses</CardTitle></CardHeader>
                <CardContent>
                    <Table><TableHeader><TableRow><TableHead>Category</TableHead><TableHead>Amount</TableHead><TableHead>Frequency</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {recurring.map((r: any) => <TableRow key={r.id}><TableCell>{r.category}</TableCell><TableCell>PKR {r.amount}</TableCell><TableCell>{r.frequency}</TableCell></TableRow>)}
                        </TableBody></Table>
                </CardContent>
            </Card>
        </div>
    );
}