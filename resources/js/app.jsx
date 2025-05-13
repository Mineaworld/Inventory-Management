import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import React from 'react';
import { ThemeProvider } from 'next-themes';
import { LanguageProvider } from './Context/LanguageContext';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                <LanguageProvider>
                    <App {...props} />
                </LanguageProvider>
            </ThemeProvider>
        );

        // Dynamically inject the Google Fonts link for Kantumruy Pro
        const fontLink = document.createElement('link');
        fontLink.href = "https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;500;700&display=swap";
        fontLink.rel = "stylesheet";
        document.head.appendChild(fontLink);

        // Add a global style for font-family
        const globalFontStyle = document.createElement('style');
        globalFontStyle.innerHTML = `body, html, * { font-family: 'Kantumruy Pro', sans-serif !important; }`;
        document.head.appendChild(globalFontStyle);
    },
    progress: {
        color: '#4B5563',
    },
});
