import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { useLanguage } from '@/Context/LanguageContext';

export default function SalesReport() {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const { auth } = usePage().props;
    const user = auth.user;
    const { t } = useLanguage();

    useEffect(() => {
        fetchSales();
    }, []);

    const fetchSales = async () => {
        setLoading(true);
        const res = await axios.get('/reports/sales');
        setSales(res.data);
        setLoading(false);
    };

    // Summary calculations
    const totalSales = sales.reduce((sum, row) => sum + row.total_sales, 0);
    const numTransactions = sales.reduce((sum, row) => sum + (row.transactions || 0), 0);
    const bestSeller = sales.reduce((max, row) => row.total_sales > (max?.total_sales || 0) ? row : max, null);

    return (
        <AuthenticatedLayout user={user}>
            <Head title={t('sales_report') || 'Sales Report'} />
            <div className="max-w-5xl mx-auto py-8 px-4">
                <h1 className="text-3xl font-bold mb-6 text-center">{t('sales_report') || 'Sales Report'}</h1>
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-blue-100 dark:bg-blue-900 rounded-lg p-6 shadow flex flex-col items-center">
                        <span className="text-lg font-semibold text-blue-700 dark:text-blue-200">{t('total_sales') || 'Total Sales'}</span>
                        <span className="text-2xl font-bold text-blue-900 dark:text-blue-100">{totalSales}</span>
                    </div>
                    <div className="bg-green-100 dark:bg-green-900 rounded-lg p-6 shadow flex flex-col items-center">
                        <span className="text-lg font-semibold text-green-700 dark:text-green-200">{t('transactions') || 'Transactions'}</span>
                        <span className="text-2xl font-bold text-green-900 dark:text-green-100">{numTransactions}</span>
                    </div>
                    <div className="bg-yellow-100 dark:bg-yellow-700 rounded-lg p-6 shadow flex flex-col items-center">
                        <span className="text-lg font-semibold text-yellow-700 dark:text-yellow-200">{t('best_seller') || 'Best Seller'}</span>
                        <span className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">{bestSeller ? bestSeller.product : '-'}</span>
                    </div>
                </div>
                {/* Chart */}
                <div className="mb-10 bg-white dark:bg-zinc-900 rounded-lg shadow p-4">
                    <h2 className="text-lg font-semibold mb-4 dark:text-white">{t('sales_by_product') || 'Sales by Product'}</h2>
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={sales} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb"  />
                            <XAxis dataKey="product" tick={{ fontSize: 12, fill: 'var(--tw-text-opacity,1) #334155' }} stroke="#cbd5e1" tickLine={false} axisLine={false} />
                            <YAxis tick={{ fontSize: 12, fill: 'var(--tw-text-opacity,1) #334155' }} stroke="#cbd5e1" tickLine={false} axisLine={false} />
                            <Tooltip contentStyle={{ backgroundColor: '#18181b', color: '#fff', border: 'none' }} itemStyle={{ color: '#fff' }} cursor={{ fill: '#334155', opacity: 0.1 }} />
                            <Legend wrapperStyle={{ color: 'inherit' }} />
                            <Bar dataKey="total_sales" name={t('total_sales') || 'Total Sales'} fill="#3b82f6" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full border rounded-lg overflow-hidden shadow">
                        <thead className="bg-gray-100 dark:bg-zinc-800">
                            <tr>
                                <th className="border px-4 py-2 text-left text-gray-700 dark:text-gray-200">{t('product')}</th>
                                <th className="border px-4 py-2 text-left text-gray-700 dark:text-gray-200">{t('total_sales') || 'Total Sales'}</th>
                                {sales.some(row => row.transactions !== undefined) && (
                                    <th className="border px-4 py-2 text-left text-gray-700 dark:text-gray-200">{t('transactions') || 'Transactions'}</th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {sales.map((row, idx) => (
                                <tr key={idx} className={
                                    idx % 2 === 0
                                        ? 'bg-white dark:bg-zinc-900'
                                        : 'bg-gray-50 dark:bg-zinc-800 hover:bg-blue-50 dark:hover:bg-blue-900'}>
                                    <td className="border px-4 py-2 text-gray-900 dark:text-gray-100">{row.product}</td>
                                    <td className="border px-4 py-2 text-gray-900 dark:text-gray-100">{row.total_sales}</td>
                                    {row.transactions !== undefined && (
                                        <td className="border px-4 py-2 text-gray-900 dark:text-gray-100">{row.transactions}</td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {loading && <div className="text-center mt-4 text-gray-500 dark:text-gray-300">{t('loading') || 'Loading...'}</div>}
            </div>
        </AuthenticatedLayout>
    );
}
