'use client';

import { useEffect, useState } from 'react';
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
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Pencil, Trash2, Plus } from 'lucide-react';
import styles from './management.module.css';

type TableItem = {
  id: number;
  tableNumber: number;
  status: 'free' | 'occupied' | 'reserved';
};

type Waiter = {
  id: number;
  name: string;
  phone: string;
  isActive: boolean;
};

export default function ManagementPage() {
  const { user } = useAuth();
  const [tables, setTables] = useState<TableItem[]>([]);
  const [waiters, setWaiters] = useState<Waiter[]>([]);
  const [tableDialog, setTableDialog] = useState({ open: false, editing: null as TableItem | null });
  const [tableForm, setTableForm] = useState({ tableNumber: '', status: 'free' });
  const [waiterDialog, setWaiterDialog] = useState({ open: false, editing: null as Waiter | null });
  const [waiterForm, setWaiterForm] = useState({ name: '', phone: '', isActive: true });

  const fetchTables = async () => {
    if (!user?.restaurantId) return;
    const { data } = await api.get(`/tables/restaurant/${user.restaurantId}`);
    setTables(data);
  };

  const fetchWaiters = async () => {
    if (!user?.restaurantId) return;
    const { data } = await api.get(`/waiters/restaurant/${user.restaurantId}`);
    setWaiters(data);
  };

  useEffect(() => {
    fetchTables();
    fetchWaiters();
  }, [user]);

  const handleTableSubmit = async () => {
    if (tableDialog.editing) {
      await api.patch(`/tables/${tableDialog.editing.id}`, {
        tableNumber: parseInt(tableForm.tableNumber),
        status: tableForm.status,
      });
    } else {
      await api.post('/tables', {
        tableNumber: parseInt(tableForm.tableNumber),
        status: tableForm.status,
      });
    }
    setTableDialog({ open: false, editing: null });
    setTableForm({ tableNumber: '', status: 'free' });
    fetchTables();
  };

  const deleteTable = async (id: number) => {
    if (confirm('Delete this table?')) await api.delete(`/tables/${id}`);
    fetchTables();
  };

  const handleWaiterSubmit = async () => {
    if (waiterDialog.editing) {
      await api.patch(`/waiters/${waiterDialog.editing.id}`, waiterForm);
    } else {
      await api.post('/waiters', waiterForm);
    }
    setWaiterDialog({ open: false, editing: null });
    setWaiterForm({ name: '', phone: '', isActive: true });
    fetchWaiters();
  };

  const deleteWaiter = async (id: number) => {
    if (confirm('Delete this waiter?')) await api.delete(`/waiters/${id}`);
    fetchWaiters();
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Restaurant Management</h1>

      <Card>
        <CardHeader className={styles.sectionHeader}>
          <CardTitle>Tables</CardTitle>
          <Button onClick={() => setTableDialog({ open: true, editing: null })}>
            <Plus size={16} /> Add Table
          </Button>
        </CardHeader>
        <CardContent>
          <div className={styles.tableWrapper}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Table #</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tables.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell>{t.tableNumber}</TableCell>
                    <TableCell className={styles.statusCell}>{t.status}</TableCell>
                    <TableCell className={styles.actionsCell}>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setTableDialog({ open: true, editing: t });
                          setTableForm({ tableNumber: String(t.tableNumber), status: t.status });
                        }}
                      >
                        <Pencil size={14} />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteTable(t.id)}>
                        <Trash2 size={14} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className={styles.sectionHeader}>
          <CardTitle>Waiters</CardTitle>
          <Button onClick={() => setWaiterDialog({ open: true, editing: null })}>
            <Plus size={16} /> Add Waiter
          </Button>
        </CardHeader>
        <CardContent>
          <div className={styles.tableWrapper}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {waiters.map((w) => (
                  <TableRow key={w.id}>
                    <TableCell>{w.name}</TableCell>
                    <TableCell>{w.phone}</TableCell>
                    <TableCell>{w.isActive ? 'Active' : 'Inactive'}</TableCell>
                    <TableCell className={styles.actionsCell}>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setWaiterDialog({ open: true, editing: w });
                          setWaiterForm({ name: w.name, phone: w.phone, isActive: w.isActive });
                        }}
                      >
                        <Pencil size={14} />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteWaiter(w.id)}>
                        <Trash2 size={14} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={tableDialog.open}
        onOpenChange={(open) => !open && setTableDialog({ open: false, editing: null })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{tableDialog.editing ? 'Edit Table' : 'Add Table'}</DialogTitle>
          </DialogHeader>
          <div className={styles.dialogForm}>
            <Label>Table Number</Label>
            <Input
              type="number"
              value={tableForm.tableNumber}
              onChange={(e) => setTableForm({ ...tableForm, tableNumber: e.target.value })}
            />
            <Label>Status</Label>
            <Select
              value={tableForm.status}
              onValueChange={(v) => setTableForm({ ...tableForm, status: v as any })}
            >
              <SelectTrigger className={styles.selectTrigger}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="occupied">Occupied</SelectItem>
                <SelectItem value="reserved">Reserved</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleTableSubmit}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={waiterDialog.open}
        onOpenChange={(open) => !open && setWaiterDialog({ open: false, editing: null })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{waiterDialog.editing ? 'Edit Waiter' : 'Add Waiter'}</DialogTitle>
          </DialogHeader>
          <div className={styles.dialogForm}>
            <Label>Name</Label>
            <Input
              value={waiterForm.name}
              onChange={(e) => setWaiterForm({ ...waiterForm, name: e.target.value })}
            />
            <Label>Phone</Label>
            <Input
              value={waiterForm.phone}
              onChange={(e) => setWaiterForm({ ...waiterForm, phone: e.target.value })}
            />
            <Label className={styles.checkboxRow}>
              <Input
                type="checkbox"
                checked={waiterForm.isActive}
                onChange={(e) => setWaiterForm({ ...waiterForm, isActive: e.target.checked })}
                className={styles.checkbox}
              />
              Active
            </Label>
            <Button onClick={handleWaiterSubmit}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
