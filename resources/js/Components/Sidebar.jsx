import React, { useEffect, useRef } from 'react';
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
    XMarkIcon,
} from '@heroicons/react/24/outline';
import ThemeToggle from '@/Components/ThemeToggle';
import { useLanguage } from '@/Context/LanguageContext';

export default function Sidebar({ user, mobileOpen = false, onClose }) {
    const { auth, url } = usePage().props;
    const { t } = useLanguage();
    user = user || auth.user;
    const sidebarRef = useRef(null);

    const navLinks = [
        { name: t('dashboard'), route: 'dashboard', icon: <HomeIcon className="w-5 h-5 mr-2" /> },
        { name: t('products'), route: 'products.manage', icon: <CubeIcon className="w-5 h-5 mr-2" /> },
        { name: t('suppliers'), route: 'suppliers.index', icon: <UserCircleIcon className="w-5 h-5 mr-2" /> },
        { name: t('stock_movements'), route: 'stock-movements.manage', icon: <ArrowsRightLeftIcon className="w-5 h-5 mr-2" /> },
        { name: t('inventory') + ' ' + t('reports'), route: 'report.inventory', icon: <ChartBarIcon className="w-5 h-5 mr-2" /> },
        { name: t('sales_overview'), route: 'report.sales', icon: <CurrencyDollarIcon className="w-5 h-5 mr-2" /> },
    ];

    const isActive = (routeName) => {
        const currentPath = url || window.location.pathname;
        const basePath = route(routeName).replace(window.location.origin, '');
        return currentPath.startsWith(basePath);
    };

    // Trap focus and close on ESC for accessibility
    useEffect(() => {
        if (!mobileOpen) return;
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
            // Trap focus
            if (e.key === 'Tab' && sidebarRef.current) {
                const focusable = sidebarRef.current.querySelectorAll('a,button,input,select,textarea,[tabindex]:not([tabindex="-1"])');
                const first = focusable[0];
                const last = focusable[focusable.length - 1];
                if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                } else if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                }
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        // Focus the sidebar
        setTimeout(() => {
            if (sidebarRef.current) {
                const focusable = sidebarRef.current.querySelectorAll('a,button,input,select,textarea,[tabindex]:not([tabindex="-1"])');
                if (focusable[0]) focusable[0].focus();
            }
        }, 50);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [mobileOpen, onClose]);

    // Sidebar content
    const sidebarContent = (
        <aside
            ref={sidebarRef}
            className="h-screen w-[250px] bg-white dark:bg-zinc-900 border-r border-muted shadow-2xl flex flex-col rounded-r-2xl overflow-hidden font-sans text-foreground dark:text-foreground z-40 text-[1.1rem] md:text-[1.15rem] focus:outline-none"
            tabIndex={-1}
        >
            <div className="p-4 text-xl font-extrabold tracking-tight border-b border-muted bg-background/80 dark:bg-background/80 text-foreground dark:text-foreground text-2xl flex items-center justify-between">
                <span className="text-primary">{t('app_name')}</span>
                {/* Close button for mobile */}
                <button
                    className="md:hidden ml-2 p-1 rounded hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
                    onClick={onClose}
                    aria-label="Close sidebar"
                >
                    <XMarkIcon className="w-6 h-6" />
                </button>
            </div>
            <nav className="flex-1 py-4 px-2 flex flex-col">
                <div className="mb-2 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-widest text-base md:text-lg">{t('home')}</div>
                <ul className="space-y-1 flex-1">
                    {navLinks.map(link => (
                        <li key={link.route}>
                            <Link
                                href={route(link.route)}
                                className={`
                                    flex items-center px-3 py-2 rounded-lg transition-all text-sm font-medium md:text-base
                                    ${isActive(link.route)
                                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-semibold shadow-md'
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
                            title={t('logout')}
                        >
                            <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                            <span className="text-sm font-medium">{t('logout')}</span>
                        </Link>
                    </div>
                </div>
            </nav>
        </aside>
    );

    // Mobile drawer overlay with animation
    return (
        <>
            {/* Desktop sidebar */}
            <div className="hidden md:block fixed left-0 top-0 z-40">
                {sidebarContent}
            </div>
            {/* Mobile sidebar drawer with animation */}
            <div
                className={`fixed inset-0 z-50 flex md:hidden pointer-events-none`}
                aria-hidden={!mobileOpen}
            >
                {/* Backdrop */}
                <div
                    className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                    onClick={onClose}
                    aria-label="Close sidebar backdrop"
                />
                {/* Slide-in sidebar */}
                <div
                    className={`relative z-50 w-[250px] h-full bg-background dark:bg-background shadow-2xl transform transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} pointer-events-auto`}
                    style={{ willChange: 'transform' }}
                >
                    {sidebarContent}
                </div>
            </div>
        </>
    );
}
