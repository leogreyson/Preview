// Translation service using Google Cloud Translation API
interface TranslationResult {
  translatedText: string;
  detectedLanguage?: string;
}

class TranslationService {
  private apiKey: string;
  private apiEndpoint = 'https://translation.googleapis.com/language/translate/v2';

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_GOOGLE_CLOUD_API_KEY || '';
  }

  /**
   * Transliterate Khmer text to English using Google Translate
   * This will phonetically convert Khmer script to Latin script
   */
  async transliterateKhmerToEnglish(khmerText: string): Promise<string> {
    if (!khmerText.trim()) return '';
    
    try {
      const response = await fetch(`${this.apiEndpoint}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: khmerText,
          source: 'km', // Khmer
          target: 'en', // English
          format: 'text'
        })
      });

      if (!response.ok) {
        throw new Error(`Translation API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.data && data.data.translations && data.data.translations[0]) {
        return data.data.translations[0].translatedText;
      }
      
      throw new Error('Invalid response format from translation API');
    } catch (error) {
      console.error('Translation error:', error);
      // Fallback to our custom transliteration
      return this.fallbackTransliteration(khmerText);
    }
  }

  /**
   * Fallback transliteration function (same as the one we created before)
   * Used when Google Translate API is not available or fails
   */
  private fallbackTransliteration(khmerText: string): string {
    // Comprehensive Khmer to English transliteration mapping
    const consonantMap: { [key: string]: string } = {
      'ក': 'k', 'ខ': 'kh', 'គ': 'g', 'ឃ': 'gh', 'ង': 'ng',
      'ច': 'ch', 'ឆ': 'chh', 'ជ': 'j', 'ឈ': 'jh', 'ញ': 'ny',
      'ដ': 'd', 'ឋ': 'th', 'ឌ': 'd', 'ឍ': 'dh', 'ណ': 'n',
      'ត': 't', 'ថ': 'th', 'ទ': 't', 'ធ': 'th', 'ន': 'n',
      'ប': 'b', 'ផ': 'ph', 'ព': 'p', 'ភ': 'ph', 'ម': 'm',
      'យ': 'y', 'រ': 'r', 'ល': 'l', 'វ': 'v', 'ស': 's',
      'ហ': 'h', 'ឡ': 'l', 'អ': 'a'
    };

    const vowelMap: { [key: string]: string } = {
      'ា': 'a', 'ិ': 'i', 'ី': 'i', 'ុ': 'u', 'ូ': 'u',
      'ួ': 'ua', 'ើ': 'oe', 'ឿ': 'oeu', 'ៀ': 'ie', 'េ': 'e',
      'ែ': 'ae', 'ៃ': 'ai', 'ោ': 'o', 'ៅ': 'au', 'ុំ': 'um',
      'ំ': 'm', 'ះ': 'h', '់': '', 'ៈ': 'ah'
    };

    // Common Khmer name patterns and their typical English equivalents
    const namePatterns: { [key: string]: string } = {
      'សុខ': 'Sok',
      'ពេជ្រ': 'Pich',
      'សុវណ្ណ': 'Sovann',
      'ចាន់': 'Chan',
      'វ៉ាន់': 'Van',
      'ភក្ត្រា': 'Phaktra',
      'រាជ': 'Reach',
      'មុន': 'Mun',
      'ដេ': 'Dey',
      'រ៉ា': 'Ra',
      'មុនី': 'Muni',
      'សុភា': 'Sopha',
      'ពុទ្ធ': 'Puth',
      'រតន៍': 'Roat',
      'វីរៈ': 'Vira'
    };

    let result = khmerText;

    // First, try to match common name patterns
    for (const [khmer, english] of Object.entries(namePatterns)) {
      result = result.replace(new RegExp(khmer, 'g'), english);
    }

    // Then transliterate remaining characters
    for (const [khmer, latin] of Object.entries(consonantMap)) {
      result = result.replace(new RegExp(khmer, 'g'), latin);
    }

    for (const [khmer, latin] of Object.entries(vowelMap)) {
      result = result.replace(new RegExp(khmer, 'g'), latin);
    }

    // Clean up and format
    result = result
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

    return result;
  }

  /**
   * Check if the API key is configured
   */
  isConfigured(): boolean {
    return !!this.apiKey;
  }
}

export const translationService = new TranslationService();
