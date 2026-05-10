'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function OwnerSubscription() {
    const { user } = useAuth();
    const [subscription, setSubscription] = useState<any>(null);
    const [plans, setPlans] = useState([]);
    const [upgrading, setUpgrading] = useState(false);

    useEffect(() => {
        if (user?.restaurantId) {
            api.get(`/subscriptions/current/${user.restaurantId}`).then(res => setSubscription(res.data)).catch(() => { });
            api.get('/subscriptions/plans').then(res => setPlans(res.data));
        }
    }, [user]);

    const handleUpgrade = async (planName: any) => {
        if (!confirm(`Upgrade to ${planName}?`)) return;
        setUpgrading(true);
        try {
            await api.post(`/subscriptions/upgrade/${user?.restaurantId}`, { plan: planName });
            alert('Subscription upgraded!');
            // refresh
            const { data } = await api.get(`/subscriptions/current/${user?.restaurantId}`);
            setSubscription(data);
        } catch (err) {
            alert('Upgrade failed');
        }
        setUpgrading(false);
    };

    return (
        <div className="p-6 min-h-screen bg-gray-50 text-gray-900" style={{ fontFamily: 'var(--font-quicksand)' }}>
            <h1 className="text-2xl font-bold mb-6 text-[var(--raspberry)]">My Subscription</h1>
            {subscription && (
                <Card className="mb-6 bg-white border border-gray-200">
                    <CardHeader><CardTitle className="text-[var(--brilliant-rose)]">Current Plan: {subscription.plan}</CardTitle></CardHeader>
                    <CardContent className="text-gray-700">
                        <p>Valid until: {new Date(subscription.endDate).toLocaleDateString()}</p>
                        <p className="mt-1 text-[var(--raspberry)] font-semibold">Price: ${subscription.price}</p>
                    </CardContent>
                </Card>
            )}
            <h2 className="text-xl font-bold mb-4 text-[var(--brilliant-rose)]">Available Plans</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan: any) => (
                    <Card key={plan.id} className="bg-white border border-gray-200 hover:border-[var(--brilliant-rose)] transition">
                        <CardHeader><CardTitle className="text-[var(--brilliant-rose)]">{plan.name}</CardTitle></CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold text-[var(--raspberry)]">${plan.price}/month</p>
                            <p className="mt-2 text-sm">{plan.features}</p>
                            <button
                                onClick={() => handleUpgrade(plan.name)}
                                disabled={upgrading || subscription?.plan === plan.name}
                                className={`mt-4 px-4 py-2 rounded w-full transition ${subscription?.plan === plan.name ? 'bg-gray-300 cursor-not-allowed' : 'bg-[var(--raspberry)] hover:bg-[var(--brilliant-rose)] text-white'}`}
                            >
                                {subscription?.plan === plan.name ? 'Active' : 'Upgrade'}
                            </button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}