'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";

import { doc, setDoc, getDoc, collection, addDoc, getDocs, updateDoc, deleteDoc } from "firebase/firestore";
import {
  Box,
  Button,
  Heading,
  Input,
  Text,
  FormControl,
  FormLabel,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  HStack,
  Badge,
  VStack,
  Flex,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  useSteps,
  Progress,
  useToast,
  Textarea
} from "@chakra-ui/react";
import { strings } from "@/lib/strings";

// Add this to the existing client dashboard after line 50:

import { offlineStorage } from "@/lib/offlineStorage";
import { useOffline } from "@/hooks/useOffline";


// Format date to elegant full format
const formatElegantDate = (dateStr: string, lang: 'en' | 'kh'): string => {
  if (!dateStr) return '';
  
  const date = new Date(dateStr);
  if (lang === 'kh') {
    return date.toLocaleDateString('km-KH', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  } else {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }
};

// Format time to professional format
const formatProfessionalTime = (timeStr: string, lang: 'en' | 'kh'): string => {
  if (!timeStr) return '';
  
  const [hours, minutes] = timeStr.split(':');
  const hour24 = parseInt(hours);
  const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
  
  if (lang === 'kh') {
    if (hour24 >= 5 && hour24 < 12) {
      return `${hour12}:${minutes} ព្រឹក`; // Morning
    } else if (hour24 >= 12 && hour24 < 17) {
      return `${hour12}:${minutes} រសៀល`; // Afternoon
    } else if (hour24 >= 17 && hour24 < 20) {
      return `${hour12}:${minutes} ល្ងាច`; // Evening
    } else {
      return `${hour12}:${minutes} យប់`; // Night
    }
  } else {
    if (hour24 >= 5 && hour24 < 12) {
      return `${hour12}:${minutes} Morning`;
    } else if (hour24 >= 12 && hour24 < 17) {
      return `${hour12}:${minutes} Afternoon`;
    } else if (hour24 >= 17 && hour24 < 20) {
      return `${hour12}:${minutes} Evening`;
    } else {
      return `${hour12}:${minutes} Night`;
    }
  }
};

// Helper to detect Khmer characters
const containsKhmer = (text: string): boolean => /[\u1780-\u17FF]/.test(text);

// Helper to detect Latin characters
const containsLatin = (text: string): boolean => /[A-Za-z]/.test(text);

// Stub translation: English to Khmer (requires integration with translation API)
const translateEnglishToKhmer = (english: string): string => {
  // TODO: integrate actual translation service
  return english;
};

// Stub transliteration: Khmer to Latin using our local logic
const transliterateKhmerToLatin = (khmer: string): string => {
  return fallbackTransliterate(khmer);
};

// Format name with honorifics and language logic (same as invitation page)
const formatName = (khHonorific: string, enHonorific: string, name: string = '', weddingInfo: any, nameType: string, currentLang: 'kh' | 'en'): string => {
  if (!name && !weddingInfo) return 'N/A';
  
  if (currentLang === 'kh') {
    // Khmer mode: prefer Khmer names, fallback to translating English if needed
    if (name) return name; // Use Khmer name if available
    
    // If no Khmer name, try to get English version and translate
    const enFieldName = `${nameType}En`;
    const englishName = weddingInfo?.[enFieldName];
    if (englishName && containsLatin(englishName)) {
      return translateEnglishToKhmer(englishName);
    }
    
    return 'N/A';
  } else {
    // English mode: prefer English transliteration, fallback to transliterating Khmer
    const enFieldName = `${nameType}En`;
    const englishName = weddingInfo?.[enFieldName];
    
    if (englishName) {
      // If English version exists, use it
      return englishName;
    } else if (name && containsKhmer(name)) {
      // If only Khmer exists, parse and transliterate
      const nameWithoutHonorific = name.replace(/^(លោក|លោកស្រី)\s*/, '');
      const transliteratedName = transliterateKhmerToLatin(nameWithoutHonorific);
      return `${enHonorific} ${transliteratedName}`;
    }
    
    return 'N/A';
  }
};

// Comprehensive Khmer to English transliteration based on standard romanization
const khmerConsonants: { [key: string]: string } = {
  'ក': 'k', 'ខ': 'kh', 'គ': 'g', 'ឃ': 'gh', 'ង': 'ng',
  'ច': 'ch', 'ឆ': 'chh', 'ជ': 'j', 'ឈ': 'jh', 'ញ': 'nh',
  'ដ': 'd', 'ឋ': 'th', 'ឌ': 'd', 'ឍ': 'dh', 'ណ': 'n',
  'ត': 't', 'ថ': 'th', 'ទ': 'd', 'ធ': 'dh', 'ន': 'n',
  'ប': 'b', 'ផ': 'ph', 'ព': 'p', 'ភ': 'ph', 'ម': 'm',
  'យ': 'y', 'រ': 'r', 'ល': 'l', 'វ': 'v',
  'ស': 's', 'ហ': 'h', 'ឡ': 'l', 'អ': 'a'
};

const khmerVowels: { [key: string]: string } = {
  // Independent vowels
  'ឥ': 'e', 'ឦ': 'ei', 'ឧ': 'o', 'ឨ': 'ou', 'ឩ': 'u', 'ឪ': 'ov', 'ឫ': 'reu', 'ឬ': 'leu', 'ឭ': 'loe', 'ឮ': 'lao', 'ឯ': 'e', 'ឰ': 'ai', 'ឱ': 'ao', 'ឲ': 'au', 'ឳ': 'ao',
  
  // Dependent vowels
  'ា': 'a', 'ិ': 'i', 'ី': 'i', 'ឹ': 'eu', 'ឺ': 'eu', 'ុ': 'o', 'ូ': 'ou', 'ួ': 'uo', 'ើ': 'oe', 'ឿ': 'euo', 'ៀ': 'ie', 'េ': 'e', 'ែ': 'ae', 'ៃ': 'ai', 'ោ': 'ao', 'ៅ': 'av',
  
  // Diacritics and signs
  'ំ': 'm', 'ះ': 'h', '់': '', 'ៈ': 'ah'
};

// Common Khmer name components and address patterns for better accuracy
const khmerNamePatterns: { [key: string]: string } = {
  // Common prefixes
  'លោក': 'Lok', 'លោកស្រី': 'Lok Srei', 'អ្នក': 'Nak', 'គ្រូ': 'Krou',
  
  // Address-related terms
  'បុរី': 'Borey', 'ពិភព': 'Piphop', 'ថ្មី': 'Thmei', 'សំរោង': 'Samrong', 
  'អណ្ដែត': 'Andet', 'ផ្ទះ': 'House', 'លេខ': 'No.', 'ផ្លូវ': 'Street',
  'គេហដ្ឋាន': 'Residence', 'ឯកឧត្តម': 'His Excellency', 'វ៉ា': 'Wa',
  'ខេត្ត': 'Province', 'ក្រុង': 'City', 'ស្រុក': 'District', 'ឃុំ': 'Commune', 
  'ភូមិ': 'Village', 'ទីលាន': 'Park', 'ផ្សារ': 'Market', 'វត្ត': 'Wat',
  
  // Common name elements
  'សុខ': 'Sok', 'វិសាល': 'Visal', 'ច័ន្ទ': 'Chan', 'ពិសាខ': 'Pisach',
  'រតន': 'Rotan', 'សុវណ្ណ': 'Sovan', 'ប្រុស': 'Bros', 'ស្រី': 'Srei',
  'ធារា': 'Thea', 'សុផល': 'Sophol', 'គង់': 'Kong', 'ពេជ្រ': 'Pich',
  'មាស': 'Meas', 'វណ្ណ': 'Van', 'ចេត': 'Chet', 'រស្មី': 'Rosmei',
  'សុធា': 'Sotha', 'សុមាលី': 'Somaly', 'កញ្ញា': 'Kanha', 'ពុទ្ធ': 'Puth',
  'ធីតា': 'Thida', 'ស្រីម': 'Srim', 'ពេជ្រកញ្ញា': 'Pichkanha',
  
  // Family names
  'យស': 'Yos', 'សឿន': 'Soeun', 'ស៊ុន': 'Sun', 'ហេង': 'Heng',
  'វង្ស': 'Vong', 'ណុប': 'Nop', 'ស៊ីម': 'Sim', 'ខេម': 'Khem',
  'សុម': 'Som', 'មុំ': 'Mom', 'នី': 'Ni', 'តាន': 'Tan',
  'ចាន់': 'Chan', 'អ៊ុក': 'Ouk', 'ហុន': 'Hun', 'សេន': 'Sen'
};

// Auto-transliteration function using local logic only
const autoTransliterate = async (khmerText: string): Promise<string> => {
  if (!khmerText) return '';
  
  // Use local transliteration logic
  return fallbackTransliterate(khmerText);
};

// Fallback transliteration function (original logic)
const fallbackTransliterate = (khmerText: string): string => {
  if (!khmerText) return '';
  
  // First, check for exact matches in common name patterns
  for (const [khmer, roman] of Object.entries(khmerNamePatterns)) {
    if (khmerText.includes(khmer)) {
      khmerText = khmerText.replace(new RegExp(khmer, 'g'), roman);
    }
  }
  
  let result = '';
  let i = 0;
  
  while (i < khmerText.length) {
    const char = khmerText[i];
    
    // Handle spaces and punctuation
    if (char === ' ' || /[,.!?-]/.test(char)) {
      result += char;
      i++;
      continue;
    }
    
    // Handle numbers (keep as-is or convert if needed)
    if (/[0-9]/.test(char)) {
      result += char;
      i++;
      continue;
    }
    
    // Handle Latin characters (already romanized)
    if (/[A-Za-z]/.test(char)) {
      result += char;
      i++;
      continue;
    }
    
    // Handle Khmer consonants
    if (khmerConsonants[char]) {
      result += khmerConsonants[char];
      
      // Check for following vowels
      if (i + 1 < khmerText.length) {
        const nextChar = khmerText[i + 1];
        if (khmerVowels[nextChar]) {
          result += khmerVowels[nextChar];
          i += 2;
          continue;
        }
      }
      
      // If no vowel follows, add inherent vowel 'a' for consonants (except at word end)
      if (i + 1 < khmerText.length && khmerText[i + 1] !== ' ' && !khmerVowels[khmerText[i + 1]]) {
        // Check if it's not a final consonant
        if (char !== 'ះ' && char !== 'ំ' && char !== '់') {
          result += 'a';
        }
      }
      
      i++;
      continue;
    }
    
    // Handle independent vowels
    if (khmerVowels[char]) {
      result += khmerVowels[char];
      i++;
      continue;
    }
    
    // Handle subscript consonants (coeng)
    if (char === '្') {
      if (i + 1 < khmerText.length) {
        const subscriptChar = khmerText[i + 1];
        if (khmerConsonants[subscriptChar]) {
          result += khmerConsonants[subscriptChar];
          i += 2;
          continue;
        }
      }
    }
    
    // If character not recognized, keep as-is
    result += char;
    i++;
  }
  
  // Post-processing: Clean up and format
  result = result
    .replace(/aa+/g, 'a') // Remove duplicate 'a's
    .replace(/([aeiou])\1+/g, '$1') // Remove duplicate vowels
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim();
  
  return result.split(' ').map(word => {
    if (word.length === 0) return word;
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }).join(' ');
};

// Generate or get existing preview slug for the client
const getOrCreatePreviewSlug = async (clientEmail: string): Promise<string> => {
  if (!clientEmail) return '';
  
  try {
    // Check if client already has a preview slug
    const docRef = doc(db, 'Users', clientEmail);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data.previewSlug) {
        return data.previewSlug;
      }
    }
    
    // Generate new preview slug
    const previewSlug = `preview-${Math.random().toString(36).substring(2, 10)}`;
    
    // Save the preview slug to user document
    await setDoc(docRef, { previewSlug }, { merge: true });
    
    return previewSlug;
  } catch (error) {
    console.error('Error creating preview slug:', error);
    return '';
  }
};

