<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\StockMovement;
use Illuminate\Support\Facades\Auth;

class ReportController extends Controller
{
    // Inventory report: all products, highlight low stock
    public function inventory()
    {
        $user = Auth::user();
        if (!($user->hasRole('Admin') || $user->hasRole('Manager'))) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $lowStockThreshold = 10; // You can adjust this value
        $products = Product::all()->map(function ($product) use ($lowStockThreshold) {
            $product->low_stock = $product->quantity < $lowStockThreshold;
            return $product;
        });

        return response()->json($products);
    }

    // Sales report: total sales per product
    public function sales()
    {
        $user = Auth::user();
        if (!($user->hasRole('Admin') || $user->hasRole('Manager'))) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $sales = StockMovement::where('type', 'sale')
            ->with('product')
            ->get()
            ->groupBy('product_id')
            ->map(function ($group) {
                return [
                    'product' => $group->first()->product->name ?? 'Unknown',
                    'total_sales' => $group->sum('quantity'),
                ];
            })
            ->values();

        return response()->json($sales);
    }
}
