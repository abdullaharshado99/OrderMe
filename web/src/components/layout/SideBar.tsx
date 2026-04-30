'use client';

import Link from 'next/link';
import Image from 'next/image';
import styles from './sidebar.module.css';
import { usePathname } from 'next/navigation';
import { isSuperAdminRole } from '@/lib/auth';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/components/auth/AuthProvider';
import { AdminGuard } from '@/components/auth/AdminGuard';
import { LogOut, LayoutDashboard, FolderPlus, Shield, UserCircle2, FileQuestion, BookOpen } from 'lucide-react';
import {
    SidebarProvider,
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarFooter,
    SidebarInset,
    SidebarTrigger,
    useSidebar,
} from '@/components/ui/sidebar';

const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/media', label: 'Media Upload', icon: FolderPlus },
    { href: '/quiz', label: 'Quiz Upload', icon: FileQuestion },
    { href: '/exams', label: 'Exams', icon: BookOpen },
    { href: '/profile', label: 'Profile', icon: UserCircle2 },
    { href: '/admins', label: 'Admins', icon: Shield, superAdminOnly: true },
];

function AdminShellChrome({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { user, setUser } = useAuth();
    const { isMobile, setOpenMobile } = useSidebar();

    const handleLogout = async () => {
        document.cookie = 'lwq_admin_token=; Max-Age=0; path=/;';
        setUser(null);
        window.location.href = '/login';
    };

    const closeMobileSidebarAfterNav = () => {
        if (isMobile) {
            setOpenMobile(false);
        }
    };

    const filteredNavItems = navItems.filter(
        (item) => !item.superAdminOnly || isSuperAdminRole(user?.role)
    );

    return (
        <>
            <Sidebar collapsible="icon" className={styles.sidebar}>
                <SidebarHeader className={styles.sidebarHeader}>
                    <SidebarMenuButton asChild isActive={pathname === '/dashboard'}>
                        <Link
                            href="/dashboard"
                            className={styles.brandLink}
                            data-sidebar-brand-link
                            onClick={closeMobileSidebarAfterNav}
                        >
                            <span className={styles.brandRow}>
                                <div className={styles.logoWrap} aria-hidden>
                                    <Image
                                        src="/IshmaalQuran-Logo.png"
                                        alt=""
                                        width={15}
                                        height={15}
                                        className={styles.brandLogo}
                                        priority
                                    />
                                </div>
                                <span className={styles.brandText} data-sidebar-brand-text>
                                    Order Me
                                </span>
                            </span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {filteredNavItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = pathname.startsWith(item.href);
                                    return (
                                        <SidebarMenuItem key={item.href}>
                                            <SidebarMenuButton
                                                asChild
                                                isActive={isActive}
                                                tooltip={item.label}
                                                onClick={closeMobileSidebarAfterNav}
                                            >
                                                <Link href={item.href}>
                                                    <Icon className={styles.icon} />
                                                    <span className={styles.iconText}>{item.label}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    );
                                })}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
                <Separator className={styles.sidebarSeparator} />
                <SidebarFooter className={styles.sidebarFooter}>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton onClick={handleLogout} tooltip="Logout">
                                <LogOut className={styles.logoutIcon} />
                                <span data-sidebar-logout-text className={styles.logoutText}>Logout</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
            </Sidebar>
            <SidebarInset>
                <header className={styles.topHeader}>
                    <SidebarTrigger className={styles.sidebarTrigger} />
                </header>
                <div className={styles.content}>
                    {children}
                </div>
            </SidebarInset>
        </>
    );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
    return (
        <AdminGuard>
            <SidebarProvider>
                <AdminShellChrome>{children}</AdminShellChrome>
            </SidebarProvider>
        </AdminGuard>
    );
}