const khmerFonts = [
    { name: "AKbalthom", value: "'AKbalthom Freehand', sans-serif" },
    { name: "Bayon", value: "'Bayon', sans-serif" },
    { name: "Hanuman", value: "'Hanuman', serif" },
    { name: "Kantumruy", value: "'Kantumruy', sans-serif" },
    { name: "Khmer OS Siemreap", value: "'Khmer OS Siemreap', sans-serif" },
    { name: "Moul", value: "'Moul', display" },
    { name: "Battambang", value: "'Battambang', serif" },
    { name: "Content", value: "'Content', sans-serif" },
    { name: "Dangrek", value: "'Dangrek', display" },
    { name: "Koulen", value: "'Koulen', display" },
    { name: "Moulpali", value: "'Moulpali', cursive" },
    { name: "Noto Sans Khmer", value: "'Noto Sans Khmer', sans-serif" },
    { name: "Nokora", value: "'Nokora', serif" },
    { name: "Kh Mondulkiri", value: "'Kh Mondulkiri', serif" },
  ];


const defaultTypography = {
  headingFont: "'Moulpali', cursive",
  bodyFont: "'Battambang', serif"
};

export default function ClientDashboard() {
  const router = useRouter();
  const toast = useToast();
  const [isClient, setIsClient] = useState(false);
  const { isOffline } = useOffline();
  
  // Form management states
  const [activeStep, setActiveStep] = useState(0);
  const [showEnglishFieldsStep0, setShowEnglishFieldsStep0] = useState(false);
  const [showEnglishFieldsStep1, setShowEnglishFieldsStep1] = useState(false);
  const [showEnglishFieldsStep2, setShowEnglishFieldsStep2] = useState(false);
  const [formProgress, setFormProgress] = useState(0);
  const [lang, setLang] = useState<'en'|'kh'>('en');
  
  const [weddingInfo, setWeddingInfo] = useState<any>({
    groomName: "", 
    groomNameEn: "",      // English groom name
    groomMother: "",
    groomFather: "", 
    groomMotherName: "",  // Khmer name
    groomFatherName: "",  // Khmer name
    groomMotherEn: "",    // English transliteration
    groomFatherEn: "",    // English transliteration
    brideName: "", 
    brideNameEn: "",      // English bride name
    brideMother: "",
    brideFather: "",
    brideMotherName: "",  // Khmer name
    brideFatherName: "",  // Khmer name
    brideMotherEn: "",    // English transliteration
    brideFatherEn: "",    // English transliteration
    date: "", 
    time: "",
    venue: "", 
    venueEn: "",          // English venue transliteration
    venueMapLink: "",
    language: "en",
    font: "'Battambang', serif",
    typography: { headingFont: "'Moulpali', cursive", bodyFont: "'Battambang', serif" }
  });
  const [guestName, setGuestName] = useState("");
  const [guests, setGuests] = useState<any[]>([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [previewSlug, setPreviewSlug] = useState<string>("");

  const clientEmail = typeof window !== 'undefined' ? localStorage.getItem('clientEmail') : null;
  
  const steps = [
    { title: lang === 'kh' ? 'ព័ត៌មានកូនប្រុស' : 'Groom Info', description: lang === 'kh' ? 'ឈ្មោះ និងគ្រួសារ' : 'Names & Family' },
    { title: lang === 'kh' ? 'ព័ត៌មានកូនស្រី' : 'Bride Info', description: lang === 'kh' ? 'ឈ្មោះ និងគ្រួសារ' : 'Names & Family' },
    { title: lang === 'kh' ? 'ពិធីមង្គលការ' : 'Wedding Details', description: lang === 'kh' ? 'ថ្ងៃ ម៉ោង ទីកន្លែង' : 'Date, Time & Venue' },
    { title: lang === 'kh' ? 'បញ្ជីភ្ញៀវ' : 'Guest List', description: lang === 'kh' ? 'គ្រប់គ្រងភ្ញៀវ' : 'Manage Guests' }
  ];
  
  
  const t = strings[lang];

  // Calculate form progress
  useEffect(() => {
    const requiredFields = [
      'groomName', 'brideName', 'date', 'time', 'venue',
      'groomMotherName', 'groomFatherName', 'brideMotherName', 'brideFatherName'
    ];
    const filledFields = requiredFields.filter(field => weddingInfo[field]);
    setFormProgress((filledFields.length / requiredFields.length) * 100);
  }, [weddingInfo]);
  
  // Auto-save function with toast notifications
  const autoSave = async () => {
    if (clientEmail) {
      try {
        await setDoc(doc(db, 'Users', clientEmail), { weddingInfo }, { merge: true });
        toast({
          title: lang === 'kh' ? 'រក្សាទុកហើយ!' : 'Auto-saved!',
          status: 'success',
          duration: 1000,
          isClosable: true,
          position: 'top-right'
        });
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    }
  };
  
  // Auto-save after 2 seconds of no typing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (weddingInfo.groomName || weddingInfo.brideName) {
        autoSave();
      }
    }, 2000);
    
    return () => clearTimeout(timeoutId);
  }, [weddingInfo]);

  // Enforce client login via localStorage and load data
  useEffect(() => {
    setIsClient(true);
    if (!clientEmail) {
      router.push('/login');
      return;
    }
    const loadData = async () => {
      // Load wedding info
      const docRef = doc(db, 'Users', clientEmail);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const loaded = data.weddingInfo || {};
        setWeddingInfo((prev: any) => ({
          ...prev,
          ...loaded,
          language: loaded.language || 'en',
          font: loaded.font || "'Battambang', serif",
          typography: {
            ...defaultTypography,
            ...(loaded.typography || {}),
            bodyFont: loaded.font || "'Battambang', serif"
          }
        }));
        
        // Load or create preview slug
        const slug = data.previewSlug || await getOrCreatePreviewSlug(clientEmail);
        setPreviewSlug(slug);
        
        // Auto-skip to Guest List if first 3 steps are complete
        const isStep1Complete = loaded.groomName && loaded.groomMotherName && loaded.groomFatherName;
        const isStep2Complete = loaded.brideName && loaded.brideMotherName && loaded.brideFatherName;
        const isStep3Complete = loaded.date && loaded.time && loaded.venue;
        
        if (isStep1Complete && isStep2Complete && isStep3Complete) {
          setActiveStep(3); // Skip to Guest List step
        }
      }
      // Load guests
      const guestSnap = await getDocs(collection(db, 'Users', clientEmail, 'Guests'));
      setGuests(guestSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    };
    loadData();
  }, [router, clientEmail]);

  // Auto-transliteration handlers
  const handleKhmerNameChange = async (fieldName: string, value: string) => {
    // Update the Khmer field immediately
    setWeddingInfo((prev: any) => ({ 
      ...prev, 
      [fieldName]: value
    }));
    
    // Auto-generate English transliteration asynchronously
    if (value.trim()) {
      try {
        const englishFieldName = fieldName.replace('Name', 'En');
        const transliterated = await autoTransliterate(value);
        setWeddingInfo((prev: any) => ({ 
          ...prev, 
          [englishFieldName]: transliterated
        }));
      } catch (error) {
        console.error('Transliteration error:', error);
        // Use fallback transliteration
        const transliterated = fallbackTransliterate(value);
        setWeddingInfo((prev: any) => ({ 
          ...prev, 
          [`${fieldName.replace('Name', 'En')}`]: transliterated
        }));
      }
    }
  };

  // Venue auto-transliteration handler
  const handleVenueChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    
    // Update the Khmer venue field immediately
    setWeddingInfo((prev: any) => ({ 
      ...prev, 
      venue: value
    }));
    
    // Auto-generate English transliteration asynchronously
    if (value.trim()) {
      try {
        const transliterated = await autoTransliterate(value);
        setWeddingInfo((prev: any) => ({ 
          ...prev, 
          venueEn: transliterated
        }));
      } catch (error) {
        console.error('Venue transliteration error:', error);
        // Use fallback transliteration
        const transliterated = fallbackTransliterate(value);
        setWeddingInfo((prev: any) => ({ 
          ...prev, 
          venueEn: transliterated
        }));
      }
    }
  };

  // General input handler for all fields including textarea
  const handleWeddingInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setWeddingInfo({ ...weddingInfo, [e.target.name]: e.target.value });
  };

  if (!isClient) {
    return null; // Prevent hydration mismatch
  }
  
  // Name Input Component with auto-transliteration
  const NameInput = ({ 
    label, 
    khmerField, 
    englishField, 
    placeholder,
    isRequired = false,
    showEnglish = false
  }: { 
    label: string;
    khmerField: string;
    englishField: string;
    placeholder: string;
    isRequired?: boolean;
    showEnglish?: boolean;
  }) => (
    <VStack spacing={3} align="stretch">
      <FormControl isRequired={isRequired}>
        <FormLabel 
          fontFamily={lang === 'kh' ? "'Battambang', serif" : undefined}
          fontSize={{ base: 'sm', md: 'md' }}
          fontWeight="medium"
        >
          {label} {lang === 'kh' ? '(ខ្មែរ)' : '(Khmer)'}
        </FormLabel>
        <Input
          name={khmerField}
          value={weddingInfo[khmerField]}
          onChange={(e) => handleKhmerNameChange(khmerField, e.target.value)}
          placeholder={placeholder}
          fontFamily="'Battambang', serif"
          fontSize={{ base: 'md', md: 'lg' }}
          bg="white"
          borderColor={weddingInfo[khmerField] ? 'green.300' : 'gray.300'}
          _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px blue.400' }}
        />
      </FormControl>
      
      {showEnglish && (
        <FormControl>
          <FormLabel
            fontFamily={lang === 'kh' ? "'Battambang', serif" : undefined}
            fontSize={{ base: 'sm', md: 'md' }}
            fontWeight="medium"
            color="gray.600"
          >
            {label} {lang === 'kh' ? '(អង់គ្លេស)' : '(English)'} 
            <Text as="span" fontSize="xs" color="gray.500" ml={2}>
              {lang === 'kh' ? '(ស្រេចចិត្ត)' : '(Optional)'}
            </Text>
          </FormLabel>
          <VStack spacing={2} align="stretch">
            <Input
              name={englishField}
              value={weddingInfo[englishField]}
              onChange={(e) => setWeddingInfo({ ...weddingInfo, [englishField]: e.target.value })}
              placeholder={weddingInfo[englishField] || fallbackTransliterate(weddingInfo[khmerField]) || 'English name'}
              bg="gray.50"
              fontSize={{ base: 'md', md: 'lg' }}
            />
            {weddingInfo[khmerField] && (
              <Button
                size="xs"
                variant="outline"
                colorScheme="blue"
                leftIcon={<span>🔄</span>}
                onClick={async () => {
                  try {
                    const transliterated = await autoTransliterate(weddingInfo[khmerField]);
                    setWeddingInfo({ ...weddingInfo, [englishField]: transliterated });
                    toast({
                      title: lang === 'kh' ? 'បានបកប្រែ!' : 'Auto-translated!',
                      description: `${weddingInfo[khmerField]} → ${transliterated}`,
                      status: 'success',
                      duration: 3000,
                      isClosable: true,
                    });
                  } catch (error) {
                    console.error('Translation error:', error);
                    toast({
                      title: lang === 'kh' ? 'មានបញ្ហា!' : 'Translation failed!',
                      description: lang === 'kh' ? 'ការបកប្រែមានបញ្ហា' : 'Using fallback transliteration',
                      status: 'warning',
                      duration: 3000,
                      isClosable: true,
                    });
                  }
                }}
                alignSelf="start"
              >
                {lang === 'kh' ? 'បកប្រែស្វ័យប្រវត្តិ' : 'Auto-translate'}
              </Button>
            )}
          </VStack>
        </FormControl>
      )}
    </VStack>
  );

  // Toggle button component for English fields
  const EnglishFieldsToggle = ({ 
    showEnglish, 
    onToggle 
  }: { 
    showEnglish: boolean; 
    onToggle: () => void; 
  }) => (
    <Button
      size="sm"
      variant="outline"
      colorScheme={showEnglish ? "red" : "blue"}
      leftIcon={<span>{showEnglish ? "👁️‍🗨️" : "✏️"}</span>}
      onClick={onToggle}
      alignSelf="start"
      bg={showEnglish ? "red.50" : "blue.50"}
      _hover={{ bg: showEnglish ? "red.100" : "blue.100" }}
    >
      {showEnglish 
        ? (lang === 'kh' ? 'លាក់ឈ្មោះអង់គ្លេស' : 'Hide English Fields')
        : (lang === 'kh' ? 'បង្ហាញឈ្មោះអង់គ្លេស' : 'Show English Fields')
      }
    </Button>
  );
  
  // Handle font selection
  const handleFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedFont = e.target.value;
    setWeddingInfo({ 
      ...weddingInfo, 
      font: selectedFont,
      typography: { ...weddingInfo.typography, bodyFont: selectedFont }
    });
  };
  
  // Handle typography selection
  const handleTypographyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setWeddingInfo({
      ...weddingInfo,
      typography: { ...weddingInfo.typography, [name]: value }
    });
  };
  // Detect browser location
  const detectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setWeddingInfo({ 
            ...weddingInfo, 
            venueMapLink: `https://www.google.com/maps?q=${latitude},${longitude}`,
            venue: weddingInfo.venue || `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`
          });
          setSuccess("Location detected and map link generated!");
          setTimeout(() => setSuccess(""), 1500);
        },
        () => {
          setError("Failed to detect location.");
          setTimeout(() => setError(""), 1500);
        }
      );
    } else {
      setError("Geolocation not supported.");
      setTimeout(() => setError(""), 1500);
    }
  };

  // Update wedding info
