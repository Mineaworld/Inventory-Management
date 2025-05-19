import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useToast } from '@/hooks/use-toast';
import { usePage } from '@inertiajs/react';

export default function Category() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [form, setForm] = useState({ name: '', description: '' });
    const [errors, setErrors] = useState({});
    const [notification, setNotification] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const { toast } = useToast();
    const { auth } = usePage().props;
    const user = auth && auth.user;
    const isAdmin = user && user.role && user.role.name === 'Admin';

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/categories');
            setCategories(res.data);
        } catch (err) {
            setNotification({ type: 'error', message: 'Failed to load categories.' });
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleInputChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const openAddModal = () => {
        setForm({ name: '', description: '' });
        setErrors({});
        setShowAddModal(true);
    };

    const openEditModal = (category) => {
        setSelectedCategory(category);
        setForm({ name: category.name, description: category.description || '' });
        setErrors({});
        setShowEditModal(true);
    };

    const openDeleteModal = (category) => {
        setSelectedCategory(category);
        setShowDeleteModal(true);
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        setErrors({});
        try {
            await axios.post('/api/categories', form);
            setShowAddModal(false);
            setNotification({ type: 'success', message: 'Category added successfully.' });
            fetchCategories();
        } catch (err) {
            if (err.response && err.response.data && err.response.data.errors) {
                setErrors(err.response.data.errors);
                if (err.response.data.errors.name) {
                    toast(<div><b>Error</b><div>{err.response.data.errors.name}</div></div>);
                } else {
                    toast(<div><b>Error</b><div>Failed to add category.</div></div>);
                }
            } else {
                toast(<div><b>Error</b><div>Failed to add category.</div></div>);
            }
        }
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        setErrors({});
        try {
            await axios.put(`/api/categories/${selectedCategory.id}`, form);
            setShowEditModal(false);
            setNotification({ type: 'success', message: 'Category updated successfully.' });
            fetchCategories();
        } catch (err) {
            if (err.response && err.response.data && err.response.data.errors) {
                setErrors(err.response.data.errors);
                if (err.response.data.errors.name) {
                    toast(<div><b>Error</b><div>{err.response.data.errors.name}</div></div>);
                } else {
                    toast(<div><b>Error</b><div>Failed to update category.</div></div>);
                }
            } else {
                toast(<div><b>Error</b><div>Failed to update category.</div></div>);
            }
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`/api/categories/${selectedCategory.id}`);
            setShowDeleteModal(false);
            setNotification({ type: 'success', message: 'Category deleted successfully.' });
            fetchCategories();
        } catch (err) {
            setNotification({ type: 'error', message: 'Failed to delete category.' });
        }
    };

    // Filter categories by search term
    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (cat.description && cat.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Categories</h1>
                {isAdmin ? (
                    <PrimaryButton onClick={openAddModal}>Add Category</PrimaryButton>
                ) : (
                    <span className="text-sm text-gray-400">Only admins can add categories.</span>
                )}
            </div>
            <div className="mb-4 flex items-center gap-2">
                <input
                    type="text"
                    placeholder="Search categories..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-muted bg-background dark:bg-zinc-800 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-full max-w-xs"
                />
            </div>
            {notification && (
                <div className={`mb-4 p-3 rounded ${notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{notification.message}</div>
            )}
            <div className="bg-white dark:bg-zinc-900 rounded shadow p-4">
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <table className="min-w-full table-auto">
                        <thead>
                            <tr className="bg-gray-100 dark:bg-zinc-800">
                                <th className="px-4 py-2 text-left">Name</th>
                                <th className="px-4 py-2 text-left">Description</th>
                                <th className="px-4 py-2 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCategories.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="text-center py-4 text-gray-500">No categories found.</td>
                                </tr>
                            ) : (
                                filteredCategories.map((cat) => (
                                    <tr key={cat.id} className="border-b border-gray-100 dark:border-zinc-800">
                                        <td className="px-4 py-2 font-medium">{cat.name}</td>
                                        <td className="px-4 py-2">
                                            {cat.description && cat.description.trim() !== ''
                                                ? cat.description
                                                : <span className="italic text-gray-400">No description</span>
                                            }
                                        </td>
                                        <td className="px-4 py-2 text-right space-x-2">
                                            {isAdmin ? (
                                                <>
                                                    <SecondaryButton onClick={() => openEditModal(cat)}>Edit</SecondaryButton>
                                                    <DangerButton onClick={() => openDeleteModal(cat)}>Delete</DangerButton>
                                                </>
                                            ) : (
                                                <span className="text-xs text-gray-400">No permission</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>
            {/* Add Modal */}
            <Modal show={showAddModal} onClose={() => setShowAddModal(false)} maxWidth="xs">
                {isAdmin ? (
                    <form onSubmit={handleAdd} className="p-4 text-sm w-full max-w-xs mx-auto rounded-xl shadow-lg bg-white dark:bg-zinc-900">
                        <h2 className="text-base font-semibold mb-2">Add Category</h2>
                        <InputLabel htmlFor="name" value="Name" />
                        <TextInput id="name" name="name" value={form.name} onChange={handleInputChange} className="mt-1 block w-full" required autoFocus />
                        <InputError message={errors.name} className="mt-1" />
                        <InputLabel htmlFor="description" value="Description" className="mt-4" />
                        <TextInput id="description" name="description" value={form.description} onChange={handleInputChange} className="mt-1 block w-full" />
                        <InputError message={errors.description} className="mt-1" />
                        <div className="mt-6 flex justify-end gap-2">
                            <SecondaryButton type="button" onClick={() => setShowAddModal(false)}>Cancel</SecondaryButton>
                            <PrimaryButton type="submit">Add</PrimaryButton>
                        </div>
                    </form>
                ) : (
                    <div className="p-4 text-center text-gray-400">Only admins can add categories.</div>
                )}
            </Modal>
            {/* Edit Modal */}
            <Modal show={showEditModal} onClose={() => setShowEditModal(false)} maxWidth="xs">
                {isAdmin ? (
                    <form onSubmit={handleEdit} className="p-4 text-sm w-full max-w-xs mx-auto rounded-xl shadow-lg bg-white dark:bg-zinc-900">
                        <h2 className="text-base font-semibold mb-2">Edit Category</h2>
                        <InputLabel htmlFor="name" value="Name" />
                        <TextInput id="name" name="name" value={form.name} onChange={handleInputChange} className="mt-1 block w-full" required autoFocus />
                        <InputError message={errors.name} className="mt-1" />
                        <InputLabel htmlFor="description" value="Description" className="mt-4" />
                        <TextInput id="description" name="description" value={form.description} onChange={handleInputChange} className="mt-1 block w-full" />
                        <InputError message={errors.description} className="mt-1" />
                        <div className="mt-6 flex justify-end gap-2">
                            <SecondaryButton type="button" onClick={() => setShowEditModal(false)}>Cancel</SecondaryButton>
                            <PrimaryButton type="submit">Save</PrimaryButton>
                        </div>
                    </form>
                ) : (
                    <div className="p-4 text-center text-gray-400">Only admins can edit categories.</div>
                )}
            </Modal>
            {/* Delete Modal */}
            <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)} maxWidth="sm">
                {isAdmin ? (
                    <div className="p-6">
                        <h2 className="text-lg font-bold mb-4">Delete Category</h2>
                        <p>Are you sure you want to delete <span className="font-semibold">{selectedCategory?.name}</span>?</p>
                        <div className="mt-6 flex justify-end gap-2">
                            <SecondaryButton type="button" onClick={() => setShowDeleteModal(false)}>Cancel</SecondaryButton>
                            <DangerButton type="button" onClick={handleDelete}>Delete</DangerButton>
                        </div>
                    </div>
                ) : (
                    <div className="p-6 text-center text-gray-400">Only admins can delete categories.</div>
                )}
            </Modal>
        </div>
    );
}

Category.layout = page => <AuthenticatedLayout children={page} />; 