'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { LayoutDashboard, Store, CreditCard, Users, LogOut } from 'lucide-react';

const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/restaurants', label: 'Restaurants', icon: Store },
    { href: '/admin/subscriptions', label: 'Subscriptions', icon: CreditCard },
    { href: '/admin/users', label: 'Register User', icon: Users },
];

export function AdminSidebar() {
    const { logout } = useAuth();
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-[var(--black)] text-[var(--silver)] h-screen fixed left-0 top-0 flex flex-col border-r border-gray-300"
            style={{ fontFamily: 'var(--font-quicksand)' }}>

            <div className="p-4 text-xl font-bold border-b border-gray-300 text-[var(--raspberry)] flex items-center gap-2">
                <img
                    src="logo-png.png"
                    alt="Admin Logo"
                    className="w-8 h-8 object-contain"
                />
                <span>Order Me Admin</span>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 p-2 rounded-lg transition 
                                ${isActive
                                    ? 'bg-[var(--raspberry)] text-white'
                                    : 'text-gray-700 hover:bg-[var(--raspberry)] hover:text-white'}`}
                        >
                            <item.icon size={20} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-300">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 w-full p-2 rounded-lg text-gray-700 hover:bg-red-500/20 hover:text-red-400 transition"                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}