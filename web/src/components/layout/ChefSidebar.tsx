'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { ChefHat, ListChecks, LogOut } from 'lucide-react';

const navItems = [
    { href: '/chef/kitchen', label: 'Kitchen', icon: ChefHat },
    { href: '/chef/orders', label: 'My Orders', icon: ListChecks },
];

export function ChefSidebar() {
    const { logout } = useAuth();
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-gray-800 text-white h-screen fixed left-0 top-0 flex flex-col">
            <div className="p-4 text-xl font-bold border-b border-gray-700">Chef Panel</div>
            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700 ${isActive ? 'bg-gray-700' : ''}`}
                        >
                            <item.icon size={20} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
            <div className="p-4 border-t border-gray-700">
                <button onClick={logout} className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-gray-700">
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}