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
                .catch(() => { });
            api.get<PlanCard[]>('/subscriptions/plans').then((res) => setPlans(res.data ?? []));
        }
    }, [user]);

    return (
        <div className="p-6 min-h-screen bg-gray-50 text-gray-900" style={{ fontFamily: 'var(--font-quicksand)' }}>

            {/* Title */}
            <h1 className="text-2xl font-bold mb-6 text-[var(--raspberry)]">
                My Subscription
            </h1>

            {/* Current Plan */}
            {subscription && (
                <Card className="mb-6 bg-white border border-gray-200">
                    <CardHeader>
                        <CardTitle className="text-[var(--brilliant-rose)]">
                            Current Plan: {subscription.plan ?? '—'}
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="text-gray-700">
                        <p>
                            Valid until:{' '}
                            {subscription.endDate != null
                                ? new Date(subscription.endDate).toLocaleDateString()
                                : '—'}
                        </p>

                        <p className="mt-1 text-[var(--raspberry)] font-semibold">
                            Price: ${subscription.price ?? '—'}
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Plans */}
            <h2 className="text-xl font-bold mb-4 text-[var(--brilliant-rose)]">
                Available Plans
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map(plan => (
                    <Card
                        key={plan.id}
                        className="bg-white border border-gray-200 hover:border-[var(--brilliant-rose)] transition"
                    >
                        <CardHeader>
                            <CardTitle className="text-[var(--brilliant-rose)]">
                                {plan.name}
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="text-gray-700">
                            <p className="text-2xl font-bold text-[var(--raspberry)]">
                                ${plan.price}/month
                            </p>

                            <p className="mt-2 text-sm">
                                {plan.features}
                            </p>

                            <button className="mt-4 bg-[var(--raspberry)] hover:bg-[var(--brilliant-rose)] text-white px-4 py-2 rounded w-full transition">
                                Upgrade
                            </button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}