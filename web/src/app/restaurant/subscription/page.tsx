'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type CurrentSubscription = {
    plan?: string;
    endDate?: string | Date;
    price?: number;
};

type PlanCard = {
    id: number | string;
    name: string;
    price: number;
    features?: string;
};

export default function OwnerSubscription() {
    const { user } = useAuth();
    const [subscription, setSubscription] = useState<CurrentSubscription | null>(null);
    const [plans, setPlans] = useState<PlanCard[]>([]);

    useEffect(() => {
        if (user?.restaurantId) {
            api
                .get<CurrentSubscription | null>(`/subscriptions/current/${user.restaurantId}`)
                .then((res) => setSubscription(res.data ?? null))
                .catch(() => {});
            api.get<PlanCard[]>('/subscriptions/plans').then((res) => setPlans(res.data ?? []));
        }
    }, [user]);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">My Subscription</h1>
            {subscription && (
                <Card className="mb-6 bg-green-50">
                    <CardHeader>
                        <CardTitle>Current Plan: {subscription.plan ?? '—'}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>
                            Valid until:{' '}
                            {subscription.endDate != null
                                ? new Date(subscription.endDate).toLocaleDateString()
                                : '—'}
                        </p>
                        <p>Price: ${subscription.price ?? '—'}</p>
                    </CardContent>
                </Card>
            )}
            <h2 className="text-xl font-bold mb-4">Available Plans</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map(plan => (
                    <Card key={plan.id}>
                        <CardHeader><CardTitle>{plan.name}</CardTitle></CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">${plan.price}/month</p>
                            <p className="mt-2">{plan.features}</p>
                            <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded w-full">Upgrade</button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}