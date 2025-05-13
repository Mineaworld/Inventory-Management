import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, Link } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PlusIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/solid';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/Components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/Components/ui/chart";
import { TrendingUp } from "lucide-react";
import { useLanguage } from '@/Context/LanguageContext';
import { Button } from '@/Components/ui/button';

function Badge({ type }) {
    const { t } = useLanguage();
    const color = type === 'in' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';
    const label = type === 'in' ? t('stock_in') : t('stock_out');
    return <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${color}`}>{label}</span>;
}

function DeltaBadge({ value, type }) {
    const color = type === 'up'
        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
        : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
    const icon = type === 'up'
        ? <ArrowTrendingUpIcon className="w-4 h-4 inline-block mr-1" />
        : <ArrowTrendingDownIcon className="w-4 h-4 inline-block mr-1" />;
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${color} ml-2`}>{icon}{value}</span>
    );
}

function SectionCards({ productCount, lowStockCount, outOfStockCount }) {
    const { t } = useLanguage();
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-2">
            <StatCard
                title={t('total_products')}
                value={productCount || 0}
                delta="+4.5%"
                deltaType="up"
                subtitle="Trending up this month"
                secondary={t('products')}
            />
            <StatCard
                title={t('low_stock')}
                value={lowStockCount || 0}
                delta="-2.1%"
                deltaType="down"
                subtitle={t('down_this_period')}
                secondary={t('needs_restocking')}
            />
            <StatCard
                title={t('out_of_stock')}
                value={outOfStockCount || 0}
                delta="-1.5%"
                deltaType="down"
                subtitle={t('critical')}
                secondary={t('no_stock_available')}
            />
            <QuickActions />
        </div>
    );
}

function ModernBarChart({ data = [] }) {
    const { t } = useLanguage();
    // Prepare multi-bar data: { name, in: X, out: Y }
    const chartData = Array.isArray(data) ? data.map(month => ({
        name: month?.name || '',
        in: month?.in || 0,
        out: month?.out || 0,
    })) : [];
    
    const chartConfig = {
        in: {
            label: t('stock_in'),
            color: "#3b82f6", // blue-500
        },
        out: {
            label: t('stock_out'),
            color: "#22c55e", // green-500
        },
    };

    // Detect dark mode
    const [isDark, setIsDark] = useState(false);
    useEffect(() => {
        const match = window.matchMedia('(prefers-color-scheme: dark)');
        setIsDark(match.matches);
        const handler = (e) => setIsDark(e.matches);
        match.addEventListener('change', handler);
        return () => match.removeEventListener('change', handler);
    }, []);

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('stock_movements')}</CardTitle>
                <CardDescription>Last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart data={chartData} barSize={24} height={220} width={500}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="name"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                        />
                        <RechartsTooltip 
                            wrapperStyle={{ zIndex: 1000 }}
                            contentStyle={{ background: '#fff', color: '#18181b', borderRadius: '0.5rem', border: '1px solid #e5e7eb', boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)' }}
                            labelStyle={{ color: '#18181b', fontWeight: 600 }}
                            itemStyle={{ color: '#18181b' }}
                        />
                        <Bar dataKey="in" fill={chartConfig.in.color} radius={4} name={t('stock_in')} />
                        <Bar dataKey="out" fill={chartConfig.out.color} radius={4} name={t('stock_out')} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 font-medium leading-none">
                    Trending up <TrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">
                    {t('recent_movements')}
                </div>
            </CardFooter>
        </Card>
    );
}

