'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { ChefHat, ListChecks, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import styles from './sidebar.module.css';

const navItems = [
  { href: '/chef/kitchen', label: 'Kitchen', icon: ChefHat },
  { href: '/chef/orders', label: 'My Orders', icon: ListChecks },
];

export function ChefSidebar() {
  const { logout } = useAuth();
  const pathname = usePathname();

  return (
    <aside className={`${styles.sidebar} ${styles.sidebarChef}`}>
      <div className={`${styles.header} ${styles.headerChef}`}>Chef Panel</div>

      <nav className={styles.nav}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.link} ${styles.linkChef} ${isActive ? styles.linkActiveChef : ''}`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className={`${styles.footer} ${styles.footerChef}`}>
        <Button
          variant="ghost"
          className={`${styles.logoutButton} ${styles.logoutButtonChef}`}
          onClick={logout}
        >
          <LogOut size={20} />
          <span>Logout</span>
        </Button>
      </div>
    </aside>
  );
}
