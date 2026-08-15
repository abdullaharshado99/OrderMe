'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { LayoutDashboard, Store, CreditCard, Users, LogOut, ChefHat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import styles from './sidebar.module.css';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/restaurants', label: 'Restaurants', icon: Store },
  { href: '/admin/users', label: 'Create Restaurant Owner', icon: Users },
  { href: '/admin/users/list', label: 'View All Users', icon: Users },
  { href: '/admin/subscriptions', label: 'Subscriptions', icon: CreditCard },
];

export function AdminSidebar() {
  const { logout } = useAuth();
  const pathname = usePathname();

  return (
    <aside className={`${styles.sidebar} ${styles.sidebarAdmin}`}>
      <div className={styles.header}>
        <Link href="/admin/dashboard" className="flex items-center gap-3">
          <span className="text-xl font-bold text-[var(--raspberry)]">
            Order Me Admin
          </span>
        </Link>
      </div>

      <nav className={styles.nav}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.link} ${styles.linkAdmin} ${isActive ? styles.linkActiveAdmin : ''}`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className={styles.footer}>
        <Button
          variant="ghost"
          className={styles.logoutButton}
          onClick={logout}
        >
          <LogOut size={20} />
          <span>Logout</span>
        </Button>
      </div>
    </aside>
  );
}