function ModernDataTable({ data = [] }) {
    const { t } = useLanguage();
    // Define columns
    const columns = [
        {
            header: t('movement_date'),
            accessorKey: 'date',
        },
        {
            header: t('product_name'),
            accessorKey: 'product_name',
        },
        {
            header: t('movement_type'),
            accessorKey: 'type',
            cell: info => <Badge type={info.getValue()} />,
        },
        {
            header: t('quantity'),
            accessorKey: 'quantity',
        },
        {
            header: t('users'),
            accessorKey: 'user_name',
        },
    ];
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });
    return (
        <Card className="rounded-2xl border border-muted bg-background dark:bg-[#18181b] shadow-lg p-4 mt-3">
            <CardHeader className="pb-1">
                <CardTitle className="text-sm font-semibold text-foreground">{t('recent_movements')}</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">{t('stock_movements')}</p>
            </CardHeader>
            <CardContent className="overflow-x-auto">
                <table className="min-w-full text-sm border-separate border-spacing-y-1">
                    <thead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id} className="bg-background">
                                {headerGroup.headers.map(header => (
                                    <th key={header.id} className="py-2 px-3 text-left font-semibold text-muted-foreground border-b border-muted">
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.length === 0 && (
                            <tr><td colSpan={columns.length} className="py-4 text-center text-muted-foreground">{t('no_records')}</td></tr>
                        )}
                        {table.getRowModel().rows.map(row => (
                            <tr key={row.id} className="border border-muted/10 hover:bg-primary/5 transition rounded-lg">
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id} className="py-2 px-3 whitespace-nowrap">
                                        {flexRender(cell.column.columnDef.cell ?? cell.column.columnDef.accessorKey, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </CardContent>
        </Card>
    );
}

export default function Dashboard() {
    const { auth } = usePage().props;
    const { t } = useLanguage();
    
    const [productStats, setProductStats] = useState({
        productCount: 0,
        lowStockCount: 0,
        outOfStockCount: 0,
    });
    const [recentMovements, setRecentMovements] = useState([]);
    const [monthlyData, setMonthlyData] = useState([]);
    
    const fetchProductStats = async () => {
        try {
            const response = await axios.get('/reports/inventory');
            console.log('Product stats response:', response.data);
            
            // Handle different response formats
            if (Array.isArray(response.data)) {
                const products = response.data;
                const stats = {
                    productCount: products.length,
                    lowStockCount: products.filter(p => p.low_stock).length,
                    outOfStockCount: products.filter(p => p.quantity === 0).length
                };
                setProductStats(stats);
            } else if (response.data && typeof response.data === 'object') {
                // Handle object response with or without stats property
                if (response.data.stats) {
                    setProductStats(response.data.stats);
                } else {
                    // Try to extract counts from the response object itself
                    const stats = {
                        productCount: response.data.productCount || response.data.count || 0,
                        lowStockCount: response.data.lowStockCount || 0,
                        outOfStockCount: response.data.outOfStockCount || 0
                    };
                    setProductStats(stats);
                }
            } else {
                console.error('Unexpected response format from inventory API:', response.data);
                setProductStats({
                    productCount: 0,
                    lowStockCount: 0,
                    outOfStockCount: 0
                });
            }
        } catch (error) {
            console.error('Error fetching product stats:', error);
            setProductStats({
                productCount: 0,
                lowStockCount: 0,
                outOfStockCount: 0
            });
        }
    };
    
    const fetchMovements = async () => {
        try {
            const response = await axios.get('/stock-movements');
            console.log('Movements response:', response.data);
            
            // Check if we have a valid response with movements data
            const movementsData = response.data?.movements || [];
            
            if (Array.isArray(movementsData)) {
                // Prepare recent movements for the table
                const movements = movementsData.slice(0, 5).map(m => ({
                    id: m?.id || 'unknown',
                    date: m?.created_at ? new Date(m.created_at).toLocaleDateString() : '-',
                    product_name: m?.product?.name || 'Unknown',
                    type: m?.type || 'unknown',
                    quantity: m?.quantity || 0,
                    user_name: m?.user?.name || 'System',
                }));
                setRecentMovements(movements);
                
                // Prepare monthly data for the chart
                // Group by month and type
                const monthlyDataMap = {};
                movementsData.forEach(m => {
                    if (m?.created_at) {
                        const date = new Date(m.created_at);
                        const month = date.toLocaleString('default', { month: 'short' });
                        if (!monthlyDataMap[month]) {
                            monthlyDataMap[month] = { in: 0, out: 0 };
                        }
                        if (m?.type && m?.quantity) {
                            monthlyDataMap[month][m.type] += parseInt(m.quantity) || 0;
                        }
                    }
                });
                
                // Convert the map to an array
                const last6Months = Array.from({ length: 6 }, (_, i) => {
                    const d = new Date();
                    d.setMonth(d.getMonth() - i);
                    return d.toLocaleString('default', { month: 'short' });
                }).reverse();
                
                const chartData = last6Months.map(month => ({
                    name: month,
                    in: monthlyDataMap[month]?.in || 0,
                    out: monthlyDataMap[month]?.out || 0,
                }));
                
                setMonthlyData(chartData);
            } else {
                console.error('Unexpected response format from movements API:', response.data);
                setRecentMovements([]);
                setMonthlyData([]);
            }
        } catch (error) {
            console.error('Error fetching movements:', error);
            setRecentMovements([]);
            setMonthlyData([]);
        }
    };
    
    useEffect(() => {
        fetchProductStats();
        fetchMovements();
    }, []);
    
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={t('dashboard')} />
            <div className="py-4">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                    {t('dashboard')}
                </h1>
                <SectionCards 
                    productCount={productStats?.productCount} 
                    lowStockCount={productStats?.lowStockCount} 
                    outOfStockCount={productStats?.outOfStockCount} 
                />
                <div className="rounded-2xl border border-muted bg-background dark:bg-[#18181b] shadow-lg p-4 overflow-hidden">
                    <ModernBarChart data={monthlyData} />
                </div>
                <ModernDataTable data={recentMovements} />
            </div>
        </AuthenticatedLayout>
    );
}

function StatCard({ title, value, delta, deltaType, subtitle, secondary }) {
    return (
        <div className="rounded-2xl border border-muted bg-background dark:bg-[#18181b] shadow-lg p-4 overflow-hidden">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">{title}</h3>
                {delta && <DeltaBadge value={delta} type={deltaType} />}
            </div>
            <div className="mt-2">
                <div className="text-2xl font-bold text-foreground">{value}</div>
                <p className="text-xs text-muted-foreground mt-1">{secondary}</p>
            </div>
        </div>
    );
}

function QuickActions() {
    const { t } = useLanguage();
    return (
        <div className="rounded-2xl border border-muted bg-background dark:bg-[#18181b] shadow-lg p-4 overflow-hidden flex flex-col justify-between">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">{t('actions')}</h3>
            <div className="mt-2 space-y-2">
                <Link href={route('products.create')} className="w-full">
                    <Button className="w-full" variant="default">
                        <PlusIcon className="w-4 h-4 mr-2" />
                        <span className="text-sm">{t('add_product')}</span>
                    </Button>
                </Link>
                <Link href={route('stock-movements.manage')} className="w-full">
                    <Button className="w-full" variant="secondary">
                        <PlusIcon className="w-4 h-4 mr-2" />
                        <span className="text-sm">{t('stock_movements')}</span>
                    </Button>
                </Link>
            </div>
        </div>
    );
}
