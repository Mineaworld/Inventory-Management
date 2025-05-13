<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\TranslationController;
use App\Models\Supplier;

// Landing page (welcome screen)
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Dashboard page (requires login and email verification)
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// All routes in this group require the user to be logged in
Route::middleware('auth')->group(function () {
    // Profile management (edit, update, delete)
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Product resource routes (CRUD)
    Route::resource('products', \App\Http\Controllers\ProductController::class);

    // Custom page to manage products (shows all suppliers)
    Route::get('/manage-products', function () {
        return Inertia::render('Products', [
            'suppliers' => Supplier::select('id', 'name')->orderBy('name')->get(),
        ]);
    })->middleware(['auth', 'verified'])->name('products.manage');

    // Stock movement routes (list and create)
    Route::get('/stock-movements', [\App\Http\Controllers\StockMovementController::class, 'index'])->name('stock-movements.index');
    Route::post('/stock-movements', [\App\Http\Controllers\StockMovementController::class, 'store'])->name('stock-movements.store');

    // Custom page to manage stock movements
    Route::get('/manage-stock-movements', function () {
        return Inertia::render('StockMovements');
    })->middleware(['auth', 'verified'])->name('stock-movements.manage');

    // Inventory and sales report data (API endpoints)
    Route::get('/reports/inventory', [ReportController::class, 'inventory'])->name('reports.inventory');
    Route::get('/reports/sales', [ReportController::class, 'sales'])->name('reports.sales');

    // Inventory and sales report pages (UI)
    Route::get('/report/inventory', function () {
        return Inertia::render('InventoryReport');
    })->middleware(['auth', 'verified'])->name('report.inventory');
    Route::get('/report/sales', function () {
        return Inertia::render('SalesReport');
    })->middleware(['auth', 'verified'])->name('report.sales');

    // Search endpoint (for global search bar)
    Route::get('/search', [\App\Http\Controllers\SearchController::class, 'search'])->name('search');

    // Supplier resource routes (CRUD)
    Route::resource('suppliers', SupplierController::class);
});

// Translation API endpoint (no auth required)
Route::get('/api/translations', [TranslationController::class, 'index'])->name('translations.index');

// Auth routes (login, register, etc.)
require __DIR__.'/auth.php';
