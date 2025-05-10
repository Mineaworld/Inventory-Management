import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';

export default function Suppliers({ suppliers, errors }) {
    const { auth } = usePage().props;
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [error, setError] = useState(errors?.error || '');

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
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Suppliers</h2>
                    <Link href={route('suppliers.create')}>
                        <PrimaryButton>Add Supplier</PrimaryButton>
                    </Link>
                </div>
                <div className="w-full max-w-6xl mx-auto flex flex-col gap-6">
                    {error && (
                        <div className="mb-4 text-red-600 bg-red-100 border border-red-300 rounded p-2">
                            {error}
                        </div>
                    )}
                    <div className="bg-white rounded shadow overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 text-sm border-separate border-spacing-y-1">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
                                    <th className="px-4 py-2"></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {suppliers.map((supplier) => (
                                    <tr key={supplier.id} className="border border-muted/10 hover:bg-primary/5 transition rounded-lg">
                                        <td className="px-4 py-2 font-semibold">{supplier.name}</td>
                                        <td className="px-4 py-2">{supplier.email}</td>
                                        <td className="px-4 py-2">{supplier.phone}</td>
                                        <td className="px-4 py-2">{supplier.address}</td>
                                        <td className="px-4 py-2 flex gap-2">
                                            <Link href={route('suppliers.edit', supplier.id)}>
                                                <PrimaryButton>Edit</PrimaryButton>
                                            </Link>
                                            <DangerButton onClick={() => handleDelete(supplier)}>
                                                Delete
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
                        <h2 className="text-lg font-bold mb-4">Delete Supplier</h2>
                        <p>Are you sure you want to delete <span className="font-semibold">{selectedSupplier?.name}</span>? This action cannot be undone.</p>
                        {error && <div className="text-red-600 mt-2">{error}</div>}
                        <div className="mt-6 flex justify-end gap-2">
                            <button className="px-4 py-2 rounded bg-gray-200" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                            <DangerButton onClick={confirmDelete}>Delete</DangerButton>
                        </div>
                    </div>
                </Modal>
            </div>
        </AuthenticatedLayout>
    );
} 