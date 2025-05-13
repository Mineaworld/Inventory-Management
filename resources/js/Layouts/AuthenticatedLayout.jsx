import React from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import Sidebar from '@/Components/Sidebar';
import { UserCircleIcon, Cog6ToothIcon, QuestionMarkCircleIcon, Bars3Icon } from '@heroicons/react/24/outline';
import ThemeToggle from '@/Components/ThemeToggle';
import LanguageSwitcher from '@/Components/LanguageSwitcher';
import * as Avatar from '@radix-ui/react-avatar';
import axios from 'axios';
import { useLanguage } from '@/Context/LanguageContext';

export default function AuthenticatedLayout({ user, children }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);
    const [search, setSearch] = useState('');
    const [results, setResults] = useState({ products: [], movements: [] });
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(false);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const { t } = useLanguage();
    let debounceTimeout = null;

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearch(value);
        setShowDropdown(!!value);
        if (debounceTimeout) clearTimeout(debounceTimeout);
        if (!value) {
            setResults({ products: [], movements: [] });
            return;
        }
        setLoading(true);
        debounceTimeout = setTimeout(async () => {
            try {
                const res = await axios.get('/search?q=' + encodeURIComponent(value));
                setResults(res.data);
            } catch (err) {
                setResults({ products: [], movements: [] });
            }
            setLoading(false);
        }, 300);
    };

    const handleBlur = () => {
        setTimeout(() => setShowDropdown(false), 150);
    };

    return (
        <div className="flex min-h-screen bg-white dark:bg-[#18181b] dark:text-foreground font-sans">
            {/* Sidebar: responsive */}
            <Sidebar
                user={user}
                mobileOpen={mobileSidebarOpen}
                onClose={() => setMobileSidebarOpen(false)}
            />
            {/* Main content */}
            <main className="flex-1 min-h-screen flex flex-col bg-white dark:bg-[#18181b] dark:text-foreground transition-all duration-300 md:ml-[250px]">
                {/* Topbar */}
                <div className="flex items-center justify-between px-4 sm:px-8 py-4 border-b border-white/10 bg-white/70 dark:bg-[#18181b]/80 backdrop-blur-md shadow-sm relative">
                    {/* Hamburger for mobile */}
                    <button
                        className="md:hidden mr-2 p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                        onClick={() => setMobileSidebarOpen(true)}
                        aria-label="Open sidebar menu"
                    >
                        <Bars3Icon className="w-7 h-7 text-primary" />
                    </button>
                    {/* Search input on the left */}
                    <div className="relative flex-1 max-w-xs">
                        <input
                            type="text"
                            placeholder={t('search') + '...'}
                            value={search}
                            onChange={handleSearchChange}
                            onFocus={() => setShowDropdown(!!search)}
                            onBlur={handleBlur}
                            className="w-full px-3 py-2 rounded-xl border border-white/10 bg-white/80 dark:bg-[#232329]/80 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 dark:text-foreground shadow"
                        />
                        {showDropdown && (search || loading) && (
                            <div className="absolute left-0 mt-2 w-80 bg-white dark:bg-[#232329] border border-muted rounded-xl shadow-lg z-50 max-h-80 overflow-y-auto">
                                {loading ? (
                                    <div className="p-4 text-center text-muted-foreground text-sm">Searching...</div>
                                ) : (
                                    <>
                                        {results.products.length === 0 && results.movements.length === 0 ? (
                                            <div className="p-4 text-center text-muted-foreground text-sm">{t('no_records')}</div>
                                        ) : (
                                            <>
                                                {results.products.length > 0 && (
                                                    <div>
                                                        <div className="px-4 pt-2 pb-1 text-xs font-semibold text-muted-foreground uppercase">{t('products')}</div>
                                                        {results.products.map(product => (
                                                            <Link
                                                                key={product.id}
                                                                href={route('products.manage') + `?highlight=${product.id}`}
                                                                className="block px-4 py-2 hover:bg-muted/50 text-foreground text-sm truncate"
                                                            >
                                                                <span className="font-medium">{product.name}</span>
                                                                <span className="ml-2 text-xs text-muted-foreground">{t('quantity')}: {product.quantity}</span>
                                                            </Link>
                                                        ))}
                                                    </div>
                                                )}
                                                {results.movements.length > 0 && (
                                                    <div>
                                                        <div className="px-4 pt-2 pb-1 text-xs font-semibold text-muted-foreground uppercase">{t('stock_movements')}</div>
                                                        {results.movements.map(movement => (
                                                            <Link
                                                                key={movement.id}
                                                                href={route('stock-movements.manage') + `?highlight=${movement.id}`}
                                                                className="block px-4 py-2 hover:bg-muted/50 text-foreground text-sm truncate"
                                                            >
                                                                <span className="font-medium">{movement.type}</span>
                                                                <span className="ml-2 text-xs text-muted-foreground">{movement.product?.name}</span>
                                                                <span className="ml-2 text-xs text-muted-foreground">{t('quantity')}: {movement.quantity}</span>
                                                            </Link>
                                                        ))}
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                    {/* Welcome message, avatar, and theme toggle on the right */}
                    <div className="flex items-center gap-2 md:gap-4 ml-2 md:ml-0">
                        <span className="hidden sm:inline text-base text-gray-500 dark:text-gray-300">{t('home')}, {user.name} ({user.role?.name})</span>
                        <LanguageSwitcher />
                        <Avatar.Root className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-700 shadow-lg">
                            <Avatar.Fallback className="text-white text-xl font-bold">
                                {user.name[0]}
                            </Avatar.Fallback>
                        </Avatar.Root>
                        <ThemeToggle />
                    </div>
                </div>
                <div className="flex-1 flex flex-col items-center overflow-y-auto">
                    <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 pb-8 flex-1">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}