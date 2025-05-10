<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SupplierController;
use App\Models\Supplier;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::resource('products', \App\Http\Controllers\ProductController::class);
    Route::get('/manage-products', function () {
        return Inertia::render('Products', [
            'suppliers' => Supplier::select('id', 'name')->orderBy('name')->get(),
        ]);
    })->middleware(['auth', 'verified'])->name('products.manage');
    Route::get('/stock-movements', [\App\Http\Controllers\StockMovementController::class, 'index'])->name('stock-movements.index');
    Route::post('/stock-movements', [\App\Http\Controllers\StockMovementController::class, 'store'])->name('stock-movements.store');
    Route::get('/manage-stock-movements', function () {
        return Inertia::render('StockMovements');
    })->middleware(['auth', 'verified'])->name('stock-movements.manage');
    Route::get('/reports/inventory', [ReportController::class, 'inventory'])->name('reports.inventory');
    Route::get('/reports/sales', [ReportController::class, 'sales'])->name('reports.sales');
    Route::get('/report/inventory', function () {
        return Inertia::render('InventoryReport');
    })->middleware(['auth', 'verified'])->name('report.inventory');
    Route::get('/report/sales', function () {
        return Inertia::render('SalesReport');
    })->middleware(['auth', 'verified'])->name('report.sales');
    Route::get('/search', [\App\Http\Controllers\SearchController::class, 'search'])->name('search');
    Route::resource('suppliers', SupplierController::class);
});

require __DIR__.'/auth.php';
