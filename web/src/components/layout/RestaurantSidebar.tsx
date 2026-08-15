'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import {
  LayoutDashboard,
  Utensils,
  ShoppingCart,
  Package,
  Users,
  LogOut,
  Settings,
  CreditCard,
  ChefHat,
  Store,
  Receipt,
  DollarSign,
  Box,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import styles from './sidebar.module.css';

const navItems = [
  { href: '/restaurant/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/restaurant/menu', label: 'Menu', icon: Utensils },
  { href: '/restaurant/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/restaurant/inventory', label: 'Inventory', icon: Package },
  { href: '/restaurant/kitchen-inventory', label: 'Kitchen Inv.', icon: ChefHat },
  { href: '/restaurant/pos', label: 'POS', icon: Store },
  { href: '/restaurant/kds', label: 'KDS', icon: Receipt },
  { href: '/restaurant/staff', label: 'Staff', icon: Users },
  { href: '/restaurant/management', label: 'Management', icon: Settings },
  { href: '/restaurant/warehouse', label: 'Warehouse', icon: Box },
  { href: '/restaurant/expenses', label: 'Expenses', icon: DollarSign },
  { href: '/restaurant/settings', label: 'Settings', icon: Settings },
  { href: '/restaurant/subscription', label: 'Subscription', icon: CreditCard },
];

export function RestaurantSidebar() {
  const { logout } = useAuth();
  const pathname = usePathname();

  return (
    <aside className={`${styles.sidebar} ${styles.sidebarRestaurant}`}>
      <div className={styles.header}>
        <span>Order Me</span>
      </div>

      <nav className={styles.nav}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.link} ${styles.linkRestaurant} ${isActive ? styles.linkActiveRestaurant : ''}`}
            >
              <item.icon
                size={20}
                className={isActive ? styles.iconActive : styles.iconMuted}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className={styles.footer}>
        <Button variant="ghost" className={styles.logoutButton} onClick={logout}>
          <LogOut size={20} />
          <span>Logout</span>
        </Button>
      </div>
    </aside>
  );
}
