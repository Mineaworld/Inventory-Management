# Stock Management System

A modern full-stack inventory and stock management platform designed for SMB (Small to Medium-sized Business
). Built with React, Laravel, and Inertia.js, this system delivers a seamless, bilingual (English/Khmer) experience for managing products, suppliers, and stock movements with real-time updates and a clean, responsive UI.

---

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Bilingual Support](#bilingual-support)
- [Environment Variables](#environment-variables)
- [Database Migrations](#database-migrations)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Features

- **User Authentication & RBAC:** Secure login with role-based access (Admin, Manager, Staff).
- **Product Management:** Full CRUD, image uploads, supplier assignment, and real-time table updates.
- **Supplier Management:** CRUD, assignment to products, deletion protection, and advanced search.
- **Stock Movements:** Track purchases, sales, returns, and adjustments with audit trails.
- **Bilingual UI:** Seamless English/Khmer switching, persisted across sessions.
- **Responsive Design:** Mobile-first, accessible, and modern UI (Tailwind, Shadcn, Radix).
- **Notifications:** Toasts and feedback for all major actions.
- **API-Driven:** Clean separation of concerns, RESTful endpoints, and Inertia.js for SPA-like UX.
- **Extensible:** Modular React components, context providers, and scalable backend structure.
- **Testing:** Comprehensive backend feature and auth tests.

---

## Architecture

- **Frontend:** React (with Inertia.js), modular components (`resources/js/Components`), context providers for language and theme, and page-based routing (`resources/js/Pages`).
- **Backend:** Laravel 12+, RESTful controllers, service-based translation API, and robust Eloquent models.
- **Database:** MySQL (or compatible), with migrations and seeders.
- **Bilingual Support:** Language files in `resources/lang/en` and `resources/lang/kh`, with a dynamic translation API.

---

## Tech Stack

- **Frontend:** React 18, Inertia.js, Tailwind CSS, Shadcn UI, Radix UI, Heroicons, Vite
- **Backend:** Laravel 12 (PHP 8.2+), Inertia Laravel, Sanctum, Ziggy
- **Other:** Axios, Chart.js, React Table, Lucide, Country/Flag icons
- **Dev Tools:** Composer, npm/yarn, PHPUnit, Laravel Pint, Vite

---

## Getting Started

### Prerequisites

- Node.js v16+
- npm or yarn
- PHP 8.2+
- Composer
- MySQL (or compatible)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/stock-management-system.git
cd stock-management-system

# Install backend dependencies
composer install

# Install frontend dependencies
npm install
# or
yarn install

# Copy and configure environment
cp .env.example .env
# Edit .env for DB, mail, etc.

# Generate application key
php artisan key:generate

# Run database migrations
php artisan migrate

# Start development servers
php artisan serve
# In a separate terminal
npm run dev
# or
yarn dev
```

---

## Bilingual Support

- **Languages:** English and Khmer, with easy toggling via the UI.
- **Persistence:** Language preference is saved across sessions.
- **Implementation:** 
  - Language files: `resources/lang/en/app.php`, `resources/lang/kh/app.php`
  - Context provider: `resources/js/Context/LanguageContext.jsx`
  - Language switcher: `resources/js/Components/LanguageSwitcher.jsx`
  - Backend API: `/api/translations?lang={en|kh}` (see `TranslationController.php`)
- **Usage:** Use the `t()` function from the language context in React components for all user-facing strings.

---

## Environment Variables

Ensure your `.env` includes:

- `DB_CONNECTION`, `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`
- `APP_URL`
- `FILESYSTEM_DRIVER=public` (for image uploads)

---

## Database Migrations

```bash
php artisan migrate         # Run all migrations
php artisan migrate:rollback # Rollback last batch
```

---

## Testing

### Backend

```bash
php artisan test
```
- Feature and unit tests are located in `tests/Feature` and `tests/Unit`.
- Auth, profile, and registration flows are covered.

### Frontend

> _No automated frontend tests are currently configured. Add your preferred framework (e.g., Jest, React Testing Library) as needed._

---

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to your branch (`git push origin feature/YourFeature`)
5. Open a pull request

---

## License

This project is open-source and available under the MIT License.

---

## Contact

For questions, suggestions, or support:

- **Minea** – [minea.dyy@gmail.com](mailto:minea.dyy@gmail.com)
- [GitHub Issues](https://github.com/Mineaworld/Inventory-Management/issues)

---

**Pro tips:**
- Use the language switcher in the sidebar for instant translation.
- The system is designed for extensibility—add new modules or languages with minimal friction.
- For production, configure caching, queues, and storage according to Laravel best practices.