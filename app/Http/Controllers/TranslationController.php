<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

class TranslationController extends Controller
{
    public function index(Request $request)
    {
        try {
            $lang = $request->query('lang', 'en');
            
            // Validate language
            if (!in_array($lang, ['en', 'kh'])) {
                $lang = 'en';
            }
            
            // Try to get translations from cache (10 minutes)
            $cacheKey = "translations_{$lang}";
            if (Cache::has($cacheKey)) {
                return response()->json(Cache::get($cacheKey));
            }
            
            // Get translations from the app.php file
            $path = resource_path("lang/{$lang}/app.php");
            
            if (File::exists($path)) {
                $translations = require $path;
                
                // Cache the translations for 10 minutes
                Cache::put($cacheKey, $translations, 600);
                
                return response()->json($translations);
            }
            
            // If file doesn't exist, try to create directory structure and empty translation file
            if (!File::exists(resource_path("lang/{$lang}"))) {
                File::makeDirectory(resource_path("lang/{$lang}"), 0755, true);
            }
            
            // Return empty translations with a 404 status
            Log::warning("Translation file not found: {$path}");
            return response()->json([], 404);
        } catch (\Exception $e) {
            Log::error("Error loading translations: " . $e->getMessage());
            return response()->json(['error' => 'Failed to load translations'], 500);
        }
    }
} 