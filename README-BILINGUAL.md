# Bilingual (English-Khmer) Functionality

This document provides an overview of the bilingual functionality implemented in the Stock Management System.

## Features

- Switch between English and Khmer languages throughout the application
- Language selection is persisted across sessions
- Smooth language toggle with animated dropdown
- Fully responsive UI that works on mobile and desktop
- Flag icons for clear language identification
- Auto-detects the user's preferred language on first visit

## Implementation Details

The bilingual system consists of several components:

### 1. Language Files

- Located in `resources/lang/en/app.php` and `resources/lang/kh/app.php`
- These files contain key-value pairs for all translatable strings
- To add a new translation, add a new key-value pair to both files

### 2. Language Context Provider

- Located in `resources/js/Context/LanguageContext.jsx`
- Manages the application's language state
- Provides a translation function `t()` for use in components
- Saves language preference to localStorage
- Fetches translations from the backend

### 3. Language Switcher Component

- Located in `resources/js/Components/LanguageSwitcher.jsx`
- Dropdown UI for switching between languages
- Shows flags for each language option
- Indicates the currently selected language

### 4. Backend Controller

- Located in `app/Http/Controllers/TranslationController.php`
- Serves translation strings based on the requested language
- Accessible via the `/api/translations?lang={lang}` endpoint

## How to Use

### Translating a Component

To make a component use translations:

```jsx
import { useLanguage } from '@/Context/LanguageContext';

function MyComponent() {
  const { t } = useLanguage();
  
  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
    </div>
  );
}
```

### Adding New Translations

1. Open both language files:
   - `resources/lang/en/app.php`
   - `resources/lang/kh/app.php`

2. Add a new entry with the same key to both files:

```php
// In resources/lang/en/app.php
'new_feature' => 'New Feature',

// In resources/lang/kh/app.php
'new_feature' => 'មុខងារថ្មី',
```

3. Use the new translation key in your components:

```jsx
<h2>{t('new_feature')}</h2>
```

## Technical Notes

- The language switcher uses shadcn-style UI components
- The frontend fetches translations via an API call
- HTML lang attribute is updated automatically when language changes
- Flag SVGs are implemented as React components
- Translations are loaded only once per language switch to minimize API calls

## Maintenance

To maintain the bilingual functionality:

1. Always add new strings to both language files
2. Use the `t()` function for all user-facing strings
3. Test the UI in both languages after making changes
4. Consider the text length in both languages when designing UI layouts 