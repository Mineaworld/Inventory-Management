import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Card, CardHeader, CardTitle, CardContent } from '@/Components/ui/card';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import TextInput from '@/Components/TextInput';
import Modal from '@/Components/Modal';
import { Toaster } from '@/Components/ui/Toaster';
import { useToast } from '@/hooks/use-toast';
import { createPortal } from 'react-dom';
import { useLanguage } from '@/Context/LanguageContext';

export default function Products({ suppliers = [] }) {
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState({ name: '', description: '', price: '', quantity: '', supplier_id: '' });
    const [editing, setEditing] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const { auth } = usePage().props;
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [sortBy, setSortBy] = useState('name');
    const [sortDir, setSortDir] = useState('asc');
    const [selected, setSelected] = useState([]);
    const [imageModal, setImageModal] = useState({ open: false, src: '', alt: '' });
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const { toast } = useToast();
    const { t } = useLanguage();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        const res = await axios.get('/products');
        setProducts(res.data);
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImageFile(file);
        if (file) {
            setImagePreview(URL.createObjectURL(file));
        } else {
            setImagePreview(null);
        }
    };

    const handleEdit = (product) => {
        setEditing(product);
        setForm({
            name: product.name,
            description: product.description,
            price: product.price,
            quantity: product.quantity,
            supplier_id: product.supplier_id || '',
        });
    };

    const handleDelete = (id) => {
        setDeleteTarget(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        try {
            await axios.delete(`/products/${deleteTarget}`);
            toast(<div><b>Product Deleted</b><div>The product was deleted successfully.</div></div>);
            fetchProducts();
        } catch (err) {
            toast(<div><b>Error</b><div>{err.response?.data?.error || 'Something went wrong.'}</div></div>);
        }
        setShowDeleteModal(false);
        setDeleteTarget(null);
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setDeleteTarget(null);
    };

    const isAdmin = auth.user && auth.user.role && auth.user.role.name === 'Admin';

    // Derived filtered and sorted products
    const filteredProducts = products
        .filter(p =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
        )
        .filter(p => {
            if (filter === 'all') return true;
            // For demo, treat all as active
            return filter === 'active';
        })
        .sort((a, b) => {
            let valA = a[sortBy];
            let valB = b[sortBy];
            if (typeof valA === 'string') valA = valA.toLowerCase();
            if (typeof valB === 'string') valB = valB.toLowerCase();
            if (valA < valB) return sortDir === 'asc' ? -1 : 1;
            if (valA > valB) return sortDir === 'asc' ? 1 : -1;
            return 0;
        });

    const openAddModal = () => {
        setEditing(null);
        setForm({ name: '', description: '', price: '', quantity: '', supplier_id: '' });
        setImageFile(null);
        setImagePreview(null);
        setShowModal(true);
    };
    const openEditModal = (product) => {
        setEditing(product);
        setForm({
            name: product.name,
            description: product.description,
            price: product.price,
            quantity: product.quantity,
            supplier_id: product.supplier_id || '',
        });
        setImageFile(null);
        setImagePreview(product.image ? `/storage/${product.image}` : null);
        setShowModal(true);
    };
    const closeModal = () => {
        setShowModal(false);
        setEditing(null);
        setForm({ name: '', description: '', price: '', quantity: '', supplier_id: '' });
        setImageFile(null);
        setImagePreview(null);
    };
    const handleModalSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', form.name);
        formData.append('description', form.description);
        formData.append('price', form.price);
        formData.append('quantity', form.quantity);
        formData.append('supplier_id', form.supplier_id);
        if (imageFile) {
            formData.append('image', imageFile);
        }
        try {
            if (editing) {
                formData.append('_method', 'PUT');
                await axios.post(`/products/${editing.id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast(<div><b>Product Updated</b><div>The product was updated successfully.</div></div>);
            } else {
                await axios.post('/products', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast(<div><b>Product Added</b><div>The product was added successfully.</div></div>);
            }
            fetchProducts();
            closeModal();
            setImageFile(null);
        } catch (err) {
            toast(<div><b>Error</b><div>{err.response?.data?.error || 'Something went wrong.'}</div></div>);
        }
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelected(filteredProducts.map(p => p.id));
        } else {
            setSelected([]);
        }
    };
    const handleSelectOne = (id) => {
        setSelected(selected.includes(id)
            ? selected.filter(sid => sid !== id)
            : [...selected, id]);
    };

    return (
        <>
            <Toaster />
            <AuthenticatedLayout user={auth.user}>
                <Head title="Products" />
                <div className="flex flex-col gap-4 p-4 md:p-6 bg-background min-h-screen">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 mb-2">
                        <h2 className="text-3xl font-bold tracking-tight text-foreground">{t('products')}</h2>
                    </div>
                    <div className="w-full max-w-6xl mx-auto flex flex-col gap-6">
                        <Card className="p-0">
                            <CardHeader className="border-b">
                                <CardTitle className="text-xl font-bold">{t('my_products') || t('products')}</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 px-6 py-4 border-b">
                                    <div className="flex gap-2 items-center">
                                        {[t('all'), t('active'), t('draft'), t('archived')].map((f, i) => (
                                            <SecondaryButton
                                                key={f}
                                                onClick={() => setFilter(['all', 'active', 'draft', 'archived'][i])}
                                                className={`px-3 py-1 rounded-full text-sm font-medium transition border focus:outline-none focus:ring-2 focus:ring-primary/40
                                                    ${filter === ['all', 'active', 'draft', 'archived'][i] ? 'bg-primary text-white border-primary shadow-none' : 'bg-muted text-foreground border-muted hover:bg-primary/10'}
                                                `}
                                                style={filter === ['all', 'active', 'draft', 'archived'][i] ? { color: 'black', borderColor: 'transparent' } : {}}
                                            >
                                                {f}
                                            </SecondaryButton>
                                        ))}
                                    </div>
                                    <div className="flex gap-2 items-center w-full md:w-auto">
                                        <TextInput
                                            type="text"
                                            placeholder={t('search')}
                                            value={searchTerm}
                                            onChange={e => setSearchTerm(e.target.value)}
                                            className="px-3 py-2 rounded-lg border border-muted bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-full md:w-48"
                                        />
                                        <SecondaryButton onClick={() => {
                                            setSortBy(sortBy === 'name' ? 'price' : sortBy === 'price' ? 'quantity' : 'name');
                                            setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
                                        }}>
                                            {t('sort_by')} {t(sortBy)} {sortDir === 'asc' ? '↑' : '↓'}
                                        </SecondaryButton>
                                        {isAdmin && (
                                            <PrimaryButton onClick={openAddModal}>+ {t('add_product')}</PrimaryButton>
                                        )}
                                    </div>
                                </div>
                                <div className="md:hidden flex flex-col gap-2 p-2">
                                    {filteredProducts.length === 0 ? (
                                        <div className="text-center text-muted-foreground py-8">{t('no_products_found') || t('no_records')}</div>
                                    ) : (
                                        filteredProducts.map(product => (
                                            <Card key={product.id} className="flex flex-col gap-2 p-3 shadow border border-muted">
                                                <div className="flex items-center gap-2">
                                                    {product.image ? (
                                                        <button
                                                            type="button"
                                                            onClick={() => setImageModal({ open: true, src: `/storage/${product.image}`, alt: product.name })}
                                                            className="focus:outline-none"
                                                            aria-label={`${t('view_image_for')} ${product.name}`}
                                                        >
                                                            <img
                                                                src={`/storage/${product.image}`}
                                                                alt={product.name}
                                                                className="rounded-md border w-12 h-12 object-cover"
                                                            />
                                                        </button>
                                                    ) : (
                                                        <div className="w-12 h-12 flex items-center justify-center bg-muted rounded-md text-xs text-muted-foreground">IMG</div>
                                                    )}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="font-semibold text-base truncate">{product.name}</div>
                                                        <div className="text-xs text-muted-foreground truncate">{product.description}</div>
                                                        <div className="mt-1 text-sm font-medium text-primary">{Number(product.price).toLocaleString(undefined, { style: 'currency', currency: 'USD' })}</div>
                                                        <div className="mt-1 text-xs text-muted-foreground">{t('qty') || 'Qty'}: <span className="font-semibold text-foreground">{product.quantity}</span></div>
                                                        {product.supplier_name && (
                                                            <div className="text-xs text-muted-foreground mt-1">{t('supplier') || 'Supplier'}: {product.supplier_name}</div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 mt-1">
                                                    {isAdmin && (
                                                        <>
                                                            <SecondaryButton onClick={() => openEditModal(product)} className="flex-1 py-1.5 px-2 text-xs rounded-md">{t('edit')}</SecondaryButton>
                                                            <DangerButton onClick={() => handleDelete(product.id)} className="flex-1 py-1.5 px-2 text-xs rounded-md">{t('delete')}</DangerButton>
                                                        </>
                                                    )}
                                                </div>
                                            </Card>
                                        ))
                                    )}
                                </div>
                                <div className="hidden md:block overflow-x-auto">
                                    <table className="min-w-full text-sm border-separate border-spacing-y-1">
                                        <thead>
                                            <tr className="bg-background">
                                                <th className="py-2 px-3 text-left font-semibold text-muted-foreground border-b border-muted">
                                                    <input
                                                        type="checkbox"
                                                        className="align-middle"
                                                        checked={selected.length === filteredProducts.length && filteredProducts.length > 0}
                                                        onChange={handleSelectAll}
                                                    />
                                                </th>
                                                <th className="py-2 px-3 text-left font-semibold text-muted-foreground border-b border-muted">{t('image') || 'Image'}</th>
                                                <th className="py-2 px-3 text-left font-semibold text-muted-foreground border-b border-muted">{t('product') || 'Product'}</th>
                                                <th className="py-2 px-3 text-left font-semibold text-muted-foreground border-b border-muted">{t('description')}</th>
                                                <th className="py-2 px-3 text-left font-semibold text-muted-foreground border-b border-muted">{t('price')}</th>
                                                <th className="py-2 px-3 text-left font-semibold text-muted-foreground border-b border-muted">{t('supplier') || 'Supplier'}</th>
                                                <th className="py-2 px-3 text-left font-semibold text-muted-foreground border-b border-muted">{t('status')}</th>
                                                <th className="py-2 px-3 text-left font-semibold text-muted-foreground border-b border-muted">{t('inventory')}</th>
                                                {isAdmin && <th className="py-2 px-3 text-left font-semibold text-muted-foreground border-b border-muted">{t('actions')}</th>}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredProducts.map((product) => (
                                                <tr key={product.id} className="border border-muted/10 hover:bg-primary/5 transition rounded-lg">
                                                    <td className="py-2 px-3 align-middle">
                                                        <input
                                                            type="checkbox"
                                                            className="align-middle"
                                                            checked={selected.includes(product.id)}
                                                            onChange={() => handleSelectOne(product.id)}
                                                        />
                                                    </td>
                                                    <td className="py-2 px-3 whitespace-nowrap">
                                                        {product.image ? (
                                                            <button
                                                                type="button"
                                                                onClick={() => setImageModal({ open: true, src: `/storage/${product.image}`, alt: product.name })}
                                                                className="focus:outline-none"
                                                                aria-label={`${t('view_image_for')} ${product.name}`}
                                                            >
                                                                <img
                                                                    src={`/storage/${product.image}`}
                                                                    alt={product.name}
                                                                    style={{ width: 40, height: 40, objectFit: 'cover' }}
                                                                    className="rounded-md border hover:shadow-lg transition"
                                                                />
                                                            </button>
                                                        ) : (
                                                            <span className="text-xs text-muted-foreground">IMG</span>
                                                        )}
                                                    </td>
                                                    <td className="py-2 px-3 whitespace-nowrap">
                                                        <span className="font-medium">{product.name}</span>
                                                    </td>
                                                    <td className="py-2 px-3 whitespace-nowrap">
                                                        {product.description && product.description.trim() !== '' && product.description.trim().toLowerCase() !== 'null' ? (
                                                            product.description
                                                        ) : (
                                                            <span className="text-xs text-muted-foreground italic">{t('no_description')}</span>
                                                        )}
                                                    </td>
                                                    <td className="py-2 px-3 whitespace-nowrap">{Number(product.price).toLocaleString(undefined, { style: 'currency', currency: 'USD' })}</td>
                                                    <td className="py-2 px-3 whitespace-nowrap">{product.supplier_name || '-'}</td>
                                                    <td className="py-2 px-3">
                                                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">{t('active')}</span>
                                                    </td>
                                                    <td className="py-2 px-3">
                                                        {product.quantity > 0 ? (
                                                            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">{product.quantity} {t('in_stock') || 'in stock'}</span>
                                                        ) : (
                                                            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">{t('out_of_stock')}</span>
                                                        )}
                                                    </td>
                                                    {isAdmin && (
                                                        <td className="py-2 px-3 whitespace-nowrap">
                                                            <SecondaryButton onClick={() => openEditModal(product)} className="mr-2">{t('edit')}</SecondaryButton>
                                                            <DangerButton onClick={() => handleDelete(product.id)}>{t('delete')}</DangerButton>
                                                        </td>
                                                    )}
                                                 </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                        <Modal show={showModal} onClose={closeModal} maxWidth="md">
                            <div className="p-6 bg-white dark:bg-zinc-900 rounded">
                                <h3 className="text-lg font-semibold mb-4 text-foreground dark:text-gray-100">{editing ? t('edit_product') : t('add_product')}</h3>
                                <form onSubmit={handleModalSubmit} className="space-y-4">
                                    <label className="block text-sm font-medium text-muted-foreground dark:text-gray-200">{t('name')}</label>
                                    <TextInput name="name" value={form.name} onChange={handleChange} placeholder={t('name')} required className="w-full dark:bg-zinc-800 dark:text-gray-100" />
                                    <label className="block text-sm font-medium text-muted-foreground dark:text-gray-200">{t('description')}</label>
                                    <TextInput name="description" value={form.description} onChange={handleChange} placeholder={t('description')} className="w-full dark:bg-zinc-800 dark:text-gray-100" />
                                    <label className="block text-sm font-medium text-muted-foreground dark:text-gray-200">{t('price')}</label>
                                    <TextInput name="price" value={form.price} onChange={handleChange} placeholder={t('price')} type="number" min="0" step="0.01" required className="w-full dark:bg-zinc-800 dark:text-gray-100" />
                                    {!editing && (
                                        <>
                                            <label className="block text-sm font-medium text-muted-foreground dark:text-gray-200">{t('initial_quantity') || t('quantity')}</label>
                                            <TextInput name="quantity" value={form.quantity} onChange={handleChange} placeholder={t('initial_quantity') || t('quantity')} type="number" min="0" required className="w-full dark:bg-zinc-800 dark:text-gray-100" />
                                        </>
                                    )}
                                    <label className="block text-sm font-medium text-muted-foreground dark:text-gray-200">{t('supplier') || 'Supplier'}</label>
                                    <select
                                        name="supplier_id"
                                        value={form.supplier_id}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 rounded-lg border border-muted bg-background dark:bg-zinc-800 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        required
                                    >
                                        <option value="">{t('select_supplier') || 'Select a supplier'}</option>
                                        {suppliers.map(s => (
                                            <option key={s.id} value={s.id}>{s.name}</option>
                                        ))}
                                    </select>
                                    <label className="block text-sm font-medium text-muted-foreground dark:text-gray-200">{t('product_image') || 'Product Image'}</label>
                                    <input
                                        type="file"
                                        name="image"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition dark:bg-zinc-800 dark:text-gray-100"
                                    />
                                    {imagePreview && (
                                        <div className="my-2 flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setImageModal({ open: true, src: imagePreview, alt: form.name || (editing && editing.name) || 'Product Image' })}
                                                className="focus:outline-none"
                                                aria-label="View full image preview"
                                            >
                                                <img
                                                    src={imagePreview}
                                                    alt={form.name || (editing && editing.name) || 'Product Image'}
                                                    style={{ width: 64, height: 64, objectFit: 'cover' }}
                                                    className="rounded-lg border shadow hover:shadow-lg transition cursor-pointer"
                                                />
                                            </button>
                                        </div>
                                    )}
                                    <div className="flex gap-2 justify-end">
                                        <SecondaryButton type="button" onClick={closeModal}>{t('cancel')}</SecondaryButton>
                                        <PrimaryButton type="submit">{editing ? t('update') : t('add')} {t('product')}</PrimaryButton>
                                    </div>
                                </form>
                            </div>
                        </Modal>
                        {imageModal.open && createPortal(
                            <div className="fixed inset-0 z-[9999] flex items-center justify-center">
                                <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-20" onClick={() => setImageModal({ open: false, src: '', alt: '' })} />
                                <div className="relative z-30">
                                    <button
                                        onClick={() => setImageModal({ open: false, src: '', alt: '' })}
                                        className="absolute top-2 right-2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-1 shadow focus:outline-none focus:ring-2 focus:ring-primary"
                                        aria-label="Close image preview"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                    <img src={imageModal.src} alt={imageModal.alt} className="rounded-lg border shadow-lg max-w-full max-h-[80vh] bg-white" />
                                </div>
                            </div>,
                            document.body
                        )}
                        <Modal show={showDeleteModal} onClose={cancelDelete} maxWidth="sm">
                            <div className="p-6 flex flex-col items-center">
                                <h3 className="text-lg font-semibold mb-2 text-center">{t('delete_product')}</h3>
                                <p className="mb-4 text-center text-muted-foreground">{t('are_you_sure_delete')}</p>
                                <div className="flex gap-2 justify-center">
                                    <SecondaryButton type="button" onClick={cancelDelete}>{t('cancel')}</SecondaryButton>
                                    <DangerButton type="button" onClick={confirmDelete}>{t('delete')}</DangerButton>
                                </div>
                            </div>
                        </Modal>
                    </div>
                </div>
            </AuthenticatedLayout>
        </>
    );
}
