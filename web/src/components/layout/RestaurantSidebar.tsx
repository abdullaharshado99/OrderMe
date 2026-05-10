'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { LayoutDashboard, Utensils, ShoppingCart, Package, Users, LogOut, Settings, CreditCard, ChefHat, Store, Receipt, DollarSign, Box } from 'lucide-react';

const navItems = [
    { href: '/restaurant/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/restaurant/menu', label: 'Menu', icon: Utensils },
    { href: '/restaurant/orders', label: 'Orders', icon: ShoppingCart },
    { href: '/restaurant/inventory', label: 'Inventory', icon: Package },
    { href: '/restaurant/kitchen-inventory', label: 'Kitchen Inv.', icon: ChefHat },
    { href: '/restaurant/pos', label: 'POS', icon: Store },
    { href: '/restaurant/kds', label: 'KDS', icon: Receipt },
    { href: '/restaurant/staff', label: 'Staff', icon: Users },
    { href: '/restaurant/warehouse', label: 'Warehouse', icon: Box },
    { href: '/restaurant/expenses', label: 'Expenses', icon: DollarSign },
    { href: '/restaurant/settings', label: 'Settings', icon: Settings },
    { href: '/restaurant/subscription', label: 'Subscription', icon: CreditCard },
];

export function RestaurantSidebar() {
    const { logout } = useAuth();
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-white h-screen fixed left-0 top-0 flex flex-col border-r border-gray-200"
            style={{ fontFamily: 'var(--font-quicksand)' }}>

            {/* Title */}
            <div className="p-4 text-xl font-bold border-b text-[var(--raspberry)]">
                Order Me
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`group flex items-center gap-3 p-2 rounded-lg transition
                            ${isActive
                                    ? 'bg-[var(--raspberry)] text-white shadow-md'
                                    : 'text-gray-700 hover:bg-[var(--raspberry)] hover:text-white'}`}
                        >
                            <item.icon
                                size={20}
                                className={`${isActive ? 'text-white' : 'text-gray-500 group-hover:text-white'}`}
                            />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-gray-200">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 w-full p-2 rounded-lg text-gray-700 hover:bg-red-500/20 hover:text-red-500 transition"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}