const saveWeddingInfo = async () => {
    if (clientEmail) {
        try {
            // Save to Firestore if online
            if (!isOffline) {
                await setDoc(doc(db, 'Users', clientEmail), { weddingInfo }, { merge: true });
                
                // Update preview invitation
                if (previewSlug) {
                    await setDoc(doc(db, 'invites', previewSlug), {
                        ...weddingInfo,
                        guestName: 'Preview',
                        status: 'preview'
                    }, { merge: true });
                }
      
                // Update all guest invitations with new wedding info
                const guestSnap = await getDocs(collection(db, 'Users', clientEmail, 'Guests'));
                const promises = guestSnap.docs.map(async (guestDoc) => {
                    const guestData = guestDoc.data();
                    if (guestData.slug) {
                        const updatedInvite = {
                            ...weddingInfo,
                            guestName: guestData.name,
                            status: guestData.status || 'pending'
                        };
                                           await setDoc(doc(db, 'invites', guestData.slug), updatedInvite, { merge: true });
                        
                        // Update offline cache for each guest
                        await offlineStorage.cacheInvitation({
                            slug: guestData.slug,
                            guestName: guestData.name,
                            weddingInfo: updatedInvite,
                            guest: {
                                name: guestData.name,
                                slug: guestData.slug,
                                status: guestData.status || 'pending'
                            },
                            timestamp: Date.now(),
                            lastUpdated: Date.now()
                        });
                    }
                });
                
                await Promise.all(promises);
            }
            
            setSuccess("Wedding info updated and cached for offline use!");
            setTimeout(() => setSuccess(""), 1500);
            
        } catch (error) {
            console.error("Error saving wedding info:", error);
            setError("Failed to save wedding info");
            setTimeout(() => setError(""), 1500);
        }
    }
};

  // Add guest
  const addGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (clientEmail && guestName) {
      const slug = Math.random().toString(36).substring(2, 8); // simple unique code
      
      // Add guest to user's collection
      await addDoc(collection(db, 'Users', clientEmail, 'Guests'), { name: guestName, slug, status: 'pending', clientEmail: clientEmail });
      
      // Create invite document
      await setDoc(doc(db, 'invites', slug), {
        ...weddingInfo,
        guestName: guestName,
        status: 'pending',
        clientEmail: clientEmail,
        slug: slug
      });
      
      setGuestName("");
      setSuccess("Guest added and invitation created!");
      // Refresh guest list
      const guestSnap = await getDocs(collection(db, 'Users', clientEmail, 'Guests'));
      setGuests(guestSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));      
      setTimeout(() => setSuccess(""), 1500);
    }
  };

  // Handlers for guest edit/delete
