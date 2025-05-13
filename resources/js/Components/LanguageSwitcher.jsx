import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/Context/LanguageContext';
import 'flag-icons/css/flag-icons.min.css';

export default function LanguageSwitcher() {
  const { lang, changeLanguage, t, isLoading } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close with escape key
  useEffect(() => {
    function handleEscKey(event) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, []);

  // Handle language change
  const handleLanguageChange = (newLang) => {
    changeLanguage(newLang);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 h-8 px-3 py-1 text-sm border border-gray-200 dark:border-gray-700 rounded-md bg-white/80 dark:bg-gray-800/80 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-all duration-300 hover:shadow-md"
        disabled={isLoading}
      >
        {lang === 'en' ? (
          <>
            <span className="fi fi-us w-5 h-3.5 rounded-sm shadow-sm" title="English" />
            <span className="hidden sm:inline">{t('english')}</span>
          </>
        ) : (
          <>
            <span className="fi fi-kh w-5 h-3.5 rounded-sm shadow-sm" title="Khmer" />
            <span className="hidden sm:inline">{t('khmer')}</span>
          </>
        )}
        <svg 
          width="12" 
          height="12" 
          viewBox="0 0 12 12" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className={`ml-1 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        >
          <path 
            d="M6 8.5L2 4.5H10L6 8.5Z" 
            fill="currentColor"
          />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-1 w-40 p-1 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50">
          <button
            onClick={() => handleLanguageChange('en')}
            className={`w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm ${
              lang === 'en' 
                ? 'bg-gray-100 dark:bg-gray-800 font-medium' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <span className="fi fi-us w-5 h-3.5 rounded-sm shadow-sm" title="English" />
            <span>{t('english')}</span>
            {lang === 'en' && (
              <svg className="ml-auto h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
          
          <div className="my-1 h-px bg-gray-100 dark:bg-gray-800" />
          
          <button
            onClick={() => handleLanguageChange('kh')}
            className={`w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm ${
              lang === 'kh' 
                ? 'bg-gray-100 dark:bg-gray-800 font-medium' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <span className="fi fi-kh w-5 h-3.5 rounded-sm shadow-sm" title="Khmer" />
            <span>{t('khmer')}</span>
            {lang === 'kh' && (
              <svg className="ml-auto h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
        </div>
      )}
    </div>
  );
} 