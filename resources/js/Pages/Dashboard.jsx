import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, Link } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PlusIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/solid';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { TrendingUp } from "lucide-react";

function Badge({ type }) {
    const color = type === 'in' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';
    const label = type === 'in' ? 'In' : 'Out';
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
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-2">
            <StatCard
                title="Total Products"
                value={productCount}
                delta="+4.5%"
                deltaType="up"
                subtitle="Trending up this month"
                secondary="Products in inventory"
            />
            <StatCard
                title="Low Stock"
                value={lowStockCount}
                delta="-2.1%"
                deltaType="down"
                subtitle="Down this period"
                secondary="Needs restocking"
            />
            <StatCard
                title="Out of Stock"
                value={outOfStockCount}
                delta="-1.5%"
                deltaType="down"
                subtitle="Critical"
                secondary="No stock available"
            />
            <QuickActions />
        </div>
    );
}

function ModernBarChart({ data }) {
    // Prepare multi-bar data: { name, in: X, out: Y }
    const chartData = data.map(month => ({
        name: month.name,
        in: month.in || 0,
        out: month.out || 0,
    }));
    const chartConfig = {
        in: {
            label: "In",
            color: "#3b82f6", // blue-500
        },
        out: {
            label: "Out",
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
                <CardTitle>Stock Movements</CardTitle>
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
                        <Bar dataKey="in" fill={chartConfig.in.color} radius={4} name="In" />
                        <Bar dataKey="out" fill={chartConfig.out.color} radius={4} name="Out" />
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 font-medium leading-none">
                    Trending up <TrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">
                    Showing total stock movements for the last 6 months
                </div>
            </CardFooter>
        </Card>
    );
}

function ModernDataTable({ data }) {
    // Define columns
    const columns = [
        {
            header: 'Date',
            accessorKey: 'date',
        },
        {
            header: 'Product',
            accessorKey: 'product_name',
        },
        {
            header: 'Type',
            accessorKey: 'type',
            cell: info => <Badge type={info.getValue()} />,
        },
        {
            header: 'Quantity',
            accessorKey: 'quantity',
        },
        {
            header: 'User',
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
                <CardTitle className="text-sm font-semibold text-foreground">Recent Stock Movements</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">Latest inventory changes in the system.</p>
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
                            <tr><td colSpan={columns.length} className="py-4 text-center text-muted-foreground">No recent movements.</td></tr>
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
    const user = auth.user;
    const [productCount, setProductCount] = useState(0);
    const [lowStockCount, setLowStockCount] = useState(0);
    const [outOfStockCount, setOutOfStockCount] = useState(0);
    const [recentMovements, setRecentMovements] = useState([]);
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        fetchProductStats();
        fetchMovements();
    }, []);

    const fetchProductStats = async () => {
        const res = await axios.get('/reports/inventory');
        setProductCount(res.data.length);
        setLowStockCount(res.data.filter(p => p.low_stock).length);
        setOutOfStockCount(res.data.filter(p => p.quantity === 0).length);
    };

    const fetchMovements = async () => {
        const res = await axios.get('/stock-movements');
        // Table: latest 10 movements
        const tableData = res.data.slice(0, 10).map(m => ({
            date: new Date(m.created_at).toLocaleDateString(),
            product_name: m.product?.name || 'Unknown',
            type: m.type === 'sale' || m.type === 'out' ? 'out' : 'in',
            quantity: m.quantity,
            user_name: m.user?.name || 'Unknown',
        }));
        setRecentMovements(tableData);

        // Chart: aggregate by month for last 6 months, split by 'in' and 'out'
        const now = new Date();
        const months = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            months.push({
                name: d.toLocaleString('default', { month: 'short' }),
                year: d.getFullYear(),
                month: d.getMonth(),
                in: 0,
                out: 0,
            });
        }
        res.data.forEach(m => {
            const d = new Date(m.created_at);
            const idx = months.findIndex(
                mon => mon.year === d.getFullYear() && mon.month === d.getMonth()
            );
            if (idx !== -1) {
                if (m.type === 'sale' || m.type === 'out') {
                    months[idx].out += m.quantity;
                } else {
                    months[idx].in += m.quantity;
                }
            }
        });
        setChartData(months);
    };

    return (
        <AuthenticatedLayout user={user}>
            <Head title="Dashboard" />
            <div className="flex flex-col gap-4 p-4 md:p-6 bg-background min-h-screen">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 mb-2">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h2>
                </div>
                <SectionCards productCount={productCount} lowStockCount={lowStockCount} outOfStockCount={outOfStockCount} />
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1 min-w-0">
                        <ModernBarChart data={chartData} />
                    </div>
                    <div className="w-full lg:w-1/3 flex-shrink-0">
                        <Card className="rounded-2xl border border-muted bg-background dark:bg-[#18181b] shadow-lg p-4 h-full flex flex-col">
                            <CardHeader>
                                <CardTitle>Tips & Insights</CardTitle>
                                <CardDescription>Improve your inventory management</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col gap-2 text-sm">
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>Review low stock items weekly to avoid stockouts.</li>
                                    <li>Analyze sales trends to optimize reorder points.</li>
                                    <li>Use barcodes for faster and more accurate stock updates.</li>
                                    <li>Regularly audit your inventory for discrepancies.</li>
                                    <li>Leverage reports to identify your best-selling products.</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
                <ModernDataTable data={recentMovements} />
            </div>
        </AuthenticatedLayout>
    );
}

function StatCard({ title, value, delta, deltaType, subtitle, secondary }) {
    return (
        <Card className="rounded-2xl border border-muted bg-background dark:bg-[#18181b] shadow-lg p-4 flex flex-col justify-between min-h-[140px]">
            <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-muted-foreground">{title}</span>
                <DeltaBadge value={delta} type={deltaType} />
            </div>
            <div className="text-2xl font-bold text-foreground mb-0.5">{value}</div>
            <div className="text-xs font-semibold text-foreground mb-0.5">{subtitle}</div>
            <div className="text-xs text-muted-foreground">{secondary}</div>
        </Card>
    );
}

function QuickActions() {
    return (
        <Card className="rounded-2xl border border-muted bg-background dark:bg-[#18181b] shadow-lg p-4 flex flex-col items-start justify-center min-h-[200px]">
            <CardHeader className="pb-1 w-full">
                <CardTitle className="text-xs font-medium text-left uppercase tracking-wide mb-2 text-foreground">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 w-full">
                <Link
                    href={route('products.manage')}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-primary text-foreground text-xs font-semibold shadow hover:bg-primary/90 transition focus:outline-none focus:ring-2 focus:ring-primary/40 w-full justify-center"
                >
                    <PlusIcon className="w-4 h-4" /> Add Product
                </Link>
                <Link
                    href={route('stock-movements.manage')}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-muted text-foreground text-xs font-semibold shadow hover:bg-muted/70 transition focus:outline-none focus:ring-2 focus:ring-primary/40 w-full justify-center"
                >
                    <ArrowTrendingUpIcon className="w-4 h-4" /> Manage Stock
                </Link>
                <Link
                    href={route('report.inventory')}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-muted text-foreground text-xs font-semibold shadow hover:bg-muted/70 transition focus:outline-none focus:ring-2 focus:ring-primary/40 w-full justify-center"
                >
                    <ArrowTrendingDownIcon className="w-4 h-4" /> View Reports
                </Link>
            </CardContent>
        </Card>
    );
}
