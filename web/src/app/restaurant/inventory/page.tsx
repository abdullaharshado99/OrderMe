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
  TableRow,
} from '@/components/ui/table';
import styles from './inventory.module.css';

export default function InventoryPage() {
  const { user } = useAuth();
  const [warehouseItems, setWarehouseItems] = useState([]);
  const [kitchenItems, setKitchenItems] = useState([]);

  useEffect(() => {
    api
      .get('/inventory/restaurant/' + user?.restaurantId + '?type=warehouse')
      .then((res) => setWarehouseItems(res.data));

    api
      .get('/inventory/restaurant/' + user?.restaurantId + '?type=kitchen')
      .then((res) => setKitchenItems(res.data));
  }, [user]);

  const renderTable = (items: any[]) => (
    <div className={styles.tableWrapper}>
      <Table>
        <TableHeader>
          <TableRow className={styles.headerRow}>
            <TableHead className={styles.tableHead}>Item</TableHead>
            <TableHead className={styles.tableHead}>Unit</TableHead>
            <TableHead className={styles.tableHead}>Quantity</TableHead>
            <TableHead className={styles.tableHead}>Reorder Level</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item: any) => (
            <TableRow key={item.id} className={styles.tableRow}>
              <TableCell className={styles.itemCell}>{item.itemName}</TableCell>
              <TableCell>{item.unit}</TableCell>
              <TableCell className={styles.quantityCell}>{item.quantity}</TableCell>
              <TableCell>{item.reorderLevel}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Inventory</h1>

      <Card className={styles.card}>
        <CardHeader className={styles.cardHeader}>
          <CardTitle className={styles.cardTitle}>🏭 Warehouse Stock</CardTitle>
        </CardHeader>
        <CardContent className={styles.cardContent}>{renderTable(warehouseItems)}</CardContent>
      </Card>

      <Card className={styles.card}>
        <CardHeader className={styles.cardHeader}>
          <CardTitle className={styles.cardTitle}>🍳 Kitchen Stock</CardTitle>
        </CardHeader>
        <CardContent className={styles.cardContent}>{renderTable(kitchenItems)}</CardContent>
      </Card>
    </div>
  );
}
