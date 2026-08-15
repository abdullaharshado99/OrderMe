'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { Logo } from './Logo';
import styles from './AppShell.module.css';

type AppShellTheme = 'admin' | 'restaurant' | 'chef';

const themeClass: Record<AppShellTheme, string> = {
  admin: styles.shellAdmin,
  restaurant: styles.shellRestaurant,
  chef: styles.shellChef,
};

const titleClass: Record<AppShellTheme, string> = {
  admin: styles.mobileTitleAdmin,
  restaurant: styles.mobileTitleRestaurant,
  chef: styles.mobileTitleChef,
};

interface AppShellProps {
  theme: AppShellTheme;
  title: string;
  sidebar: React.ReactNode;
  children: React.ReactNode;
}

export function AppShell({ theme, title, sidebar, children }: AppShellProps) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  return (
    <div className={`${styles.shell} ${themeClass[theme]}`}>
      <div className={styles.sidebarDesktop}>{sidebar}</div>

      <div className={styles.main}>
        {isMobile && (
          <header className={styles.mobileHeader}>
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open navigation menu" className={styles.menuButton}>
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className={styles.sheetContent} showCloseButton>
                {sidebar}
              </SheetContent>
            </Sheet>
            <div className={styles.headerLogo}>
              <Logo size="sm" showText={false} />
            </div>
            <span className={`${styles.mobileTitle} ${titleClass[theme]}`}>{title}</span>
          </header>
        )}
        {children}
      </div>
    </div>
  );
}