import React from 'react';
import { useForm, usePage, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import SecondaryButton from '@/Components/SecondaryButton';

export default function Create() {
    const { auth } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        address: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('suppliers.store'));
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="flex flex-col gap-4 p-4 md:p-6 bg-background min-h-screen">
                <div className="w-full max-w-lg mx-auto flex flex-col gap-6">
                    <div className="flex items-center gap-2 mb-2">
                        <Link href={route('suppliers.index')}>
                            <SecondaryButton type="button">&larr; Back</SecondaryButton>
                        </Link>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Add Supplier</h1>
                    </div>
                    <form onSubmit={submit} className="space-y-4 bg-white p-6 rounded shadow">
                        <div>
                            <InputLabel htmlFor="name" value="Name" />
                            <TextInput id="name" value={data.name} onChange={e => setData('name', e.target.value)} className="mt-1 block w-full" required autoFocus />
                            <InputError message={errors.name} className="mt-1" />
                        </div>
                        <div>
                            <InputLabel htmlFor="email" value="Email" />
                            <TextInput id="email" type="email" value={data.email} onChange={e => setData('email', e.target.value)} className="mt-1 block w-full" />
                            <InputError message={errors.email} className="mt-1" />
                        </div>
                        <div>
                            <InputLabel htmlFor="phone" value="Phone" />
                            <TextInput id="phone" value={data.phone} onChange={e => setData('phone', e.target.value)} className="mt-1 block w-full" />
                            <InputError message={errors.phone} className="mt-1" />
                        </div>
                        <div>
                            <InputLabel htmlFor="address" value="Address" />
                            <TextInput id="address" value={data.address} onChange={e => setData('address', e.target.value)} className="mt-1 block w-full" />
                            <InputError message={errors.address} className="mt-1" />
                        </div>
                        <div className="flex justify-end">
                            <PrimaryButton disabled={processing}>Save</PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 