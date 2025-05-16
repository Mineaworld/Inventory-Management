<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CategoryController extends Controller
{
    /**
     * Display a listing of the categories.
     */
    public function index()
    {
        $categories = Category::all();
        return response()->json($categories);
    }

    /**
     * Display the specified category.
     */
    public function show(Category $category)
    {
        return response()->json($category);
    }

    /**
     * Store a newly created category in storage.
     */
    public function store(Request $request)
    {
        if (!Auth::user()->hasRole('Admin')) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name',
            'description' => 'nullable|string',
        ]);
        $category = Category::create($validated);
        return response()->json($category, 201);
    }

    /**
     * Update the specified category in storage.
     */
    public function update(Request $request, Category $category)
    {
        //check if the user is admin
        if (!Auth::user()->hasRole('Admin')) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name,' . $category->id,
            'description' => 'nullable|string',
        ]);
        $category->update($validated);
        return response()->json($category);
    }

    /**
     * Remove the specified category from storage.
     */
    public function destroy(Category $category)
    {
        if (!Auth::user()->hasRole('Admin')) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        $category->delete();
        return response()->json(null, 204);
    }
} 