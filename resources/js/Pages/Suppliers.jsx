import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';
import { useLanguage } from '@/Context/LanguageContext';

export default function Suppliers({ suppliers, errors }) {
    const { auth } = usePage().props;
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [error, setError] = useState(errors?.error || '');
    const { t } = useLanguage();

    const handleDelete = (supplier) => {
        setSelectedSupplier(supplier);
        setShowDeleteModal(true);
        setError('');
    };

    const confirmDelete = () => {
        router.delete(route('suppliers.destroy', selectedSupplier.id), {
            onError: (err) => setError(err.error || 'Failed to delete supplier.'),
            onSuccess: () => {
                setShowDeleteModal(false);
                setSelectedSupplier(null);
            },
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="flex flex-col gap-4 p-4 md:p-6 bg-background min-h-screen">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 mb-2">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">{t('suppliers')}</h2>
                    <Link href={route('suppliers.create')}>
                        <PrimaryButton>{t('add_supplier')}</PrimaryButton>
                    </Link>
                </div>
                <div className="w-full max-w-6xl mx-auto flex flex-col gap-6">
                    {error && (
                        <div className="mb-4 text-red-600 bg-red-100 dark:bg-red-900/40 border border-red-300 dark:border-red-700 rounded p-2">
                            {error}
                        </div>
                    )}
                    <div className="bg-white dark:bg-zinc-900 rounded shadow overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-700 text-sm border-separate border-spacing-y-1">
                            <thead className="bg-gray-50 dark:bg-zinc-800">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">{t('name')}</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">{t('email')}</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">{t('phone')}</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">{t('address')}</th>
                                    <th className="px-4 py-2"></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-zinc-900 divide-y divide-gray-200 dark:divide-zinc-800">
                                {suppliers.map((supplier) => (
                                    <tr key={supplier.id} className="border border-muted/10 dark:border-zinc-700 hover:bg-primary/5 dark:hover:bg-primary/10 transition rounded-lg">
                                        <td className="px-4 py-2 font-semibold text-foreground dark:text-gray-100">{supplier.name}</td>
                                        <td className="px-4 py-2 text-foreground dark:text-gray-100">{supplier.email}</td>
                                        <td className="px-4 py-2 text-foreground dark:text-gray-100">{supplier.phone}</td>
                                        <td className="px-4 py-2 text-foreground dark:text-gray-100">{supplier.address}</td>
                                        <td className="px-4 py-2 flex gap-2">
                                            <Link href={route('suppliers.edit', supplier.id)}>
                                                <PrimaryButton>{t('edit')}</PrimaryButton>
                                            </Link>
                                            <DangerButton onClick={() => handleDelete(supplier)}>
                                                {t('delete')}
                                            </DangerButton>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                    <div className="p-6">
                        <h2 className="text-lg font-bold mb-4">{t('delete_supplier')}</h2>
                        <p>{t('are_you_sure_delete')} <span className="font-semibold">{selectedSupplier?.name}</span>? {t('this_action_cannot_be_undone')}</p>
                        {error && <div className="text-red-600 mt-2">{error}</div>}
                        <div className="mt-6 flex justify-end gap-2">
                            <button className="px-4 py-2 rounded bg-gray-200" onClick={() => setShowDeleteModal(false)}>{t('cancel')}</button>
                            <DangerButton onClick={confirmDelete}>{t('delete')}</DangerButton>
                        </div>
                    </div>
                </Modal>
            </div>
        </AuthenticatedLayout>
    );
} 