// Around line 1200, update the handleEditGuest function:
const handleEditGuest = async (guest: any) => {
  const statusOptions = [
    'pending',
    'confirmed', 
    'declined'
  ];
  
  const currentStatus = guest.status || 'pending';
  const newStatus = window.prompt(
    `Update status for ${guest.name}:\n\n` +
    `Current: ${currentStatus}\n\n` +
    `Options:\n` +
    `- pending (⏳ waiting for response)\n` +
    `- confirmed (✅ will attend)\n` +
    `- declined (❌ cannot attend)\n\n` +
    `Enter new status:`, 
    currentStatus
  );
  
  if (newStatus && statusOptions.includes(newStatus.toLowerCase())) {
    await updateDoc(doc(db, 'Users', clientEmail!, 'Guests', guest.id), { 
      status: newStatus.toLowerCase() 
    });
    
    // Also update the invite document
    if (guest.slug) {
      await updateDoc(doc(db, 'invites', guest.slug), { 
        status: newStatus.toLowerCase() 
      });
    }
    
    // Refresh guest list
    const snap = await getDocs(collection(db, 'Users', clientEmail!, 'Guests'));
    setGuests(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    
    toast({
      title: lang === 'kh' ? 'បានធ្វើបច្ចុប្បន្នភាព!' : 'Status Updated!',
      description: `${guest.name}: ${newStatus}`,
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  } else if (newStatus !== null) {
    toast({
      title: lang === 'kh' ? 'ស្ថានភាពមិនត្រឹមត្រូវ!' : 'Invalid Status!',
      description: lang === 'kh' ? 'សូមជ្រើសរើស: pending, confirmed, ឬ declined' : 'Please choose: pending, confirmed, or declined',
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
  }
};

  const handleDeleteGuest = async (id: string) => {
    if (confirm("Delete this guest?")) {
      await deleteDoc(doc(db, 'Users', clientEmail!, 'Guests', id));
      const snap = await getDocs(collection(db, 'Users', clientEmail!, 'Guests'));
      setGuests(snap.docs.map(d => ({ id: d.id, ...d.data() })));      
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('clientEmail');
    router.push('/login');
  };

  return (
    <Box 
      maxW={{ base: "100%", md: "4xl" }} 
      mx="auto" 
      mt={{ base: 4, md: 10 }} 
      p={{ base: 4, md: 8 }} 
      bg="white"
      borderRadius={{ base: 'none', md: 'lg' }}
      boxShadow={{ base: 'none', md: 'lg' }}
      minH="100vh"
    >
      {/* Header with Language Toggle */}
      <Flex 
        justify="space-between" 
        align="center" 
        mb={6}
        direction={{ base: 'column', sm: 'row' }}
        gap={{ base: 4, sm: 0 }}
      >
        <VStack align={{ base: 'center', sm: 'start' }} spacing={2}>
          <Heading 
            as="h1" 
            size={{ base: 'lg', md: 'xl' }}
            fontFamily={lang === 'kh' ? "'Moul', display" : undefined}
            textAlign={{ base: 'center', sm: 'left' }}
          >
            {t.clientDashboard}
          </Heading>
          <Text fontSize="sm" color="gray.600" fontFamily={lang === 'kh' ? "'Battambang', serif" : undefined}>
            {clientEmail}
          </Text>
        </VStack>
        
        <HStack spacing={2}>
          <Button
            size="sm"
            colorScheme={lang === 'en' ? 'blue' : 'gray'}
            onClick={() => {
              setLang('en');
              setWeddingInfo({ ...weddingInfo, language: 'en' });
            }}
          >
            English
          </Button>
          <Button
            size="sm"
            fontFamily="'Battambang', serif"
            colorScheme={lang === 'kh' ? 'blue' : 'gray'}
            onClick={() => {
              setLang('kh');
              setWeddingInfo({ ...weddingInfo, language: 'kh' });
            }}
          >
            ខ្មែរ
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleLogout}
          >
            {lang === 'kh' ? 'ចេញ' : 'Logout'}
          </Button>
        </HStack>
      </Flex>

      {/* Progress Bar */}
      <Box mb={6}>
        <Flex justify="space-between" align="center" mb={2}>
          <Text fontSize="sm" fontWeight="medium" color="gray.600">
            {lang === 'kh' ? 'ការបំពេញបែបបទ' : 'Form Progress'}
          </Text>
          <Text fontSize="sm" fontWeight="bold" color="blue.600">
            {Math.round(formProgress)}%
          </Text>
        </Flex>
        <Progress 
          value={formProgress} 
          colorScheme="blue" 
          borderRadius="full" 
          bg="gray.100"
          height="8px"
        />
      </Box>

      {/* Step Navigation */}
      <Box mb={8}>
        <Stepper index={activeStep} orientation="horizontal" size={{ base: 'sm', md: 'md' }}>
          {steps.map((step, index) => (
            <Step key={index}>
              <StepIndicator>
                <StepStatus
                  complete={<StepIcon />}
                  incomplete={<StepNumber />}
                  active={<StepNumber />}
                />
              </StepIndicator>
              <Box flexShrink="0">
                <StepTitle>{step.title}</StepTitle>
                <StepDescription>{step.description}</StepDescription>
              </Box>
              <StepSeparator />
            </Step>
          ))}
        </Stepper>
      </Box>

      {/* Step Content */}
      <Box mb={8}>
        {activeStep === 0 && (
          <VStack spacing={6} align="stretch">
            <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
              <Heading size="md" color="blue.600" fontFamily={lang === 'kh' ? "'Battambang', serif" : undefined}>
                {lang === 'kh' ? 'ព័ត៌មានកូនប្រុស និងគ្រួសារ' : 'Groom & Family Information'}
              </Heading>
              <EnglishFieldsToggle 
                showEnglish={showEnglishFieldsStep0} 
                onToggle={() => setShowEnglishFieldsStep0(!showEnglishFieldsStep0)} 
              />
            </Flex>
            
            <NameInput
              label={lang === 'kh' ? 'ឈ្មោះកូនប្រុស' : 'Groom Name'}
              khmerField="groomName"
              englishField="groomNameEn"
              placeholder={lang === 'kh' ? 'ឧ. យស សុខា' : 'e.g. យស សុខា'}
              isRequired={true}
              showEnglish={showEnglishFieldsStep0}
            />

            <NameInput
              label={lang === 'kh' ? 'ឈ្មោះម្តាយ' : 'Mother Name'}
              khmerField="groomMotherName"
              englishField="groomMotherEn"
              placeholder={lang === 'kh' ? 'ឧ. លោកស្រី សោម ស្រីពៅ' : 'e.g. លោកស្រី សោម ស្រីពៅ'}
              isRequired={true}
              showEnglish={showEnglishFieldsStep0}
            />

            <NameInput
              label={lang === 'kh' ? 'ឈ្មោះឪពុក' : 'Father Name'}
              khmerField="groomFatherName"
              englishField="groomFatherEn"
              placeholder={lang === 'kh' ? 'ឧ. លោក សោម សារិទ្ធ' : 'e.g. លោក សោម សារិទ្ធ'}
              isRequired={true}
              showEnglish={showEnglishFieldsStep0}
            />
          </VStack>
        )}

        {activeStep === 1 && (
          <VStack spacing={6} align="stretch">
            <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
              <Heading size="md" color="pink.600" fontFamily={lang === 'kh' ? "'Battambang', serif" : undefined}>
                {lang === 'kh' ? 'ព័ត៌មានកូនស្រី និងគ្រួសារ' : 'Bride & Family Information'}
              </Heading>
              <EnglishFieldsToggle 
                showEnglish={showEnglishFieldsStep1} 
                onToggle={() => setShowEnglishFieldsStep1(!showEnglishFieldsStep1)} 
              />
            </Flex>
            
            <NameInput
              label={lang === 'kh' ? 'ឈ្មោះកូនស្រី' : 'Bride Name'}
              khmerField="brideName"
              englishField="brideNameEn"
              placeholder={lang === 'kh' ? 'ឧ. សឿន សាវឿត' : 'e.g. សឿន សាវឿត'}
              isRequired={true}
              showEnglish={showEnglishFieldsStep1}
            />

            <NameInput
              label={lang === 'kh' ? 'ឈ្មោះម្តាយ' : 'Mother Name'}
              khmerField="brideMotherName"
              englishField="brideMotherEn"
              placeholder={lang === 'kh' ? 'ឧ. លោកស្រី នី សុជាតា' : 'e.g. លោកស្រី នី សុជាតា'}
              isRequired={true}
              showEnglish={showEnglishFieldsStep1}
            />

            <NameInput
              label={lang === 'kh' ? 'ឈ្មោះឪពុក' : 'Father Name'}
              khmerField="brideFatherName"
              englishField="brideFatherEn"
              placeholder={lang === 'kh' ? 'ឧ. លោក មុំ វិសុទ្ធ' : 'e.g. លោក មុំ វិសុទ្ធ'}
              isRequired={true}
              showEnglish={showEnglishFieldsStep1}
            />
          </VStack>
        )}

        {activeStep === 2 && (
          <VStack spacing={6} align="stretch">
            <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
              <Heading size="md" color="green.600" fontFamily={lang === 'kh' ? "'Battambang', serif" : undefined}>
                {lang === 'kh' ? 'ព័ត៌មានពិធីមង្គលការ' : 'Wedding Details'}
              </Heading>
              <EnglishFieldsToggle 
                showEnglish={showEnglishFieldsStep2} 
                onToggle={() => setShowEnglishFieldsStep2(!showEnglishFieldsStep2)} 
              />
            </Flex>
            
            <Flex direction={{ base: 'column', md: 'row' }} gap={4}>
              <FormControl isRequired>
                <FormLabel fontFamily={lang === 'kh' ? "'Battambang', serif" : undefined}>
                  {lang === 'kh' ? 'ថ្ងៃ' : 'Date'}
                </FormLabel>
                <Input
                  name="date"
                  type="date"
                  value={weddingInfo.date}
                  onChange={handleWeddingInfoChange}
                  bg="white"
                  borderColor={weddingInfo.date ? 'green.300' : 'gray.300'}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontFamily={lang === 'kh' ? "'Battambang', serif" : undefined}>
                  {lang === 'kh' ? 'ម៉ោង' : 'Time'}
                </FormLabel>
                <Input
                  name="time"
                  type="time"
                  value={weddingInfo.time}
                  onChange={handleWeddingInfoChange}
                  bg="white"
                  borderColor={weddingInfo.time ? 'green.300' : 'gray.300'}
                />
              </FormControl>
            </Flex>

            <VStack spacing={6} align="stretch">
              <FormControl isRequired>
                <FormLabel fontFamily={lang === 'kh' ? "'Battambang', serif" : undefined}>
                  {lang === 'kh' ? 'ទីកន្លែងពិធីមង្គលការ (ខ្មែរ)' : 'Wedding Venue Address (Khmer)'}
                </FormLabel>
                <Textarea
                  name="venue"
                  value={weddingInfo.venue}
                  onChange={handleVenueChange}
                  placeholder={lang === 'kh' ? 'ឧ. បុរីពិភពថ្មីសំរោងអណ្ដែត II ផ្ទះលេខ ៧ ផ្លូវលេខ ១២ (គេហដ្ឋានឯកឧត្តម វ៉ា សុធា)' : 'e.g. បុរីពិភពថ្មីសំរោងអណ្ដែត II ផ្ទះលេខ ៧ ផ្លូវលេខ ១២'}
                  bg="white"
                  borderColor={weddingInfo.venue ? 'green.300' : 'gray.300'}
                  fontFamily={lang === 'kh' ? "'Battambang', serif" : undefined}
                  fontSize={{ base: 'md', md: 'lg' }}
                  minH="80px"
                  resize="vertical"
                  rows={3}
                />
              </FormControl>

              {showEnglishFieldsStep2 && (
                <FormControl>
                  <FormLabel fontFamily={lang === 'kh' ? "'Battambang', serif" : undefined} color="gray.600">
                    {lang === 'kh' ? 'ទីកន្លែងពិធីមង្គលការ (អង់គ្លេស)' : 'Wedding Venue Address (English)'}
                    <Text as="span" fontSize="xs" color="gray.500" ml={2}>
                      {lang === 'kh' ? '(ស្រេចចិត្ត)' : '(Optional)'}
                    </Text>
                  </FormLabel>
                  <VStack spacing={2} align="stretch">
                    <Textarea
                      name="venueEn"
                      value={weddingInfo.venueEn}
                      onChange={(e) => setWeddingInfo({ ...weddingInfo, venueEn: e.target.value })}
                      placeholder={weddingInfo.venueEn || fallbackTransliterate(weddingInfo.venue) || 'English venue address'}
                      bg="gray.50"
                      fontSize={{ base: 'md', md: 'lg' }}
                      minH="80px"
                      resize="vertical"
                      rows={3}
                    />
                    {weddingInfo.venue && (
                      <Button
                        size="xs"
                        variant="outline"
                        colorScheme="blue"
                        leftIcon={<span>🔄</span>}
                        onClick={async () => {
                          const transliterated = await autoTransliterate(weddingInfo.venue);
                          setWeddingInfo({ ...weddingInfo, venueEn: transliterated });
                        }}
                        alignSelf="start"
                      >
                        {lang === 'kh' ? 'បកប្រែស្វ័យប្រវត្តិ' : 'Auto-translate'}
                      </Button>
                    )}
                  </VStack>
                </FormControl>
              )}
            </VStack>

            <FormControl>
              <FormLabel fontFamily={lang === 'kh' ? "'Battambang', serif" : undefined}>
                {lang === 'kh' ? 'តំណរភ្ជាប់ Google Maps' : 'Google Maps Link'}
              </FormLabel>
              <Input
                name="venueMapLink"
                value={weddingInfo.venueMapLink}
                onChange={handleWeddingInfoChange}
                placeholder="https://maps.google.com/..."
                bg="white"
              />
              <Button
                size="sm"
                mt={2}
                colorScheme="blue"
                variant="outline"
                onClick={detectLocation}
              >
                {lang === 'kh' ? 'រកទីតាំងបច្ចុប្បន្ន' : 'Detect Location'}
              </Button>
            </FormControl>

            {/* Font Selection */}
            <FormControl>
              <FormLabel fontFamily={lang === 'kh' ? "'Battambang', serif" : undefined}>
                {lang === 'kh' ? 'ជ្រើសរើសពុម្ពអក្សរ' : 'Choose Font'}
              </FormLabel>
              <Select
                value={weddingInfo.font}
                onChange={handleFontChange}
                fontFamily={weddingInfo.font}
              >
                {khmerFonts.map(font => (
                  <option key={font.value} value={font.value}>
                    {font.name}
                  </option>
                ))}
              </Select>
              {/* Font Preview */}
              <Box mt={3} p={4} bg="blue.50" borderRadius="md" border="1px solid" borderColor="blue.200">
                <Text fontFamily={weddingInfo.font} fontSize="lg" fontWeight="semibold" color="blue.800" mb={2}>
                  {lang === 'kh' ? 'ការបង្ហាញអក្សរ' : 'Font Preview'}
                </Text>
                <Text fontFamily={weddingInfo.font} fontSize="md" color="gray.700">
                  កូនប្រុសឈ្មោះ៖ {weddingInfo.groomName || 'សុខា'}
                </Text>
                <Text fontFamily={weddingInfo.font} fontSize="md" color="gray.700">
                  កូនស្រីឈ្មោះ៖ {weddingInfo.brideName || 'សុវត្ថិ'}
                </Text>
              </Box>
            </FormControl>
          </VStack>
        )}

        {activeStep === 3 && (
          <VStack spacing={6} align="stretch">
            <Heading size="md" color="purple.600" fontFamily={lang === 'kh' ? "'Battambang', serif" : undefined}>
              {lang === 'kh' ? 'គ្រប់គ្រងបញ្ជីភ្ញៀវ' : 'Manage Guest List'}
            </Heading>
            
            {/* Add Guest Form */}
            <Box p={4} bg="gray.50" borderRadius="md">
              <form onSubmit={addGuest}>
                <FormControl mb={3}>
                  <FormLabel fontFamily={lang === 'kh' ? "'Battambang', serif" : undefined}>
                    {lang === 'kh' ? 'បន្ថែមភ្ញៀវថ្មី' : 'Add New Guest'}
                  </FormLabel>
                  <Input
                    placeholder={t.guestNamePlaceholder}
                    fontFamily={lang === 'kh' ? "'Battambang', serif" : undefined}
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    bg="white"
                  />
                </FormControl>
                <Button
                  type="submit"
                  colorScheme="purple"
                  isDisabled={!guestName.trim()}
                  leftIcon={<span>➕</span>}
                >
                  {t.addGuest}
                </Button>
              </form>
            </Box>

            {/* Guest List */}
            <Box>
              <VStack align="stretch" spacing={3} mb={4}>
                <Text fontSize="lg" fontWeight="semibold" fontFamily={lang === 'kh' ? "'Battambang', serif" : undefined}>
                  {t.guestList} ({guests.length})
                </Text>
                <Text fontSize="sm" color="gray.600" fontFamily={lang === 'kh' ? "'Battambang', serif" : undefined}>
                  {lang === 'kh' 
                    ? '💡 ចុចប៊ូតុង "ចម្លង" ដើម្បីចម្លងតំណរលិខិតអញ្ជើញដល់ភ្ញៀវនីមួយៗ' 
                    : '💡 Click "Copy" to copy the invitation link for each guest to share with them'
                  }
                </Text>
              </VStack>
              
              {guests.length === 0 ? (
                <Box textAlign="center" py={8} color="gray.500">
                  <Text fontFamily={lang === 'kh' ? "'Battambang', serif" : undefined}>
                    {lang === 'kh' ? 'មិនទាន់មានភ្ញៀវ' : 'No guests added yet'}
                  </Text>
                </Box>
              ) : (
                <TableContainer borderRadius="md" boxShadow="sm" bg="white">
                  <Table size={{ base: 'sm', md: 'md' }}>
                    <Thead bg="gray.50">
                      <Tr>
                        <Th fontFamily={lang === 'kh' ? "'Battambang', serif" : undefined}>{t.name}</Th>
                        <Th>Status</Th>
                        <Th>{lang === 'kh' ? 'លិខិតអញ្ជើញ' : 'Invitation'}</Th>
                        <Th>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {guests.map((guest) => (
                        <Tr key={guest.id} _hover={{ bg: 'gray.50' }}>
                          <Td fontFamily={lang === 'kh' ? "'Battambang', serif" : undefined}>{guest.name}</Td>
                          <Td>
                            <Box
                              display="inline-flex"
                              alignItems="center"
                              px={3}
                              py={1}
                              borderRadius="full"
                              fontSize="xs"
                              fontWeight="bold"
                              textTransform="capitalize"
                              bg={
                                guest.status === 'confirmed' || guest.status === 'going' ? 'green.100' : 
                                guest.status === 'declined' || guest.status === 'rejected' || guest.status === 'not-going' ? 'red.100' : 
                                'yellow.100'
                              }
                              color={
                                guest.status === 'confirmed' || guest.status === 'going' ? 'green.800' : 
                                guest.status === 'declined' || guest.status === 'rejected' || guest.status === 'not-going' ? 'red.800' : 
                                'yellow.800'
                              }
                              border="1px solid"
                              borderColor={
                                guest.status === 'confirmed' || guest.status === 'going' ? 'green.300' : 
                                guest.status === 'declined' || guest.status === 'rejected' || guest.status === 'not-going' ? 'red.300' : 
                                'yellow.300'
                              }
                            >
                              {guest.status === 'confirmed' || guest.status === 'going' ? (
                                <>
                                  <Text as="span" mr={1}>✅</Text>
                                  {lang === 'kh' ? 'បានបញ្ជាក់' : 'Confirmed'}
                                </>
                              ) : guest.status === 'declined' || guest.status === 'rejected' || guest.status === 'not-going' ? (
                                <>
                                  <Text as="span" mr={1}>❌</Text>
                                  {lang === 'kh' ? 'បានបដិសេធ' : 'Declined'}
                                </>
                              ) : (
                                <>
                                  <Text as="span" mr={1}>⏳</Text>
                                  {lang === 'kh' ? 'កំពុងរង់ចាំ' : 'Pending'}
                                </>
                              )}
                            </Box>
                          </Td>
                          <Td>
                            <HStack spacing={1}>
                              <Button
                                size="xs"
                                as="a"
                                href={`/invite/${guest.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                colorScheme="blue"
                                variant="outline"
                                leftIcon={<span>👁️</span>}
                              >
                                {lang === 'kh' ? 'មើល' : 'View'}
                              </Button>
                              <Button
                                size="xs"
                                variant="outline"
                                colorScheme="green"
                                leftIcon={<span>📋</span>}
                                onClick={async () => {
                                  const guestUrl = `${window.location.origin}/invite/${guest.slug}`;
                                  try {
                                    await navigator.clipboard.writeText(guestUrl);
                                    toast({
                                      title: lang === 'kh' ? 'បានចម្លង!' : 'Copied!',
                                      description: `${lang === 'kh' ? 'តំណរភ្ជាប់សម្រាប់' : 'Link for'} ${guest.name} ${lang === 'kh' ? 'ត្រូវបានចម្លងទៅក្លិបបតុ' : 'copied to clipboard'}`,
                                      status: 'success',
                                      duration: 3000,
                                      isClosable: true,
                                    });
                                  } catch (err) {
                                    // Fallback for older browsers
                                    const textArea = document.createElement('textarea');
                                    textArea.value = guestUrl;
                                    document.body.appendChild(textArea);
                                    textArea.select();
                                    document.execCommand('copy');
                                    document.body.removeChild(textArea);
                                    toast({
                                      title: lang === 'kh' ? 'បានចម្លង!' : 'Copied!',
                                      description: `${lang === 'kh' ? 'តំណរភ្ជាប់សម្រាប់' : 'Link for'} ${guest.name} ${lang === 'kh' ? 'ត្រូវបានចម្លងទៅក្លិបបតុ' : 'copied to clipboard'}`,
                                      status: 'success',
                                      duration: 3000,
                                      isClosable: true,
                                    });
                                  }
                                }}
                              >
                                {lang === 'kh' ? 'ចម្លង' : 'Copy'}
                              </Button>
                            </HStack>
                          </Td>
                          <Td>
                            <HStack spacing={1}>
                              <Button size="xs" onClick={() => handleEditGuest(guest)}>Edit</Button>
                              <Button size="xs" colorScheme="red" onClick={() => handleDeleteGuest(guest.id)}>Delete</Button>
                            </HStack>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          </VStack>
        )}
      </Box>

      {/* Live Invitation Preview */}
      {(weddingInfo.groomName || weddingInfo.brideName) && (
        <Box mt={8} p={6} bg="gradient-to-br from-blue-50 to-pink-50" borderRadius="lg" border="1px solid" borderColor="gray.200">
          <Flex justify="space-between" align="center" mb={4}>
            <Heading size="md" color="blue.600" fontFamily={lang === 'kh' ? "'Battambang', serif" : undefined}>
              {lang === 'kh' ? 'ការមើលលទ្ធផលលិខិតអញ្ជើញ' : 'Live Invitation Preview'}
            </Heading>
            <HStack spacing={2}>
              <Button
                size="sm"
                as="a"
                href={previewSlug ? `/invite/${previewSlug}` : '#'}
                target="_blank"
                rel="noopener noreferrer"
                colorScheme="blue"
                variant="outline"
                leftIcon={<span>🔗</span>}
                isDisabled={!previewSlug}
                onClick={async () => {
                  if (previewSlug) {
                    // Ensure preview invitation is up to date
                    await setDoc(doc(db, 'invites', previewSlug), {
                      ...weddingInfo,
                      guestName: 'Preview',
                      status: 'preview'
                    }, { merge: true });
                  }
                }}
              >
                {lang === 'kh' ? 'មើលពេញ' : 'Full Preview'}
              </Button>
              
              {previewSlug && (
                <Button
                  size="sm"
                  variant="ghost"
                  leftIcon={<span>📋</span>}
                  onClick={async () => {
                    const previewUrl = `${window.location.origin}/invite/${previewSlug}`;
                    try {
                      await navigator.clipboard.writeText(previewUrl);
                      toast({
                        title: lang === 'kh' ? 'បានចម្លង!' : 'Copied!',
                        description: lang === 'kh' ? 'តំណរភ្ជាប់ត្រូវបានចម្លងទៅក្លិបបតុ' : 'Preview link copied to clipboard',
                        status: 'success',
                        duration: 2000,
                        isClosable: true,
                      });
                    } catch (err) {
                      // Fallback for older browsers
                      const textArea = document.createElement('textarea');
                      textArea.value = previewUrl;
                      document.body.appendChild(textArea);
                      textArea.select();
                      document.execCommand('copy');
                      document.body.removeChild(textArea);
                      toast({
                        title: lang === 'kh' ? 'បានចម្លង!' : 'Copied!',
                        description: lang === 'kh' ? 'តំណរភ្ជាប់ត្រូវបានចម្លងទៅក្លិបបតុ' : 'Preview link copied to clipboard',
                        status: 'success',
                        duration: 2000,
                        isClosable: true,
                      });
                    }
                  }}
                >
                  {lang === 'kh' ? 'ចម្លង' : 'Copy Link'}
                </Button>
              )}
            </HStack>
          </Flex>
          
          <Box 
            bg="white" 
            p={6} 
            borderRadius="md" 
            boxShadow="lg"
            fontFamily={weddingInfo.typography?.bodyFont || "'Battambang', serif"}
            maxW="400px"
            mx="auto"
            border="2px solid"
            borderColor="gold"
            position="relative"
            _before={{
              content: '""',
              position: 'absolute',
              top: 2,
              left: 2,
              right: 2,
              bottom: 2,
              border: '1px solid',
              borderColor: 'gold',
              borderRadius: 'md',
              pointerEvents: 'none'
            }}
          >
            <VStack spacing={4} textAlign="center">
              <Text
                fontSize="2xl"
                fontWeight="bold"
                color="gold"
                fontFamily={weddingInfo.typography?.headingFont || "'Moulpali', cursive"}
              >
                {lang === 'kh' ? 'លិខិតអញ្ជើញ' : 'Wedding Invitation'}
              </Text>
              
              <VStack spacing={2}>
                <Text fontSize="lg" fontWeight="semibold" color="blue.800">
                  {formatName('', '', weddingInfo.groomName, weddingInfo, 'groomName', lang)}
                </Text>
                <Text fontSize="md" color="gray.600">
                  {lang === 'kh' ? 'និង' : '&'}
                </Text>
                <Text fontSize="lg" fontWeight="semibold" color="pink.600">
                  {formatName('', '', weddingInfo.brideName, weddingInfo, 'brideName', lang)}
                </Text>
              </VStack>
              
              {(weddingInfo.date || weddingInfo.time || weddingInfo.venue) && (
                <VStack spacing={2} mt={4}>
                  {weddingInfo.date && (
                    <Text fontSize="md" color="gray.700">
                      📅 {formatElegantDate(weddingInfo.date, lang)}
                    </Text>
                  )}
                  {weddingInfo.time && (
                    <Text fontSize="md" color="gray.700">
                      🕐 {formatProfessionalTime(weddingInfo.time, lang)}
                    </Text>
                  )}
                  {weddingInfo.venue && (
                    <Text fontSize="md" color="gray.700">
                      📍 {lang === 'en' && weddingInfo.venueEn ? weddingInfo.venueEn : weddingInfo.venue}
                    </Text>
                  )}
                </VStack>
              )}
              
              <Text fontSize="sm" color="gray.500" mt={4} fontStyle="italic">
                {lang === 'kh' ? 'សូមគោរពអញ្ជើញមកដល់ពិធីមង្គលការរបស់យើងខ្ញុំ' : 'We cordially invite you to our wedding ceremony'}
              </Text>
            </VStack>
          </Box>
        </Box>
      )}

      {/* Navigation Buttons */}
      <Flex justify="space-between" align="center" pt={6} borderTop="1px solid" borderColor="gray.200">
        <Button
          onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
          isDisabled={activeStep === 0}
          variant="outline"
        >
          {lang === 'kh' ? 'ថយក្រោយ' : 'Previous'}
        </Button>

        <HStack spacing={2}>
          <Button
            colorScheme="blue"
            variant="outline"
            onClick={saveWeddingInfo}
            leftIcon={<span>💾</span>}
          >
            {t.save}
          </Button>
          
          {activeStep < steps.length - 1 ? (
            <Button
              colorScheme="blue"
              onClick={() => setActiveStep(Math.min(steps.length - 1, activeStep + 1))}
            >
              {lang === 'kh' ? 'បន្ទាប់' : 'Next'}
            </Button>
          ) : (
            <Button
              colorScheme="green"
              onClick={() => {
                saveWeddingInfo();
                toast({
                  title: lang === 'kh' ? 'បានបញ្ចប់!' : 'Completed!',
                  description: lang === 'kh' ? 'ការរៀបចំលិខិតអញ្ជើញបានបញ្ចប់' : 'Wedding invitation setup complete',
                  status: 'success',
                  duration: 3000,
                  isClosable: true,
                });
              }}
              leftIcon={<span>✅</span>}
            >
              {lang === 'kh' ? 'បញ្ចប់' : 'Complete'}
            </Button>
          )}
        </HStack>
      </Flex>

      {/* Success/Error Messages */}
      {success && (
        <Box mt={4} p={3} bg="green.50" border="1px solid" borderColor="green.200" borderRadius="md">
          <Text color="green.700">{success}</Text>
        </Box>
      )}
      {error && (
        <Box mt={4} p={3} bg="red.50" border="1px solid" borderColor="red.200" borderRadius="md">
          <Text color="red.700">{error}</Text>
        </Box>
      )}
    </Box>
  );
}
