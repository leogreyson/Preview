'use client'; // This directive is necessary for client-side hooks and interactions in Next.js App Router
import dynamic from 'next/dynamic';
import { useInView } from 'react-intersection-observer';

import React, { useState, useEffect } from "react";
// Assuming db is configured and exported from '@/lib/firebase'
// This matches the user's provided InvitePage.tsx structure for Firebase setup.
import { db } from "@/lib/firebase";
import GlobalStyles from '@/app/GlobalStyles';

import { collectionGroup, getDocs, doc, getDoc, collection, onSnapshot, query, Firestore, updateDoc, serverTimestamp } from "firebase/firestore";
//import { LanguageSwitcher } from "@/app/invite/[slug]/components/EntranceScreen";

import {
    ChakraProvider,
    extendTheme,
    Box,
    Heading,
    HeadingProps,
    Text,
    Button,
    VStack,
    HStack,
    Center,
    Spinner,
    Input,
    Radio,
    RadioGroup,
    Stack,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    Flex,
    Image,
    Skeleton,
} from "@chakra-ui/react";
import { Global, keyframes } from '@emotion/react';
import QRCode from 'react-qr-code';
import WavyLineBackground from "@/WavyLineBackground";


// Enhanced Premium Animations with Traditional Khmer Elements
const OptimizedFadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translate3d(0, 20px, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
`;

const fadeInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-40px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
`;

const fadeInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(40px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
`;

const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

const floatingGlow = keyframes`
  0%, 100% { 
    box-shadow: 0 5px 15px rgba(196, 166, 106, 0.4);
    transform: translateY(0px);
  }
  50% { 
    box-shadow: 0 10px 25px rgba(196, 166, 106, 0.6);
    transform: translateY(-2px);
  }
`;

const textShimmer = keyframes`
  0% {
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
  }
`;

// New for flower breathing/glow
const neonGlow = keyframes`
  0%, 100% {
    filter: brightness(1.2)
      saturate(100%) 
      invert(20%) 
      sepia(59%) 
      saturate(348%) 
      hue-rotate(6deg) 
      brightness(115%) 
      contrast(110%)
  }
  50% {
    filter: brightness(2)
      saturate(130%) 
      invert(80%) 
      sepia(69%) 
      saturate(448%) 
      hue-rotate(6deg) 
      brightness(130%) 
      contrast(150%)
      drop-shadow(0 0 2px #fff700)
      drop-shadow(0 0 4px #fff700);
  }
`;


const pulseGold = keyframes`
  0%, 100% {
    box-shadow: 0 0 5px rgba(196, 166, 106, 0.5), 0 0 10px rgba(196, 166, 106, 0.3);
  }
  50% {
    box-shadow: 0 0 20px rgba(196, 166, 106, 0.8), 0 0 30px rgba(196, 166, 106, 0.5);
  }
`;

// Traditional Khmer-inspired animations
const khmerOrnamentGlow = keyframes`
  0%, 100% {
    text-shadow: 0 0 10px rgba(212, 175, 55, 0.5), 0 0 20px rgba(196, 166, 106, 0.3);
    transform: scale(1);
  }
  50% {
    text-shadow: 0 0 20px rgba(212, 175, 55, 0.8), 0 0 30px rgba(196, 166, 106, 0.6), 0 0 40px rgba(255, 215, 0, 0.4);
    transform: scale(1.02);
  }
`;

const sacredGeometryRotate = keyframes`
  0% { transform: rotate(0deg) scale(1); opacity: 0.6; }
  50% { transform: rotate(180deg) scale(1.05); opacity: 0.8; }
  100% { transform: rotate(360deg) scale(1); opacity: 0.6; }
`;

const lotusBloom = keyframes`
  0% { 
    transform: scale(0.8) rotate(-5deg); 
    opacity: 0.7; 
    filter: hue-rotate(0deg);
  }
  50% { 
    transform: scale(1.1) rotate(5deg); 
    opacity: 1; 
    filter: hue-rotate(15deg);
  }
  100% { 
    transform: scale(1) rotate(0deg); 
    opacity: 0.8; 
    filter: hue-rotate(0deg);
  }
`;

// Premium animations for next-level elegance
const typewriter = keyframes`
  from { width: 0; }
  to { width: 100%; }
`;

const fadeInStagger = keyframes`
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const luxuryGlow = keyframes`
  0%, 100% {
    filter: drop-shadow(0 0 5px rgba(196, 166, 106, 0.5));
    transform: scale(1);
  }
  50% {
    filter: drop-shadow(0 0 20px rgba(196, 166, 106, 0.8));
    transform: scale(1.02);
  }
`;

const elegantFloat = keyframes`
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
    opacity: 0.8;
  }
  33% {
    transform: translateY(-8px) rotate(120deg);
    opacity: 1;
  }
  66% {
    transform: translateY(-4px) rotate(240deg);
    opacity: 0.9;
  }
`;

const cardHover = keyframes`
  0% {
    transform: translateY(0) scale(1);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }
  100% {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }
`;

const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const sparkle = keyframes`
  0%, 100% {
    opacity: 0.3;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
`;

// Update the GlobalKeyframes component around line 260:

const GlobalKeyframes = () => (
    <Global
        styles={`
        /* Enhanced backdrop filter support with transparency */
        @supports (backdrop-filter: blur(20px)) {
            .glass-card {
                backdrop-filter: blur(60px) saturate(1.2) brightness(1.05) !important;
                background: rgba(255, 255, 255, 0.02) !important; /* VERY transparent */
                border: none !important;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.04) !important;
            }
        }
        
        /* Fallback for browsers without backdrop-filter support */
        @supports not (backdrop-filter: blur(20px)) {
            .glass-card {
                background: rgba(255, 255, 255, 0.75) !important; /* More opaque fallback */
                border: none !important;
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08) !important;
            }
        }
        
        /* Mobile optimizations with ultra transparency */
        @media (max-width: 768px) {
            .glass-card {
                backdrop-filter: blur(20px) saturate(1.1) opacity: 0.3 !important;
                background: rgba(255, 255, 255, 0.01) !important; /* ULTRA transparent on mobile */
                border: none !important;
                box-shadow: 0 4px 16px rgba(0,0,0,0.03) !important;
            }
        
                        /* FIXED: Enable font rendering on mobile */
            .premium-card {
                border: none !important;
                background: rgba(255, 255, 255, 0.05) !important; /* INCREASED from 0.01 */
                backdrop-filter: blur(25px) !important;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02) !important;
            }
            
            /* ADDED: Force font loading on mobile */
            * {
                text-rendering: optimizeLegibility !important;
                -webkit-font-smoothing: antialiased !important;
                -moz-osx-font-smoothing: grayscale !important;
                font-feature-settings: "kern" 1 !important;
            }
        }
        

            /* Ultra transparent premium cards */
            .premium-card {
                border: none !important;
                background: rgba(255, 255, 255, 0.01) !important; /* ULTRA transparent */
                backdrop-filter: blur(25px) !important;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02) !important;
            }
        }
        
        /* Desktop keeps strong blur but ultra transparency */
        @media (min-width: 769px) {
            .glass-card {
                backdrop-filter: blur(60px) saturate(1.2) brightness(1.05) !important;
                background: rgba(255, 255, 255, 0.02) !important;
                border: none !important;
            }
            
            .premium-card {
                background: rgba(255, 255, 255, 0.02) !important;
                backdrop-filter: blur(30px) !important;
            }
        }
        
        /* Remove all card borders and make ultra transparent */
        .premium-card {
            border: none !important;
            background: rgba(255, 255, 255, 0.02) !important;
            backdrop-filter: blur(30px) !important;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02) !important;
        }
        
        .khmer-border {
            border: none !important;
        }
        `}
    />
);
// Lazy load heavy components
const LazyCountdownTimer = dynamic(() => Promise.resolve(CountdownTimer), {
  loading: () => (
    <Box
      bg="linear-gradient(135deg, rgba(196, 166, 106, 0.1), rgba(212, 175, 55, 0.05))"
      borderRadius="2xl"
      p={{ base: 6, md: 8 }}
      border="1px solid rgba(196, 166, 106, 0.2)"
      minH="200px"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Spinner size="lg" color="brand.gold" />
    </Box>
  ),
  ssr: false
});


const LazyMapSection = dynamic(() => import('./components/MapSection'), {
  loading: () => (
    <Box
      bg="rgba(255, 255, 255, 0.1)"
      borderRadius="xl"
      p={8}
      textAlign="center"
      minH="400px"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <VStack spacing={4}>
        <Spinner size="lg" color="brand.gold" />
        <Text fontFamily="khmerBody" color="brand.textPrimary">
          Loading map...
        </Text>
      </VStack>
    </Box>
  ),
  ssr: false
});

// Progressive image loading component
const LazyImage: React.FC<{
  src: string;
  alt: string;
  fallbackSrc?: string;
  [key: string]: any;
}> = ({ src, alt, fallbackSrc, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
    rootMargin: '100px'
  });

  return (
    <Box ref={ref} position="relative" {...props}>
      {inView && (
        <>
          {!isLoaded && (
            <Box
              position="absolute"
              inset={0}
              bg="linear-gradient(135deg, rgba(196, 166, 106, 0.1), rgba(212, 175, 55, 0.05))"
              borderRadius="inherit"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Spinner size="md" color="brand.gold" />
            </Box>
          )}
          <LazyImage
            src={hasError ? (fallbackSrc || src) : src}
            alt={alt}
            onLoad={() => setIsLoaded(true)}
            onError={() => {
              setHasError(true);
              setIsLoaded(true);
            }}
            opacity={isLoaded ? 1 : 0}
            transition="opacity 0.5s ease"
            {...props}
          />
        </>
      )}
    </Box>
  );
};

// Format date to elegant full format
const formatElegantDate = (dateStr: string, lang: 'en' | 'kh'): string => {
  if (!dateStr) return '';
  
  const date = new Date(dateStr);
  
  if (lang === 'kh') {
    // Manual Khmer date formatting with Khmer numerals
    const khmerDays = ['អាទិត្យ', 'ច័ន្ទ', 'អង្គារ', 'ពុធ', 'ព្រហស្បតិ៍', 'សុក្រ', 'សៅរ៍'];
    const khmerMonths = [
      'មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា',
      'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'
    ];
    
    const dayName = khmerDays[date.getDay()];
    const day = toKhmerNumerals(date.getDate().toString());
    const month = khmerMonths[date.getMonth()];
    const year = toKhmerNumerals(date.getFullYear().toString());
    
    return `ថ្ងៃ${dayName} ទី${day} ខែ${month} ឆ្នាំ${year}`;
  } else {
    // English formatting
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }
};

const goldPulse = keyframes`
  0%, 100% { opacity: 0.8; box-shadow: 0 0 4px rgba(212,175,55,0.4); }
  50%      { opacity: 1;   box-shadow: 0 0 6px rgba(255,215,0,0.7); }
`;

// Format time to professional format
const formatProfessionalTime = (timeStr: string, lang: 'en' | 'kh'): string => {
  if (!timeStr) return '';
  
  const [hours, minutes] = timeStr.split(':');
  const hour24 = parseInt(hours);
  const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
  
  if (lang === 'kh') {
    // Convert numbers to Khmer numerals and use Khmer time periods
    const khmerHour = toKhmerNumerals(hour12.toString());
    const khmerMinutes = toKhmerNumerals(minutes);
    
    if (hour24 >= 5 && hour24 < 12) {
      return `${khmerHour}:${khmerMinutes} ពេលព្រឹក`; // Morning
    } else if (hour24 >= 12 && hour24 < 17) {
      return `${khmerHour}:${khmerMinutes} ពេលរសៀល`; // Afternoon
    } else if (hour24 >= 17 && hour24 < 20) {
      return `${khmerHour}:${khmerMinutes} ពេលល្ងាច`; // Evening
    } else {
      return `${khmerHour}:${khmerMinutes} ពេលយប់`; // Night
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

// Function to create Google Maps embed URL from a Google Maps link
const createMapEmbedUrl = (mapLink: string, venue: string): string => {
  // If no map link provided, don't show map
  if (!mapLink) return '';
  
  try {
    // If it's already a coordinates-based link (from detect location)
    if (mapLink.includes('q=') && mapLink.includes(',')) {
      const coordsMatch = mapLink.match(/q=([^&]+)/);
      if (coordsMatch) {
        const coords = coordsMatch[1];
        // Use basic Google Maps embed with coordinates - no API key needed
        return `https://www.google.com/maps?q=${coords}&output=embed`;
      }
    }
    
    // For Google Maps URLs, try to extract location info
    if (mapLink.includes('maps.google.com') || mapLink.includes('maps.app.goo.gl')) {
      // Try to extract coordinates from URL
      const coordsRegex = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
      const coordsMatch = mapLink.match(coordsRegex);
      if (coordsMatch) {
        const lat = coordsMatch[1];
        const lng = coordsMatch[2];
        return `https://www.google.com/maps?q=${lat},${lng}&output=embed`;
      }
      
      // Try to extract place name from URL
      const placeMatch = mapLink.match(/place\/([^\/\?]+)/);
      if (placeMatch) {
        const placeName = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '));
        return `https://www.google.com/maps?q=${encodeURIComponent(placeName)}&output=embed`;
      }
      
      // If venue name is available, use it as search query
      if (venue) {
        return `https://www.google.com/maps?q=${encodeURIComponent(venue)}&output=embed`;
      }
    }
    
    // If venue name is available, create a search embed
    if (venue) {
      return `https://www.google.com/maps?q=${encodeURIComponent(venue)}&output=embed`;
    }
    
    return '';
  } catch (error) {
    console.error('Error creating map embed URL:', error);
    return '';
  }
};

// Function to convert English digits to Khmer numerals
const toKhmerNumerals = (str: string): string => {
    const khmerDigits = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];
    return str.replace(/[0-9]/g, (digit) => khmerDigits[parseInt(digit)]);
};

// Function to format time in Khmer with proper AM/PM notation
const formatKhmerTime = (timeStr: string): string => {
    if (!timeStr) return '';
    
    // Convert digits to Khmer numerals first
    let khmerTime = toKhmerNumerals(timeStr);
    
    // Replace AM/PM with Khmer equivalents
    if (timeStr.toLowerCase().includes('am')) {
        khmerTime = khmerTime.replace(/AM/gi, 'នៅពេលព្រឹក');
    } else if (timeStr.toLowerCase().includes('pm')) {
        // Check if it's evening (6 PM or later) or afternoon
        const hour = parseInt(timeStr.split(':')[0]);
        if (hour >= 18 || timeStr.includes('evening')) {
            khmerTime = khmerTime.replace(/PM/gi, 'នៅពេលយប់');
        } else {
            khmerTime = khmerTime.replace(/PM/gi, 'នៅពេលរសៀល');
        }
    }
    
    return khmerTime;
};

// Helper to detect Khmer characters
const containsKhmer = (text: string): boolean => /[\u1780-\u17FF]/.test(text);
// Helper to detect Latin characters
// Comprehensive Khmer to English transliteration mappings
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
  'ា': 'a', 'ិ': 'i', 'ី': 'i', 'ុ': 'o', 'ូ': 'ou',
  'ួ': 'ua', 'ើ': 'oe', 'ឿ': 'oeu', 'ៀ': 'ie', 'េ': 'e',
  'ែ': 'ae', 'ៃ': 'ai', 'ោ': 'o', 'ៅ': 'au', 'ុំ': 'um',
  'ំ': 'm', 'ះ': 'h', '់': '', 'ៈ': 'ah'
};

const khmerNamePatterns: { [key: string]: string } = {
  // Common titles and prefixes
  'លោក': 'Lok', 'លោកស្រី': 'Lok Srei', 'អ្នក': 'Nak', 'គ្រូ': 'Krou',
  
  // Address-related terms (comprehensive for accurate venue translation)
  'បុរី': 'Borey', 'ពិភព': 'Piphop', 'ថ្មី': 'Thmei', 'សំរោង': 'Samrong', 
  'អណ្ដែត': 'Andet', 'ផ្ទះ': 'House', 'លេខ': 'No.', 'ផ្លូវ': 'Street',
  'គេហដ្ឋាន': 'Residence', 'ឯកឧត្តម': 'His Excellency', 'វ៉ា': 'Wa',
  'ខេត្ត': 'Province', 'ក្រុង': 'City', 'ស្រុក': 'District', 'ឃុំ': 'Commune', 
  'ភូមិ': 'Village', 'ទីលាន': 'Park', 'ផ្សារ': 'Market', 'វត្ត': 'Wat',
  'អគារ': 'Building', 'ជាន់': 'Floor', 'ក្រុម': 'Group', 'សង្កាត់': 'Sangkat',
  
  // Common personal names
  'សុខ': 'Sok', 'វិសាល': 'Visal', 'ច័ន្ទ': 'Chan', 'ពិសាខ': 'Pisach',
  'រតន': 'Rotan', 'សុវណ្ណ': 'Sovan', 'ប្រុស': 'Bros', 'ស្រី': 'Srei',
  'ធារា': 'Thea', 'សុផល': 'Sophol', 'គង់': 'Kong', 'ពេជ្រ': 'Pich',
  'មាស': 'Meas', 'វណ្ណ': 'Van', 'ចេត': 'Chet', 'រស្មី': 'Rosmei',
  'សុធា': 'Sotha', 'សុមាលី': 'Somaly', 'កញ្ញា': 'Kanha', 'ពុទ្ធ': 'Puth',
  'ធីតា': 'Thida', 'ស្រីម': 'Srim', 'ពេជ្រកញ្ញា': 'Pichkanha'
};

// Local transliteration function
const fallbackTransliterate = (khmerText: string): string => {
  if (!khmerText) return '';
  
  // First, check for exact matches in common patterns
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
    if (char === ' ' || /[,.!?()-]/.test(char)) {
      result += char;
      i++;
      continue;
    }
    
    // Handle numbers (keep as-is)
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
      
      // Add inherent vowel 'a' for consonants (except at word end)
      if (i + 1 < khmerText.length && khmerText[i + 1] !== ' ' && !khmerVowels[khmerText[i + 1]]) {
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
  
  // Capitalize first letter of each word
  return result.split(' ').map(word => {
    if (word.length === 0) return word;
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }).join(' ');
};

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

// Format name with honorifics and language logic
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


// Define interfaces for content for type safety
interface Content {
    coupleMonogram: string;
    inviteText: string;
    guestDefault: string;
    quote: string;
    enterButton: string;
    weddingCeremony: string;
    honorGuestText: string;
    groomName: string;
    groomParents: string;
    brideName: string;
    brideParents: string;
    introParagraph: string;
    groomTitle: string;
    brideTitle: string;
    ceremonyLocationTitle: string;
    date: string;
    time: string;
    location: string;
    confirmAttendanceButton: string;
    viewMapButton: string;
    thankYou: string;
    rsvpFormTitle: string;
    rsvpNameLabel: string;
    rsvpEmailLabel: string;
    rsvpAttendingLabel: string;
    rsvpYes: string;
    rsvpNo: string;
    rsvpSubmit: string;
    rsvpSuccess: string;
    rsvpError: string;
    totalConfirmed: string;
    guestCount: string;
    mapVenueName: string;
    getDirections: string;
    mapError: string;
    guestNotFound: string;
    viewInvitation: string;
}

interface AstraConfig {
    colors: {
        imperialGold: string;
        lotusPink: string;
        templeStone: string;
        silkIvory: string;
        buttonGradientEnd: string;
        quote: string;
        successGreen: string;
        errorRed: string;
    };
    fonts: {
        heading: string;
        body: string;
    };
    content: {
        kh: Content;
        en: Content;
    };
}

// Firebase configuration (now used for API key in MapComponent, other setup assumed from '@/lib/firebase')
const firebaseConfig = {
    apiKey: "AIzaSyDZmh_eoSgBqkxhrdw5QfQly1uVpCQA0cU",
    authDomain: "wedding-8bf55.firebaseapp.com",
    projectId: "wedding-8bf55",
    storageBucket: "wedding-8bf55.firebasestorage.app",
    messagingSenderId: "362428044475",
    appId: "1:362428044475:web:fc1c15b107cef4bf06859e",
    measurementId: "G-8RFG3XD3BW"
};

// Next.js app directory uses projectId as the base app ID for public data
const appId: string = firebaseConfig.projectId;

// Extend Chakra UI theme with custom colors and fonts
// Create theme with dynamic font support
// Update the createTheme function around line 600 to include proper Khmer fonts:

const createTheme = (font?: string) => extendTheme({
    colors: {
        brand: {
            // New Professional Palette - aligned with prompt
            gold: '#c4a66a',         // Antique Gold
            sandstone: '#bca798',    // Warm neutral/sandstone
            ivory: '#f5f3ed',        // Ivory background
            maroon: '#5c2c2c',       // Deep Maroon for primary text
            textPrimary: '#5c2c2c',  // Deep Maroon for primary text
            textSecondary: '#a88c5a',// Gold for secondary accents
            success: '#4CAF50',
            error: '#D32F2F',
            // Added for slight variations in gold/brown if needed:
            darkGold: '#a88c5a',
            mediumBrown: '#7c6b50',
            lightBrown: '#644a1a',
        },
    },
fonts: {
    // Prioritize Battambang, Moul, and other custom Khmer fonts
    khmerHeading: font || `'Moul', 'KhmerMoul', 'Koulen', 'Battambang', 'Hanuman', Arial, Helvetica, sans-serif`,
    khmerSubheading: font || `'Battambang', 'Moul', 'KhmerMoul', 'Hanuman', 'Koulen', Arial, Helvetica, sans-serif`,
    khmerBody: font || `'Battambang', 'Hanuman', 'Kantumruy', 'Moul', Arial, Helvetica, sans-serif`,

    // These are fallback for other Chakra components if you use their `heading` and `body`
    heading: `'Battambang', 'Moul', 'KhmerMoul', 'Noto Sans Khmer', Arial, Helvetica, sans-serif`,
    body: `'Battambang', 'Hanuman', 'Kantumruy', Arial, Helvetica, sans-serif`,

    // You can still add a custom
    moul: `'Moul', 'KhmerMoul', Arial, Helvetica, sans-serif`,
    },
    components: {
        Heading: {
            baseStyle: {
                fontFamily: 'khmerHeading',
                letterSpacing: '0.02em',
                lineHeight: '1.3', // Better line height for Khmer
            },
            sizes: {
                '4xl': { fontSize: { base: '2.2rem', md: '3rem' } },
                '3xl': { fontSize: { base: '1.8rem', md: '2.5rem' } },
                '2xl': { fontSize: { base: '1.5rem', md: '2rem' } },
                'xl': { fontSize: { base: '1.3rem', md: '1.6rem' } },
            },
        },
        Text: {
            baseStyle: {
                fontFamily: 'khmerBody',
                lineHeight: '1.6', // Better for Khmer readability
            },
        },
        Button: {
            baseStyle: {
                fontFamily: 'khmerBody',
                fontWeight: 'semibold',
                letterSpacing: '0.5px',
            },
        },
    },
    styles: {
        global: (props: any) => ({
            'html, body, #root': {
                height: '100%',
                width: '100%',
                margin: 0,
                padding: 0,
            },
            body: {
                fontFamily: `'Noto Sans Khmer', 'Khmer OS', 'Khmer UI', 'Roboto', 'Arial Unicode MS', sans-serif`,
                backgroundColor: 'brand.ivory',
                backgroundImage: 'url(https://www.transparenttextures.com/patterns/stucco.png)',
                backgroundRepeat: 'repeat',
                backgroundSize: 'auto',
                color: 'brand.textPrimary',
                overflowX: 'hidden',
                // ADDED: Ensure proper text rendering for Khmer
                textRendering: 'optimizeLegibility',
                fontFeatureSettings: '"kern" 1',
                fontVariantLigatures: 'normal',
            },
        }),
    },
});

// Global Keyframe Animations (using emotion/react's Global component for injection)
// Note: This was previously duplicate - keeping only this one instance

const astraConfig: AstraConfig = {
    colors: {
        imperialGold: '#a88c5a',
        lotusPink: '#fbe9ea',
        templeStone: '#5a4a3a',
        silkIvory: '#fdfaf3',
        buttonGradientEnd: '#c7b489',
        quote: '#7c6b50',
        successGreen: '#4CAF50',
        errorRed: '#F44336',
    },
    fonts: {
        heading: "'Moulpali', cursive",
        body: "'Battambang', serif",
    },
    content: {            kh: {
                coupleMonogram: "vectors/monogram.png",
                inviteText: "សិរីសួស្ដីអាពាហ៍ពិពាហ៍",
                guestDefault: "ភ្ញៀវកិត្តិយស",
                quote: "សេចក្ដីស្រឡាញ់ គឺជាអំណោយដ៏ធំបំផុត ដែលយើងអាចផ្តល់អោយគ្នា។",
                enterButton: "បើកលិខិតអញ្ជើញ",
                weddingCeremony: "ពិធីមង្គលការ",
                honorGuestText: "យើងខ្ញុំសូមគោរពអញ្ជើញលោកអ្នកចូលរួមជាកិត្តិយស",
                groomName: "យស សុខា",
                groomParents: "ម្តាយឈ្មោះ៖ យស សុភាព\nឪពុកឈ្មោះ៖ យស សាវឿត",
                brideName: "សឿន សាវឿត",
                brideParents: "ម្តាយឈ្មោះ៖ ចំរើន\nឪពុកឈ្មោះ៖ សឿន សាវឿត",
                introParagraph: "យើងខ្ញុំ យស សុភាព និង យស សាវឿត មានកិត្តិយសសូមគោរពអញ្ជើញ លោក លោកស្រី និងគ្រួសារ អញ្ជើញចូលរួមពិធីមង្គលការរបស់កូនយើង ដែលនឹងត្រូវប្រព្រឹត្តទៅនៅថ្ងៃទី ១២ ខែ មិថុនា ឆ្នាំ ២០២៤ វេលាម៉ោង ៨:០០ ព្រឹក ។",
                groomTitle: "កូនប្រុសឈ្មោះ៖",
                brideTitle: "កូនស្រីឈ្មោះ៖",
                ceremonyLocationTitle: "ពិធីសូត្រមន្តនឹងប្រព្រឹត្តនៅ",
                date: "ថ្ងៃព្រហស្បតិ៍ ទី ១២ ខែ មិថុនា ឆ្នាំ ២០២៤",
                time: "វេលាម៉ោង ៨:០០ ព្រឹក",
                location: "ផ្ទះលេខ ១៦ ភូមិ សាលាបាក់ សង្កាត់ សាលាបាក់ ក្រុងកំពត ខេត្តកំពត",
            confirmAttendanceButton: "✅ បញ្ជាក់ការចូលរួម",
            viewMapButton: "🗺️ មើលផែនទី",
            thankYou: "សូមអរគុណ",
            rsvpFormTitle: "បញ្ជាក់ការចូលរួម",
            rsvpNameLabel: "ឈ្មោះ",
            rsvpEmailLabel: "អ៊ីមែល",
            rsvpAttendingLabel: "តើអ្នកនឹងចូលរួមទេ?",
            rsvpYes: "បាទ/ចាស, ចូលរួម",
            rsvpNo: "ទេ, អធ្យាស្រ័យ",
            rsvpSubmit: "បញ្ជូន",
            rsvpSuccess: "ការបញ្ជាក់ការចូលរួមរបស់អ្នកត្រូវបានរក្សាទុកហើយ! សូមអរគុណ!",
            rsvpError: "មានបញ្ហាក្នុងការរក្សាទុកការបញ្ជាក់ការចូលរួម។ សូម​ព្យាយាម​ម្តង​ទៀត​នៅ​ពេល​ក្រោយ។",
            totalConfirmed: "ចំនួនអ្នកបញ្ជាក់ចូលរួមសរុប",
            guestCount: "ភ្ញៀវ",
            mapVenueName: "មជ្ឈមណ្ឌលសន្និបាត និងពិព័រណ៍កោះពេជ្រ",
            getDirections: "ទៅកាន់ទីតាំង",
            mapError: "មិនអាចផ្ទុកផែនទីបានទេ។",
            guestNotFound: "សុំអភ័យទោស! មិនមានលិខិតអញ្ជើញនេះទេ។",
            viewInvitation: "មើលលិខិតអញ្ជើញ",
        },
        en: {
            coupleMonogram: "vectors/monogram.png",
            inviteText: "WELCOME TO OUR WEDDING",
            guestDefault: "Dear Guest",
            quote: "\"Love is the greatest gift we can give each other.\"",
            enterButton: "Open Invitation",
            weddingCeremony: "Wedding Ceremony",
            honorGuestText: "We cordially invite you to be our esteemed guest",
            groomName: "Yos Sokha",
            groomParents: "Mother: Yos Sophiep\nFather: Yos Savoeut",
            brideName: "Soeun Savoeut", 
            brideParents: "Mother: Chamroeun\nFather: Soeun Savoeut",
            introParagraph: "We, Yos Sophiep and Yos Savoeut, have the honor to cordially invite you and your family to attend the wedding ceremony of our children, which will be held on June 12, 2024 at 8:00 AM.",
            groomTitle: "Groom:",
            brideTitle: "Bride:",
            ceremonyLocationTitle: "The ceremony will be held at",
            date: "Thursday, June 12, 2024",
            time: "Time: 8:00 AM",
            location: "House No. 16, Sala Bak Village, Sala Bak Commune, Kampot City, Kampot Province",
            confirmAttendanceButton: "✅ Confirm Attendance",
            viewMapButton: "🗺️ View Map",
            thankYou: "Thank You",
            rsvpFormTitle: "Confirm Your Attendance",
            rsvpNameLabel: "Name",
            rsvpEmailLabel: "Email",
            rsvpAttendingLabel: "Will you be attending?",
            rsvpYes: "Yes, I will attend",
            rsvpNo: "No, I apologize",
            rsvpSubmit: "Submit",
            rsvpSuccess: "Your RSVP has been saved! Thank you!",
            rsvpError: "There was an issue saving your RSVP. Please try again later.",
            totalConfirmed: "Total Confirmed", // <-- Added missing property
            guestCount: "Guests",
            mapVenueName: "Koh Pich Convention and Exhibition Center",
            getDirections: "Get Directions",
            mapError: "Could not load map.",
            guestNotFound: "Sorry! This invitation does not exist.",
            viewInvitation: "View Invitation",
        }
    }
};


// --- PREMIUM ORNAMENTAL COMPONENTS WITH TRADITIONAL KHMER ELEMENTS --- //

// Traditional Khmer Sacred Geometry Overlay
const KhmerSacredGeometry: React.FC = () => (
    <Box 
        position="absolute" 
        inset={0} 
        zIndex={0} 
        pointerEvents="none" 
        overflow="hidden"
        className="sacred-geometry-bg"
    >
        {/* Traditional Khmer temple spire pattern */}
        <Box
            position="absolute"
            top="10%"
            left="10%"
            width="20px"
            height="20px"
            background="linear-gradient(45deg, rgba(212, 175, 55, 0.3), rgba(196, 166, 106, 0.2))"
            transform="rotate(45deg)"
            borderRadius="20%"
            css={{
                animation: `${sacredGeometryRotate} 15s linear infinite`,
            }}
        />
        <Box
            position="absolute"
            top="30%"
            right="15%"
            width="15px"
            height="15px"
            background="linear-gradient(135deg, rgba(244, 228, 188, 0.4), rgba(212, 175, 55, 0.3))"
            transform="rotate(-45deg)"
            borderRadius="30%"
            css={{
                animation: `${sacredGeometryRotate} 12s linear infinite reverse`,
                animationDelay: '2s',
            }}
        />
        {/* Lotus pattern elements */}
        <Box
            position="absolute"
            bottom="20%"
            left="20%"
            width="25px"
            height="25px"
            background="radial-gradient(circle, rgba(255, 215, 0, 0.2), rgba(212, 175, 55, 0.1))"
            borderRadius="50%"
            css={{
                animation: `${lotusBloom} 8s ease-in-out infinite`,
                animationDelay: '1s',
            }}
        />
        <Box
            position="absolute"
            top="60%"
            right="25%"
            width="18px"
            height="18px"
            background="radial-gradient(circle, rgba(196, 166, 106, 0.3), rgba(244, 228, 188, 0.1))"
            borderRadius="50%"
            css={{
                animation: `${lotusBloom} 10s ease-in-out infinite`,
                animationDelay: '3s',
            }}
        />
    </Box>
);

// Traditional Khmer Ornamental Divider
// Replace the KhmerOrnamentalDivider component (around line 1379)
// Update the KhmerOrnamentalDivider component around line 1081:

const KhmerOrnamentalDivider: React.FC = () => (
    <Box 
        my={6} 
        display="flex" 
        alignItems="center" 
        justifyContent="center"
        position="relative"
        w="100%"
        maxW="500px"
        mx="auto"
        h="20px"
    >
        {/* Enhanced Background decorative elements with lotus curves */}
        <Box
            position="absolute"
            inset={0}
            zIndex={0}
            opacity={0.08}
            pointerEvents="none"
        >
            {/* Lotus curve pattern behind */}
            <Box
                position="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                w="50%"
                h="50px"
                background="url('/vectors/lotus-curve.svg'), url('/vectors/lineup.svg')"
                backgroundSize="contain, contain"
                backgroundRepeat="no-repeat, no-repeat"
                backgroundPosition="center, center"
                filter="blur(0.5px)"
            />
            
            {/* Subtle filigree scroll pattern */}
            <Box
                position="absolute"
                top="20%"
                left="20%"
                right="20%"
                height="40px"
                background="url('/vectors/filigree-pattern.svg')"
                backgroundSize="repeat-x"
                backgroundRepeat="repeat-x"
                backgroundPosition="center"
                opacity={0.6}
                filter="blur(0.3px)"
            />
        </Box>

        {/* Main lineup.svg - enhanced size and interactivity */}
        <Box
            position="relative"
            zIndex={3}
            display="flex"
            alignItems="center"
            justifyContent="center"
            cursor="pointer"
            transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
            _hover={{
                transform: "scale(1.05)",
                filter: `
                    brightness(1.3) 
                    saturate(1.4) 
                    hue-rotate(15deg)
                    drop-shadow(0 6px 12px rgba(255,215,0,0.8))
                    drop-shadow(0 0 24px rgba(255,215,0,0.6))
                `,
            }}
        >
            <Image
                src="/vectors/lineup.svg"
                alt="Ornamental Divider"
                width={{ base: "140px", md: "180px", lg: "220px" }}
                height="auto"
                filter="brightness(1.2) saturate(1.3) hue-rotate(10deg)"
                css={{
                    animation: `${khmerOrnamentGlow} 3s ease-in-out infinite`,
                    filter: `
                        brightness(1.2) 
                        saturate(1.3) 
                        hue-rotate(10deg)
                        drop-shadow(0 4px 8px rgba(255,215,0,0.6))
                        drop-shadow(0 0 16px rgba(255,215,0,0.4))
                    `,
                }}
                fallbackSrc="/vectors/monogram.svg"
            />
            
            {/* Enhanced 3x3 dots grid with staggered animation */}
            <Box
                position="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                display="grid"
                gridTemplateColumns="repeat(3, 1fr)"
                gridTemplateRows="repeat(3, 1fr)"
                gap="5px"
                zIndex={4}
            >
                {Array.from({ length: 9 }).map((_, i) => (
                    <Box
                        key={i}
                        w="4px"
                        h="4px"
                        bg="#FFD700"
                        borderRadius="full"
                        boxShadow="0 0 6px #FFD700, 0 0 12px rgba(255,215,0,0.3)"
                        css={{
                            animation: `${sparkle} ${2.5 + (i * 0.3)}s ease-in-out infinite`,
                            animationDelay: `${i * 0.15}s`,
                        }}
                    />
                ))}
            </Box>
        </Box>

        {/* REMOVED: Left and Right horizontal lines */}
        {/* These are the lines you wanted removed:
        <Box
            position="absolute"
            left="0"
            top="50%"
            transform="translateY(-50%)"
            width="42%"
            height="3px"
            background="linear-gradient(to right, transparent, rgba(255, 215, 0, 0.9), rgba(255, 215, 0, 0.5))"
            borderRadius="full"
            zIndex={1}
            css={{
                animation: `${shimmer} 4s ease-in-out infinite`,
            }}
        />

        <Box
            position="absolute"
            right="0"
            top="50%"
            transform="translateY(-50%)"
            width="42%"
            height="3px"
            background="linear-gradient(to left, transparent, rgba(255, 215, 0, 0.9), rgba(255, 215, 0, 0.5))"
            borderRadius="full"
            zIndex={1}
            css={{
                animation: `${shimmer} 4s ease-in-out infinite`,
                animationDelay: '2s',
            }}
        />
        */}

        {/* Enhanced Background decorative elements with better positioning */}
        <Box
            position="absolute"
            inset={0}
            zIndex={-1}
            opacity={0.15}
            pointerEvents="none"
        >
            {/* Top background pattern */}
            <Box
                position="absolute"
                top="-30px"
                left="15%"
                right="15%"
                height="50px"
                backgroundImage="url('/vectors/lineup.svg')"
                backgroundSize="contain"
                backgroundRepeat="no-repeat"
                backgroundPosition="center"
                transform="scale(1.2) scaleY(-1)"
                filter="blur(1px)"
            />
            
            {/* Bottom background pattern */}
            <Box
                position="absolute"
                bottom="-35px"
                left="15%"
                right="15%"
                height="50px"
                backgroundImage="url('/vectors/lineup.svg')"
                backgroundSize="contain"
                backgroundRepeat="no-repeat"
                backgroundPosition="center"
                transform="scale(0.7) scaleY(-1)"
                filter="blur(1px)"
            />
        </Box>

        {/* Enhanced Side decorative sparkles */}
        <Box
            position="absolute"
            left="-30px"
            top="50%"
            transform="translateY(-50%)"
            w="10px"
            h="10px"
            bg="#FFD700"
            borderRadius="full"
            boxShadow="0 0 8px #FFD700, 0 0 16px rgba(255,215,0,0.4)"
            zIndex={2}
            css={{
                animation: `${sparkle} 2.5s ease-in-out infinite`,
            }}
            _before={{
                content: '""',
                position: 'absolute',
                top: '-2px',
                left: '-2px',
                right: '-2px',
                bottom: '-2px',
                border: '1px solid rgba(255,215,0,0.3)',
                borderRadius: 'full',
                animation: `${pulseGold} 3s ease-in-out infinite`,
            }}
        />
        <Box
            position="absolute"
            right="-30px"
            top="50%"
            transform="translateY(-50%)"
            w="10px"
            h="10px"
            bg="#FFD700"
            borderRadius="full"
            boxShadow="0 0 8px #FFD700, 0 0 16px rgba(255,215,0,0.4)"
            zIndex={2}
            css={{
                animation: `${sparkle} 2.5s ease-in-out infinite`,
                animationDelay: '1.2s',
            }}
            _before={{
                content: '""',
                position: 'absolute',
                top: '-2px',
                left: '-2px',
                right: '-2px',
                bottom: '-2px',
                border: '1px solid rgba(255,215,0,0.3)',
                borderRadius: 'full',
                animation: `${pulseGold} 3s ease-in-out infinite`,
                animationDelay: '1.2s',
            }}
        />

        {/* Additional temple-arch accent elements */}
        <Box
            position="absolute"
            top="20%"
            left="50%"
            transform="translateX(-50%)"
            w="4px"
            h="4px"
            bg="rgba(255,215,0,0.6)"
            borderRadius="full"
            zIndex={1}
            css={{
                animation: `${sparkle} 6s ease-in-out infinite`,
                animationDelay: '0.5s',
            }}
        />
        <Box
            position="absolute"
            bottom="20%"
            left="50%"
            transform="translateX(-50%)"
            w="4px"
            h="4px"
            bg="rgba(255,215,0,0.6)"
            borderRadius="full"
            zIndex={1}
            css={{
                animation: `${sparkle} 6s ease-in-out infinite`,
                animationDelay: '1.8s',
            }}
        />
    </Box>
);

// Premium Floating Particle System
const LuxuryFloatingParticles: React.FC = () => (
    <Box position="absolute" inset={0} zIndex={0} pointerEvents="none" overflow="hidden">
        {Array.from({ length: 25 }).map((_, i) => (
            <Box
                key={`luxury-particle-${i}`}
                position="absolute"
                width="10px"
                height="10px"
                borderRadius="full"
                bg={`rgba(${i % 3 === 0 ? '196, 166, 106' : i % 3 === 1 ? '212, 175, 55' : '244, 228, 188'}, ${0.6 + Math.random() * 0.4})`}
                left={`${Math.random() * 100}%`}
                top={`${Math.random() * 100}%`}
                css={{
                    animation: `${elegantFloat} ${3 + Math.random() * 4}s ease-in-out infinite`,
                    animationDelay: `${Math.random() * 2}s`,
                }}
                boxShadow={`0 0 6px rgba(196, 166, 106, 0.8)`}
            />
        ))}
        
        {/* Larger golden sparkles */}
        {Array.from({ length: 8 }).map((_, i) => (
            <Box
                key={`sparkle-${i}`}
                position="absolute"
                width="8px"
                height="8px"
                borderRadius="full"
                bg="rgba(212, 175, 55, 0.8)"
                left={`${Math.random() * 100}%`}
                top={`${Math.random() * 100}%`}
                css={{
                    animation: `${sparkle} ${2 + Math.random() * 3}s ease-in-out infinite`,
                    animationDelay: `${Math.random() * 3}s`,
                }}
                boxShadow="0 0 12px rgba(212, 175, 55, 0.9)"
            />
        ))}
    </Box>
);

const FloatingPetals: React.FC = () => (
    <Box position="absolute" inset={0} zIndex={0} pointerEvents="none" overflow="hidden">
        {Array.from({ length: 15 }).map((_, i) => (
            <Box
                as="svg"
                key={i}
                position="absolute"
                viewBox="0 0 20 20"
                style={{
                    width: `${Math.random() * 20 + 10}px`,
                    left: `${Math.random() * 100}%`,
                    animation: `floating-petal ${Math.random() * 20 + 15}s linear infinite`,
                    animationDelay: `${Math.random() * 15}s`,
                    opacity: 50,
                }}
            >
                <path d="M10 0 C5 5, 5 15, 10 20 C15 15, 15 5, 10 0 Z" fill={i % 2 === 0 ? 'var(--chakra-colors-brand-sandstone)' : 'rgba(196, 166, 106, 0.5)'} />
            </Box>
        ))}
    </Box>
);

/**
 * Renders a decorative smoke animation using multiple SVG ellipses.
 * Each smoke puff animates upwards with varying delays and sizes to create a dynamic effect.
 * The component is positioned absolutely and is intended for background or overlay use,
 * with pointer events disabled to avoid interfering with user interactions.
 *
 * @component
 * @returns {JSX.Element} The animated smoke effect as a React functional component.
 */
const Smoke: React.FC = () => (
    <Box position="absolute" inset={0} zIndex={0} pointerEvents="none" overflow="hidden">
        {Array.from({ length: 6 }).map((_, i) => (
            <Box
                as="svg"
                viewBox="0 0 100 100"
                key={i}
                position="absolute"
                bottom={`${-20 + i * 10}%`}
                left={`${20 + i * 15}%`}
                width={`${50 + i * 10}px`}
                opacity={0.15 + i * 0.05}
                style={{
                    animation: `smoke-rise ${18 + i * 4}s linear infinite`,
                    animationDelay: `${i * 2.5}s`,
                }}
            >
                <ellipse cx="50" cy="60" rx={28 + i * 2} ry={18 + i * 2} fill="rgba(255,255,255,0.45)" />
            </Box>
        ))}
    </Box>
);

const Checkmark: React.FC<{ message: string }> = ({ message }) => (
    <Box display="flex" alignItems="center" justifyContent="center" animation="fade-in-slow 1s forwards" mt={6}>
        <Box
            as="svg"
            viewBox="0 0 52 52"
            width="80px"
            height="80px"
            stroke="var(--chakra-colors-brand-success)"
            fill="none"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            sx={{
                strokeDasharray: '100',
                strokeDashoffset: '100',
                animation: 'stroke 0.75s ease-out forwards',
                '@keyframes stroke': {
                    to: { strokeDashoffset: '0' }
                }
            }}
        >
            <path d="M14 27 l10 10 l14 -14" />
        </Box>
        <Text ml={3} fontSize="2xl" fontWeight="bold" color="brand.success" fontFamily="khmerBody">{message}</Text>
    </Box>
);

// Premium Countdown Timer Component
const CountdownTimer: React.FC<{ targetDate: string; lang: 'kh' | 'en' }> = ({ targetDate, lang }) => {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const target = new Date(targetDate).getTime();
            const difference = target - now;

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((difference % (1000 * 60)) / 1000)
                });
            } else {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    if (!mounted) return null;

    const formatNumber = (num: number) => {
        return lang === 'kh' ? toKhmerNumerals(num.toString().padStart(2, '0')) : num.toString().padStart(2, '0');
    };

    return (
        <Box
            className="animate-fade-in-up-delay-6"
            bg="linear-gradient(135deg, rgba(196, 166, 106, 0.1), rgba(212, 175, 55, 0.05))"
            borderRadius="xl" // Smaller border radius on mobile
            p={{ base: 3, md: 6 }} // Much smaller padding on mobile
            border="1px solid rgba(196, 166, 106, 0.2)"
            backdropFilter={{ base: "none", md: "blur(10px)" }} // Remove blur on mobile
            position="relative"
            overflow="hidden"
        >
            <Text
                textAlign="center"
                fontSize={{ base: 'sm', md: 'lg' }} // Much smaller on mobile
                fontFamily="khmerHeading"
                fontWeight="bold"
                color="brand.maroon"
                mb={{ base: 3, md: 4 }}
            >
                {lang === 'kh' ? 'រាប់ថ្ងៃ' : 'Countdown'}
            </Text>
            
            <HStack justify="center" spacing={{ base: 2, md: 4 }} wrap="wrap"> {/* Smaller spacing */}
                {/* Days */}
                <VStack spacing={1}>
                    <Box
                        bg="linear-gradient(135deg, #c4a66a, #b8986b)"
                        color="white"
                        borderRadius="lg" // Smaller radius
                        p={{ base: 2, md: 4 }} // Much smaller padding
                        minW={{ base: "45px", md: "60px" }} // Smaller minimum width
                        textAlign="center"
                        boxShadow={{ base: "none", md: "0 8px 25px rgba(196, 166, 106, 0.3)" }} // Remove shadow on mobile
                        position="relative"
                        // Remove hardware acceleration properties on mobile
                        willChange={{ base: "auto", md: "transform" }}
                    >
                        <Text fontSize={{ base: 'md', md: 'xl' }} fontWeight="bold" fontFamily="khmerBody">
                            {formatNumber(timeLeft.days)}
                        </Text>
                    </Box>
                    <Text fontSize={{ base: '2xs', md: 'xs' }} fontFamily="khmerBody" color="brand.textPrimary" fontWeight="medium">
                        {lang === 'kh' ? 'ថ្ងៃ' : 'Days'}
                    </Text>
                </VStack>

                {/* Hours */}
                <VStack spacing={2}>
                    <Box
                        bg="linear-gradient(135deg, #8b4513, #a0522d)"
                        color="white"
                        borderRadius="xl"
                        p={{ base: 4, md: 6 }}
                        minW={{ base: "60px", md: "80px" }}
                        textAlign="center"
                        boxShadow="0 8px 25px rgba(139, 69, 19, 0.3)"
                        position="relative"
                        _before={{
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), transparent)',
                            borderRadius: 'xl',
                        }}
                    >
                        <Text fontSize={{ base: 'xl', md: '2xl' }} fontWeight="bold" fontFamily="khmerBody">
                            {formatNumber(timeLeft.hours)}
                        </Text>
                    </Box>
                    <Text fontSize={{ base: 'xs', md: 'sm' }} fontFamily="khmerBody" color="brand.textPrimary" fontWeight="medium">
                        {lang === 'kh' ? 'ម៉ោង' : 'Hours'}
                    </Text>
                </VStack>

                {/* Minutes */}
                <VStack spacing={2}>
                    <Box
                        bg="linear-gradient(135deg, #7c6b50, #9b8b78)"
                        color="white"
                        borderRadius="xl"
                        p={{ base: 4, md: 6 }}
                        minW={{ base: "60px", md: "80px" }}
                        textAlign="center"
                        boxShadow="0 8px 25px rgba(124, 107, 80, 0.3)"
                        position="relative"
                        _before={{
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), transparent)',
                            borderRadius: 'xl',
                        }}
                    >
                        <Text fontSize={{ base: 'xl', md: '2xl' }} fontWeight="bold" fontFamily="khmerBody">
                            {formatNumber(timeLeft.minutes)}
                        </Text>
                    </Box>
                    <Text fontSize={{ base: 'xs', md: 'sm' }} fontFamily="khmerBody" color="brand.textPrimary" fontWeight="medium">
                        {lang === 'kh' ? 'នាទី' : 'Minutes'}
                    </Text>
                </VStack>

                {/* Seconds */}
                <VStack spacing={2}>
                    <Box
                        bg="linear-gradient(135deg, #d4af37, #c4a66a)"
                        color="white"
                        borderRadius="xl"
                        p={{ base: 4, md: 6 }}
                        minW={{ base: "60px", md: "80px" }}
                        textAlign="center"
                        boxShadow="0 8px 25px rgba(212, 175, 55, 0.3)"
                        position="relative"
                        animation={`${pulseGold} 2s ease-in-out infinite`}
                        _before={{
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), transparent)',
                            borderRadius: 'xl',
                        }}
                    >
                        <Text fontSize={{ base: 'xl', md: '2xl' }} fontWeight="bold" fontFamily="khmerBody">
                            {formatNumber(timeLeft.seconds)}
                        </Text>
                    </Box>
                    <Text fontSize={{ base: 'xs', md: 'sm' }} fontFamily="khmerBody" color="brand.textPrimary" fontWeight="medium">
                        {lang === 'kh' ? 'វិនាទី' : 'Seconds'}
                    </Text>
                </VStack>
            </HStack>
        </Box>
    );
};

