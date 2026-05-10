'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function InventoryPage() {
    const { user } = useAuth();
    const [warehouseItems, setWarehouseItems] = useState([]);
    const [kitchenItems, setKitchenItems] = useState([]);

    useEffect(() => {
        api.get('/inventory/restaurant/' + user?.restaurantId + '?type=warehouse').then(res => setWarehouseItems(res.data));
        api.get('/inventory/restaurant/' + user?.restaurantId + '?type=kitchen').then(res => setKitchenItems(res.data));
    }, [user]);

    return (
        <div className="p-6 space-y-8">
            <h1 className="text-2xl font-bold">Inventory</h1>
            <Card>
                <CardHeader><CardTitle>🏭 Warehouse Stock</CardTitle></CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader><TableRow><TableHead>Item</TableHead><TableHead>Unit</TableHead><TableHead>Quantity</TableHead><TableHead>Reorder Level</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {warehouseItems.map((item: any) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.itemName}</TableCell>
                                    <TableCell>{item.unit}</TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell>{item.reorderLevel}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <Card>
                <CardHeader><CardTitle>🍳 Kitchen Stock</CardTitle></CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader><TableRow><TableHead>Item</TableHead><TableHead>Unit</TableHead><TableHead>Quantity</TableHead><TableHead>Reorder Level</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {kitchenItems.map((item: any) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.itemName}</TableCell>
                                    <TableCell>{item.unit}</TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell>{item.reorderLevel}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}