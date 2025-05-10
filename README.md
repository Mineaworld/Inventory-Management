# Stock Management System

A modern, full-stack inventory and stock management system built with React, Laravel, and Inertia.js. This application enables businesses to efficiently manage products, stock movements, and inventory levels with a user-friendly interface and robust backend.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Migrations](#database-migrations)
- [Usage](#usage)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Features

- User authentication and role-based access control (Admin, Employee, etc.)
- Product CRUD (Create, Read, Update, Delete) with image upload
- Real-time stock movement tracking (purchases, sales, adjustments, returns)
- Search, filter, and sort products
- Responsive and accessible UI
- Toast notifications for user feedback
- Secure file uploads and data validation

---

## Tech Stack

- **Frontend:** React, Inertia.js, Tailwind CSS
- **Backend:** Laravel (PHP)
- **Database:** MySQL (or compatible)
- **Other:** Axios, Shadcn UI, Radix UI, Vite

---

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- PHP (v8.1+)
- Composer
- MySQL or compatible database

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/stock-management-system.git
   cd stock-management-system
   ```

2. **Install backend dependencies:**
   ```bash
   composer install
   ```

3. **Install frontend dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

4. **Copy and configure environment files:**
   ```bash
   cp .env.example .env
   # Edit .env to match your local setup (DB, mail, etc.)
   ```

5. **Generate application key:**
   ```bash
   php artisan key:generate
   ```

6. **Run database migrations:**
   ```bash
   php artisan migrate
   ```

7. **Start the development servers:**
   ```bash
   # In one terminal
   php artisan serve

   # In another terminal
   npm run dev
   # or
   yarn dev
   ```

---

## Environment Variables

Ensure the following variables are set in your `.env` file:

- `DB_CONNECTION`, `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`
- `APP_URL`
- `FILESYSTEM_DRIVER=public` (for image uploads)

---

## Database Migrations

Run all migrations with:
```bash
php artisan migrate
```

To rollback:
```bash
php artisan migrate:rollback
```

---

## Usage

- Log in as an admin to manage products and stock.
- Add, edit, or delete products. Upload images for each product.
- Track stock movements (purchases, sales, returns, adjustments).
- Use the search and filter features to quickly find products.
- All actions provide real-time feedback via toast notifications.

---

## Testing

To run backend tests:
```bash
php artisan test
```

To run frontend tests (if available):
```bash
npm run test
# or
yarn test
```

---

## Contributing

Contributions are welcome! Please open issues or submit pull requests for any improvements or bug fixes.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a pull request

---

## License

This project is open-source and available under the [MIT License](LICENSE).

---

## Contact

For questions, suggestions, or support, please contact:

- **Minea** – [minea.dyy@gmail.com](mailto:your.email@example.com)
- [GitHub Issues](https://github.com/Mineaworld/Inventory-Management/issues)