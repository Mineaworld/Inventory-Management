import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { usePage } from '@inertiajs/react';
import { Card, CardHeader, CardTitle, CardContent } from '@/Components/ui/card';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import Modal from '@/Components/Modal';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Toaster } from '@/Components/ui/Toaster';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/Components/ui/button';

export default function StockMovements() {
    const [movements, setMovements] = useState([]);
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState({ product_id: '', type: 'purchase', quantity: '', note: '' });
    const [loading, setLoading] = useState(false);
    const { auth } = usePage().props;
    const [showModal, setShowModal] = useState(false);
    const { toast } = useToast();

    const isAdminOrEmployee = auth.user && auth.user.role && (
        auth.user.role.name === 'Admin' || auth.user.role.name === 'Employee'
    );

    useEffect(() => {
        fetchMovements();
        fetchProducts();
    }, []);

    const fetchMovements = async () => {
        const res = await axios.get('/stock-movements');
        setMovements(res.data);
    };

    const fetchProducts = async () => {
        const res = await axios.get('/products');
        setProducts(res.data);
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const openModal = () => setShowModal(true);
    const closeModal = () => {
        setShowModal(false);
        setForm({ product_id: '', type: 'purchase', quantity: '', note: '' });
    };
    const handleModalSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('/stock-movements', form);
            setForm({ product_id: '', type: 'purchase', quantity: '', note: '' });
            fetchMovements();
            closeModal();
            toast(<div><b>Stock Movement Added</b><div>The stock movement was added successfully.</div></div>);
        } catch (err) {
            toast(<div><b>Error</b><div>{err.response?.data?.message || 'Unknown error'}</div></div>);
        }
        setLoading(false);
    };

    const typeBadge = (type) => {
        const map = {
            purchase: 'bg-green-100 text-green-700',
            sale: 'bg-red-100 text-red-700',
            return: 'bg-blue-100 text-blue-700',
            adjustment: 'bg-yellow-100 text-yellow-700',
        };
        return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${map[type] || 'bg-muted text-foreground'}`}>{type.charAt(0).toUpperCase() + type.slice(1)}</span>;
    };

    return (
        <>
            <Toaster />
            <AuthenticatedLayout user={auth.user}>
                <Head title="Stock Movements" />
                <div className="flex flex-col gap-4 p-4 md:p-6 bg-background min-h-screen">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 mb-2">
                        <h2 className="text-3xl font-bold tracking-tight text-foreground">Stock Movements</h2>
                        {isAdminOrEmployee && (
                            <PrimaryButton onClick={openModal}>+ Add Movement</PrimaryButton>
                        )}
                    </div>
                    <div className="w-full mx-auto flex flex-col gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Stock Movements</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto w-full">
                                    <table className="w-full text-sm border-separate border-spacing-y-1">
                                        <thead>
                                            <tr className="bg-background">
                                                <th className="py-2 px-3 text-left font-semibold text-muted-foreground border-b border-muted">Date</th>
                                                <th className="py-2 px-3 text-left font-semibold text-muted-foreground border-b border-muted">Product</th>
                                                <th className="py-2 px-3 text-left font-semibold text-muted-foreground border-b border-muted">Type</th>
                                                <th className="py-2 px-3 text-left font-semibold text-muted-foreground border-b border-muted">Quantity</th>
                                                <th className="py-2 px-3 text-left font-semibold text-muted-foreground border-b border-muted">User</th>
                                                <th className="py-2 px-3 text-left font-semibold text-muted-foreground border-b border-muted">Note</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {movements.map(m => (
                                                <tr key={m.id} className="border border-muted/10 hover:bg-primary/5 transition rounded-lg">
                                                    <td className="py-2 px-3 whitespace-nowrap">{new Date(m.created_at).toLocaleString()}</td>
                                                    <td className="py-2 px-3 whitespace-nowrap">{m.product?.name}</td>
                                                    <td className="py-2 px-3 whitespace-nowrap">{typeBadge(m.type)}</td>
                                                    <td className="py-2 px-3 whitespace-nowrap">{m.quantity}</td>
                                                    <td className="py-2 px-3 whitespace-nowrap">{m.user?.name}</td>
                                                    <td className="py-2 px-3 whitespace-nowrap">{m.note}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                        {/* Add Movement Modal */}
                        <Modal show={showModal} onClose={closeModal} maxWidth="md">
                            <div className="p-6">
                                <h3 className="text-lg font-semibold mb-4">Add Stock Movement</h3>
                                <form onSubmit={handleModalSubmit} className="space-y-4">
                                    <div>
                                        <label className="block mb-1 text-sm font-medium">Product</label>
                                        <select name="product_id" value={form.product_id} onChange={handleChange} required className="border p-2 w-full rounded">
                                            <option value="">Select Product</option>
                                            {products.map(product => (
                                                <option key={product.id} value={product.id}>{product.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block mb-1 text-sm font-medium">Type</label>
                                        <select name="type" value={form.type} onChange={handleChange} required className="border p-2 w-full rounded">
                                            <option value="purchase">Purchase</option>
                                            <option value="sale">Sale</option>
                                            <option value="return">Return</option>
                                            <option value="adjustment">Adjustment</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block mb-1 text-sm font-medium">Quantity</label>
                                        <TextInput name="quantity" value={form.quantity} onChange={handleChange} placeholder="Quantity" type="number" min="1" required className="w-full" />
                                    </div>
                                    <div>
                                        <label className="block mb-1 text-sm font-medium">Note (optional)</label>
                                        <TextInput name="note" value={form.note} onChange={handleChange} placeholder="Note (optional)" className="w-full" />
                                    </div>
                                    <div className="flex gap-2 justify-end">
                                        <SecondaryButton type="button" onClick={closeModal}>Cancel</SecondaryButton>
                                        <PrimaryButton type="submit" disabled={loading}>{loading ? 'Saving...' : 'Add Movement'}</PrimaryButton>
                                    </div>
                                </form>
                            </div>
                        </Modal>
                    </div>
                </div>
            </AuthenticatedLayout>
        </>
    );
}
