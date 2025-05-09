<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\StockMovement;
use Illuminate\Support\Facades\Auth;

class SearchController extends Controller
{
    public function search(Request $request)
    {
        $query = $request->input('q', '');
        if (!$query) {
            return response()->json(['products' => [], 'movements' => []]);
        }

        // Products: match name or description
        $products = Product::where('name', 'like', "%$query%")
            ->orWhere('description', 'like', "%$query%")
            ->limit(10)
            ->get();

        // Stock Movements: match note, type, or related product name
        $movements = StockMovement::with('product', 'user')
            ->where('note', 'like', "%$query%")
            ->orWhere('type', 'like', "%$query%")
            ->orWhereHas('product', function($q) use ($query) {
                $q->where('name', 'like', "%$query%")
                  ->orWhere('description', 'like', "%$query%") ;
            })
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        return response()->json([
            'products' => $products,
            'movements' => $movements,
        ]);
    }
} 