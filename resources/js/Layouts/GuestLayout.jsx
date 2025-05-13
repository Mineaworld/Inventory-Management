import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-gray-100 to-blue-50 pt-6 sm:justify-center sm:pt-0">
            <div className="mb-2 mt-4 transform transition-all duration-300 hover:scale-110">
                <Link href="/">
                    <ApplicationLogo className="h-24 w-24 fill-current text-blue-600" />
                </Link>
            </div>
            <h1 className="mb-4 text-3xl font-bold text-gray-800">Inventory Management System</h1>

            <div className="mt-2 w-full max-w-md overflow-hidden rounded-xl bg-white px-8 py-6 shadow-2xl transition-all duration-300 hover:shadow-lg sm:rounded-2xl">
                {children}
            </div>
            
            <div className="mt-6 text-center text-sm text-gray-600">
                &copy; {new Date().getFullYear()} Inventory Management System. All rights reserved.
            </div>
        </div>
    );
}
