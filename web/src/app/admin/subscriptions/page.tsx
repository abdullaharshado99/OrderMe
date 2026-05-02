'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminSubscriptions() {
    const [subs, setSubs] = useState([]);

    useEffect(() => {
        api.get('/subscriptions/all').then(res => setSubs(res.data));
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">All Restaurant Subscriptions</h1>
            <div className="space-y-4">
                {subs.map((sub: any) => (
                    <Card key={sub.id}>
                        <CardHeader><CardTitle>{sub.restaurant?.name || 'Restaurant'}</CardTitle></CardHeader>
                        <CardContent>
                            <p>Plan: {sub.plan}</p>
                            <p>Price: ${sub.price}</p>
                            <p>Start: {new Date(sub.startDate).toLocaleDateString()}</p>
                            <p>End: {new Date(sub.endDate).toLocaleDateString()}</p>
                            <p>Status: {sub.isActive ? 'Active' : 'Expired'}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}