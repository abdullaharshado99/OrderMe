'use client';

import api from '@/lib/axios';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import styles from './restaurants.module.css';

export default function RestaurantsPage() {
    const [restaurants, setRestaurants] = useState<any[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingRestaurantId, setEditingRestaurantId] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        phone: '',
        email: '',
        subscriptionPlan: 'basic',
        isActive: true,
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchRestaurants();
    }, []);

    const fetchRestaurants = async () => {
        try {
            const { data } = await api.get('/restaurants');
            setRestaurants(data);
        } catch (err) {
            console.error(err);
        }
    };

    const openCreateForm = () => {
        setEditingRestaurantId(null);
        setFormData({
            name: '',
            address: '',
            phone: '',
            email: '',
            subscriptionPlan: 'basic',
            isActive: true,
        });
        setShowForm(true);
    };

    const openEditForm = (restaurant: any) => {
        setEditingRestaurantId(restaurant.id);
        setFormData({
            name: restaurant.name ?? '',
            address: restaurant.address ?? '',
            phone: restaurant.phone ?? '',
            email: restaurant.email ?? '',
            subscriptionPlan: restaurant.subscriptionPlan ?? 'basic',
            isActive: restaurant.isActive ?? true,
        });
        setShowForm(true);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            if (editingRestaurantId) {
                await api.patch(`/restaurants/${editingRestaurantId}`, formData);
                toast({
                    title: 'Restaurant updated',
                    description: `${formData.name} changes have been saved`,
                    variant: 'success',
                });
            } else {
                await api.post('/restaurants', formData);
                toast({
                    title: 'Restaurant created',
                    description: `${formData.name} was added successfully`,
                    variant: 'success',
                });
            }
            setShowForm(false);
            setEditingRestaurantId(null);
            setFormData({
                name: '',
                address: '',
                phone: '',
                email: '',
                subscriptionPlan: 'basic',
                isActive: true,
            });
            await fetchRestaurants();
        } catch (err) {
            console.error(err);
            const msg = (err as any)?.response?.data?.message || 'Failed to save restaurant';
            toast({ title: 'Save failed', description: msg, variant: 'destructive' });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1 className={styles.title}>Restaurants</h1>
                <Button onClick={openCreateForm} className={styles.primaryButton}>
                    + Add Restaurant
                </Button>
            </div>

            {showForm && (
                <Card className={styles.formCard}>
                    <CardHeader>
                        <CardTitle className={styles.formTitle}>
                            {editingRestaurantId ? 'Edit Restaurant' : 'Create New Restaurant'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className={styles.formContent}>
                        <form onSubmit={handleSubmit} className={styles.form}>
                            <Input
                                className={styles.input}
                                type="text"
                                placeholder="Restaurant Name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                            <Input
                                className={styles.input}
                                type="text"
                                placeholder="Address"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            />
                            <Input
                                className={styles.input}
                                type="text"
                                placeholder="Phone"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                            <Input
                                className={styles.input}
                                type="email"
                                placeholder="Owner Email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />

                            <div>
                                <Label className={styles.fieldLabel}>Subscription Plan</Label>
                                <Select
                                    value={formData.subscriptionPlan}
                                    onValueChange={(value) =>
                                        setFormData({ ...formData, subscriptionPlan: value })
                                    }
                                >
                                    <SelectTrigger className={styles.selectTrigger}>
                                        <SelectValue placeholder="Select plan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Basic">Basic (per month)</SelectItem>
                                        <SelectItem value="Pro">Pro (per month)</SelectItem>
                                        <SelectItem value="Enterprise">Enterprise (per month)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {editingRestaurantId && (
                                <Label className={styles.checkboxRow}>
                                    <Input
                                        type="checkbox"
                                        checked={formData.isActive}
                                        onChange={(e) =>
                                            setFormData({ ...formData, isActive: e.target.checked })
                                        }
                                        className={styles.checkbox}
                                    />
                                    Active restaurant
                                </Label>
                            )}

                            <div className={styles.actions}>
                                <Button
                                    type="submit"
                                    className={styles.primaryButton}
                                    disabled={submitting}
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 className={styles.spinner} aria-hidden />
                                            Saving...
                                        </>
                                    ) : (
                                        'Save'
                                    )}
                                </Button>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => {
                                        setShowForm(false);
                                        setEditingRestaurantId(null);
                                    }}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            <div className={styles.grid}>
                {restaurants.map((rest: any) => (
                    <Card key={rest.id} className={styles.restaurantCard}>
                        <CardHeader>
                            <CardTitle className={styles.restaurantTitle}>{rest.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>{rest.address}</p>
                            <p>{rest.phone}</p>
                            <p>{rest.email}</p>
                            <p className={styles.meta}>Plan: {rest.subscriptionPlan || 'basic'}</p>
                            <p className={styles.meta}>Active: {rest.isActive ? 'Yes' : 'No'}</p>
                            <div className={styles.cardFooter}>
                                <Button
                                    type="button"
                                    variant="link"
                                    className={styles.editButton}
                                    onClick={() => openEditForm(rest)}
                                >
                                    Edit
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
