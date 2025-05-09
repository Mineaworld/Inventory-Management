<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProductController extends Controller
{
    /**
     * Display a listing of the products.
     */
    public function index()
    {
        // All authenticated users can view products
        $products = Product::all();
        return response()->json($products);
    }

    /**
     * Show the form for creating a new product.
     */
    public function create()
    {
        // For API/SPA, you may not need this
    }

    /**
     * Store a newly created product in storage.
     */
    public function store(Request $request)
    {
        // Only Admin can create products
        if (!Auth::user()->hasRole('Admin')) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'quantity' => 'required|integer|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);
        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('products', 'public');
        }
        $product = Product::create($validated);
        return response()->json($product, 201);
    }

    /**
     * Display the specified product.
     */
    public function show(Product $product)
    {
        return response()->json($product);
    }

    /**
     * Show the form for editing the specified product.
     */
    public function edit(Product $product)
    {
        // For API/SPA, you may not need this
    }

    /**
     * Update the specified product in storage.
     */
    public function update(Request $request, Product $product)
    {
        // Only Admin can update products
        if (!Auth::user()->hasRole('Admin')) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'quantity' => 'required|integer|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);
        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('products', 'public');
        }
        $product->update($validated);
        return response()->json($product);
    }

    /**
     * Remove the specified product from storage.
     */
    public function destroy(Product $product)
    {
        // Only Admin can delete products
        if (!Auth::user()->hasRole('Admin')) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        $product->delete();
        return response()->json(null, 204);
    }
}