const OrnamentalDivider: React.FC = () => (
    <Flex width="full" height="12" my="6" justify="center" align="center" position="relative">
        {/* Central ornamental element */}
        <Box
            width="60px"
            height="60px"
            borderRadius="full"
            bg="linear-gradient(135deg, rgba(196, 166, 106, 0.2), rgba(212, 175, 55, 0.1))"
            border="2px solid rgba(196, 166, 106, 0.3)"
            display="flex"
            alignItems="center"
            justifyContent="center"
            position="relative"
            zIndex={2}
            _before={{
                content: '""',
                position: 'absolute',
                width: '40px',
                height: '40px',
                borderRadius: 'full',
                bg: 'linear-gradient(45deg, rgba(196, 166, 106, 0.4), rgba(212, 175, 55, 0.2))',
                animation: `${pulseGold} 3s ease-in-out infinite`,
            }}
        >
            <Box
                as="svg"
                width="24px"
                height="24px"
                viewBox="0 0 24 24"
                fill="none"
                color="brand.gold"
            >
                <path 
                    d="M12 2 L13.5 8.5 L20 8.5 L15 12.5 L16.5 19 L12 15 L7.5 19 L9 12.5 L4 8.5 L10.5 8.5 L12 2 Z" 
                    fill="currentColor"
                    opacity="0.8"
                />
            </Box>
        </Box>
        
        {/* Left flourish */}
        <Box
            position="absolute"
            left="0"
            top="50%"
            transform="translateY(-50%)"
            width="45%"
            height="2px"
            background="linear-gradient(to right, transparent, rgba(196, 166, 106, 0.6), rgba(196, 166, 106, 0.2))"
            _after={{
                content: '""',
                position: 'absolute',
                right: '-10px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '8px',
                height: '8px',
                borderRadius: 'full',
                bg: 'rgba(196, 166, 106, 0.6)',
            }}
        />
        
        {/* Right flourish */}
        <Box
            position="absolute"
            right="0"
            top="50%"
            transform="translateY(-50%)"
            width="45%"
            height="2px"
            background="linear-gradient(to left, transparent, rgba(196, 166, 106, 0.6), rgba(196, 166, 106, 0.2))"
            _before={{
                content: '""',
                position: 'absolute',
                left: '-10px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '8px',
                height: '8px',
                borderRadius: 'full',
                bg: 'rgba(196, 166, 106, 0.6)',
            }}
        />
    </Flex>
);

