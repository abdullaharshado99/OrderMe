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
        <div className="p-6 min-h-screen bg-gray-50 text-gray-900" style={{ fontFamily: 'var(--font-quicksand)' }}>

            <h1 className="text-2xl font-bold mb-6 text-[var(--raspberry)]">
                All Restaurant Subscriptions
            </h1>

            <div className="space-y-4">
                {subs.map((sub: any) => (
                    <Card
                        key={sub.id}
                        className="bg-white border border-gray-200 hover:border-[var(--brilliant-rose)] transition"
                    >
                        <CardHeader>
                            <CardTitle className="text-[var(--brilliant-rose)]">
                                {sub.restaurant?.name || 'Restaurant'}
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="text-gray-700 space-y-1">
                            <p><span className="font-semibold">Plan:</span> {sub.plan}</p>
                            <p><span className="font-semibold">Price:</span> ${sub.price}</p>
                            <p><span className="font-semibold">Start:</span> {new Date(sub.startDate).toLocaleDateString()}</p>
                            <p><span className="font-semibold">End:</span> {new Date(sub.endDate).toLocaleDateString()}</p>

                            <p>
                                <span className="font-semibold">Status:</span>{' '}
                                <span className={sub.isActive ? 'text-green-600' : 'text-red-500'}>
                                    {sub.isActive ? 'Active' : 'Expired'}
                                </span>
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}