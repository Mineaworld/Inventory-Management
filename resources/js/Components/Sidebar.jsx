import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Link as InertiaLink } from '@inertiajs/react';
import {
    HomeIcon,
    CubeIcon,
    ArrowsRightLeftIcon,
    ChartBarIcon,
    CurrencyDollarIcon,
    ArrowLeftOnRectangleIcon,
    UserCircleIcon,
} from '@heroicons/react/24/outline';
import ThemeToggle from '@/Components/ThemeToggle';

const navLinks = [
    { name: 'Dashboard', route: 'dashboard', icon: <HomeIcon className="w-5 h-5 mr-2" /> },
    { name: 'Products', route: 'products.manage', icon: <CubeIcon className="w-5 h-5 mr-2" /> },
    { name: 'Stock Movements', route: 'stock-movements.manage', icon: <ArrowsRightLeftIcon className="w-5 h-5 mr-2" /> },
    { name: 'Inventory Report', route: 'report.inventory', icon: <ChartBarIcon className="w-5 h-5 mr-2" /> },
    { name: 'Sales Report', route: 'report.sales', icon: <CurrencyDollarIcon className="w-5 h-5 mr-2" /> },
];

export default function Sidebar({ user }) {
    const { auth } = usePage().props;
    user = user || auth.user;

    return (
        <aside className="fixed left-0 top-0 h-screen w-[250px] bg-background dark:bg-background border-r border-muted shadow-xl flex flex-col rounded-r-2xl overflow-hidden font-sans text-foreground dark:text-foreground z-40 text-[1.1rem] md:text-[1.15rem]">
            <div className="p-4 text-xl font-extrabold tracking-tight border-b border-muted bg-background/80 dark:bg-background/80 text-foreground dark:text-foreground text-2xl">
                <span className="text-primary">Inventory</span>Pro
            </div>
            <nav className="flex-1 py-4 px-2 flex flex-col">
                <div className="mb-2 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-widest text-base md:text-lg">Main</div>
                <ul className="space-y-1 flex-1">
                    {navLinks.map(link => (
                        <li key={link.route}>
                            <Link
                                href={route(link.route)}
                                className={`
                                    flex items-center px-3 py-2 rounded-lg transition-all text-sm font-medium md:text-base
                                    ${window.location.pathname === route(link.route)
                                        ? 'bg-primary/10 text-primary font-semibold shadow-md'
                                        : 'hover:bg-muted hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/30'}
                                `}
                            >
                                {link.icon}
                                {link.name}
                            </Link>
                        </li>
                    ))}
                </ul>
                {/* Pushes the controls to the bottom */}
                <div className="mt-auto w-full pb-4">
                    <div className="w-full border-t border-muted flex flex-col items-center gap-2 px-4 pt-4">
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="flex items-center justify-center gap-2 text-white bg-red-500 hover:bg-red-600 transition p-2 rounded-xl w-full border border-red-600 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-500/30"
                            title="Logout"
                        >
                            <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                            <span className="text-sm font-medium">Logout</span>
                        </Link>
                    </div>
                </div>
            </nav>
        </aside>
    );
}