// --- RSVP FORM COMPONENT --- //
interface RSVPFormProps {
    onClose: () => void;
    lang: 'kh' | 'en';
    guestRef: any; // DocumentReference from Firestore
}

const RSVPForm: React.FC<RSVPFormProps> = ({ onClose, lang, guestRef }) => {
    const content = astraConfig.content[lang];
    const [attending, setAttending] = useState<string>('');
    const [reason, setReason] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [messageType, setMessageType] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [showReasonField, setShowReasonField] = useState<boolean>(false);

    // Debug logging
    useEffect(() => {
        console.log('RSVPForm mounted with guestRef:', guestRef);
        console.log('GuestRef type:', typeof guestRef);
        if (guestRef) {
            console.log('GuestRef has _delegate:', !!guestRef._delegate);
            console.log('GuestRef has _key:', !!guestRef._key);
        }
    }, [guestRef]);

    // Show reason field when "no" is selected
    useEffect(() => {
        setShowReasonField(attending === 'no');
        if (attending !== 'no') {
            setReason(''); // Clear reason if not saying no
        }
    }, [attending]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!attending) {
            setMessage(content.rsvpError);
            setMessageType('error');
            return;
        }

        // If declining and no reason provided, require reason
        if (attending === 'no' && !reason.trim()) {
            setMessage(lang === 'kh' ? 'សូមផ្តល់មូលហេតុមួយ។' : 'Please provide a reason.');
            setMessageType('error');
            return;
        }
        
        if (!guestRef) {
            console.error("No guest reference available for RSVP");
            setMessage("មិនអាចកំណត់អត្តសញ្ញាណភ្ញៀវបានទេ។ សូមព្យាយាមម្តងទៀត។");
            setMessageType('error');
            return;
        }

        // Additional validation to ensure guestRef is a valid Firestore DocumentReference
        if (!guestRef._delegate && !guestRef._key) {
            console.error("Invalid guest reference object");
            setMessage("មិនអាចកំណត់អត្តសញ្ញាណភ្ញៀវបានទេ។ សូមព្យាយាមម្តងទៀត។");
            setMessageType('error');
            return;
        }
        
        setIsSubmitting(true);
        try {
            const updateData: any = {
                attending: attending === 'yes',
                rsvpTimestamp: serverTimestamp(),
                status: attending === 'yes' ? 'confirmed' : 'declined'
            };

            // Add reason if declining
            if (attending === 'no' && reason.trim()) {
                updateData.declineReason = reason.trim();
            }

            await updateDoc(guestRef, updateData);
            
            // Show appropriate success message
            if (attending === 'yes') {
                setMessage(lang === 'kh' ? 
                    'អរគុណច្រើន! យើងរំពឹងទុកថានឹងបានជួបអ្នកនៅថ្ងៃពិធីមង្គលការ។ អ្នកនឹងមានពេលវេលាដ៏អស្ចារ្យ!' : 
                    'Thank you so much! We are excited to see you at our wedding ceremony. You will have a wonderful time!');
            } else {
                setMessage(lang === 'kh' ? 
                    '😢 យើងពិតជាសោកស្តាយដែលអ្នកមិនអាចចូលរួមបាន។ សូមអរគុណសម្រាប់ការជូនដំណឹង។ យើងនឹងនឹកឃើញអ្នក!' : 
                    '😢 We are truly sorry you cannot attend. Thank you for letting us know. We will miss you!');
            }
            setMessageType('success');
            
            setTimeout(() => {
                onClose();
            }, 3000); // Give more time to read the personalized message
        } catch (e) {
            console.error("Error updating RSVP: ", e);
            setMessage(content.rsvpError);
            setMessageType('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal isOpen={true} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent p={6} borderRadius="xl" boxShadow="2xl" bg="white" maxW="90%" width="400px">
                <ModalHeader>
                    <Heading as="h2" fontSize="2xl" fontFamily="khmerSubheading" color="brand.textPrimary" textAlign="center" fontWeight="semibold">
                        {content.rsvpFormTitle}
                    </Heading>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack as="form" spacing={4} onSubmit={handleSubmit}>
                        <Box width="full">
                            <Text fontSize="md" fontWeight="medium" mb={2} fontFamily="khmerBody">
                                {content.rsvpAttendingLabel}
                            </Text>
                            <RadioGroup onChange={setAttending} value={attending}>
                                <Stack direction="row" spacing={4}>
                                    <Radio value="yes" colorScheme="yellow" isDisabled={isSubmitting} fontFamily="khmerBody">
                                        {content.rsvpYes}
                                    </Radio>
                                    <Radio value="no" colorScheme="yellow" isDisabled={isSubmitting} fontFamily="khmerBody">
                                        {content.rsvpNo}
                                    </Radio>
                                </Stack>
                            </RadioGroup>
                        </Box>
                        
                        {/* Reason field for declining */}
                        {showReasonField && (
                            <Box width="full">
                                <Text fontSize="md" fontWeight="medium" mb={2} fontFamily="khmerBody">
                                    {lang === 'kh' ? 'មូលហេតុ:' : 'Reason:'}
                                </Text>
                                <Input
                                    placeholder={lang === 'kh' ? 'សូមប្រាប់យើងពីមូលហេតុ...' : 'Please let us know why...'}
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    bg="white"
                                    border="2px solid"
                                    borderColor="brand.gold"
                                    _focus={{
                                        borderColor: "brand.darkGold",
                                        boxShadow: "0 0 0 1px var(--chakra-colors-brand-darkGold)"
                                    }}
                                    fontFamily="khmerBody"
                                    isDisabled={isSubmitting}
                                />
                            </Box>
                        )}
                        
                        {message && (
                            <Box 
                                p={4} 
                                borderRadius="md" 
                                bg={messageType === 'success' ? 'green.50' : 'red.50'}
                                border={`1px solid ${messageType === 'success' ? 'var(--chakra-colors-green-200)' : 'var(--chakra-colors-red-200)'}`}
                                width="full"
                            >
                                <Text 
                                    color={messageType === 'success' ? 'green.700' : 'red.700'} 
                                    textAlign="center" 
                                    fontFamily="khmerBody"
                                    fontSize="sm"
                                    lineHeight="1.5"
                                >
                                    {message}
                                </Text>
                            </Box>
                        )}
                        
                        <Button 
                            type="submit" 
                            bg={'brand.gold'} 
                            color="white" 
                            isDisabled={isSubmitting || !attending || (attending === 'no' && !reason.trim())} 
                            fontFamily="khmerBody" 
                            fontWeight="semibold"
                            width="full"
                            _hover={{ bg: 'brand.darkGold' }}
                            isLoading={isSubmitting}
                            loadingText={content.rsvpSubmit}
                        >
                            {content.rsvpSubmit}
                        </Button>
                    </VStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

// NOW add the LazyRSVPForm wrapper AFTER the RSVPForm component:
const LazyRSVPForm = dynamic(() => Promise.resolve(RSVPForm), {
  loading: () => (
    <VStack spacing={4} w="300px">
      <Skeleton height="40px" width="100%" borderRadius="md" />
      <Skeleton height="80px" width="100%" borderRadius="md" />
      <Skeleton height="40px" width="120px" borderRadius="full" />
    </VStack>
  ),
  ssr: false
});

// --- CEREMONIAL FLOW COMPONENTS --- //
interface EntranceScreenProps {
    guestName: string;
    onEnter: () => void;
    lang: 'kh' | 'en';
    weddingInfo?: any;  // Add this line
}


const EntranceScreen: React.FC<EntranceScreenProps> = ({ guestName, onEnter, lang, weddingInfo }) => {
    // Ensure we default to Khmer if no language is set
    const currentLang = lang || 'kh';
    const content = astraConfig.content[currentLang];
    const [isContentVisible, setContentVisible] = useState<boolean>(false);
    const [showButton, setShowButton] = useState<boolean>(false);
    const [showMonogram, setShowMonogram] = useState<boolean>(false);
    const [showTitle, setShowTitle] = useState<boolean>(false);
    const [showGuestName, setShowGuestName] = useState<boolean>(false);
    const [showQuote, setShowQuote] = useState<boolean>(false);
    const [isExiting, setIsExiting] = useState<boolean>(false);

    useEffect(() => {
        // Staggered entrance animation with smoother timing
        const monogramTimer = setTimeout(() => setShowMonogram(true), 500);
        const titleTimer = setTimeout(() => setShowTitle(true), 1000);
        const guestNameTimer = setTimeout(() => setShowGuestName(true), 1500);
        const quoteTimer = setTimeout(() => setShowQuote(true), 2000);
        const contentTimer = setTimeout(() => setContentVisible(true), 2500);
        const buttonTimer = setTimeout(() => setShowButton(true), 3000);
        
        return () => {
            clearTimeout(monogramTimer);
            clearTimeout(titleTimer);
            clearTimeout(guestNameTimer);
            clearTimeout(quoteTimer);
            clearTimeout(contentTimer);
            clearTimeout(buttonTimer);
        };
    }, []);
    
    useEffect(() => {
    // ULTRA FAST - everything appears almost together
    const quickTimer = setTimeout(() => {
        setShowMonogram(true);
        setShowTitle(true);
        setShowGuestName(true);
        setShowQuote(true);
        setContentVisible(true);
        setShowButton(true);
    }, 100); // Everything appears after just 100ms
    
    return () => {
        clearTimeout(quickTimer);
    };
}, []);

    const handleEnter = () => {
        setIsExiting(true);
        // FASTER exit animation
        setTimeout(() => {
            onEnter();
        }, 800); // REDUCED from 500ms
    };

    return (
        <Center
            minH="100vh"
            p={4}
            position="relative"
            overflow="hidden"
            bgImage="
                url('/textures/khmer-damask-motif-light.png'),
                linear-gradient(to bottom right, var(--chakra-colors-brand-ivory), var(--chakra-colors-brand-sandstone))
            "
            bgBlendMode="multiply"
            bgSize="auto, cover"
            bgRepeat="repeat, no-repeat"
            bgPosition="center, center"
            // FASTER exit animation
    opacity={isExiting ? 0 : 1}
    transform={isExiting ? 'scale(0.95) translateY(-20px)' : 'scale(1) translateY(0)'}
    filter={isExiting ? 'blur(2px)' : 'blur(0px)'} // ADD: blur effect on exit
    transition="all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)" // SLOWER: 0.8s with smooth easing
    _after={{
        content: "''",
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        height: "80%",
        backgroundImage: "url('/vectors/angkorwat.svg')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center bottom",
        opacity: 0.15,
        pointerEvents: "none",
        zIndex: 0,
        maskImage: "linear-gradient(to top, transparent 0%, black 20%, black 90%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to top, transparent 0%, black 20%, black 80%, transparent 100%)",
    }}
>

            <VStack
                zIndex={1}
                spacing={5}
                textAlign="center"
                bg="rgba(255, 255, 255, 0.35)"
                backdropFilter="blur(15px)"
                p={{ base: 8, md: 12 }}
                borderRadius="xl"
                boxShadow="0 15px 40px rgba(0,0,0,0.1), 0 0 0 1px rgba(255, 255, 255, 0.4)"
                border="1px solid rgba(255, 255, 255, 0.3)"
                maxW="lg"
               // FASTER container animation
                opacity={isContentVisible && !isExiting ? 1 : 0}
                transform={
                    isExiting 
                        ? 'translateY(-50px) scale(0.9)' 
                        : isContentVisible 
                            ? 'translateY(0) scale(1)' 
                            : 'translateY(30px) scale(0.95)'
                }
                transition="all 1s cubic-bezier(0.4, 0, 0.2, 1)"
            >

                {/* Title - Second to appear */}
                <Box
                    opacity={showTitle ? 1 : 0}
                    transform={showTitle ? 'translateY(0)' : 'translateY(30px)'}
                    transition="all 1s cubic-bezier(0.4, 0, 0.2, 1)"
                >
                    <Heading 
                        as="h2" 
                        fontSize={{ base: '2rem', md: '1.8rem' }} 
                        fontFamily={currentLang === 'kh' ? "Moul" : "WeddingFont"} 
                        color="brand.maroon" 
                        letterSpacing="0.01em" 
                        lineHeight="1.3"
                        fontWeight="bold"
                        textAlign="center"
                        mb={2}
                    >
                        {currentLang === 'kh' ? 'សូមគោរពអញ្ជើញ' : 'Cordially Invited'}
                    </Heading>
                </Box>

                {/* Guest Name - Third to appear with special golden effect */}
                <Box
                    opacity={showGuestName ? 1 : 0}
                    transform={showGuestName ? 'translateY(0) scale(1)' : 'translateY(25px) scale(0.9)'}
                    transition="all 1.2s cubic-bezier(0.4, 0, 0.2, 1)"
                >
                    <Text
                        fontSize={{ base: '2xl', md: '4.5xl' }}
                        fontFamily="khmerSubheading"
                        color="brand.gold"
                        fontWeight="bold"
                        letterSpacing="1px"
                        textShadow="0 3px 6px rgba(196, 166, 106, 0.4)"
                        css={{
                            animation: showGuestName ? `${textShimmer} 4s ease-in-out infinite 0.5s` : 'none',
                        }}
                    >
                        {guestName || content.guestDefault}
                    </Text>
                </Box>
                
                {/* Quote - Fourth to appear */}
                <Box
                    opacity={showQuote ? 1 : 0}
                    transform={showQuote ? 'translateY(0)' : 'translateY(20px)'}
                    transition="all 1s cubic-bezier(0.4, 0, 0.2, 1)"
                >
                    <Text
                        fontSize={{ base: 'md', md: 'lg' }}
                        color="brand.mediumBrown"
                        fontStyle="italic"
                        fontFamily="khmerBody"
                        maxW="sm"
                        pt={2}
                        lineHeight="1.6"
                    >
                        {content.quote}
                    </Text>
                </Box>
                
                {/* Button - Last to appear with enhanced entrance */}
                <Box
                    opacity={showButton ? 1 : 0}
                    transform={showButton ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.8)'}
                    transition="all 1.5s cubic-bezier(0.4, 0, 0.2, 1)"
                >
                    <Button
                        onClick={handleEnter}
                        bg="linear-gradient(135deg, #FFD700 0%, #FFA500 20%, #FFD700 40%, #B8860B 60%, #FFD700 80%, #DAA520 100%)"
                        color="white"
                        px={{ base: 14, md: 20 }}
                        py={{ base: 7, md: 10 }}
                        mt={8}
                        borderRadius="full"
                        fontFamily={lang === 'kh' ? 'moul' : 'WeddingFont'}
                        fontSize={{ base: 'xl', md: '2xl' }}
                        fontWeight="900"
                        letterSpacing="1px"
                        boxShadow="0 8px 20px rgba(255, 215, 0, 0.4), inset 0 2px 6px rgba(255, 255, 255, 0.4), 0 0 30px rgba(255, 215, 0, 0.3), 0 4px 16px rgba(0, 0, 0, 0.1)"
                        border="2px solid #FFD700"
                       // textShadow="0 2px 4px rgba(0,0,0,0.3), 0 1px 0px rgba(255,255,255,0.2)"
                        position="relative"
                        overflow="hidden"
                        zIndex={10}
                        _before={{
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: '-100%',
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent)',
                            transition: 'left 0.5s ease',
                        }}
                        _after={{
                            content: '""',
                            position: 'absolute',
                            inset: '-3px',
                            background: 'linear-gradient(45deg, #FFD700, #FFA500, #FFD700, #B8860B, #FFD700)',
                            backgroundSize: '300% 300%',
                            borderRadius: 'full',
                            zIndex: -1,
                            opacity: 0.6,
                            animation: `${gradientShift} 3s ease-in-out infinite`,
                        }}
                        _hover={{ 
                            boxShadow: '0 12px 30px rgba(255, 215, 0, 0.5), inset 0 3px 8px rgba(255, 255, 255, 0.5), 0 0 40px rgba(255, 215, 0, 0.4), 0 6px 24px rgba(0, 0, 0, 0.15)', 
                            transform: 'scale(1.05) translateY(-3px)',
                            bg: 'linear-gradient(135deg, #FFA500 0%, #FFD700 20%, #FFFF00 40%, #FFD700 60%, #FFA500 80%, #B8860B 100%)',
                            borderColor: '#FFFF00',
                            _before: {
                                left: '100%',
                            },
                        }}
                        _active={{
                            transform: 'scale(1.02) translateY(-2px)',
                        }}
                        transition="all 0.4s cubic-bezier(.25,.8,.25,1)"
                        // Add entrance animation
                        css={{
                            animation: showButton ? `${pulseGold} 2s ease-in-out infinite 1s` : 'none',
                        }}
                    >
                        <Text
                            fontSize="inherit"
                            fontWeight="inherit"
                            position="relative"
                            zIndex={2}
                            textTransform="uppercase"
                            sx={{
                                background: "linear-gradient(90deg, #FFFFFF 0%, #FFFACD 50%, #FFFFFF 100%)",
                                backgroundClip: "text",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.2))",
                            }}
                        >
                            {content.enterButton}
                        </Text>
                    </Button>
                </Box>
            </VStack>
        </Center>
    );
};

