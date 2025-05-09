<?php

namespace App\Http\Controllers;

use App\Models\StockMovement;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class StockMovementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $movements = StockMovement::with(['product', 'user'])->orderBy('created_at', 'desc')->get();
        return response()->json($movements);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = Auth::user();
        if (!($user->hasRole('Admin') || $user->hasRole('Employee'))) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'type' => 'required|in:purchase,sale,return,adjustment',
            'quantity' => 'required|integer|min:1',
            'note' => 'nullable|string|max:255',
        ]);

        $product = Product::findOrFail($validated['product_id']);

        // Adjust product quantity based on movement type
        switch ($validated['type']) {
            case 'purchase':
            case 'return':
                $product->quantity += $validated['quantity'];
                break;
            case 'sale':
            case 'adjustment':
                if ($product->quantity < $validated['quantity']) {
                    return response()->json(['error' => 'Not enough stock for this operation.'], 400);
                }
                $product->quantity -= $validated['quantity'];
                break;
        }
        $product->save();

        $movement = StockMovement::create([
            'product_id' => $product->id,
            'user_id' => $user->id,
            'type' => $validated['type'],
            'quantity' => $validated['quantity'],
            'note' => $validated['note'] ?? null,
        ]);

        return response()->json($movement->load(['product', 'user']), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
