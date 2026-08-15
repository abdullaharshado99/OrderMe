'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { LayoutDashboard, Users, Menu, ShoppingCart, LogOut, BarChart3, Utensils, Warehouse } from 'lucide-react';
import { Logo } from './Logo';
import styles from './sidebar.module.css';

const adminNav = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/restaurants', label: 'Restaurants', icon: Users },
    { href: '/admin/subscriptions', label: 'Subscriptions', icon: ShoppingCart },
];

const restaurantNav = [
    { href: '/restaurant/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/restaurant/menu', label: 'Menu', icon: Menu },
    { href: '/restaurant/orders', label: 'Orders', icon: ShoppingCart },
    { href: '/restaurant/staff', label: 'Staff', icon: Users },
    { href: '/restaurant/inventory', label: 'Inventory', icon: Warehouse },
    { href: '/restaurant/expenses', label: 'Expenses', icon: BarChart3 },
];

export function Sidebar() {
    const { user, logout } = useAuth();
    const pathname = usePathname();

    const navItems = user?.role === 'SUPER_ADMIN' ? adminNav : restaurantNav;
    const sidebarClass = user?.role === 'SUPER_ADMIN' ? styles.sidebarAdmin : styles.sidebarRestaurant;

    return (
        <aside className={`${styles.sidebar} ${sidebarClass}`}>
            <div className={styles.header}>
                <Logo size="sm" showText={true} variant={user?.role === 'SUPER_ADMIN' ? 'default' : 'default'} />
            </div>
            <nav className={styles.nav}>
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const linkClass = isActive
                        ? `${styles.link} ${styles.linkActive} ${user?.role === 'SUPER_ADMIN' ? styles.linkActiveAdmin : styles.linkActiveRestaurant}`
                        : `${styles.link} ${user?.role === 'SUPER_ADMIN' ? styles.linkAdmin : styles.linkRestaurant}`;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={linkClass}
                        >
                            <item.icon size={20} className={styles.icon} />
                            <span className={styles.label}>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
            <div className={styles.footer}>
                <button
                    onClick={logout}
                    className={`${styles.logoutButton} ${user?.role === 'SUPER_ADMIN' ? styles.logoutButtonAdmin : styles.logoutButtonRestaurant}`}
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}