'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import styles from './list.module.css';

export default function AdminUsersList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get('/users').then((res) => setUsers(res.data));
  }, []);

  const filteredUsers = users.filter((u: any) => u.role?.name === 'RESTAURANT_OWNER');

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-[var(--raspberry)] mb-6">
        Create Owner or Create Chef
      </h1>

      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-pink-50 transition-colors">
                  <TableHead className="font-bold text-[var(--raspberry)] mb-6">ID</TableHead>
                  <TableHead className="font-bold text-[var(--raspberry)] mb-6">Name</TableHead>
                  <TableHead className="font-bold text-[var(--raspberry)] mb-6">Email</TableHead>
                  <TableHead className="font-bold text-[var(--raspberry)] mb-6">Role</TableHead>
                  <TableHead className="font-bold text-[var(--raspberry)] mb-6">Restaurant</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredUsers.map((u: any, index: number) => (
                  <TableRow
                    key={u.id}
                    className="hover:bg-pink-50 transition-colors"
                  >
                    <TableCell>{index + 1}</TableCell>

                    <TableCell className="font-medium">
                      {u.UserName || u.name || 'N/A'}
                    </TableCell>

                    <TableCell>{u.email}</TableCell>

                    <TableCell>
                      <span className="px-2 py-1 rounded-full text-xs bg-pink-100 text-[var(--raspberry)]">
                        {u.role?.name}
                      </span>
                    </TableCell>

                    <TableCell>{u.restaurantId}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredUsers.length === 0 && (
              <div className="py-8 text-center text-gray-500">
                No restaurant owners found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}