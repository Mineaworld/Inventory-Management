import React from 'react';
import { useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';

export default function Edit({ supplier }) {
    const { auth } = usePage().props;
    const { data, setData, put, processing, errors } = useForm({
        name: supplier.name || '',
        email: supplier.email || '',
        phone: supplier.phone || '',
        address: supplier.address || '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('suppliers.update', supplier.id));
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="flex flex-col gap-4 p-4 md:p-6 bg-background dark:bg-zinc-950 min-h-screen">
                <div className="w-full max-w-lg mx-auto flex flex-col gap-6">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground mb-6">Edit Supplier</h1>
                    <form onSubmit={submit} className="space-y-4 bg-white dark:bg-zinc-900 p-6 rounded shadow">
                        <div>
                            <InputLabel htmlFor="name" value="Name" className="dark:text-gray-200" />
                            <TextInput id="name" value={data.name} onChange={e => setData('name', e.target.value)} className="mt-1 block w-full dark:bg-zinc-800 dark:text-gray-100" required autoFocus />
                            <InputError message={errors.name} className="mt-1" />
                        </div>
                        <div>
                            <InputLabel htmlFor="email" value="Email" className="dark:text-gray-200" />
                            <TextInput id="email" type="email" value={data.email} onChange={e => setData('email', e.target.value)} className="mt-1 block w-full dark:bg-zinc-800 dark:text-gray-100" />
                            <InputError message={errors.email} className="mt-1" />
                        </div>
                        <div>
                            <InputLabel htmlFor="phone" value="Phone" className="dark:text-gray-200" />
                            <TextInput id="phone" value={data.phone} onChange={e => setData('phone', e.target.value)} className="mt-1 block w-full dark:bg-zinc-800 dark:text-gray-100" />
                            <InputError message={errors.phone} className="mt-1" />
                        </div>
                        <div>
                            <InputLabel htmlFor="address" value="Address" className="dark:text-gray-200" />
                            <TextInput id="address" value={data.address} onChange={e => setData('address', e.target.value)} className="mt-1 block w-full dark:bg-zinc-800 dark:text-gray-100" />
                            <InputError message={errors.address} className="mt-1" />
                        </div>
                        <div className="flex justify-end">
                            <PrimaryButton disabled={processing}>Update</PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 