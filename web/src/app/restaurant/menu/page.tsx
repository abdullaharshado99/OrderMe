'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Pencil, Trash2 } from 'lucide-react';
import styles from './menu.module.css';

type MenuItem = {
  id: number;
  name: string;
  price: number;
  cuisine: string | null;
  foodCategory: string | null;
  description: string | null;
  isAvailable: boolean;
};

type Grouped = Record<string, Record<string, MenuItem[]>>;

export default function MenuPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    cuisine: '',
    foodCategory: '',
    description: '',
    isAvailable: true,
  });
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; itemId: number | null }>({
    open: false,
    itemId: null,
  });

  const fetchMenu = async () => {
    if (!user?.restaurantId) return;
    try {
      const { data } = await api.get<MenuItem[]>(`/menus/restaurant/${user.restaurantId}`);
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.restaurantId) fetchMenu();
  }, [user]);

  const uniqueCuisines = [...new Set(items.map((i) => i.cuisine?.trim()).filter(Boolean))] as string[];
  const grouped: Grouped = items.reduce((acc, item) => {
    const cuisine = item.cuisine?.trim() || 'Uncategorized';
    const rawFoodCat = item.foodCategory?.trim() || 'General';
    const foodCatKey = rawFoodCat.toLowerCase();
    if (!acc[cuisine]) acc[cuisine] = {};
    if (!acc[cuisine][foodCatKey]) acc[cuisine][foodCatKey] = [];
    acc[cuisine][foodCatKey].push(item);
    return acc;
  }, {} as Grouped);

  const displayGroups = Object.entries(grouped).map(([cuisine, catMap]) => {
    const categories = Object.entries(catMap).map(([key, itemsList]) => {
      const displayName = itemsList[0]?.foodCategory?.trim() || key;
      return { displayName, items: itemsList };
    });
    return { cuisine, categories };
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.cuisine.trim()) {
      alert('Cuisine is required');
      return;
    }
    if (!formData.foodCategory.trim()) {
      alert('Food Category is required');
      return;
    }
    if (!formData.name.trim() || !formData.price) {
      alert('Name and price are required');
      return;
    }
    try {
      const payload = {
        name: formData.name.trim(),
        price: parseFloat(formData.price),
        cuisine: formData.cuisine.trim(),
        foodCategory: formData.foodCategory.trim(),
        description: formData.description,
        isAvailable: formData.isAvailable,
      };
      if (editingId) {
        await api.patch(`/menus/${editingId}`, payload);
      } else {
        await api.post(`/menus/restaurant/${user?.restaurantId}`, payload);
      }
      resetForm();
      fetchMenu();
    } catch {
      alert('Failed to save menu item');
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: '',
      price: '',
      cuisine: '',
      foodCategory: '',
      description: '',
      isAvailable: true,
    });
  };

  const handleEdit = (item: MenuItem) => {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      price: item.price.toString(),
      cuisine: item.cuisine || '',
      foodCategory: item.foodCategory || '',
      description: item.description || '',
      isAvailable: item.isAvailable,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const confirmDelete = (id: number) => {
    setDeleteModal({ open: true, itemId: id });
  };

  const handleDelete = async () => {
    if (deleteModal.itemId === null) return;
    await api.delete(`/menus/${deleteModal.itemId}`);
    fetchMenu();
    if (editingId === deleteModal.itemId) resetForm();
    setDeleteModal({ open: false, itemId: null });
  };

  if (loading) return <div className={styles.loading}>Loading menu...</div>;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Menu Items</h1>
      <Card className={styles.formCard}>
        <CardHeader>
          <CardTitle className={styles.formTitle}>
            {editingId ? 'Edit Menu Item' : 'Add New Item'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGrid}>
              <div>
                <Label>Cuisine</Label>
                <Input
                  list="cuisine-list"
                  value={formData.cuisine}
                  onChange={(e) => setFormData({ ...formData, cuisine: e.target.value })}
                  placeholder="e.g., Pakistani, Italian, Japanese"
                  required
                />
                <datalist id="cuisine-list">
                  {uniqueCuisines.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>
              <div>
                <Label>Food Category</Label>
                <Input
                  value={formData.foodCategory}
                  onChange={(e) => setFormData({ ...formData, foodCategory: e.target.value })}
                  placeholder="e.g., Karahi, Pizza, Biryani"
                  required
                />
              </div>
              <div>
                <Label>Item Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Chicken Karahi, Margherita Pizza"
                  required
                />
              </div>
              <div>
                <Label>Price (PKR)</Label>
                <Input
                  type="number"
                  step="1"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="e.g., 1200"
                  required
                />
              </div>
            </div>
            <div>
              <Label>Description (optional)</Label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Any details about the dish"
              />
            </div>
            <div className={styles.checkboxRow}>
              <Input
                type="checkbox"
                id="available"
                checked={formData.isAvailable}
                onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                className={styles.checkbox}
              />
              <Label htmlFor="available">Available</Label>
            </div>
            <div className={styles.formActions}>
              <Button type="submit" className={styles.primaryButton}>
                {editingId ? 'Update Item' : 'Add Item'}
              </Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel Edit
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <div className={styles.menuGrid}>
        {displayGroups.map(({ cuisine, categories }) => (
          <Card key={cuisine} className={styles.cuisineCard}>
            <div className={styles.cuisineHeader}>
              <h2 className={styles.cuisineTitle}>{cuisine} Cuisine</h2>
            </div>
            <div className={styles.cuisineBody}>
              {categories.map(({ displayName, items: catItems }) => (
                <div key={displayName}>
                  <h3 className={styles.categoryTitle}>{displayName}</h3>
                  <div className={styles.itemsGrid}>
                    {catItems.map((item) => (
                      <Card
                        key={item.id}
                        className={`${styles.itemCard} ${!item.isAvailable ? styles.itemUnavailable : ''}`}
                      >
                        <CardHeader>
                          <CardTitle className={styles.itemTitle}>{item.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className={styles.itemPrice}>PKR {item.price}</p>
                          {item.description && (
                            <p className={styles.itemDescription}>{item.description}</p>
                          )}
                          <div className={styles.itemActions}>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              className={styles.editButton}
                              onClick={() => handleEdit(item)}
                            >
                              <Pencil size={16} />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              className={styles.deleteButton}
                              onClick={() => confirmDelete(item.id)}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <Dialog
        open={deleteModal.open}
        onOpenChange={(open) => !open && setDeleteModal({ open: false, itemId: null })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to permanently delete this menu item? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteModal({ open: false, itemId: null })}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {items.length === 0 && (
        <div className={styles.emptyState}>No menu items yet. Use the form above to add items.</div>
      )}
    </div>
  );
}
