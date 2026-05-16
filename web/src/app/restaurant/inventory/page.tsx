'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';

export default function InventoryPage() {
    const { user } = useAuth();
    const [warehouseItems, setWarehouseItems] = useState([]);
    const [kitchenItems, setKitchenItems] = useState([]);

    useEffect(() => {
        api
            .get('/inventory/restaurant/' + user?.restaurantId + '?type=warehouse')
            .then(res => setWarehouseItems(res.data));

        api
            .get('/inventory/restaurant/' + user?.restaurantId + '?type=kitchen')
            .then(res => setKitchenItems(res.data));
    }, [user]);

    return (
        <div className="p-6 space-y-8 min-h-screen bg-gray-50 text-gray-900">

            {/* Page Title */}
            <h1 className="text-2xl font-bold text-[var(--raspberry)]">
                Inventory
            </h1>

            {/* Warehouse */}
            <Card className="bg-white border border-gray-200">

                <CardHeader className="border-b border-gray-200">
                    <CardTitle className="text-[var(--brilliant-rose)]">
                        🏭 Warehouse Stock
                    </CardTitle>
                </CardHeader>

                <CardContent className="pt-4">

                    <Table>

                        <TableHeader>
                            <TableRow className="hover:bg-transparent">

                                <TableHead className="text-[var(--raspberry)] font-semibold">
                                    Item
                                </TableHead>

                                <TableHead className="text-[var(--raspberry)] font-semibold">
                                    Unit
                                </TableHead>

                                <TableHead className="text-[var(--raspberry)] font-semibold">
                                    Quantity
                                </TableHead>

                                <TableHead className="text-[var(--raspberry)] font-semibold">
                                    Reorder Level
                                </TableHead>

                            </TableRow>
                        </TableHeader>

                        <TableBody>

                            {warehouseItems.map((item: any) => (

                                <TableRow
                                    key={item.id}
                                    className="hover:bg-pink-50 transition"
                                >

                                    <TableCell className="font-medium">
                                        {item.itemName}
                                    </TableCell>

                                    <TableCell>{item.unit}</TableCell>

                                    <TableCell className="text-[var(--raspberry)] font-semibold">
                                        {item.quantity}
                                    </TableCell>

                                    <TableCell>
                                        {item.reorderLevel}
                                    </TableCell>

                                </TableRow>
                            ))}

                        </TableBody>

                    </Table>

                </CardContent>
            </Card>

            {/* Kitchen */}
            <Card className="bg-white border border-gray-200">

                <CardHeader className="border-b border-gray-200">
                    <CardTitle className="text-[var(--brilliant-rose)]">
                        🍳 Kitchen Stock
                    </CardTitle>
                </CardHeader>

                <CardContent className="pt-4">

                    <Table>

                        <TableHeader>
                            <TableRow className="hover:bg-transparent">

                                <TableHead className="text-[var(--raspberry)] font-semibold">
                                    Item
                                </TableHead>

                                <TableHead className="text-[var(--raspberry)] font-semibold">
                                    Unit
                                </TableHead>

                                <TableHead className="text-[var(--raspberry)] font-semibold">
                                    Quantity
                                </TableHead>

                                <TableHead className="text-[var(--raspberry)] font-semibold">
                                    Reorder Level
                                </TableHead>

                            </TableRow>
                        </TableHeader>

                        <TableBody>

                            {kitchenItems.map((item: any) => (

                                <TableRow
                                    key={item.id}
                                    className="hover:bg-pink-50 transition"
                                >

                                    <TableCell className="font-medium">
                                        {item.itemName}
                                    </TableCell>

                                    <TableCell>{item.unit}</TableCell>

                                    <TableCell className="text-[var(--raspberry)] font-semibold">
                                        {item.quantity}
                                    </TableCell>

                                    <TableCell>
                                        {item.reorderLevel}
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