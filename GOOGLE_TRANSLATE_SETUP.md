# Google Translate API Setup Guide

## Quick Setup Steps

### 1. Enable Google Cloud Translation API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project `wedding-8bf55` (or create a new one)
3. Enable the **Cloud Translation API**:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Cloud Translation API"
   - Click "Enable"

### 2. Create API Key

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy the generated API key
4. (Optional but recommended) Restrict the API key:
   - Click "Restrict Key"
   - Under "API restrictions", select "Restrict key"
   - Select only "Cloud Translation API"
   - Under "Website restrictions", add your domain

### 3. Update Environment File

Replace `your_google_cloud_api_key_here` in `.env.local` with your actual API key:

```bash
NEXT_PUBLIC_GOOGLE_CLOUD_API_KEY=AIza...your_actual_api_key_here
```

### 4. Test the Translation

The translation will now work automatically when users toggle between Khmer (ខ្មែរ) and English on the invitation page.

## Features Added

✅ **Auto-translation of venue address** when language is switched
✅ **Loading indicator** while translation is in progress  
✅ **Fallback to original text** if translation fails
✅ **Extensible system** - easy to add more fields for translation

## How It Works

1. **Language Toggle**: When user clicks EN/ខ្មែរ buttons
2. **Auto-Detection**: System detects if content needs translation
3. **Google Translate**: Calls Google Cloud Translation API
4. **Smart Display**: Shows translated text or original if translation fails

## Testing Without API Key

If you don't set up the API key immediately, the system will:
- Show a fallback transliteration (basic conversion)
- Display a yellow status badge in the client dashboard
- Continue to work with reduced accuracy

## Cost Information

Google Cloud Translation API pricing:
- First 500,000 characters per month: FREE
- After that: $20 per 1 million characters
- Perfect for wedding invitations (very low usage)

## Example Results

**Original Khmer:**
```
បុរីពិភពថ្មីសំរោងអណ្ដែត II ផ្ទះលេខ ៧ ផ្លូវលេខ ១២ (គេហដ្ឋានឯកឧត្តម វ៉ា សុធា)
```

**Google Translate Result:**
```
Borey Piphup Thmei Samrong Andet II House No. 7 Street No. 12 (Residence of His Excellency Wa Sotha)
```

## Troubleshooting

**If translations don't appear:**
1. Check browser console for errors
2. Verify API key is correct in `.env.local`
3. Make sure Translation API is enabled in Google Cloud
4. Restart the development server after changing `.env.local`

**If you see "Local Translation" badge:**
- API key is not configured
- Set up Google Cloud API key following steps above
