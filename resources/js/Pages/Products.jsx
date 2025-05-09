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

export default function Products() {
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState({ name: '', description: '', price: '', quantity: '' });
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
        setForm({ name: '', description: '', price: '', quantity: '' });
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
        });
        setImageFile(null);
        setImagePreview(product.image ? `/storage/${product.image}` : null);
        setShowModal(true);
    };
    const closeModal = () => {
        setShowModal(false);
        setEditing(null);
        setForm({ name: '', description: '', price: '', quantity: '' });
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
                        <h2 className="text-3xl font-bold tracking-tight text-foreground">Products</h2>
                    </div>
                    <div className="w-full max-w-6xl mx-auto flex flex-col gap-6">
                        <Card className="p-0">
                            <CardHeader className="border-b">
                                <CardTitle className="text-xl font-bold">My products</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 px-6 py-4 border-b">
                                    <div className="flex gap-2 items-center">
                                        {['all', 'active', 'draft', 'archived'].map(f => (
                                            <SecondaryButton
                                                key={f}
                                                onClick={() => setFilter(f)}
                                                className={`px-3 py-1 rounded-full text-sm font-medium transition border focus:outline-none focus:ring-2 focus:ring-primary/40
                                                    ${filter === f ? 'bg-primary text-white border-primary shadow-none' : 'bg-muted text-foreground border-muted hover:bg-primary/10'}
                                                `}
                                                style={filter === f ? { color: 'black', borderColor: 'transparent' } : {}}
                                            >
                                                {f.charAt(0).toUpperCase() + f.slice(1)}
                                            </SecondaryButton>
                                        ))}
                                    </div>
                                    <div className="flex gap-2 items-center w-full md:w-auto">
                                        <TextInput
                                            type="text"
                                            placeholder="Search"
                                            value={searchTerm}
                                            onChange={e => setSearchTerm(e.target.value)}
                                            className="px-3 py-2 rounded-lg border border-muted bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-full md:w-48"
                                        />
                                        <SecondaryButton onClick={() => {
                                            setSortBy(sortBy === 'name' ? 'price' : sortBy === 'price' ? 'quantity' : 'name');
                                            setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
                                        }}>
                                            Sort by {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)} {sortDir === 'asc' ? '↑' : '↓'}
                                        </SecondaryButton>
                                        {isAdmin && (
                                            <PrimaryButton onClick={openAddModal}>+ Add Product</PrimaryButton>
                                        )}
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
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
                                                <th className="py-2 px-3 text-left font-semibold text-muted-foreground border-b border-muted">Image</th>
                                                <th className="py-2 px-3 text-left font-semibold text-muted-foreground border-b border-muted">Product</th>
                                                <th className="py-2 px-3 text-left font-semibold text-muted-foreground border-b border-muted">Description</th>
                                                <th className="py-2 px-3 text-left font-semibold text-muted-foreground border-b border-muted">Price</th>
                                                <th className="py-2 px-3 text-left font-semibold text-muted-foreground border-b border-muted">Status</th>
                                                <th className="py-2 px-3 text-left font-semibold text-muted-foreground border-b border-muted">Inventory</th>
                                                {isAdmin && <th className="py-2 px-3 text-left font-semibold text-muted-foreground border-b border-muted">Actions</th>}
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
                                                                aria-label={`View image for ${product.name}`}
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
                                                    <td className="py-2 px-3 whitespace-nowrap">{product.description}</td>
                                                    <td className="py-2 px-3 whitespace-nowrap">{Number(product.price).toLocaleString(undefined, { style: 'currency', currency: 'USD' })}</td>
                                                    <td className="py-2 px-3">
                                                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">Active</span>
                                                    </td>
                                                    <td className="py-2 px-3">
                                                        {product.quantity > 0 ? (
                                                            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">{product.quantity} in stock</span>
                                                        ) : (
                                                            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">Out of Stock</span>
                                                        )}
                                                    </td>
                                                    {isAdmin && (
                                                        <td className="py-2 px-3 whitespace-nowrap">
                                                            <SecondaryButton onClick={() => openEditModal(product)} className="mr-2">Edit</SecondaryButton>
                                                            <DangerButton onClick={() => handleDelete(product.id)}>Delete</DangerButton>
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
                            <div className="p-6">
                                <h3 className="text-lg font-semibold mb-4">{editing ? 'Edit Product' : 'Add Product'}</h3>
                                <form onSubmit={handleModalSubmit} className="space-y-4">
                                    <TextInput name="name" value={form.name} onChange={handleChange} placeholder="Name" required className="w-full" />
                                    <TextInput name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full" />
                                    <TextInput name="price" value={form.price} onChange={handleChange} placeholder="Price" type="number" min="0" step="0.01" required className="w-full" />
                                    {!editing && (
                                        <TextInput name="quantity" value={form.quantity} onChange={handleChange} placeholder="Initial Quantity" type="number" min="0" required className="w-full" />
                                    )}
                                    <label className="block text-sm font-medium text-muted-foreground">Product Image</label>
                                    <input
                                        type="file"
                                        name="image"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition"
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
                                        <SecondaryButton type="button" onClick={closeModal}>Cancel</SecondaryButton>
                                        <PrimaryButton type="submit">{editing ? 'Update' : 'Add'} Product</PrimaryButton>
                                    </div>
                                </form>
                            </div>
                        </Modal>
                        {imageModal.open && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center">
                                <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setImageModal({ open: false, src: '', alt: '' })} />
                                <div className="relative z-10">
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
                            </div>
                        )}
                        <Modal show={showDeleteModal} onClose={cancelDelete} maxWidth="sm">
                            <div className="p-6 flex flex-col items-center">
                                <h3 className="text-lg font-semibold mb-2 text-center">Delete Product</h3>
                                <p className="mb-4 text-center text-muted-foreground">Are you sure you want to delete this product? This action cannot be undone.</p>
                                <div className="flex gap-2 justify-center">
                                    <SecondaryButton type="button" onClick={cancelDelete}>Cancel</SecondaryButton>
                                    <DangerButton type="button" onClick={confirmDelete}>Delete</DangerButton>
                                </div>
                            </div>
                        </Modal>
                    </div>
                </div>
            </AuthenticatedLayout>
        </>
    );
}
