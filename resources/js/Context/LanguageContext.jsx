import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const LanguageContext = createContext();

// Default translations as a fallback
const DEFAULT_TRANSLATIONS = {
  en: {
    dashboard: 'Dashboard',
    products: 'Products',
    suppliers: 'Suppliers',
    stock_movements: 'Stock Movements',
    inventory: 'Inventory',
    reports: 'Reports',
    sales_overview: 'Sales Overview',
    logout: 'Logout',
    app_name: 'Stock Management',
    home: 'Home',
    english: 'English',
    khmer: 'Khmer',
    language: 'Language',
    search: 'Search',
    no_records: 'No Records Found',
    // Add more default translations as needed
    total_products: 'Total Products',
    total_categories: 'Total Categories',
    total_users: 'Total Users',
    recent_movements: 'Recent Movements',
    stock_summary: 'Stock Summary', 
    low_stock: 'Low Stock',
    movement_date: 'Movement Date',
    product_name: 'Product Name',
    movement_type: 'Movement Type',
    quantity: 'Quantity',
    actions: 'Actions',
    stock_in: 'Stock In',
    stock_out: 'Stock Out',
    add_product: 'Add Product',
    users: 'Users'
  },
  kh: {
    dashboard: 'ផ្ទាំងគ្រប់គ្រង',
    products: 'ផលិតផល',
    suppliers: 'អ្នកផ្គត់ផ្គង់',
    stock_movements: 'ចលនាស្តុក',
    inventory: 'សារពើភ័ណ្ឌ',
    reports: 'របាយការណ៍',
    sales_overview: 'ទិដ្ឋភាពលក់',
    logout: 'ចាកចេញ',
    app_name: 'ប្រព័ន្ធគ្រប់គ្រងស្តុក',
    home: 'ទំព័រដើម',
    english: 'អង់គ្លេស',
    khmer: 'ខ្មែរ',
    language: 'ភាសា',
    search: 'ស្វែងរក',
    no_records: 'មិនមានទិន្នន័យ',
    // Add more default translations as needed
    total_products: 'ផលិតផលសរុប',
    total_categories: 'ប្រភេទសរុប',
    total_users: 'អ្នកប្រើប្រាស់សរុប',
    recent_movements: 'ចលនាថ្មីៗ',
    stock_summary: 'សង្ខេបស្តុក',
    low_stock: 'ស្តុកទាប',
    movement_date: 'កាលបរិច្ឆេទចលនា',
    product_name: 'ឈ្មោះផលិតផល',
    movement_type: 'ប្រភេទចលនា',
    quantity: 'បរិមាណ',
    actions: 'សកម្មភាព',
    stock_in: 'ស្តុកចូល',
    stock_out: 'ស្តុកចេញ',
    add_product: 'បន្ថែមផលិតផល',
    users: 'អ្នកប្រើប្រាស់'
  }
};

export function useLanguage() {
  return useContext(LanguageContext);
}

export function LanguageProvider({ children }) {
  // Initialize language from localStorage or default to 'en'
  const savedLang = typeof window !== 'undefined' ? localStorage.getItem('app_language') : null;
  const initialLang = savedLang && (savedLang === 'en' || savedLang === 'kh') ? savedLang : 'en';
  
  const [lang, setLang] = useState(initialLang);
  const [translations, setTranslations] = useState(DEFAULT_TRANSLATIONS[initialLang] || DEFAULT_TRANSLATIONS.en);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load translations for the current language
    const loadTranslations = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        console.log(`Loading translations for language: ${lang}`);
        const response = await axios.get(`/api/translations?lang=${lang}`, {
          timeout: 5000 // Add a timeout to prevent hanging requests
        });
        
        console.log('Received translations:', response.data);
        
        if (response.data && typeof response.data === 'object' && Object.keys(response.data).length > 0) {
          // Merge with default translations to ensure all keys are present
          const mergedTranslations = {
            ...DEFAULT_TRANSLATIONS[lang],
            ...response.data
          };
          setTranslations(mergedTranslations);
        } else {
          // Use default translations if API returns empty
          console.log('Using default translations - API returned empty response');
          setTranslations(DEFAULT_TRANSLATIONS[lang] || DEFAULT_TRANSLATIONS.en);
        }
        
        // Store the selected language in localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('app_language', lang);
          
          // Set the HTML lang attribute
          document.documentElement.lang = lang === 'en' ? 'en' : 'km';
        }
      } catch (error) {
        console.error('Failed to load translations:', error);
        setError(error);
        // Fall back to default translations
        setTranslations(DEFAULT_TRANSLATIONS[lang] || DEFAULT_TRANSLATIONS.en);
      } finally {
        setIsLoading(false);
      }
    };

    loadTranslations();
  }, [lang]);

  // Translation function
  const t = (key) => {
    // If translation exists, return it
    if (translations[key]) {
      return translations[key];
    }
    // If not, check default translations as fallback
    if (DEFAULT_TRANSLATIONS[lang]?.[key]) {
      return DEFAULT_TRANSLATIONS[lang][key];
    }
    // If still not found, try English defaults as last resort
    if (DEFAULT_TRANSLATIONS.en?.[key]) {
      return DEFAULT_TRANSLATIONS.en[key];
    }
    // If all else fails, return the key itself
    return key;
  };

  // Toggle language function
  const toggleLanguage = () => {
    setLang(prevLang => prevLang === 'en' ? 'kh' : 'en');
  };

  // Change language function
  const changeLanguage = (newLang) => {
    if (newLang === 'en' || newLang === 'kh') {
      setLang(newLang);
    }
  };

  // Provide all language-related functions and state
  const value = {
    lang,
    t,
    toggleLanguage,
    changeLanguage,
    isLoading,
    error
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
} 