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
import { useLanguage } from '@/Context/LanguageContext';

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
    const { t } = useLanguage();
    const user = auth && auth.user;
    const isAdmin = user && user.role && user.role.name === 'Admin';

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/categories');
            setCategories(res.data);
        } catch (err) {
            setNotification({ type: 'error', message: t('failed_to_load_categories') });
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
            setNotification({ type: 'success', message: t('category_added') });
            fetchCategories();
        } catch (err) {
            if (err.response && err.response.data && err.response.data.errors) {
                setErrors(err.response.data.errors);
                if (err.response.data.errors.name) {
                    toast(<div><b>{t('error')}</b><div>{err.response.data.errors.name}</div></div>);
                } else {
                    toast(<div><b>{t('error')}</b><div>{t('failed_to_add_category')}</div></div>);
                }
            } else {
                toast(<div><b>{t('error')}</b><div>{t('failed_to_add_category')}</div></div>);
            }
        }
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        setErrors({});
        try {
            await axios.put(`/api/categories/${selectedCategory.id}`, form);
            setShowEditModal(false);
            setNotification({ type: 'success', message: t('category_updated') });
            fetchCategories();
        } catch (err) {
            if (err.response && err.response.data && err.response.data.errors) {
                setErrors(err.response.data.errors);
                if (err.response.data.errors.name) {
                    toast(<div><b>{t('error')}</b><div>{err.response.data.errors.name}</div></div>);
                } else {
                    toast(<div><b>{t('error')}</b><div>{t('failed_to_update_category')}</div></div>);
                }
            } else {
                toast(<div><b>{t('error')}</b><div>{t('failed_to_update_category')}</div></div>);
            }
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`/api/categories/${selectedCategory.id}`);
            setShowDeleteModal(false);
            setNotification({ type: 'success', message: t('category_deleted') });
            fetchCategories();
        } catch (err) {
            setNotification({ type: 'error', message: t('failed_to_delete_category') });
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
                <h1 className="text-2xl font-bold">{t('categories')}</h1>
                {isAdmin ? (
                    <PrimaryButton onClick={openAddModal}>{t('add_category')}</PrimaryButton>
                ) : (
                    <span className="text-sm text-gray-400">{t('only_admins_can_add_categories')}</span>
                )}
            </div>
            <div className="mb-4 flex items-center gap-2">
                <input
                    type="text"
                    placeholder={t('search_categories')}
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
                    <div>{t('loading')}</div>
                ) : (
                    <table className="min-w-full table-auto">
                        <thead>
                            <tr className="bg-gray-100 dark:bg-zinc-800">
                                <th className="px-4 py-2 text-left">{t('name')}</th>
                                <th className="px-4 py-2 text-left">{t('description')}</th>
                                <th className="px-4 py-2 text-right">{t('actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCategories.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="text-center py-4 text-gray-500">{t('no_categories_found')}</td>
                                </tr>
                            ) : (
                                filteredCategories.map((cat) => (
                                    <tr key={cat.id} className="border-b border-gray-100 dark:border-zinc-800">
                                        <td className="px-4 py-2 font-medium">{cat.name}</td>
                                        <td className="px-4 py-2">
                                            {cat.description && cat.description.trim() !== ''
                                                ? cat.description
                                                : <span className="italic text-gray-400">{t('no_description')}</span>
                                            }
                                        </td>
                                        <td className="px-4 py-2 text-right space-x-2">
                                            {isAdmin ? (
                                                <>
                                                    <SecondaryButton onClick={() => openEditModal(cat)}>{t('edit')}</SecondaryButton>
                                                    <DangerButton onClick={() => openDeleteModal(cat)}>{t('delete')}</DangerButton>
                                                </>
                                            ) : (
                                                <span className="text-xs text-gray-400">{t('no_permission')}</span>
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
                        <h2 className="text-base font-semibold mb-2">{t('add_category')}</h2>
                        <InputLabel htmlFor="name" value={t('name')} />
                        <TextInput id="name" name="name" value={form.name} onChange={handleInputChange} className="mt-1 block w-full" required autoFocus />
                        <InputError message={errors.name} className="mt-1" />
                        <InputLabel htmlFor="description" value={t('description')} className="mt-4" />
                        <TextInput id="description" name="description" value={form.description} onChange={handleInputChange} className="mt-1 block w-full" />
                        <InputError message={errors.description} className="mt-1" />
                        <div className="mt-6 flex justify-end gap-2">
                            <SecondaryButton type="button" onClick={() => setShowAddModal(false)}>{t('cancel')}</SecondaryButton>
                            <PrimaryButton type="submit">{t('add')}</PrimaryButton>
                        </div>
                    </form>
                ) : (
                    <div className="p-4 text-center text-gray-400">{t('only_admins_can_add_categories')}</div>
                )}
            </Modal>
            {/* Edit Modal */}
            <Modal show={showEditModal} onClose={() => setShowEditModal(false)} maxWidth="xs">
                {isAdmin ? (
                    <form onSubmit={handleEdit} className="p-4 text-sm w-full max-w-xs mx-auto rounded-xl shadow-lg bg-white dark:bg-zinc-900">
                        <h2 className="text-base font-semibold mb-2">{t('edit_category')}</h2>
                        <InputLabel htmlFor="name" value={t('name')} />
                        <TextInput id="name" name="name" value={form.name} onChange={handleInputChange} className="mt-1 block w-full" required autoFocus />
                        <InputError message={errors.name} className="mt-1" />
                        <InputLabel htmlFor="description" value={t('description')} className="mt-4" />
                        <TextInput id="description" name="description" value={form.description} onChange={handleInputChange} className="mt-1 block w-full" />
                        <InputError message={errors.description} className="mt-1" />
                        <div className="mt-6 flex justify-end gap-2">
                            <SecondaryButton type="button" onClick={() => setShowEditModal(false)}>{t('cancel')}</SecondaryButton>
                            <PrimaryButton type="submit">{t('save')}</PrimaryButton>
                        </div>
                    </form>
                ) : (
                    <div className="p-4 text-center text-gray-400">{t('only_admins_can_edit_categories')}</div>
                )}
            </Modal>
            {/* Delete Modal */}
            <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)} maxWidth="sm">
                {isAdmin ? (
                    <div className="p-6">
                        <h2 className="text-lg font-bold mb-4">{t('delete_category')}</h2>
                        <p>{t('are_you_sure_delete')} <span className="font-semibold">{selectedCategory?.name}</span>?</p>
                        <div className="mt-6 flex justify-end gap-2">
                            <SecondaryButton type="button" onClick={() => setShowDeleteModal(false)}>{t('cancel')}</SecondaryButton>
                            <DangerButton type="button" onClick={handleDelete}>{t('delete')}</DangerButton>
                        </div>
                    </div>
                ) : (
                    <div className="p-6 text-center text-gray-400">{t('only_admins_can_delete_categories')}</div>
                )}
            </Modal>
        </div>
    );
}

Category.layout = page => <AuthenticatedLayout children={page} />; 