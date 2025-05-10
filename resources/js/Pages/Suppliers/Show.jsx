import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Show({ supplier }) {
    const { auth } = usePage().props;
    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="flex flex-col gap-4 p-4 md:p-6 bg-background min-h-screen">
                <div className="w-full max-w-lg mx-auto flex flex-col gap-6">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground mb-6">Supplier Details</h1>
                    <div className="bg-white p-6 rounded shadow space-y-4">
                        <div>
                            <span className="font-semibold">Name:</span> {supplier.name}
                        </div>
                        <div>
                            <span className="font-semibold">Email:</span> {supplier.email}
                        </div>
                        <div>
                            <span className="font-semibold">Phone:</span> {supplier.phone}
                        </div>
                        <div>
                            <span className="font-semibold">Address:</span> {supplier.address}
                        </div>
                        <div className="flex justify-end">
                            <Link href={route('suppliers.edit', supplier.id)}>
                                <PrimaryButton>Edit</PrimaryButton>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 