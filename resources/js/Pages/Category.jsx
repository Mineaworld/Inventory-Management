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
            } else {
                setNotification({ type: 'error', message: 'Failed to add category.' });
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
            } else {
                setNotification({ type: 'error', message: 'Failed to update category.' });
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
                <PrimaryButton onClick={openAddModal}>Add Category</PrimaryButton>
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
                                        <td className="px-4 py-2">{cat.description}</td>
                                        <td className="px-4 py-2 text-right space-x-2">
                                            <SecondaryButton onClick={() => openEditModal(cat)}>Edit</SecondaryButton>
                                            <DangerButton onClick={() => openDeleteModal(cat)}>Delete</DangerButton>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>
            {/* Add Modal */}
            <Modal show={showAddModal} onClose={() => setShowAddModal(false)}>
                <form onSubmit={handleAdd} className="p-6">
                    <h2 className="text-lg font-bold mb-4">Add Category</h2>
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
            </Modal>
            {/* Edit Modal */}
            <Modal show={showEditModal} onClose={() => setShowEditModal(false)}>
                <form onSubmit={handleEdit} className="p-6">
                    <h2 className="text-lg font-bold mb-4">Edit Category</h2>
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
            </Modal>
            {/* Delete Modal */}
            <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)} maxWidth="sm">
                <div className="p-6">
                    <h2 className="text-lg font-bold mb-4">Delete Category</h2>
                    <p>Are you sure you want to delete <span className="font-semibold">{selectedCategory?.name}</span>?</p>
                    <div className="mt-6 flex justify-end gap-2">
                        <SecondaryButton type="button" onClick={() => setShowDeleteModal(false)}>Cancel</SecondaryButton>
                        <DangerButton type="button" onClick={handleDelete}>Delete</DangerButton>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

Category.layout = page => <AuthenticatedLayout children={page} />; 