interface InvitationScreenProps {
    guestName: string;
    lang: 'kh' | 'en';
    setLang: (lang: 'kh' | 'en') => void;
    weddingInfo: any;
    guest: any;
    onRSVPSuccess: () => void;
    isRSVPSuccess: boolean;
    guestRef: any;
    slug: string;
}

const InvitationScreen: React.FC<InvitationScreenProps> = ({ guestName, lang, setLang, weddingInfo, guest, onRSVPSuccess, isRSVPSuccess, guestRef, slug }) => {
    const content = astraConfig.content[lang];
    const [showRSVP, setShowRSVP] = useState<boolean>(false);
    const [confirmedCount, setConfirmedCount] = useState<number>(0);
    const [currentUrl, setCurrentUrl] = useState<string>('');
    const [isMusicPlaying, setIsMusicPlaying] = useState<boolean>(false); // Start as false, will be enabled by user interaction
    const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);
    const [musicInitialized, setMusicInitialized] = useState<boolean>(false);
    const [autoplayBlocked, setAutoplayBlocked] = useState<boolean>(false);
    // ADD: State for invitation screen fade-in animation
    const [isVisible, setIsVisible] = useState<boolean>(false);

        useEffect(() => {
        // Small delay then trigger fade-in
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 100); // Short delay to ensure smooth transition
        
        return () => clearTimeout(timer);
    }, []);

    // ADD THESE LAZY LOADING HOOKS HERE:
    const { ref: timelineRef, inView: timelineInView } = useInView({
        threshold: 0.1,
        triggerOnce: true,
        rootMargin: '100px'
    });

    const { ref: mapRef, inView: mapInView } = useInView({
        threshold: 0.1,
        triggerOnce: true,
        rootMargin: '100px'
    });

    const { ref: contactRef, inView: contactInView } = useInView({
        threshold: 0.1,
        triggerOnce: true,
        rootMargin: '50px'
    });

    const { ref: countdownRef, inView: countdownInView } = useInView({
        threshold: 0.1,
        triggerOnce: true,
        rootMargin: '50px'
    });

    // Translation state
    const [translatedContent, setTranslatedContent] = useState<{[key: string]: string}>({});
    const [isTranslating, setIsTranslating] = useState<boolean>(false);
    
    // Auto-translate content when language changes
    const translateContent = async (targetLang: 'kh' | 'en') => {
        if (!weddingInfo) return;
  
        
        setIsTranslating(true);
        try {
            const newTranslations: {[key: string]: string} = {};
            
            // Fields that might need translation
            const fieldsToTranslate = [
                { key: 'venue', value: weddingInfo.venue },
                // Add more fields as needed
            ];
            
            for (const field of fieldsToTranslate) {
                if (!field.value) continue;
                
                try {
                    let translatedText = '';
                    if (targetLang === 'en') {
                        // Use local transliteration from Khmer to English
                        translatedText = fallbackTransliterate(field.value);
                    } else {
                        // For English to Khmer, keep original (no reverse translation available)
                        translatedText = field.value;
                    }
                    
                    newTranslations[field.key] = translatedText || field.value;
                } catch (error) {
                    console.error(`Translation error for ${field.key}:`, error);
                    newTranslations[field.key] = field.value;
                }
            }
            
            setTranslatedContent(newTranslations);
        } catch (error) {
            console.error('Translation process error:', error);
        } finally {
            setIsTranslating(false);
        }
    };
    
    // Trigger translation when language changes
    useEffect(() => {
        if (weddingInfo) {
            translateContent(lang);
        }
    }, [lang, weddingInfo]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setCurrentUrl(window.location.href);
            
            // Use the HTML audio element instead of creating new Audio object
            const audioElement = document.getElementById('background-music') as HTMLAudioElement;
            if (audioElement) {
                audioElement.volume = 0.3;
                setAudioRef(audioElement);
                
                // Try immediate autoplay with a small delay
                const attemptAutoplay = () => {
                    setTimeout(() => {
                        audioElement.play().then(() => {
                            console.log('Music autoplay successful');
                            setIsMusicPlaying(true);
                        }).catch((error) => {
                            console.log('Autoplay blocked by browser:', error);
                            setAutoplayBlocked(true);
                            // Set up user interaction fallback
                            setupInteractionFallback();
                        });
                    }, 500); // Small delay to let page fully load
                };
                
                // Fallback for when autoplay is blocked
                const setupInteractionFallback = () => {
                    const handleFirstInteraction = () => {
                        if (audioElement && !isMusicPlaying) {
                            audioElement.play().then(() => {
                                console.log('Music started after user interaction');
                                setIsMusicPlaying(true);
                                setAutoplayBlocked(false);
                            }).catch((error) => {
                                console.log('Could not start music:', error);
                            });
                        }
                        // Remove listeners after first interaction
                        document.removeEventListener('click', handleFirstInteraction);
                        document.removeEventListener('keydown', handleFirstInteraction);
                        document.removeEventListener('touchstart', handleFirstInteraction);
                    };
                    
                    // Add interaction listeners
                    document.addEventListener('click', handleFirstInteraction);
                    document.addEventListener('keydown', handleFirstInteraction);
                    document.addEventListener('touchstart', handleFirstInteraction);
                };
                
                // Try autoplay immediately when audio is ready
                if (audioElement.readyState >= 2) { // HAVE_CURRENT_DATA
                    attemptAutoplay();
                } else {
                    audioElement.addEventListener('canplay', attemptAutoplay, { once: true });
                }
                
                return () => {
                    // Cleanup
                    document.removeEventListener('click', () => {});
                    document.removeEventListener('keydown', () => {});
                    document.removeEventListener('touchstart', () => {});
                };
            }
        }
    }, []);

    // Toggle music playback
    const toggleMusic = () => {
        console.log('Toggling music. Current state:', isMusicPlaying);
        
        if (audioRef) {
            if (isMusicPlaying) {
                audioRef.pause();
            } else {
                audioRef.play()
                    .then(() => {
                        console.log('Music started successfully');
                    })
                    .catch((error) => {
                        console.log('Could not play music:', error);
                    });
            }
        } else {
            console.log('No audio source available');
        }
    };

    // Fetch real-time confirmed RSVP count
    useEffect(() => {
        let unsubscribe: (() => void) | undefined;
        if (db) {
            const rsvpsQuery = query(collection(db as Firestore, `artifacts/${appId}/public/data/wedding_rsvps`));
            unsubscribe = onSnapshot(rsvpsQuery, (snapshot) => {
                let count = 0;
                snapshot.forEach((doc) => {
                    if (doc.data().attending) {
                        count++;
                    }
                });
                setConfirmedCount(count);
            }, (error) => {
                console.error("Error fetching RSVP count:", error);
            });
        }
        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [db]);


    return (
// Update the main Center container around line 2900:

<Center
    minH="100vh"
    p={{ base: 2, sm: 4, md: 8 }}
    // ENHANCED: Add textured backgrounds for mobile similar to desktop
    bgImage={{
        base: "url('/textures/silk-texture.png'), url('/textures/paper-texture.jpg'), linear-gradient(135deg, rgba(245, 243, 237, 0.95) 0%, rgba(188, 167, 152, 0.9) 100%)", 
        md: "url('/textures/khmer-artwork.jpg'), url('/textures/silk-texture.png'), linear-gradient(to bottom, var(--chakra-colors-brand-ivory), var(--chakra-colors-brand-sandstone))"
    }}
    bgAttachment={{ base: "scroll", md: "fixed" }}
    bgBlendMode={{ base: "multiply, soft-light, normal", md: "multiply" }} // Multiple blend modes for mobile
    bgRepeat={{ base: "repeat, repeat, no-repeat", md: "no-repeat" }}
    bgSize={{ 
        base: "200px 200px, 150px 150px, cover", // Different sizes for each texture
        md: "cover" 
    }}
    bgPosition={{ 
        base: "0 0, 50px 50px, center", // Offset patterns
        md: "center" 
    }}
    overflow="hidden"
    position="relative"
         opacity={isVisible ? 1 : 0}
            //transform={isVisible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.98)'}
          //  filter={isVisible ? 'blur(0px)' : 'blur(3px)'}
           // transition="all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)" // SLOW: 1.2s smooth fade-in
    // ADD: Enhanced backdrop filter
    _before={{
        content: '""',
        position: "absolute",
        inset: 0,
        bgImage: "url('/textures/fabric-texture.png')", // Additional fabric overlay
        bgSize: "300px 300px",
        bgRepeat: "repeat",
        opacity: { base: 0.15, md: 0.08 },
        mixBlendMode: "multiply",
        zIndex: -1,
    }}
    _after={{
        content: '""',
        position: "absolute", 
        inset: 0,
        bgImage: "url('/textures/vintage-paper.png')", // Vintage paper overlay
        bgSize: "400px 400px",
        bgRepeat: "repeat",
        opacity: { base: 0.12, md: 0.05 },
        mixBlendMode: "soft-light",
        zIndex: -2,
    }}
>
{/* Top-right Controls - Language Switch & Music Toggle - FIXED POSITIONING */}
<Box
    position="fixed"
    top={4}
    right={4}
    zIndex={9999} // Increased z-index to ensure it's above everything
    display="flex"
    gap={3}
    alignItems="center"
    flexDirection="row" // Always horizontal layout
    pointerEvents="auto" // Ensure clickable
>
    {/* Language Switch */}
    <Box
        bg="rgba(255, 255, 255, 0.9)" // Increased opacity for better visibility
        backdropFilter="blur(15px)"
        borderRadius="full"
        p={1}
        border="2px solid rgba(196, 166, 106, 0.4)" // Stronger border
        boxShadow="0 8px 32px rgba(0, 0, 0, 0.1), 0 4px 16px rgba(196, 166, 106, 0.2)"
        minW="auto"
        display="flex"
        alignItems="center"
    >
        <Button
            size="sm"
            bg={lang === 'en' ? 'rgba(196, 166, 106, 0.9)' : 'transparent'}
            color={lang === 'en' ? 'white' : 'brand.textPrimary'}
            _hover={{ bg: 'rgba(196, 166, 106, 0.7)' }}
            borderRadius="full"
            px={4}
            py={2}
            fontSize="xs"
            fontWeight="bold"
            onClick={() => setLang('en')}
            transition="all 0.3s ease"
            border="none"
            minW="40px"
            h="32px"
        >
            EN
        </Button>
        <Button
            size="sm"
            bg={lang === 'kh' ? 'rgba(196, 166, 106, 0.9)' : 'transparent'}
            color={lang === 'kh' ? 'white' : 'brand.textPrimary'}
            _hover={{ bg: 'rgba(196, 166, 106, 0.7)' }}
            borderRadius="full"
            px={4}
            py={2}
            fontSize="xs"
            fontWeight="bold"
            fontFamily="'Battambang', serif"
            onClick={() => setLang('kh')}
            transition="all 0.3s ease"
            border="none"
            minW="40px"
            h="32px"
        >
            ខ្មែរ
        </Button>
    </Box>

    {/* Music Toggle */}
    <Box position="relative">
        <Button
            size="sm"
            bg={isMusicPlaying ? "rgba(196, 166, 106, 0.9)" : "rgba(255, 255, 255, 0.9)"}
            backdropFilter="blur(15px)"
            borderRadius="full"
            p={3}
            border="2px solid rgba(196, 166, 106, 0.4)"
            boxShadow={isMusicPlaying ? 
                "0 8px 32px rgba(196, 166, 106, 0.4), 0 4px 16px rgba(196, 166, 106, 0.3)" : 
                "0 8px 32px rgba(0, 0, 0, 0.1), 0 4px 16px rgba(196, 166, 106, 0.2)"
            }
            color={isMusicPlaying ? "white" : "brand.textPrimary"}
            _hover={{ 
                bg: isMusicPlaying ? "rgba(196, 166, 106, 1)" : "rgba(255, 255, 255, 1)",
                transform: "scale(1.05)"
            }}
            onClick={toggleMusic}
            transition="all 0.3s ease"
            display="flex"
            alignItems="center"
            justifyContent="center"
            minW="44px"
            h="44px"
            position="relative"
            overflow="hidden"
            animation={isMusicPlaying ? "musicPulse 2s ease-in-out infinite" : undefined}
            sx={{
                '@keyframes musicPulse': {
                    '0%, 100%': { transform: 'scale(1)', boxShadow: '0 8px 32px rgba(196, 166, 106, 0.4)' },
                    '50%': { transform: 'scale(1.05)', boxShadow: '0 12px 40px rgba(196, 166, 106, 0.6)' }
                }
            }}
        >
            {isMusicPlaying ? (
                <>
                    <Box as="svg" w="18px" h="18px" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                    </Box>
                    {/* Sound waves animation */}
                    <Box
                        position="absolute"
                        top="50%"
                        left="50%"
                        transform="translate(-50%, -50%)"
                        w="70px"
                        h="70px"
                        border="2px solid"
                        borderColor="currentColor"
                        borderRadius="50%"
                        opacity="0.3"
                        animation="soundWave 2s ease-out infinite"
                        sx={{
                            '@keyframes soundWave': {
                                '0%': { transform: 'translate(-50%, -50%) scale(0)', opacity: '0.7' },
                                '100%': { transform: 'translate(-50%, -50%) scale(1)', opacity: '0' }
                            }
                        }}
                    />
                </>
            ) : (
                <Box as="svg" w="18px" h="18px" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                </Box>
            )}
        </Button>
        
        {/* Music status indicator */}
        {(!musicInitialized || (autoplayBlocked && !isMusicPlaying)) && (
            <Box
                position="absolute"
                top="-4px"
                right="-4px"
                w="20px"
                h="20px"
                bg={autoplayBlocked ? "red.500" : "orange.500"}
                borderRadius="50%"
                display="flex"
                alignItems="center"
                justifyContent="center"
                animation="statusPulse 1.5s ease-in-out infinite"
                boxShadow="0 2px 8px rgba(0, 0, 0, 0.2)"
                sx={{
                    '@keyframes statusPulse': {
                        '0%, 100%': { opacity: '0.8', transform: 'scale(1)' },
                        '50%': { opacity: '1', transform: 'scale(1.15)' }
                    }
                }}
            >
                <Box as="svg" w="10px" h="10px" viewBox="0 0 24 24" fill="white">
                    {autoplayBlocked ? (
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                    ) : (
                        <path d="M12 6V4l-8 8 8 8v-2h8V6z"/>
                    )}
                </Box>
            </Box>
        )}
    </Box>
</Box>

{/* Autoplay blocked notification - ALSO FIXED POSITIONING */}
{autoplayBlocked && !isMusicPlaying && (
    <Box
        position="fixed"
        top="100px" // Positioned below the controls
        right="20px"
        bg="rgba(255, 255, 255, 0.98)"
        backdropFilter="blur(12px)"
        p={4}
        borderRadius="16px"
        border="2px solid rgba(196, 166, 106, 0.4)"
        color="brand.textPrimary"
        fontSize="sm"
        fontWeight="500"
        maxW="220px"
        textAlign="center"
        zIndex={9998} // Just below the controls
        animation="notificationSlide 0.5s ease-in-out"
        boxShadow="0 8px 32px rgba(0, 0, 0, 0.15), 0 4px 16px rgba(196, 166, 106, 0.2)"
        sx={{
            '@keyframes notificationSlide': {
                '0%': { transform: 'translateX(100%)', opacity: '0' },
                '100%': { transform: 'translateX(0)', opacity: '1' }
            }
        }}
    >
        <Text mb={3} lineHeight="1.4">
            🎵 {lang === 'kh' ? 'ចុចដើម្បីបើកតន្ត្រី' : 'Click to enable music'}
        </Text>
        <Button
            size="sm"
            bg="brand.gold"
            color="white"
            _hover={{ bg: "brand.darkGold" }}
            borderRadius="full"
            px={4}
            py={2}
            onClick={() => setAutoplayBlocked(false)}
            fontWeight="bold"
        >
            {lang === 'kh' ? 'បិទ' : 'Dismiss'}
        </Button>
    </Box>
)}
{/* Autoplay blocked notification */}
{autoplayBlocked && !isMusicPlaying && (
    <Box
        position="fixed"
        top="90px"
        right="20px"
        bg="rgba(255, 255, 255, 0.95)"
        backdropFilter="blur(8px)"
        p={3}
        borderRadius="12px"
        border="1px solid rgba(196, 166, 106, 0.3)"
        color="brand.textPrimary"
        fontSize="sm"
        fontWeight="500"
        maxW="200px"
        textAlign="center"
        zIndex={1000}
        animation="fade-in-slow 0.5s ease-in-out"
        boxShadow="0 4px 16px rgba(0, 0, 0, 0.1)"
    >
        <Text mb={2}>🎵 {lang === 'kh' ? 'ចុចដើម្បីបើកតន្ត្រី' : 'Click to enable music'}</Text>
        <Button
            size="xs"
            bg="brand.gold"
            color="white"
            _hover={{ bg: "brand.darkGold" }}
            onClick={() => setAutoplayBlocked(false)}
        >
            {lang === 'kh' ? 'បិទ' : 'Dismiss'}
        </Button>
    </Box>
)}

{/* Hidden HTML audio element for better browser compatibility */}
<audio
    id="background-music"
    loop
    autoPlay
    muted={false}
    preload="auto"
    style={{ display: 'none' }}
    onLoadedMetadata={() => setMusicInitialized(true)}
    onCanPlay={() => {
        // Try to play when the audio can play
        const audioElement = document.getElementById('background-music') as HTMLAudioElement;
        if (audioElement && !isMusicPlaying) {
            audioElement.play().catch(() => {
                console.log('Initial autoplay attempt failed');
            });
        }
    }}
    onPlay={() => setIsMusicPlaying(true)}
    onPause={() => setIsMusicPlaying(false)}
    onError={(e) => console.log('Audio element error:', e)}
>
    <source src="/music/wedding.mp3" type="audio/mpeg" />
    <source src="/music/wedding.ogg" type="audio/ogg" />
    Your browser does not support the audio element.
</audio>

<Box
  position="fixed"
  top={{ base: "40%", md: "40%" }}
  left="50%"
  transform="translate(-50%, -50%)"
  zIndex={-1}
  w={{ base: "100vw", md: "150vw" }} // Smaller on mobile
  h={{ base: "60vh", md: "100vh" }} // Smaller on mobile
  overflow="hidden"
  pointerEvents="none"
  opacity={{ base: 0.08, md: 0.15 }} // Much more subtle on mobile
  display={{ base: "none", sm: "block" }} // Hide completely on small mobile
>
  <Image
    src="/vectors/background.svg"
    alt="Background"
    objectFit="cover"
    w="100%"
    h="100%"
    filter="sepia(30%) hue-rotate(25deg) saturate(0.8)"
    loading="lazy" // Add lazy loading
  />

  {/* Fades */}
  <Box
    position="absolute"
    bottom="0"
    left="0"
    w="100%"
    h="50%"
    bgGradient="linear(to-t, #fff 70%, transparent 100%)"
  />
  <Box
    position="absolute"
    top="0"
    left="0"
    w="100%"
    h="20%"
    bgGradient="linear(to-b, #fff 20%, transparent 100%)"
  />
</Box>

{/* Bottom Left Texture - Wat SVG with Enhanced Fade */}
<Box
  position="fixed"
  bottom={70}
  left={-200}
  w={{ base: "65%", md: "60%" }}
  h={{ base: "45vh", md: "50vh" }}
  zIndex={-2}
  overflow="hidden"
  pointerEvents="none"
  opacity={0.37}
>
  <Image
    src="/vectors/wat.webp"
    alt="Traditional Khmer Wat"
    objectFit="contain"
    w="100%"
    h="100%"
    filter="sepia(38%) hue-rotate(28deg) brightness(1.18) saturate(0.77)"
    draggable={false}
    style={{ pointerEvents: 'none', userSelect: 'none' }}
  />
  {/* Enhanced multi-directional vignette overlay */}
  <Box
    position="absolute"
    inset={0}
    background="
      radial-gradient(ellipse at 40% 80%, transparent 10%, rgba(255,255,255,0.4) 70%, rgba(255,255,255,0.9) 100%),
      linear-gradient(to top, rgba(255,255,255,0.6) 0%, transparent 40%),
      linear-gradient(to right, rgba(255,255,255,0.7) 0%, transparent 50%),
      linear-gradient(to bottom, transparent 0%, transparent 60%, rgba(255,255,255,0.5) 100%)
    "
    mixBlendMode="lighten"
    pointerEvents="none"
  />
</Box>

{/* Bottom Right Texture - Angkor SVG with Enhanced Fade */}
<Box
  position="fixed"
  bottom={70}
  right={-190}
  w={{ base: "75%", md: "70%" }}
  h={{ base: "55vh", md: "60vh" }}
  zIndex={-2}
  overflow="hidden"
  pointerEvents="none"
  opacity={0.37}
>
  <Image
    src="/vectors/angkorwhiteblack.svg"
    alt="Traditional Angkor Pattern"
    objectFit="contain"
    w="100%"
    h="100%"
    filter="sepia(38%) hue-rotate(28deg) brightness(1.18) saturate(0.77)"
    draggable={false}
    style={{ pointerEvents: 'none', userSelect: 'none' }}
  />
  {/* Enhanced multi-directional vignette overlay */}
  <Box
    position="absolute"
    inset={0}
    background="
      radial-gradient(ellipse at 65% 85%, transparent 30%, rgba(255,255,255,0.4) 70%, rgba(255,255,255,0.9) 100%),
      linear-gradient(to top, rgba(255,255,255,0.6) 0%, transparent 40%),
      linear-gradient(to left, rgba(255,255,255,0.7) 0%, transparent 50%),
      linear-gradient(to bottom, transparent 0%, transparent 60%, rgba(255,255,255,0.5) 100%)
    "
    mixBlendMode="lighten"
    pointerEvents="none"
  />
</Box>

{/* Flower Art Pattern Overlay */}
<Box
  position="fixed"
  inset={0}
  zIndex={-1}
  pointerEvents="none"
  opacity={0.12}
  background="url('/vectors/flowers-background.svg') center/cover no-repeat"
  filter="sepia(40%) hue-rotate(30deg) brightness(1.1) contrast(0.9)"
  mixBlendMode="multiply"
/>

{/* Root line left flower */}
<Box
  position="fixed"
  left={{ base: "-100px", md: 0 }}      // 50px from left on mobile, 0 on desktop
  bottom={{ base: "-10px", md: 0 }}    // 0px from bottom on mobile, 0 on desktop
  zIndex={{ base: 2, md: -10 }} // Different z-index for mobile vs desktop
  // Remove the display property - keep visible on all devices
  mb={{ base: 0, md: 0 }} // Add bottom margin on mobile
>
  <Image
    src='/vectors/rootright.svg'
    alt="Left Root Flower"
    height={{ base: "-100vh", sm: "80vh", md: "100vh" }} // Progressive sizing: mobile -> tablet -> desktop
    width="auto"
    maxW="none"
    maxH="none"
    mx="auto"
    pos="relative"
    fallbackSrc="/vectors/rootright.svg"
    transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
    opacity={{ base: 0.60, sm: 0.60, md: 0.70 }} // Different opacity levels
    sx={{
      animation: `${neonGlow} 10s ease-in-out infinite`,
      transform: { 
        base: "scaleX(-1) translateY(30px) scale(0.8)", // Smaller and lower on mobile
        sm: "scaleX(-1) translateY(20px) scale(0.9)", // Medium on tablet
        md: "scaleX(-1)" // Normal position on desktop
      },
    }}
  />
</Box>

{/* Root line right flower */}
<Box
  position="fixed"
  right={{ base: "-100px", md: 0 }}  
  bottom={{ base: "-10px", md: 0 }}    // 0px from bottom on mobile, 0 on desktop
  zIndex={{ base: 2, md: -10 }} // Different z-index for mobile vs desktop
  // Remove the display property - keep visible on all devices
  mb={{ base: 0, md: 0 }} // Add bottom margin on mobile
  // Remove the display property - keep visible on all devices
>
  <Image
    src='/vectors/rootright.svg'
    alt="Right Root Flower"
    height={{ base: "-100vh", sm: "80vh", md: "100vh" }} // Progressive sizing: mobile -> tablet -> desktop
    width="auto"
    maxW="none"
    maxH="none"
    mx="auto"
    pos="relative"
    fallbackSrc="/vectors/rootright.svg"
    transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
    opacity={{ base: 0.50, sm: 0.60, md: 0.70 }} // Different opacity levels
    sx={{
      animation: `${neonGlow} 10s ease-in-out infinite`,
      transform: { 
        base: "translateY(30px) scale(0.8)", // Smaller and lower on mobile
        sm: "translateY(20px) scale(0.9)", // Medium on tablet
        md: "none" // Normal position on desktop
      },
    }}
  />
</Box>
            
            {/* Full-screen Invitation Content */}
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                textAlign="center"
                px={{ base: 2, md: 8 }}
                py={{ base: 2, md: 10 }}
                maxW={{ base: "98%", sm: "95%", md: "2xl" }}
                width="100%"
                className="glass-card floating-particles-luxury khmer-border"
                borderRadius={{ base: "lg", md: "2xl" }}
                position="relative"
                zIndex={2}
                minHeight="auto"
                // ENHANCED: Much more transparent with stronger blur
                bg="rgba(255, 255, 255, 0.02)" // REDUCED: from 0.06 to 0.02 - much more transparent
                backdropFilter="blur(30px) saturate(1.2) brightness(0.5)" // INCREASED: stronger blur
                border="1px solid rgba(255, 255, 255, 0.04)" // REDUCED: more subtle border
                boxShadow="0 8px 32px rgba(0, 0, 0, 0.04), 0 4px 16px rgba(255, 255, 255, 0.02)" // REDUCED: softer shadows
                mx="auto"
                // ENHANCED: Even more subtle border effects
                _before={{
                    content: '""',
                    position: "absolute",
                    inset: "-2px",
                    background: "linear-gradient(45deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.01), rgba(255, 255, 255, 0.05))", // REDUCED opacity
                    borderRadius: "inherit",
                    filter: "blur(15px)", // INCREASED blur
                    zIndex: -1,
                    opacity: 0.3, // REDUCED opacity
                }}
                _after={{
                    content: '""',
                    position: "absolute",
                    inset: "0px",
                    borderRadius: "inherit", 
                    boxShadow: "inset 0 1px 2px rgba(255, 255, 255, 0.05)", // REDUCED inner glow
                    zIndex: -1,
                    pointerEvents: "none",
                }}
            >
                 {/* ADD: New animated wrapper for content only */}
        <Box
            w="100%"
            opacity={isVisible ? 1 : 0}
            transform={isVisible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.98)'}
            filter={isVisible ? 'blur(0px)' : 'blur(3px)'}
            transition="all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
        >
        </Box>
        
    {/* Move these background elements to a lower z-index and ensure they don't interfere */}
    <Box position="absolute" inset={0} zIndex={-2} pointerEvents="none">
        <KhmerSacredGeometry />
    </Box>
    
    <Box position="absolute" inset={0} zIndex={-1} pointerEvents="none">
        <LuxuryFloatingParticles />
    </Box>
    
                
                {/* Refined Monogram with Luxury Effects */}
                <Box 
                    pos="relative" 
                    mb={{ base: 4, md: 6 }} 
                    zIndex={1}
                    className="animate-fade-in-up luxury-monogram"
                >
                  {/* Enhanced silk-paper halo backdrop */}
                  <Box
                    pos="absolute"
                    inset={0}
                    bg="url('/textures/silk-texture.png') center/cover no-repeat"
                    opacity={0.3}
                    borderRadius="full"
                    filter="blur(3px)"
                    animation={`${luxuryGlow} 4s ease-in-out infinite`}
                  />
                     {/* Monogram with Direct Golden Color - Cleaned Up */}
                <Image
                  src={weddingInfo.monogramUrl || '/vectors/monogram.svg'}
                  alt="Couple Monogram"
                  boxSize={{ base: "70px", sm: "90px", md: "130px", lg: "170px" }}
                  mx="auto"
                  pos="relative"
                  fallbackSrc="/vectors/monogram.svg"
                  transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                  sx={{
                    // Apply golden color with very subtle shadow
                    filter: `
                      brightness(0) 
                      saturate(100%) 
                      invert(%) 
                      sepia(59%) 
                      saturate(348%) 
                      hue-rotate(6deg) 
                      brightness(95%) 
                      contrast(121%)
                      drop-shadow(0 0 1px rgba(250, 2150, 0, 0.8))
                    `,
                    // Add the same shimmer animation as title
                    animation: `${textShimmer} 6s ease-in-out infinite`,
                  }}
                  _hover={{
                      transform: "scale(1.05) rotate(2deg)",
                      filter: `
                        brightness(0) 
                        saturate(100%) 
                        invert(78%) 
                        sepia(59%) 
                        saturate(348%) 
                        hue-rotate(6deg) 
                        brightness(115%) 
                        contrast(110%)
                        drop-shadow(0 0 2px rgba(255, 215, 0, 0.9))
                      `,
                  }}
                />
                </Box>
                

                {/* Premium Wedding Invitation Title with Traditional Khmer Elements */}
                <Heading
                    as="h1"
                    fontSize={{ base: "1.5rem", sm: "1.8rem", md: "2.2rem", lg: "2.5rem" }}
                    fontFamily={lang === 'kh' ? 'moul' : 'weddingFont'}
                    letterSpacing="0.05em"
                    lineHeight="2"
                    fontWeight="bold"
                    mb={{ base: 4, md: 6 }}
                    textAlign="center"
                    px={2}
                    position="relative"
                    zIndex={999} // Put it on absolute top layer
                    color="transparent"
                    background="linear-gradient(90deg, #FFD700 0%, #FFC107 25%, #b18635 50%, #FFD700 75%, #FFC107 100%)"
                    backgroundSize="600% 100%" // Make gradient even bigger
                    backgroundClip="text"
                    textShadow="none"
                    isolation="isolate" // Create new stacking context
                    sx={{
                        WebkitTextFillColor: "transparent",
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        backgroundImage: "linear-gradient(90deg, #FFD700 0%, #FFC107 25%, #b18635 50%, #FFD700 75%, #FFC107 100%)",
                        backgroundSize: "600% 100%", // Even larger gradient
                        backgroundPosition: "center",
                        animation: `${textShimmer} 18s ease-in-out infinite`,
                        // Force it above everything
                        transform: "translateZ(0)", // Force hardware acceleration
                        willChange: "transform", // Optimize for animations
                    }}
                >
                    {content.inviteText}
                </Heading>

                <Box className="animate-fade-in-up-delay-2">
                    <KhmerOrnamentalDivider />
                </Box>

{/* Parents Section - Side by Side Layout */}
<Flex 
    direction="row" // Force horizontal layout on all screen sizes
    justify="space-between" 
    width="100%" 
    gap={{ base: 2, md: 8 }} // Smaller gap on mobile
    mb={{ base: 4, md: 8 }}
    maxW={{ base: "100%", md: "4xl" }}
    px={{ base: 1, md: 0 }}
    className="animate-fade-in-up-delay-3"
>    
    {/* Groom's Parents - Left Column */}
    <Box 
        flex={1} 
        textAlign="center" 
        minW={0}
        className="premium-card khmer-border"
        p={{ base: 3, sm: 5, md: 6 }} // Increased mobile padding
        borderRadius={{ base: "lg", md: "xl" }}
        bg="rgba(255, 255, 255, 0.08)"
        backdropFilter="blur(10px)"
        position="relative"
        mr={1}
    >
        <Heading 
            as="h3" 
            fontSize={{ base: 'xs', sm: 'xl', md: 'xl' }} // INCREASED from '2xs'
            fontFamily={lang === 'kh' ? 'moul' : 'weddingFont'} 
            color="brand.maroon" 
            fontWeight="bold"
            mb={{ base: 2, sm: 5, md: 4 }} // Increased spacing
            px={0}
            lineHeight={{ base: 2, md: 2 }}
            noOfLines={2}
        >
            {lang === 'kh' ? 'មាតាបិតាកូនប្រុស' : "Groom's Parents"}
        </Heading>
        <VStack spacing={{ base: 1, sm: 2, md: 3 }} align="center"> // Increased spacing
            {/* Groom's Father */}
            <Box>
                <Text 
                    fontSize={{ base: 'xs', sm: 'sm', md: 'lg' }} // INCREASED from '2xs'
                    fontFamily="khmerSubheading" 
                    color="brand.textPrimary"
                    fontWeight="semibold"
                    noOfLines={3}
                    lineHeight={{ base: 2, md: 1.5 }} // Better line height
                >
                    {formatName('លោក', 'Mr.', weddingInfo?.groomFatherName, weddingInfo, 'groomFather', lang)}
                </Text>
                {weddingInfo?.groomFatherSubtitle && (
                    <Text 
                        fontSize={{ base: '2xs', sm: 'xs', md: 'sm' }} // INCREASED
                        fontFamily="khmerBody" 
                        color="brand.mediumBrown"
                        fontStyle="italic"
                        noOfLines={2}
                        lineHeight={1.2}
                    >
                        {weddingInfo.groomFatherSubtitle}
                    </Text>
                )}
            </Box>
            {/* Groom's Mother */}
            <Box>
                <Text 
                    fontSize={{ base: 'xs', sm: 'sm', md: 'lg' }} // INCREASED from '2xs'
                    fontFamily="khmerSubheading" 
                    color="brand.textPrimary"
                    fontWeight="semibold"
                    noOfLines={3}
                    lineHeight={{ base: 2, md: 1.5 }}
                >
                    {formatName('លោកស្រី', 'Mrs.', weddingInfo?.groomMotherName, weddingInfo, 'groomMother', lang)}
                </Text>
                {weddingInfo?.groomMotherSubtitle && (
                    <Text 
                        fontSize={{ base: '2xs', sm: 'xs', md: 'sm' }} // INCREASED
                        fontFamily="khmerBody" 
                        color="brand.mediumBrown"
                        fontStyle="italic"
                        noOfLines={2}
                        lineHeight={1.2}
                    >
                        {weddingInfo.groomMotherSubtitle}
                    </Text>
                )}
            </Box>
        </VStack>
    </Box>

 {/* Bride's Parents - Right Column */}
<Box 
    flex={1} 
    textAlign="center" 
    minW={0}
    className="premium-card khmer-border"
    p={{ base: 3, sm: 4, md: 6 }} // Same increased mobile padding
    borderRadius={{ base: "lg", md: "xl" }}
    bg="rgba(255, 255, 255, 0.08)"
    backdropFilter="blur(10px)"
    position="relative"
    ml={1}
>
    <Heading 
        as="h3" 
        fontSize={{ base: 'xs', sm: 'xl', md: 'xl' }} // SAME AS GROOM'S PARENTS
        fontFamily={lang === 'kh' ? 'moul' : 'weddingFont'} 
        color="brand.maroon" 
        fontWeight="bold"
        mb={{ base: 2, sm: 5, md: 4 }} // Same increased spacing
        px={0}
        lineHeight={{ base: 2.1, md: 2 }}
        noOfLines={2}
    >
        {lang === 'kh' ? 'មាតាបិតាកូនស្រី' : "Bride's Parents"}
    </Heading>
    <VStack spacing={{ base: 1, sm: 2, md: 3 }} align="center"> {/* Same increased spacing */}
        {/* Bride's Father */}
        <Box>
            <Text 
                fontSize={{ base: 'xs', sm: 'sm', md: 'lg' }} // SAME AS GROOM'S PARENTS
                fontFamily="khmerSubheading" 
                color="brand.textPrimary"
                fontWeight="semibold"
                noOfLines={3}
                lineHeight={{ base: 2, md: 1.5 }} // Same better line height
            >
                {formatName('លោក', 'Mr.', weddingInfo?.brideFatherName, weddingInfo, 'brideFather', lang)}
            </Text>
            {weddingInfo?.brideFatherSubtitle && (
                <Text 
                    fontSize={{ base: '2xs', sm: 'xs', md: 'sm' }} // SAME AS GROOM'S PARENTS
                    fontFamily="khmerBody" 
                    color="brand.mediumBrown"
                    fontStyle="italic"
                    noOfLines={2}
                    lineHeight={1.2}
                >
                    {weddingInfo.brideFatherSubtitle}
                </Text>
            )}
        </Box>
        {/* Bride's Mother */}
        <Box>
            <Text 
                fontSize={{ base: 'xs', sm: 'sm', md: 'lg' }} // SAME AS GROOM'S PARENTS
                fontFamily="khmerSubheading" 
                color="brand.textPrimary"
                fontWeight="semibold"
                noOfLines={3}
                lineHeight={{ base: 2, md: 1.5 }} // Same line height
            >
                {formatName('លោកស្រី', 'Mrs.', weddingInfo?.brideMotherName, weddingInfo, 'brideMother', lang)}
            </Text>
            {weddingInfo?.brideMotherSubtitle && (
                <Text 
                    fontSize={{ base: '2xs', sm: 'xs', md: 'sm' }} // SAME AS GROOM'S PARENTS
                    fontFamily="khmerBody" 
                    color="brand.mediumBrown"
                    fontStyle="italic"
                    noOfLines={2}
                    lineHeight={1.2}
                >
                    {weddingInfo.brideMotherSubtitle}
                </Text>
            )}
        </Box>
    </VStack>
</Box>
</Flex>
                
                {/* Introduction Paragraph */}
                <Text
                    fontFamily="khmerBody"
                    fontSize={{ base: 'xs', sm: 'sm', md: 'lg' }} // Much smaller on mobile
                    color="brand.textPrimary"
                    lineHeight={{ base: '1.4', md: '1.8' }} // Tighter on mobile
                    mb={{ base: 3, md: 8 }} // Reduced mobile margin
                    textAlign="center"
                    maxW={{ base: "100%", md: "4xl" }}
                    px={{ base: 2, md: 6 }} // Reduced mobile padding
                    wordBreak="break-word" // Allow text wrapping
                    whiteSpace="normal" // Ensure text wraps
                >
                    {lang === 'kh' ? 
                     `យើងខ្ញុំ ${formatName('លោកស្រី', 'Mrs.', weddingInfo?.groomMotherName, weddingInfo, 'groomMother', 'kh')} និង ${formatName('លោក', 'Mr.', weddingInfo?.groomFatherName, weddingInfo, 'groomFather', 'kh')} មានកិត្តិយសសូមគោរពអញ្ជើញ លោក លោកស្រី និងគ្រួសារ អញ្ជើញចូលរួមពិធីមង្គលការរបស់កូនយើង ដែលនឹងត្រូវប្រព្រឹត្តទៅនៅ ${weddingInfo?.date ? toKhmerNumerals(weddingInfo.date) : 'TBD'} ${weddingInfo?.time ? formatKhmerTime(weddingInfo.time) : 'TBD'} ។` :
                     `We, ${formatName('លោកស្រី', 'Mrs.', weddingInfo?.groomMotherName, weddingInfo, 'groomMother', 'en')} and ${formatName('លោក', 'Mr.', weddingInfo?.groomFatherName, weddingInfo, 'groomFather', 'en')}, have the honor to cordially invite you and your family to attend the wedding ceremony of our children, which will be held on ${weddingInfo?.date || 'TBD'} at ${weddingInfo?.time || 'TBD'}.`}
                </Text>
                
{/* Bride and Groom Names Section */}
<Flex 
    direction="row" // Force horizontal layout on all screen sizes
    justify="space-around" 
    width="100%" 
    gap={{ base: 1, sm: 2, md: 6 }}
    mb={{ base: 3, md: 8 }}
    maxW={{ base: "100%", md: "3xl" }}
    px={{ base: 0, md: 0 }}
>
    {/* Groom */}
    <VStack spacing={{ base: 1, sm: 2, md: 2 }} flex={1} minW={0}>
        <Text
            fontFamily="khmerSubheading"
            fontSize={{ base: 'xs', sm: 'sm', md: 'lg' }} // INCREASED from '3xs'
            fontWeight="bold"
            color="brand.mediumBrown"
            lineHeight={2}
            noOfLines={1}
        >
            {lang === 'kh' ? 'កូនប្រុសឈ្មោះ៖' : 'Groom:'}
        </Text>
        <Text
            fontFamily={lang === 'kh' ? 'khmerSubheading' : 'weddingFont'}
            fontSize={{ base: 'sm', sm: 'xl', md: '2xl', lg: '3xl' }} // MUCH BIGGER on mobile
            fontWeight="bold"
            color="#b18635"
            textAlign="center"
            letterSpacing="0.05em"
            position="relative"
            lineHeight={{ base: 1.9, md: 1.4 }}
            noOfLines={2}
            sx={{
                background: "linear-gradient(90deg, #fff9e1 0%, #FFD700 50%, #f7cf41 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: `
                    0 1px 1px #b79c32,
                    0 2px 5px rgba(255,215,0,0.3),
                    0 0.5px 0px #fff
                `,
                filter: "none"
            }}
            _before={{
                content: '"◆"',
                position: 'absolute',
                top: { base: '-8px', md: '-12px' }, // Adjusted for bigger text
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: { base: '0.6rem', md: '0.9rem' }, // Bigger diamond
                color: '#FFE066',
                textShadow: '0 0 3px #FFD700',
                opacity: 0.75,
                animation: `${sparkle} 2.5s ease-in-out infinite`
            }}
        >
            {formatName('', '', weddingInfo?.groomName, weddingInfo, 'groomName', lang)}
        </Text>
    </VStack>
    
{/* Bride */}
<VStack spacing={{ base: 0.5, sm: 1, md: 2 }} flex={1} minW={0}>
    <Text
        fontFamily="khmerSubheading"
        fontSize={{ base: 'xs', sm: 'sm', md: 'lg' }} // SAME AS GROOM - increased from '3xs'
        fontWeight="bold"
        color="brand.mediumBrown"
        lineHeight={2}
        noOfLines={1}
    >
        {lang === 'kh' ? 'កូនស្រីនាម៖' : 'Bride:'}
    </Text>
    <Text
        fontFamily={lang === 'kh' ? 'khmerSubheading' : 'weddingFont'}
        fontSize={{ base: 'sm', sm: 'xl', md: '2xl', lg: '3xl' }} // SAME AS GROOM - much bigger on mobile
        fontWeight="bold"
        color="#b18635"
        textAlign="center"
        letterSpacing="0.05em"
        position="relative"
        lineHeight={{ base: 2, md: 1.4 }}
        noOfLines={2}
        sx={{
            background: "linear-gradient(90deg, #fff9e1 0%, #FFD700 50%, #f7cf41 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: `
                0 1px 1px #b79c32,
                0 2px 5px rgba(255,215,0,0.3),
                0 0.5px 0px #fff
            `,
            filter: "none"
        }}
        _before={{
            content: '"◆"',
            position: 'absolute',
            top: { base: '-8px', md: '-12px' }, // Adjusted for bigger text
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: { base: '0.6rem', md: '0.9rem' }, // Bigger diamond
            color: '#FFE066',
            textShadow: '0 0 3px #FFD700',
            opacity: 0.75,
            animation: `${sparkle} 2.5s ease-in-out infinite`
        }}
    >
        {formatName('', '', weddingInfo?.brideName, weddingInfo, 'brideName', lang)}
    </Text>
</VStack>
</Flex>
                
                {/* Ceremony Location and Time */}
                <VStack 
                    spacing={{ base: 2, md: 4 }} // Smaller mobile spacing
                    mb={{ base: 3, md: 8 }} // Reduced mobile margin
                    maxW={{ base: "100%", md: "3xl" }} 
                    textAlign="center" 
                    px={{ base: 2, md: 0 }} // Minimal mobile padding
                >
                    <Text
                        fontFamily="khmerSubheading"
                        fontSize={{ base: 'sm', sm: 'md', md: 'xl' }} // Smaller on mobile
                        fontWeight="semibold"
                        color="brand.maroon"
                        lineHeight={1.3}
                    >
                        {lang === 'kh' ? 'ពិធីសូត្រមន្តនឹងប្រព្រឹត្តនៅ' : 'The ceremony will be held at'}
                    </Text>
                    
                    <Text
                        fontFamily="khmerBody"
                        fontSize={{ base: 'xs', sm: 'sm', md: 'lg' }} // Much smaller on mobile
                        color="brand.textPrimary"
                        lineHeight={{ base: '1.4', md: '1.6' }}
                        fontWeight="medium"
                        noOfLines={{ base: 4, md: 3 }} // Allow more lines on mobile
                        position="relative"
                        wordBreak="break-word"
                        whiteSpace="normal"
                    >
                        {isTranslating ? (
                            <Flex align="center" justify="center" gap={2}>
                                <Spinner size="sm" color="brand.gold" />
                                <Text fontSize="sm" color="brand.mediumBrown" fontStyle="italic">
                                    {lang === 'kh' ? 'កំពុងបកប្រែ...' : 'Translating...'}
                                </Text>
                            </Flex>
                        ) : (
                            <>
                                {lang === 'en' && weddingInfo?.venue ? 
                                    (weddingInfo.venueEn || translatedContent.venue || fallbackTransliterate(weddingInfo.venue) || weddingInfo.venue || 'TBD') :
                                    (weddingInfo?.venue || 'TBD')}
                            </>
                        )}
                    </Text>
                    
                    <Text
                        fontFamily="khmerSubheading"
                        fontSize={{ base: 'sm', sm: 'md', md: 'xl' }}
                        fontWeight="bold"
                        color="brand.gold"
                        lineHeight={1.3}
                    >
                        {formatElegantDate(weddingInfo?.date || '', lang)}
                    </Text>
                
                    <Text
                        fontFamily="khmerBody"
                        fontSize={{ base: 'xs', sm: 'sm', md: 'lg' }}
                        color="brand.maroon"
                        fontWeight="semibold"
                        lineHeight={1.3}
                    >
                        {formatProfessionalTime(weddingInfo?.time || '', lang)}
                    </Text>
                </VStack>

                <KhmerOrnamentalDivider />

                {/* RSVP Section - Show different content based on guest status */}
                {!isRSVPSuccess && (
                    <>
                        {guest?.status === 'confirmed' ? (
                            // Show greeting for confirmed guests
                            <VStack 
                                spacing={{ base: 3, md: 4 }} 
                                mt={{ base: 6, md: 8 }} 
                                p={{ base: 4, md: 6 }} 
                                bg="rgba(76, 175, 80, 0.1)" 
                                borderRadius="xl" 
                                border="2px solid rgba(76, 175, 80, 0.3)"
                                maxW={{ base: "95%", md: "auto" }}
                                mx="auto"
                            >
                                <Text fontSize={{ base: "xl", md: "2xl" }} textAlign="center">🎉</Text>
                                <Text
                                    fontFamily="khmerSubheading"
                                    fontSize={{ base: 'md', sm: 'lg', md: 'xl' }}
                                    fontWeight="bold"
                                    color="green.700"
                                    textAlign="center"
                                    lineHeight="1.6"
                                    px={{ base: 2, md: 0 }}
                                >
                                    {lang === 'kh' ? 
                                        `អរគុណ ${guest?.name || 'ភ្ញៀវកិត្តិយស'}! យើងរំពឹងទុកថានឹងបានជួបអ្នកនៅថ្ងៃពិធីមង្គលការ។ អ្នកនឹងមានពេលវេលាដ៏អស្ចារ្យ!` :
                                        `Thank you ${guest?.name || 'Dear Guest'}! We are excited to see you at our wedding ceremony. You will have a wonderful time!`
                                    }
                                </Text>
                                <Text
                                    fontFamily="khmerBody"
                                    fontSize={{ base: 'sm', md: 'md' }}
                                    color="green.600"
                                    textAlign="center"
                                >
                                    {lang === 'kh' ? 'ការបញ្ជាក់៖ នឹងចូលរួម ✓' : 'Status: Will Attend ✓'}
                                </Text>
                            </VStack>
                        ) : guest?.status === 'declined' ? (
                            // Show sympathy message for declined guests
                            <VStack 
                                spacing={{ base: 3, md: 4 }} 
                                mt={{ base: 6, md: 8 }} 
                                p={{ base: 4, md: 6 }} 
                                bg="rgba(244, 67, 54, 0.1)" 
                                borderRadius="xl" 
                                border="2px solid rgba(244, 67, 54, 0.3)"
                                maxW={{ base: "95%", md: "auto" }}
                                mx="auto"
                            >
                                <Text fontSize={{ base: "xl", md: "2xl" }} textAlign="center">😢</Text>
                                <Text
                                    fontFamily="khmerSubheading"
                                    fontSize={{ base: 'md', sm: 'lg', md: 'xl' }}
                                    fontWeight="bold"
                                    color="red.700"
                                    textAlign="center"
                                    lineHeight="1.6"
                                    px={{ base: 2, md: 0 }}
                                >
                                    {lang === 'kh' ? 
                                        `${guest?.name || 'ភ្ញៀវកិត្តិយស'}, យើងពិតជាសោកស្តាយដែលអ្នកមិនអាចចូលរួមបាន។ យើងនឹងនឹកឃើញអ្នក!` :
                                        `${guest?.name || 'Dear Guest'}, we are truly sorry you cannot attend. We will miss you!`
                                    }
                                </Text>
                                {guest?.declineReason && (
                                    <Text
                                        fontFamily="khmerBody"
                                        fontSize={{ base: 'xs', md: 'sm' }}
                                        color="red.600"
                                        textAlign="center"
                                        fontStyle="italic"
                                        px={{ base: 2, md: 0 }}
                                    >
                                        {lang === 'kh' ? 'មូលហេតុ៖ ' : 'Reason: '}{guest.declineReason}
                                    </Text>
                                )}
                                <Text
                                    fontFamily="khmerBody"
                                    fontSize={{ base: 'sm', md: 'md' }}
                                    color="red.600"
                                    textAlign="center"
                                >
                                    {lang === 'kh' ? 'ការបញ្ជាក់៖ មិនអាចចូលរួម' : 'Status: Cannot Attend'}
                                </Text>
                            </VStack>
                        ) : (
                            // Show RSVP button for guests who haven't responded
                            <>
                                <Box className="animate-fade-in-up-delay-3" mt={{ base: 6, md: 8 }}>
                                    <Button
                                        size={{ base: "lg", md: "xl" }}
                                        borderRadius="full"
                                        fontFamily="khmerBody"
                                        fontSize={{ base: 'lg', md: 'xl' }}
                                        fontWeight="bold"
                                        letterSpacing="0.5px"
                                        onClick={() => setShowRSVP(true)}
                                        bg="linear-gradient(135deg, #FFD700, #F4E970, #D4AF37, #B8860B)"
                                        color="white"
                                        px={{ base: 10, md: 16 }}
                                        py={{ base: 6, md: 8 }}
                                        position="relative"
                                        overflow="hidden"
                                       // boxShadow="0 15px 40px rgba(212, 175, 55, 0.8), inset 0 2px 6px rgba(255, 255, 255, 0.4), 0 0 50px rgba(212, 175, 55, 0.6)"
                                        border="3px solid #D4AF37"
                                        //textShadow="0 2px 4px rgba(0,0,0,0.3)"
                                       // _before={{
                                          //  content: '""',
                                          //  position: 'absolute',
                                           // top: 0,
                                          //  left: '-100%',
                                           // width: '100%',
                                           // height: '100%',
                                          //  background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent)',
                                           // transition: 'left 0.6s',
                                      //  }}
                                     //   _after={{
                                       //     content: '""',
                                        //    position: 'absolute',
                                        //</Box>    inset: '-4px',
                                       //     background: 'linear-gradient(45deg, #FFD700, #F4E970, #D4AF37, #FFD700)',
                                       //</Box>     borderRadius: 'full',
                                       //     zIndex: -1,
                                        //    opacity: 0,
                                      // </Box>      transition: 'opacity 0.3s ease',
                                     //</>   }}
                                        _hover={{
                                            bg: "linear-gradient(135deg, #F4E970, #FFD700, #D4AF37, #B8860B)",
                                           // boxShadow: "0 20px 50px rgba(212, 175, 55, 0.9), inset 0 3px 8px rgba(255, 255, 255, 0.5), 0 0 60px rgba(212, 175, 55, 0.8)",
                                            transform: "translateY(-5px) scale(1.08)",
                                            _before: {
                                                left: '100%',
                                            },
                                            _after: {
                                                opacity: 0.8,
                                            }
                                        }}
                                        _active={{
                                            transform: "translateY(-2px) scale(1.05)",
                                        }}
                                        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                                    //   animation={`${pulseGold} ${OptimizedFadeInUp} 2s ease-in-out infinite`}
                                    >
                                        <Text
                                            fontSize="inherit"
                                            fontWeight="inherit"
                                            position="relative"
                                            zIndex={2}
                                        >
                                            {content.confirmAttendanceButton}
                                        </Text>
                                    </Button>
                                </Box>
                                 <Center mt={{ base: 4, md: 6 }} flexDirection="column" className="animate-fade-in-up-delay-3">
                                    <Text 
                                        fontFamily="khmerBody" 
                                        color="brand.textPrimary" 
                                        fontSize={{ base: 'sm', md: 'md' }} 
                                        fontWeight="bold"
                                        mb={3}
                                        textAlign="center"
                                        opacity={0.8}
                                    >
                                        {lang === 'kh' ? 'ស្កេន ដើម្បីបញ្ជាក់' : 'Scan to RSVP'}
                                    </Text>
                                    <Box 
                                        className="glass-card premium-card"
                                        p={{ base: 4, md: 5 }} 
                                        borderRadius="2xl" 
                                        display="inline-block"
                                        position="relative"
                                        // Remove the _before pseudo-element that creates the animated golden border
                                    >
                                        <Box display={{ base: "block", md: "none" }}>
                                            <QRCode 
                                                value={currentUrl || ''} 
                                                size={100} 
                                                bgColor="transparent" 
                                                fgColor="var(--chakra-colors-brand-gold)" 
                                            />
                                        </Box>
                                        <Box display={{ base: "none", md: "block" }}>
                                            <QRCode 
                                                value={currentUrl || ''} 
                                                size={128} 
                                                bgColor="transparent" 
                                                fgColor="var(--chakra-colors-brand-gold)" 
                                            />
                                        </Box>
                                    </Box>
                                </Center>
                            </>
                        )}
                    </>
                )}
                {isRSVPSuccess && <Checkmark message={content.rsvpSuccess} />}

{/* Enhanced Google Maps Section - moved to bottom */}
                {weddingInfo?.venueMapLink ? (
                    <Box 
                        mt={{ base: 8, md: 10 }} 
                        mb={{ base: 6, md: 8 }}
                        w="100%"
                        maxW={{ base: "95%", md: "600px" }}
                        mx="auto"
                        data-map-container
                    >
                        {/* Map Title with elegant styling */}
                        <Text
                            fontFamily="khmerSubheading"
                            fontSize={{ base: 'lg', md: 'xl' }}
                            fontWeight="bold"
                            color="brand.gold"
                            textAlign="center"
                            mb={4}
                            textShadow="0 2px 4px rgba(196, 166, 106, 0.3)"
                            position="relative"
                            _before={{
                                content: '""',
                                position: 'absolute',
                                bottom: '-8px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: '60px',
                                height: '2px',
                                bg: 'brand.gold',
                                borderRadius: 'full'
                            }}
                        >
                            {lang === 'kh' ? 'ទីតាំងលើផែនទី' : 'Location on Map'}
                        </Text>
                        
                        {/* Professional Map Container */}
                        <Box
                            position="relative"
                            borderRadius="xl"
                            overflow="hidden"
                            boxShadow="0 12px 40px rgba(0, 0, 0, 0.15)"
                            border="3px solid"
                            borderColor="brand.gold"
                            bg="white"
                            _before={{
                                content: '""',
                                position: 'absolute',
                                top: 2,
                                left: 2,
                                right: 2,
                                bottom: 2,
                                border: '1px solid',
                                borderColor: 'brand.sandstone',
                                borderRadius: 'lg',
                                pointerEvents: 'none',
                                zIndex: 1,
                                opacity: 0.6
                            }}
                            _after={{
                                content: '""',
                                position: 'absolute',
                                top: '-2px',
                                left: '-2px',
                                right: '-2px',
                                bottom: '-2px',
                                background: 'linear-gradient(45deg, transparent 30%, rgba(196, 166, 106, 0.1) 50%, transparent 70%)',
                                borderRadius: 'xl',
                                pointerEvents: 'none',
                                zIndex: -1
                            }}
                        >
                            {/* Map Iframe */}
                            <Box
                                as="iframe"
                                src={createMapEmbedUrl(weddingInfo.venueMapLink, weddingInfo.venue)}
                                w="100%"
                                h={{ base: "300px", md: "380px" }}
                                border="0"
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title={lang === 'kh' ? 'ផែនទីទីតាំងពិធីមង្គលការ' : 'Wedding Venue Location Map'}
                                onError={(e: React.SyntheticEvent<HTMLIFrameElement, Event>) => {
                                    // Hide the map completely if it fails to load
                                    const mapContainer = e.currentTarget.closest('[data-map-container]');
                                    if (mapContainer) {
                                        (mapContainer as HTMLElement).style.display = 'none';
                                    }
                                }}
                                position="relative"
                                zIndex={2}
                            />
                            
                            {/* Enhanced Fallback Content */}
                            <Box
                                position="absolute"
                                top={0}
                                left={0}
                                right={0}
                                bottom={0}
                                bg="linear-gradient(135deg, #f5f3ed 0%, #e8e6df 100%)"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                zIndex={1}
                                opacity={0}
                                transition="opacity 0.3s ease"
                                _hover={{ opacity: 1 }}
                            >
                                <VStack spacing={4} textAlign="center" p={6}>
                                    <Box fontSize="3xl" color="brand.gold">📍</Box>
                                    <Text 
                                        fontSize={{ base: "sm", md: "md" }}
                                        color="brand.maroon" 
                                        fontFamily="khmerBody"
                                        fontWeight="semibold"
                                    >
                                        {lang === 'kh' ? 'ផែនទីកំពុងផ្ទុក...' : 'Loading Interactive Map...'}
                                    </Text>
                                    <Text 
                                        fontSize="xs" 
                                        color="brand.mediumBrown" 
                                        fontFamily="khmerBody"
                                        opacity={0.8}
                                    >
                                        {lang === 'kh' ? 'សូមរង់ចាំបន្តិច' : 'Please wait a moment'}
                                    </Text>
                                </VStack>
                            </Box>
                        </Box>
                        
                        {/* Enhanced Action Buttons */}
                        <HStack 
                            spacing={4} 
                            justify="center" 
                            mt={6}
                            flexWrap="wrap"
                            gap={3}
                        >
                            
                            <Button
                                as="a"
                                href={weddingInfo.venueMapLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                size={{ base: "sm", md: "md" }}
                                leftIcon={<span style={{ fontSize: '16px' }}>🗺️</span>}
                                bg="white"
                                color="brand.maroon"
                                border="2px solid"
                                borderColor="brand.gold"
                                _hover={{
                                    bg: 'brand.gold',
                                    color: 'white',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 8px 25px rgba(196, 166, 106, 0.4)',
                                    borderColor: 'brand.darkGold'
                                }}
                                _active={{
                                    transform: 'translateY(0px)',
                                    boxShadow: '0 4px 15px rgba(196, 166, 106, 0.3)'
                                }}
                                transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                                fontFamily="khmerBody"
                                fontWeight="bold"
                                borderRadius="full"
                                px={6}
                                py={3}
                            >
                                {lang === 'kh' ? 'បើកផែនទី Google' : 'Open in Google Maps'}
                            </Button>
                            
                            <Button
                                as="a"
                                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(weddingInfo.venue || '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                size={{ base: "sm", md: "md" }}
                                leftIcon={<span style={{ fontSize: '16px' }}>🧭</span>}
                                bg="brand.mediumBrown"
                                color="white"
                                border="2px solid"
                                borderColor="brand.mediumBrown"
                                _hover={{
                                    bg: 'brand.darkGold',
                                    borderColor: 'brand.darkGold',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 8px 25px rgba(124, 107, 80, 0.4)'
                                }}
                                _active={{
                                    transform: 'translateY(0px)',
                                    boxShadow: '0 4px 15px rgba(124, 107, 80, 0.3)'
                                }}
                                transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                                fontFamily="khmerBody"
                                fontWeight="bold"
                                borderRadius="full"
                                px={6}
                                py={3}
                            >
                                {lang === 'kh' ? 'ទទួលទិសដៅ' : 'Get Directions'}
                            </Button>
                        </HStack>
                    </Box>
                ) : (
                    // Loading placeholder
                    <Box
                        h="400px"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        bg="rgba(255, 255, 255, 0.1)"
                        borderRadius="xl"
                    >
                        <VStack spacing={4}>
                            <Spinner size="lg" color="brand.gold" />
                            <Text fontFamily="khmerBody" color="brand.textPrimary" fontSize="sm">
                                {lang === 'kh' ? 'កំពុងផ្ទុកផែនទី...' : 'Loading map...'}
                            </Text>
                        </VStack>
                    </Box>
                )}

{/* Enhanced Ceremony Timeline Section */}
                <Box 
                    mt={{ base: 8, md: 12 }} 
                    mb={{ base: 6, md: 8 }}
                    w="100%"
                    maxW={{ base: "95%", md: "4xl" }}
                    mx="auto"
                >
                    {/* Timeline Title */}
                    <Text
                        fontFamily="khmerSubheading"
                        fontSize={{ base: 'xl', md: '2xl' }}
                        fontWeight="bold"
                        color="brand.gold"
                        textAlign="center"
                        mb={6}
                        textShadow="0 2px 4px rgba(196, 166, 106, 0.3)"
                        position="relative"
                        _before={{
                            content: '""',
                            position: 'absolute',
                            bottom: '-12px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '80px',
                            height: '3px',
                            bg: 'brand.gold',
                            borderRadius: 'full'
                        }}
                    >
                        {lang === 'kh' ? 'កម្មវិធីពិធីមង្គលការ' : 'Engagement Ceremony Timeline'}
                    </Text>

                    {/* Main Timeline Container */}
                    <Box
                        className="glass-card premium-card animate-fade-in-up-delay-1"
                        borderRadius="2xl"
                        p={{ base: 6, md: 8 }}
                        border="2px solid"
                        borderColor="brand.gold"
                        position="relative"
                        overflow="hidden"
                        _before={{
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '4px',
                            background: 'linear-gradient(90deg, transparent, brand.gold, transparent)',
                            animation: `${gradientShift} ${OptimizedFadeInUp} 4s ease-in-out infinite`,
                        }}
                    >
                        {/* Date Header */}
                        <Box textAlign="center" mb={8}>
                            <Text
                                fontFamily="khmerSubheading"
                                fontSize={{ base: 'lg', md: 'xl' }}
                                fontWeight="bold"
                                color="brand.maroon"
                                mb={2}
                            >
                                {formatElegantDate(weddingInfo?.date || '', lang)}
                            </Text>
                            <Text
                                fontFamily="khmerBody"
                                fontSize={{ base: 'md', md: 'lg' }}
                                color="brand.mediumBrown"
                                fontWeight="medium"
                            >
                                {lang === 'kh' ? 'នៅទីលំនៅកូនស្រី' : 'At the Bride\'s Residence'}
                            </Text>
                        </Box>

                        {/* Timeline Events */}
                        <VStack spacing={6} align="stretch">
                            {/* Morning Session Header */}
                            <Box>
                                <Text
                                    fontFamily="khmerSubheading"
                                    fontSize={{ base: 'lg', md: 'xl' }}
                                    fontWeight="bold"
                                    color="brand.gold"
                                    mb={4}
                                    textAlign="center"
                                    bg="linear-gradient(90deg, transparent, rgba(196, 166, 106, 0.1), transparent)"
                                    py={2}
                                    borderRadius="lg"
                                >
                                    {lang === 'kh' ? 'វេលាព្រឹក' : 'Morning Session'}
                                </Text>
                            </Box>

                            {/* Event 1 */}
                            <Flex align="start" gap={4}>
                                <Box
                                    bg="brand.gold"
                                    color="white"
                                    borderRadius="full"
                                    minW="60px"
                                    h="60px"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    fontFamily="khmerBody"
                                    fontSize={{ base: 'sm', md: 'md' }}
                                    fontWeight="bold"
                                    boxShadow="0 4px 15px rgba(196, 166, 106, 0.4)"
                                >
                                    07:30
                                </Box>
                                <Box flex={1}>
                                    <Text
                                        fontFamily="khmerSubheading"
                                        fontSize={{ base: 'md', md: 'lg' }}
                                        fontWeight="semibold"
                                        color="brand.maroon"
                                        mb={2}
                                    >
                                        {lang === 'kh' ? 'ការមកដល់របស់ភ្ញៀវកិត្តិយស' : 'Arrival of Honorable Guests'}
                                    </Text>
                                    <Text
                                        fontFamily="khmerBody"
                                        fontSize={{ base: 'sm', md: 'md' }}
                                        color="brand.textPrimary"
                                        lineHeight="1.6"
                                    >
                                        {lang === 'kh' ? 'នឹងមានអាហារពេលព្រឹកតាមប្រពៃណីបម្រើជូន' : 'Traditional Breakfast to be Served'}
                                    </Text>
                                </Box>
                            </Flex>

{/* Event 2 */}
<Flex align="start" gap={4}>
    <Box
        bg="brand.maroon"
        color="white"
        borderRadius="full"
        minW="60px"
        h="60px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        fontFamily="khmerBody"
        fontSize={{ base: 'sm', md: 'md' }}
        fontWeight="bold"
        boxShadow="0 4px 15px rgba(139, 69, 19, 0.4)"
    >
        {(() => {
            const timeStr = weddingInfo?.time || '09:09';
            const [hours, minutes] = timeStr.split(':');
            const hour24 = parseInt(hours);
            const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
            
            if (lang === 'kh') {
                return `${toKhmerNumerals(hour12.toString())}:${toKhmerNumerals(minutes)}`;
            } else {
                return `${hour12}:${minutes}`;
            }
        })()}
    </Box>
    <Box flex={1}>
                                    <Text
                                        fontFamily="khmerSubheading"
                                        fontSize={{ base: 'md', md: 'lg' }}
                                        fontWeight="semibold"
                                        color="brand.maroon"
                                        mb={2}
                                    >
                                        {lang === 'kh' ? 'ការចាប់ផ្តើមពិធីវប្បធម៌ខ្មែរ' : 'Commencement of the Khmer Cultural Ceremony'}
                                    </Text>
                                    <Text
                                        fontFamily="khmerBody"
                                        fontSize={{ base: 'sm', md: 'md' }}
                                        color="brand.textPrimary"
                                        lineHeight="1.6"
                                    >
                                        {lang === 'kh' ? 'ពិធីបុណ្យពាហាពិពាហ៍តាមប្រពៃណីខ្មែរ' : 'Traditional Khmer Wedding Ceremony'}
                                    </Text>
                                </Box>
                            </Flex>

                            {/* Event 3 */}
                            <Flex align="start" gap={4}>
                                <Box
                                    bg="brand.mediumBrown"
                                    color="white"
                                    borderRadius="full"
                                    minW="60px"
                                    h="60px"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    fontFamily="khmerBody"
                                    fontSize={{ base: 'sm', md: 'md' }}
                                    fontWeight="bold"
                                    boxShadow="0 4px 15px rgba(124, 107, 80, 0.4)"
                                >
                                    11:30
                                </Box>
                                <Box flex={1}>
                                    <Text
                                        fontFamily="khmerSubheading"
                                        fontSize={{ base: 'md', md: 'lg' }}
                                        fontWeight="semibold"
                                        color="brand.maroon"
                                        mb={2}
                                    >
                                        {lang === 'kh' ? 'ការអញ្ជើញទទួលទានអាហារថ្ងៃត្រង់' : 'Formal Invitation to Join for Lunch'}
                                    </Text>
                                    <Text
                                        fontFamily="khmerBody"
                                        fontSize={{ base: 'sm', md: 'md' }}
                                        color="brand.textPrimary"
                                        lineHeight="1.6"
                                    >
                                        {lang === 'kh' ? 'អាហារថ្ងៃត្រង់នឹងត្រូវបម្រើជូនភ្ញៀវកិត្តិយស' : 'Lunch will be served to honorable guests'}
                                    </Text>
                                </Box>
                            </Flex>
                        </VStack>

                        {/* Important Notice */}
                        <Box
                            mt={8}
                            p={6}
                            bg="rgba(196, 166, 106, 0.1)"
                            borderRadius="xl"
                            border="1px solid rgba(196, 166, 106, 0.3)"
                        >
                            <Text
                                fontFamily="khmerBody"
                                fontSize={{ base: 'sm', md: 'md' }}
                                color="brand.textPrimary"
                                textAlign="center"
                                lineHeight="1.8"
                                fontStyle="italic"
                            >
                                {lang === 'kh' ? 
                                    'យើងសូមគោរពអរុណថាភ្ញៀវកិត្តិយសទាំងអស់គ្នា សូមមកដល់ទាន់ពេលវេលា ដើម្បីគោរពប្រពៃណី និងលំដាប់នៃកម្មវិធីថ្ងៃនេះ។ វត្តមានរបស់អ្នកមានតម្លៃណាស់សម្រាប់យើង។' :
                                    'We respectfully request that all guests arrive on time to honor the customs and flow of the day\'s proceedings. Your presence is sincerely appreciated.'
                                }
                            </Text>
                        </Box>

                        {/* Premium Save the Date Section */}
                        <Box
                            mt={8}
                            p={{ base: 6, md: 8 }}
                            bg="linear-gradient(135deg, rgba(196, 166, 106, 0.08), rgba(212, 175, 55, 0.05))"
                            borderRadius="2xl"
                            border="1px solid rgba(196, 166, 106, 0.2)"
                            backdropFilter="blur(10px)"
                            textAlign="center"
                            className="animate-fade-in-up-delay-7"
                        >
                            <VStack spacing={4}>
                                <Text
                                    fontSize={{ base: 'lg', md: 'xl' }}
                                    fontFamily="khmerHeading"
                                    fontWeight="bold"
                                    color="brand.maroon"
                                    className="gradient-text-luxury"
                                >
                                    {lang === 'kh' ? 'រក្សាកាលបរិច្ឆេទ' : 'Save the Date'}
                                </Text>
                                
                                <HStack spacing={4} justify="center" wrap="wrap">
                                    {/* Add to Google Calendar */}
                                    <Button
                                        as="a"
                                        href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('Wedding Ceremony')}&dates=${new Date(weddingInfo?.date || '').toISOString().replace(/[-:]/g, '').split('.')[0]}Z&details=${encodeURIComponent('Wedding ceremony celebration')}&location=${encodeURIComponent(weddingInfo?.venue || '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        size="md"
                                        bg="rgba(66, 133, 244, 0.1)"
                                        color="#4285F4"
                                        border="1px solid rgba(66, 133, 244, 0.3)"
                                        borderRadius="lg"
                                        px={6}
                                        py={3}
                                        fontFamily="khmerBody"
                                        fontSize={{ base: 'sm', md: 'md' }}
                                        _hover={{
                                            bg: '#4285F4',
                                            color: 'white',
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 8px 25px rgba(66, 133, 244, 0.3)',
                                        }}
                                        transition="all 0.3s ease"
                                        leftIcon={
                                            <Box as="svg" w="18px" h="18px" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                                            </Box>
                                        }
                                    >
                                        {lang === 'kh' ? 'Google Calendar' : 'Google Calendar'}
                                    </Button>

                                    {/* Add to Apple Calendar */}
                                    <Button
                                        as="a"
                                        href={`data:text/calendar;charset=utf8,BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
URL:${typeof window !== 'undefined' ? window.location.href : ''}
DTSTART:${new Date(weddingInfo?.date || '').toISOString().replace(/[-:]/g, '').split('.')[0]}Z
SUMMARY:Wedding Ceremony
DESCRIPTION:Wedding ceremony celebration
LOCATION:${weddingInfo?.venue || ''}
END:VEVENT
END:VCALENDAR`}
                                        download="wedding-invitation.ics"
                                        size="md"
                                        bg="rgba(0, 0, 0, 0.1)"
                                        color="gray.700"
                                        border="1px solid rgba(0, 0, 0, 0.3)"
                                        borderRadius="lg"
                                        px={6}
                                        py={3}
                                        fontFamily="khmerBody"
                                        fontSize={{ base: 'sm', md: 'md' }}
                                        _hover={{
                                            bg: 'gray.700',
                                            color: 'white',
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
                                        }}
                                        transition="all 0.3s ease"
                                        leftIcon={
                                            <Box as="svg" w="18px" h="18px" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/>
                                            </Box>
                                        }
                                    >
                                        {lang === 'kh' ? 'Apple Calendar' : 'Apple Calendar'}
                                    </Button>
                                </HStack>
                            </VStack>
                        </Box>

                        {/* Wedding Countdown */}
                        {weddingInfo?.date && (
                            <Box mt={8}>
                                <LazyCountdownTimer targetDate={weddingInfo.date} lang={lang} />
                            </Box>
                        )}

                        {/* RSVP Status and Countdown */}
                        {guest?.status === 'confirmed' && (
                            <Box mt={8} textAlign="center">
                                <Box
                                    display="inline-block"
                                    bg="linear-gradient(135deg, rgba(76, 175, 80, 0.1), rgba(76, 175, 80, 0.05))"
                                    borderRadius="full"
                                    px={6}
                                    py={3}
                                    border="2px solid rgba(76, 175, 80, 0.3)"
                                    mb={6}
                                >
                                    <Text
                                        fontFamily="khmerBody"
                                        fontSize={{ base: 'md', md: 'lg' }}
                                        color="green.700"
                                        fontWeight="bold"
                                    >
                                        ✓ {lang === 'kh' ? 'អ្នកបានជ្រើសរើសចូលរួម!' : 'You have chosen to join!'}
                                    </Text>
                                </Box>

                                {/* Countdown */}
                                <Box>
                                    <Text
                                        fontFamily="khmerSubheading"
                                        fontSize={{ base: 'lg', md: 'xl' }}
                                        fontWeight="bold"
                                        color="brand.maroon"
                                        mb={4}
                                    >
                                        {lang === 'kh' ? 'រាប់ថ្ងៃរហូតដល់ពិធីមង្គលការ' : 'Countdown until the ceremony'}
                                    </Text>
                                    <LazyCountdownTimer targetDate={weddingInfo?.date || ''} lang={lang} />
                                </Box>
                            </Box>
                        )}
                    </Box>
                </Box>


                {/* Premium Astra Decor Contact Section */}
                <Box
                    mt={{ base: 8, md: 12 }}
                    p={{ base: 6, md: 8 }}
                    bg="linear-gradient(135deg, rgba(196, 166, 106, 0.08), rgba(212, 175, 55, 0.05))"
                    borderRadius="2xl"
                    border="1px solid rgba(196, 166, 106, 0.2)"
                    backdropFilter="blur(10px)"
                    textAlign="center"
                    position="relative"
                    overflow="hidden"
                    className="animate-fade-in-up-delay-8"
                    _before={{
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: '-100%',
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
                        animation: `${shimmer}  5s ease-in-out infinite`,
                    }}
                >
                    <VStack spacing={4}>
                        {/* Astra Decor Logo/Branding */}
                        <Box>
                            <Text
                                fontSize={{ base: 'lg', md: 'xl' }}
                                fontFamily="khmerHeading"
                                fontWeight="bold"
                                color="brand.gold"
                                mb={2}
                                className="gradient-text-luxury"
                            >
                                ASTRA DECOR
                            </Text>
                            <Text
                                fontSize={{ base: 'sm', md: 'md' }}
                                fontFamily="khmerBody"
                                color="brand.mediumBrown"
                                fontStyle="italic"
                            >
                                {lang === 'kh' ? 'ការរៀបចំពិធីបុណ្យខ្ពស់គុណភាព' : 'Premium Wedding & Event Planning'}
                            </Text>
                            <Text
                                fontSize={{ base: 'sm', md: 'md' }}
                                fontFamily="khmerBody"
                                color="brand.mediumBrown"
                                fontStyle="italic"
                            >
                                {lang === 'kh' ? 'ទំនាក់ទំនង' : 'Contact Us'}
                            </Text>
                        </Box>

                        {/* Contact Information */}
                        <HStack 
                            spacing={{ base: 4, md: 6 }} 
                            justify="center" 
                            wrap="wrap"
                            fontSize={{ base: 'sm', md: 'md' }}
                            fontFamily="khmerBody"
                        >
                            {/* Phone */}
                            <HStack 
                                spacing={2} 
                                color="brand.textPrimary"
                                p={3}
                                borderRadius="lg"
                                bg="rgba(255, 255, 255, 0.1)"
                                _hover={{
                                    bg: 'rgba(196, 166, 106, 0.1)',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 4px 15px rgba(196, 166, 106, 0.2)',
                                }}
                                transition="all 0.3s ease"
                                cursor="pointer"
                                as="a"
                                href="tel:+855 69 566 388"
                            >
                                <Box as="svg" w="16px" h="16px" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M6.62 10.79a15.9 15.9 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.21 11.36 11.36 0 003.58.58 1 1 0 011 1V20a1 1 0 01-1 1A18 18 0 013 3a1 1 0 011-1h3.5a1 1 0 011 1 11.36 11.36 0 00.58 3.58 1 1 0 01-.21 1.11l-2.2 2.2z"/>
                                </Box>
                                <Text>+855 69 566 388</Text>
                            </HStack>

                            {/* Email */}
                            <HStack 
                                spacing={2} 
                                color="brand.textPrimary"
                                p={3}
                                borderRadius="lg"
                                bg="rgba(255, 255, 255, 0.1)"
                                _hover={{
                                    bg: 'rgba(196, 166, 106, 0.1)',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 4px 15px rgba(196, 166, 106, 0.2)',
                                }}
                                transition="all 0.3s ease"
                                cursor="pointer"
                                as="a"
                                href="mailto:contact@astradecor.com"
                            >
                                <Box as="svg" w="16px" h="16px" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm16 3.38l-8 5.33-8-5.33V6l8 5.33L20 6v1.38z"/>
                                </Box>
                                <Text>info@astra-decoration.com</Text>
                            </HStack>
                        </HStack>

                        {/* Social Media Links */}
                        <HStack spacing={4} justify="center">
                            {/* Facebook */}
                            <Button
                                as="a"
                                href="https://web.facebook.com/people/Astra-Decor/61553596712833/"
                                target="_blank"
                                rel="noopener noreferrer"
                                size="md"
                                bg="rgba(24, 119, 242, 0.1)"
                                color="#1877F2"
                                border="1px solid rgba(24, 119, 242, 0.3)"
                                borderRadius="full"
                                p={3}
                                minW="48px"
                                h="48px"
                                _hover={{
                                    bg: '#1877F2',
                                    color: 'white',
                                    transform: 'translateY(-2px) scale(1.05)',
                                    boxShadow: '0 8px 25px rgba(24, 119, 242, 0.4)',
                                }}
                                transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                            >
                                <Box as="svg" w="20px" h="20px" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                </Box>
                            </Button>

                            {/* Instagram */}
                            <Button
                                as="a"
                                href="https://www.instagram.com/astradecor_official"
                                target="_blank"
                                rel="noopener noreferrer"
                                size="md"
                                bg="rgba(225, 48, 108, 0.1)"
                                color="#E1306C"
                                border="1px solid rgba(225, 48, 108, 0.3)"
                                borderRadius="full"
                                p={3}
                                minW="48px"
                                h="48px"
                                _hover={{
                                    bg: 'linear-gradient(45deg, #F56040, #E1306C, #C13584)',
                                    color: 'white',
                                    transform: 'translateY(-2px) scale(1.05)',
                                    boxShadow: '0 8px 25px rgba(225, 48, 108, 0.4)',
                                }}
                                transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                            >
                                <Box as="svg" w="20px" h="20px" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                </Box>
                            </Button>

                            {/* Telegram */}
                            <Button
                                as="a"
                                href="https://t.me/astra_decor"
                                target="_blank"
                                rel="noopener noreferrer"
                                size="md"
                                bg="rgba(0, 136, 204, 0.1)"
                                color="#0088CC"
                                border="1px solid rgba(0, 136, 204, 0.3)"
                                borderRadius="full"
                                p={3}
                                minW="48px"
                                h="48px"
                                _hover={{
                                    bg: '#0088CC',
                                    color: 'white',
                                    transform: 'translateY(-2px) scale(1.05)',
                                    boxShadow: '0 8px 25px rgba(0, 136, 204, 0.4)',
                                }}
                                transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                            >
                                <Box as="svg" w="20px" h="20px" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                                </Box>
                            </Button>

                            {/* Website */}
                            <Button
                                as="a"
                                href="https://www.astra-decoration.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                size="md"
                                bg="rgba(196, 166, 106, 0.1)"
                                color="brand.gold"
                                border="1px solid rgba(196, 166, 106, 0.3)"
                                borderRadius="full"
                                p={3}
                                minW="48px"
                                h="48px"
                                _hover={{
                                    bg: 'brand.gold',
                                    color: 'white',
                                    transform: 'translateY(-2px) scale(1.05)',
                                    boxShadow: '0 8px 25px rgba(196, 166, 106, 0.4)',
                                }}
                                transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                            >
                                <Box as="svg" w="20px" h="20px" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
                                </Box>
                            </Button>
                        </HStack>

                        {/* Powered by text */}
                        <Text
                             as="footer"
                    textAlign="center"
                            fontSize={{ base: "xs", md: "sm" }}
                            fontFamily="khmerBody"
                            color="gray.500"
                            mt={2}
                        >
                            {lang === 'kh' ? 'ផ្តល់ជូនដោយ' : 'Powered by'} ASTRA DECOR
                        </Text>
                    </VStack>
                </Box>
            </Box>

            {showRSVP && <LazyRSVPForm onClose={() => setShowRSVP(false)} lang={lang} guestRef={guestRef} />}
        </Center>
    );
};

// Main Next.js Page Component
export default function InvitePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = React.use(params);
    const [loading, setLoading] = useState(true);
    const [guest, setGuest] = useState<any>(null);
    const [weddingInfo, setWeddingInfo] = useState<any>(null);
    const [view, setView] = useState<'entrance' | 'invitation' | 'error'>('entrance');
    const [lang, setLang] = useState<'kh' | 'en'>('kh');
    const [isRSVPSuccess, setIsRSVPSuccess] = useState<boolean>(false);
    const [guestRef, setGuestRef] = useState<any>(null);
    

    // Fetch guest and wedding info based on slug
    useEffect(() => {
        const fetchGuest = async () => {
            setLoading(true);
            
            try {
                // Ensure db is initialized before proceeding
                if (!db) {
                    console.error("Firestore instance is not available.");
                    setView('error');
                    setLoading(false);
                    return;
                }

                // Fetch from invites collection first
                const inviteDocRef = doc(db, "invites", slug);
                const inviteDocSnap = await getDoc(inviteDocRef);
                
                if (inviteDocSnap.exists()) {
                    const inviteData = inviteDocSnap.data();
                    setWeddingInfo(inviteData);
                    setGuest({ 
                        name: inviteData.guestName, 
                        slug: slug, 
                        status: inviteData.status || 'pending',
                        attending: inviteData.attending || null,
                        declineReason: inviteData.declineReason || null,
                        rsvpTimestamp: inviteData.rsvpTimestamp || null
                    });
                    
                    // Set the guestRef to the invite document for RSVP updates
                    setGuestRef(inviteDocRef);
                    
                    // Set language from the invite data, but default to 'kh' if not specified
                    if (inviteData.language) {
                        setLang(inviteData.language);
                    } else {
                        // Keep default 'kh' if no language is specified in the database
                        setLang('kh');
                    }
                    
                    setView('entrance');
                } else {
                    // Fallback to old structure - also default to 'kh'
                    const snapshot = await getDocs(collectionGroup(db, "Guests"));
                    let guestDocData: any = null;
                    let parentUserId: string | null = null;

                    snapshot.forEach(docSnap => {
                        if (docSnap.data().slug === slug) {
                            const docData = docSnap.data();
                            guestDocData = { 
                                ...docData, 
                                id: docSnap.id,
                                status: docData.status || 'pending',
                                attending: docData.attending || null,
                                declineReason: docData.declineReason || null,
                                rsvpTimestamp: docData.rsvpTimestamp || null
                            };
                            parentUserId = docSnap.ref.parent.parent?.id || null;
                            setGuestRef(docSnap.ref);
                        }
                    });
                    setGuest(guestDocData);

                    if (parentUserId) {
                        const userDocRef = doc(db, "Users", parentUserId);
                        const userDocSnap = await getDoc(userDocRef);
                        setWeddingInfo(userDocSnap.data()?.weddingInfo || null);
                        if (guestDocData && userDocSnap.exists()) {
                            setView('entrance');
                        } else {
                            setView('error');
                        }
                    } else {
                        setView('error');
                    }
                    // Keep default 'kh' for fallback structure as well
                }
            } catch (error) {
                console.error("Error fetching guest or wedding info:", error);
                setView('error');
            } finally {
                setLoading(false);
            }
        };
        
        // Check if db is truthy before calling fetchGuest
        if (db) {
            fetchGuest();
        } else {
            console.log("Firestore not available yet. Waiting for initialization...");
            setLoading(false);
        }
    }, [slug]);

    // ...existing code...
    

    useEffect(() => {
        if (!db || !slug) return;
        
        // Listen for updates to the invite document
        const inviteDocRef = doc(db, "invites", slug);
        const unsubscribe = onSnapshot(inviteDocRef, (docSnap) => {
            if (docSnap.exists()) {
                const newData = docSnap.data();
                setWeddingInfo(newData);
                
                // REMOVED: Don't automatically override user's language choice
                // The language toggle should be controlled by user interaction only
                // if (newData.language && newData.language !== lang) {
                //     setLang(newData.language);
                // }
            }
        }, (error) => {
            console.error("Error in weddingInfo snapshot:", error);
        });
    
        return () => unsubscribe();
    }, [db, slug]); // REMOVED 'lang' from dependencies
    
    // ...existing code...

    const handleRSVPSuccess = () => {
        setIsRSVPSuccess(true);
        setTimeout(() => setIsRSVPSuccess(false), 5000);
    };



    // Create theme with dynamic font
    const theme = createTheme(weddingInfo?.font);

    if (loading) {
        return (
            <ChakraProvider theme={theme}>
                <GlobalKeyframes />
                <Center minH="100vh">
                    <Spinner size="xl" color="brand.gold" />
                </Center>
            </ChakraProvider>
        );
    }

    if (view === 'error' || !guest || !weddingInfo) {
        return (
            <ChakraProvider theme={theme}>
                <GlobalKeyframes />
                <Center minH="100vh" p={4}>
                    <Text fontSize="2xl" color="brand.error" fontFamily="khmerBody" textAlign="center" fontWeight="semibold">
                        {astraConfig.content[lang].guestNotFound}
                    </Text>
                </Center>
            </ChakraProvider>
        );
    }

    return (
        <ChakraProvider theme={theme}>
            <GlobalStyles />
            <GlobalKeyframes />
            {view === 'entrance' ? (
                <EntranceScreen guestName={guest.name || astraConfig.content[lang].guestDefault} onEnter={() => setView('invitation')} lang={lang} weddingInfo={weddingInfo} />
            ) : (
                <InvitationScreen
                    guestName={guest.name || astraConfig.content[lang].guestDefault}
                    lang={lang}
                    setLang={setLang}
                    weddingInfo={weddingInfo}
                    guest={guest}
                    onRSVPSuccess={handleRSVPSuccess}
                    isRSVPSuccess={isRSVPSuccess}
                    guestRef={guestRef}
                    slug={slug}
                />
            )}
        </ChakraProvider>
    );
}
