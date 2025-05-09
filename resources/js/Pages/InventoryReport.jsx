import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardContent } from '@/Components/ui/card';
import PrimaryButton from '@/Components/PrimaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';

export default function InventoryReport() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState('');
    const { auth } = usePage().props;
    const user = auth.user;

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        const res = await axios.get('/reports/inventory');
        setProducts(res.data);
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase())
    );

    // Export to CSV
    const exportCSV = () => {
        const header = ['Product', 'Quantity', 'Low Stock?'];
        const rows = filteredProducts.map(p => [p.name, p.quantity, p.low_stock ? 'Yes' : 'No']);
        let csv = [header, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'inventory_report.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

    // Print
    const printReport = () => {
        window.print();
    };

    return (
        <AuthenticatedLayout user={user}>
            <Head title="Inventory Report" />
            <div className="max-w-5xl mx-auto py-8 px-2 md:px-0">
                <Card className="dark:bg-zinc-900 dark:text-gray-100">
                    <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 border-b dark:border-zinc-700">
                        <CardTitle className="text-2xl font-bold dark:text-white">Inventory Report</CardTitle>
                        <div className="flex gap-2 mt-2 md:mt-0">
                            <PrimaryButton onClick={exportCSV}>Export CSV</PrimaryButton>
                            <PrimaryButton onClick={printReport}>Print</PrimaryButton>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4 flex flex-col md:flex-row md:items-center gap-2">
                            <input
                                type="text"
                                placeholder="Search product..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="px-3 py-2 rounded-lg border border-muted bg-background dark:bg-zinc-800 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-full md:w-64"
                            />
                        </div>
                        <div className="overflow-x-auto rounded-lg border border-muted dark:border-zinc-700">
                            <table className="w-full text-sm border-separate border-spacing-y-1 min-w-[500px]">
                                <thead className="sticky top-0 bg-background dark:bg-zinc-800 z-10">
                                    <tr>
                                        <th className="py-2 px-3 text-left font-semibold text-muted-foreground dark:text-gray-200 border-b border-muted dark:border-zinc-700">Product</th>
                                        <th className="py-2 px-3 text-left font-semibold text-muted-foreground dark:text-gray-200 border-b border-muted dark:border-zinc-700">Quantity</th>
                                        <th className="py-2 px-3 text-left font-semibold text-muted-foreground dark:text-gray-200 border-b border-muted dark:border-zinc-700">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProducts.length === 0 && (
                                        <tr><td colSpan={3} className="py-4 text-center text-muted-foreground dark:text-gray-400">No products found.</td></tr>
                                    )}
                                    {filteredProducts.map((product, idx) => (
                                        <tr key={product.id} className={
                                            product.quantity === 0
                                                ? 'bg-red-100/80 dark:bg-red-900/60'
                                                : product.low_stock
                                                    ? 'bg-yellow-50 dark:bg-yellow-900/40'
                                                    : idx % 2 === 0
                                                        ? 'bg-white dark:bg-zinc-900'
                                                        : 'bg-gray-50 dark:bg-zinc-800'}>
                                            <td className="py-2 px-3 border-b border-muted dark:border-zinc-700 font-medium dark:text-gray-100">{product.name}</td>
                                            <td className="py-2 px-3 border-b border-muted dark:border-zinc-700 dark:text-gray-100">{product.quantity}</td>
                                            <td className="py-2 px-3 border-b border-muted dark:border-zinc-700">
                                                {product.quantity === 0 ? (
                                                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200">Out of Stock</span>
                                                ) : product.low_stock ? (
                                                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-200 dark:bg-yellow-700 text-yellow-900 dark:text-yellow-100">Low Stock</span>
                                                ) : (
                                                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-100">In Stock</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
