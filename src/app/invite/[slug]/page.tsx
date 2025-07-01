'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, serverTimestamp, query, where, getDocs, collection } from "firebase/firestore";
import { offlineStorage } from "@/lib/offlineStorage";
import { useOffline } from "@/hooks/useOffline";
import { FaPhoneAlt, FaEnvelope, FaFacebookF, FaInstagram, FaTelegramPlane, FaLink } from 'react-icons/fa';

// Type definitions
interface GuestData {
  id: string;
  name?: string;
  guestName?: string;
  clientEmail?: string;
  status?: 'pending' | 'confirmed' | 'declined';
  rsvpStatus?: 'pending' | 'confirmed' | 'declined';
  slug?: string;
  [key: string]: any;
}
import {
  ChakraProvider,
  Box,
  Icon,
  Text,
  Button,
  VStack,
  HStack,
  Center,
  Spinner,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Radio,
  RadioGroup,
  Stack,
  Image,
  Grid,
} from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";

// Map section component
import MapSection from './components/MapSection';

// Enhanced lightweight theme with proper branding
const lightweightTheme = extendTheme({
  fonts: {
    heading: "'Battambang', 'Moul', 'Noto Sans Khmer', 'TrajanPro', system-ui, sans-serif",
    body: "'Battambang', 'Hanuman', 'AKbalthom', 'Noto Sans Khmer', system-ui, sans-serif",
    khmerHeading: "'Moul', 'Battambang', 'Noto Sans Khmer', 'TrajanPro', system-ui, sans-serif",
    khmerBody: "'Battambang', 'Hanuman', 'AKbalthom', 'Noto Sans Khmer', 'TrajanPro', system-ui, sans-serif",
  },
  colors: {
    brand: {
      gold: '#D4AF37',
      darkGold: '#B8951F',
      ivory: '#FFF8DC',
      maroon: '#8B0000',
      brown: '#8B4513',
      sandstone: '#bca798',
      textPrimary: '#5c2c2c',
      textSecondary: '#a88c5a',
    }
  },
  styles: {
    global: (props: any) => ({
      'html, body': {
        fontFamily: 'body',
        color: 'brand.textPrimary',
        backgroundColor: '#e7e4d8', /* a warm, antique paper tone */
        backgroundRepeat: 'no-repeat, repeat !important',
        backgroundSize: 'cover, auto !important',
        backgroundPosition: 'center center, top left !important',
        backgroundAttachment: 'fixed, local !important',
        lineHeight: 'base',
        WebkitOverflowScrolling: 'touch',
        overscrollBehavior: 'contain',
        minHeight: '100vh !important',
      },
      '#__next': {
        backgroundColor: 'transparent !important',
        minHeight: '100vh !important',
      },
    })
  },
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  }
});

// Minimal utility functions
const toKhmerNumerals = (str: string): string => {
  const khmerDigits = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];
  return str.replace(/[0-9]/g, (digit) => khmerDigits[parseInt(digit)]);
};

const formatDate = (dateStr: string, lang: 'en' | 'kh'): string => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  
  if (lang === 'kh') {
    const khmerDays = ['អាទិត្យ', 'ច័ន្ទ', 'អង្គារ', 'ពុធ', 'ព្រហស្បតិ៍', 'សុក្រ', 'សៅរ៍'];
    const khmerMonths = ['មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា', 'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'];
    return `ថ្ងៃ${khmerDays[date.getDay()]} ទី${toKhmerNumerals(date.getDate().toString())} ខែ${khmerMonths[date.getMonth()]} ឆ្នាំ${toKhmerNumerals(date.getFullYear().toString())}`;
  }
  
  return date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

const formatTime = (timeStr: string, lang: 'en' | 'kh'): string => {
  if (!timeStr) return '';
  const [hours, minutes] = timeStr.split(':');
  const hour12 = parseInt(hours) === 0 ? 12 : parseInt(hours) > 12 ? parseInt(hours) - 12 : parseInt(hours);
  const period = parseInt(hours) >= 12 ? (lang === 'kh' ? 'ល្ងាច' : 'PM') : (lang === 'kh' ? 'ព្រឹក' : 'AM');
  
  return lang === 'kh' 
    ? `${toKhmerNumerals(hour12.toString())}:${toKhmerNumerals(minutes)} ${period}`
    : `${hour12}:${minutes} ${period}`;
};

// Simple entrance screen component
const EntranceScreen: React.FC<{
  guestName: string;
  onEnter: () => void;
  lang: 'kh' | 'en';
  weddingInfo: any;
}> = ({ guestName, onEnter, lang, weddingInfo }) => {
  // Format guest name with proper fallback - FIXED
  const formatGuestName = (name: string, lang: 'kh' | 'en') => {
    // Always show the actual guest name if it exists
    if (name && name.trim() !== '' && name !== 'Preview') {
      return name; // Use the actual guest name as provided
    }
    
    // Only show fallback if no name is provided
    return lang === 'kh' ? 'ភ្ញៀវកិត្តិយស' : 'Dear Guest';
  };

  // Add click handler with debugging
  const handleEnterClick = () => {
    console.log('Enter button clicked'); // Debug log
    onEnter();
  };

  return (
<Box
  px={{ base: 4, md: 10 }}
  py={{ base: 6, md: 10 }}
  maxW="420px"
  mx="auto"
  borderRadius="xl"
  bg="rgba(24, 64, 80, 0.63)" // teal overlay
  boxShadow="0 10px 40px rgba(0,0,0,0.18)"
  backdropFilter="blur(16px)"
  border="1.5px solid rgba(255,255,255,0.16)"
  transition="box-shadow 0.3s"
>


      <VStack spacing={8} textAlign="center" p={6} maxW="sm" position="relative" zIndex={1001}>
        {/* Monogram */}
        <Image
          src="/vectors/monogram.svg"
          alt="Wedding Monogram"
          boxSize="150px"
          animation="fadeInScale 1.2s ease-out"
          filter="sepia(20%)"
        />
        
        {/* Welcome Text */}
        <VStack spacing={4}>
          <Text
            fontSize="3xl"
            fontFamily="khmerHeading"
            fontWeight="bold"
            color="brand.gold"
            lineHeight="shorter"
          >
            {lang === 'kh' ? 'សូមស្វាគមន៍' : 'Welcome'}
          </Text>
          
          <Text
            fontSize="xl"
            fontFamily={lang === 'kh' ? 'Moul' : 'TrajanPro'}
            color="white"
            textAlign="center"
            fontWeight="semibold"
          >
            {formatGuestName(guestName, lang)}
          </Text>
          
          <Text
            fontSize="lg"
            fontFamily="khmerBody"
            color="brand.textSecondary"
            textAlign="center"
            fontStyle="italic"
          >
            {lang === 'kh' 
              ? '"សេចក្ដីស្រឡាញ់ គឺជាអំណោយដ៏ធំបំផុត"'
              : '"Love is the greatest gift we can give each other"'
            }
          </Text>
        </VStack>

        {/* Enter Button - FIXED with higher z-index and proper event handling */}
        <Button
          size="lg"
          bg="brand.gold"
          color="white"
          px={8}
          py={6}
          fontSize="lg"
          fontFamily="khmerBody"
          onClick={handleEnterClick}
          onTouchEnd={handleEnterClick} // Add touch support for mobile
          _hover={{ bg: 'brand.darkGold', transform: 'translateY(-2px)' }}
          _active={{ transform: 'translateY(0px)' }}
          transition="all 0.3s ease"
          shadow="lg"
          cursor="pointer"
          position="relative"
          zIndex={1002}
        >
          {lang === 'kh' ? 'បើកលិខិតអញ្ជើញ' : 'Open Invitation'}
        </Button>

        <Image
          src="/vectors/kbach.png"
          alt="Khmer Traditional Decoration"
          w="300px"
          h="200px" // Different aspect ratio if needed
          opacity={0.9}
          animation="fadeInScale 1.5s ease-out"
          filter="sepia(15%) brightness(1.1)"
          mt={-10} // Pull it even closer to the button
          mb={-20} // Reduce bottom margin
        />

      </VStack>
    </Box>
  );
};

// Simple inline countdown component if needed
const SimpleCountdown: React.FC<{ targetDate: string; lang: 'kh' | 'en' }> = ({ targetDate, lang }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
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
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <HStack spacing={4} justify="center">
      <VStack spacing={1}>
        <Text fontSize="2xl" fontWeight="bold" color="brand.gold">
          {lang === 'kh' ? toKhmerNumerals(timeLeft.days.toString()) : timeLeft.days}
        </Text>
        <Text fontSize="sm" color="brand.textSecondary">
          {lang === 'kh' ? 'ថ្ងៃ' : 'Days'}
        </Text>
      </VStack>
      <VStack spacing={1}>
        <Text fontSize="2xl" fontWeight="bold" color="brand.gold">
          {lang === 'kh' ? toKhmerNumerals(timeLeft.hours.toString()) : timeLeft.hours}
        </Text>
        <Text fontSize="sm" color="brand.textSecondary">
          {lang === 'kh' ? 'ម៉ោង' : 'Hours'}
        </Text>
      </VStack>
      <VStack spacing={1}>
        <Text fontSize="2xl" fontWeight="bold" color="brand.gold">
          {lang === 'kh' ? toKhmerNumerals(timeLeft.minutes.toString()) : timeLeft.minutes}
        </Text>
        <Text fontSize="sm" color="brand.textSecondary">
          {lang === 'kh' ? 'នាទី' : 'Minutes'}
        </Text>
      </VStack>
      <VStack spacing={1}>
        <Text fontSize="2xl" fontWeight="bold" color="brand.gold">
          {lang === 'kh' ? toKhmerNumerals(timeLeft.seconds.toString()) : timeLeft.seconds}
        </Text>
        <Text fontSize="sm" color="brand.textSecondary">
          {lang === 'kh' ? 'វិនាទី' : 'Seconds'}
        </Text>
      </VStack>
    </HStack>
  );
};

// RSVP Form Component
const RSVPForm: React.FC<{
  onClose: () => void;
  lang: 'kh' | 'en';
  onSubmit: (status: 'confirmed' | 'declined') => void;
}> = ({ onClose, lang, onSubmit }) => {
  const [selectedStatus, setSelectedStatus] = useState<'confirmed' | 'declined' | ''>('');

  const handleSubmit = () => {
    if (selectedStatus) {
      onSubmit(selectedStatus);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent mx={4}>
        <ModalHeader fontFamily="khmerBody">
          {lang === 'kh' ? 'បញ្ជាក់ការចូលរួម' : 'Confirm Attendance'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={4}>
            <Text fontFamily="khmerBody" textAlign="center">
              {lang === 'kh' 
                ? 'សូមបញ្ជាក់ថាតើអ្នកនឹងចូលរួមពិធីបុណ្យអាពាហ៍ពិពាហ៍នេះដែរឬទេ?'
                : 'Will you be attending this wedding ceremony?'
              }
            </Text>
            
            <RadioGroup value={selectedStatus} onChange={(value) => setSelectedStatus(value as 'confirmed' | 'declined' | '')}>
              <Stack spacing={3}>
                <Radio value="confirmed" colorScheme="green">
                  <Text fontFamily="khmerBody">
                    {lang === 'kh' ? '✅ បាទ/ចាស ខ្ញុំនឹងចូលរួម' : '✅ Yes, I will attend'}
                  </Text>
                </Radio>
                <Radio value="declined" colorScheme="red">
                  <Text fontFamily="khmerBody">
                    {lang === 'kh' ? '❌ អត់ទេ ខ្ញុំមិនអាចចូលរួម' : '❌ No, I cannot attend'}
                  </Text>
                </Radio>
              </Stack>
            </RadioGroup>
            
            <HStack spacing={3} w="full" pt={4}>
              <Button
                variant="outline"
                onClick={onClose}
                flex={1}
                fontFamily="khmerBody"
              >
                {lang === 'kh' ? 'បោះបង់' : 'Cancel'}
              </Button>
              <Button
                bg="brand.gold"
                color="white"
                onClick={handleSubmit}
                isDisabled={!selectedStatus}
                flex={1}
                fontFamily="khmerBody"
                _hover={{ bg: 'brand.darkGold' }}
              >
                {lang === 'kh' ? 'បញ្ជាក់' : 'Confirm'}
              </Button>
            </HStack>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

// Main Page Component - Add debugging to the view state
export default function InvitePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  const [loading, setLoading] = useState(true);
  const [guest, setGuest] = useState<GuestData | null>(null);
  const [weddingInfo, setWeddingInfo] = useState<any>(null);
  const [guestRef, setGuestRef] = useState<any>(null);
  const [lang, setLang] = useState<'kh' | 'en'>('kh');
  const [showRSVP, setShowRSVP] = useState(false);
  const [showExtendedContent, setShowExtendedContent] = useState(false);
  const [rsvpStatus, setRsvpStatus] = useState<'pending' | 'confirmed' | 'declined'>('pending');
  const [view, setView] = useState<'entrance' | 'invitation'>('entrance');
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  
  const { isOffline } = useOffline();
  const toast = useToast();

  // Add debugging for view changes
  const handleEnterInvitation = () => {
    console.log('Switching from entrance to invitation view'); // Debug log
    setView('invitation');
  };

  // Add music functionality
  useEffect(() => {
    if (view === 'invitation' && typeof window !== 'undefined') {
      // Only create audio when we reach the invitation screen
      const audio = new Audio('/music/wedding.mp3');
      audio.loop = true;
      audio.volume = 0.3;
      setAudioRef(audio);

      // Try to autoplay (will work after user interaction)
      const playAudio = () => {
        audio.play().then(() => {
          setIsMusicPlaying(true);
        }).catch(() => {
          // Autoplay blocked - will play on first user interaction
        });
      };

      // Small delay to ensure smooth transition
      const timer = setTimeout(playAudio, 1000);

      return () => {
        clearTimeout(timer);
        audio.pause();
        audio.src = '';
      };
    }
  }, [view]);

  // Add music toggle function
  const toggleMusic = () => {
    if (audioRef) {
      if (isMusicPlaying) {
        audioRef.pause();
        setIsMusicPlaying(false);
      } else {
        audioRef.play().then(() => {
          setIsMusicPlaying(true);
        }).catch(console.log);
      }
    }
  };

useEffect(() => {
   const fetchData = async () => {
    try {
      console.log('Fetching data for slug:', slug);
      
      // Check cache first
      const cachedInvitation = await offlineStorage.getCachedInvitation(slug);
      if (cachedInvitation) {
        console.log('Using cached data');
        setGuest(cachedInvitation.guest);
        setWeddingInfo(cachedInvitation.weddingInfo);
        setRsvpStatus(cachedInvitation.guest?.status || 'pending');
        setLoading(false);
        return;
      }
  
      if (!isOffline) {
        // Use the invite document to find the client (more efficient)
        const inviteDocRef = doc(db, "invites", slug);
        const inviteDocSnap = await getDoc(inviteDocRef);
        
        if (inviteDocSnap.exists()) {
          const inviteData = inviteDocSnap.data();
          const clientEmail = inviteData.clientEmail;
          
          if (!clientEmail) {
            throw new Error("No client email found in invite document");
          }
          
          // Get guest from specific client's collection
          const guestsRef = collection(db, "Users", clientEmail, "Guests");
          const guestQuery = query(guestsRef, where("slug", "==", slug));
          const guestSnapshot = await getDocs(guestQuery);
          
          if (!guestSnapshot.empty) {
            const guestDoc = guestSnapshot.docs[0];
            const guestData = { id: guestDoc.id, ...guestDoc.data() } as GuestData;
            
            // Get wedding info from user document
            const userDocRef = doc(db, 'Users', clientEmail);
            const userDoc = await getDoc(userDocRef);
            
            if (userDoc.exists()) {
              const weddingData = userDoc.data().weddingInfo;
              
              // Cache and set state
              await offlineStorage.cacheInvitation({
                slug,
                guestName: guestData.guestName || guestData.name || 'Guest',
                weddingInfo: weddingData,
                guest: guestData,
                timestamp: Date.now(),
                lastUpdated: Date.now()
              });
              
              setGuest(guestData);
              setWeddingInfo(weddingData);
              setGuestRef(guestDoc.ref);
              setRsvpStatus(guestData.status || 'pending');
            }
          }
        } else {
          throw new Error("Invite document not found");
        }
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error loading invitation',
        description: 'Please try again later',
        status: 'error',
        duration: 3000,
      });
      setLoading(false);
    }
  };

  fetchData();
}, [slug, isOffline, toast]);

  if (loading) {
    return (
      <ChakraProvider theme={lightweightTheme}>
        <Center minH="100vh">
          <VStack spacing={4}>
            <Spinner size="xl" color="brand.gold" />
            <Text color="brand.maroon">
              {lang === 'kh' ? 'កំពុងផ្ទុក...' : 'Loading...'}
            </Text>
          </VStack>
        </Center>
      </ChakraProvider>
    );
  }

  if (!guest || !weddingInfo) {
    return (
      <ChakraProvider theme={lightweightTheme}>
        <Center minH="100vh" p={4}>
          <Text fontSize="xl" color="red.500" textAlign="center">
            {lang === 'kh' ? 'រកមិនឃើញលិខិតអញ្ជើញ' : 'Invitation not found'}
          </Text>
        </Center>
      </ChakraProvider>
    );
  }
  
  const getNameByLanguage = (khmerName: string, englishName: string, lang: 'kh' | 'en') => {
  return lang === 'kh' ? khmerName : englishName;
};

  // Add RSVP submit handler
 const handleRSVPSubmit = async (status: 'confirmed' | 'declined') => {
  try {
    // Validate guest data before proceeding
    if (!guest) {
      throw new Error('Guest data not available');
    }

    if (!guest.id) {
      throw new Error('Guest ID is missing');
    }

    setRsvpStatus(status);
    setShowRSVP(false);

    // Only update Firebase if online and we have valid guest data
    if (!isOffline && guest?.clientEmail && guest?.id) {
      try {
        // Get fresh reference to the guest document
        const freshGuestRef = doc(db, 'Users', guest.clientEmail, 'Guests', guest.id);
        
        console.log('Updating guest:', guest.clientEmail, guest.id); // 🔍 DEBUG
        
        // Check if the document exists before updating
        const guestDocSnap = await getDoc(freshGuestRef);
        if (!guestDocSnap.exists()) {
          throw new Error('Guest document not found in database');
        }
        
        await updateDoc(freshGuestRef, {
          status,
          rsvpStatus: status,
          rsvpAt: serverTimestamp(),
        });
        
        console.log('✅ Firebase updated successfully!');
      } catch (firebaseError) {
        console.error('❌ Firebase update failed:', firebaseError);
        // Continue with cache update even if Firebase fails
        throw new Error(`Failed to update database: ${firebaseError instanceof Error ? firebaseError.message : 'Unknown error'}`);
      }
    }

    // Update cache (this should always work)
    try {
      await offlineStorage.cacheInvitation({
        slug,
        guestName: guest?.guestName || guest?.name || 'Guest',
        weddingInfo,
        guest: { ...guest, status, rsvpStatus: status },
        timestamp: Date.now(),
        lastUpdated: Date.now()
      });
    } catch (cacheError) {
      console.error('❌ Cache update failed:', cacheError);
      // Don't throw here as the main operation might have succeeded
    }

    // Show success message
    toast({
      title: status === 'confirmed'
        ? (lang === 'kh' ? 'អរគុណសម្រាប់ការបញ្ជាក់!' : 'Thank you for confirming!')
        : (lang === 'kh' ? 'សូមអភ័យទោសដែលអ្នកមិនអាចចូលរួម' : 'Sorry you cannot attend'),
      status: status === 'confirmed' ? 'success' : 'info',
      duration: 3000,
    });
  } catch (error) {
    console.error('❌ RSVP Error:', error);
    
    // Revert status changes on error
    setRsvpStatus('pending');
    setShowRSVP(true); // Show form again for retry
    
    // Show specific error message
    const errorTitle = lang === 'kh' ? 'បញ្ហាក្នុងការបញ្ជាក់' : 'RSVP Error';
    let errorDescription = '';
    
    if (error instanceof Error) {
      if (error.message.includes('Guest data not available')) {
        errorDescription = lang === 'kh' ? 'មិនមានទិន្នន័យភ្ញៀវ' : 'Guest data not available';
      } else if (error.message.includes('Guest ID is missing')) {
        errorDescription = lang === 'kh' ? 'បាត់លេខសម្គាល់ភ្ញៀវ' : 'Guest ID is missing';
      } else if (error.message.includes('Guest document not found')) {
        errorDescription = lang === 'kh' ? 'រកមិនឃើញទិន្នន័យភ្ញៀវ' : 'Guest record not found';
      } else if (error.message.includes('Failed to update database')) {
        errorDescription = lang === 'kh' ? 'មិនអាចធ្វើបច្ចុប្បន្នភាពបានទេ' : 'Could not update database';
      } else {
        errorDescription = error.message;
      }
    } else {
      errorDescription = lang === 'kh' ? 'មានបញ្ហាមិនស្គាល់' : 'An unknown error occurred';
    }
    
    toast({
      title: errorTitle,
      description: errorDescription,
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
  }
};

   return (
    <ChakraProvider theme={lightweightTheme}>
      {/* CSS-in-JS animations with background override */}
<style jsx global>{`
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes fadeInScale {
    from { opacity: 0; transform: scale(0.9); }
    to { opacity: 1; transform: scale(1); }
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  /* Desktop background */
  html, body, #__next, .chakra-ui-light, [data-theme="light"] {
    background-color: #052b37;
    background-image: url('/vectors/bggree0n.jpg'), url('/textures/cartographer.png') !important;
    background-repeat: no-repeat, repeat !important;
    background-size: cover, auto !important;
    background-position: center center, top left !important;
    background-attachment: fixed, local !important;
    min-height: 100vh !important;
  }
  
  /* Mobile background - make it much smaller */
  @media (max-width: 768px) {
    html, body, #__next, .chakra-ui-light, [data-theme="light"] {
      background-size: 60%, auto !important; /* Much smaller - try 40% or 50% for even smaller */
      background-position: center top, top left !important;
      background-attachment: scroll, local !important;
    }
  }
  
  /* Extra small mobile */
  @media (max-width: 480px) {
    html, body, #__next, .chakra-ui-light, [data-theme="light"] {
      background-size: 50%, auto !important; /* Even smaller for small phones */
      background-position: center top, top left !important;
    }
  }
  
  .chakra-ui-light body,
  [data-theme="light"] body {
    background: transparent !important;
  }
      `}</style>

      {/* Show entrance screen if not dismissed and data is loaded */}
      {view === 'entrance' && !loading && guest && weddingInfo && (
        <EntranceScreen
          guestName={guest.guestName || guest.name || ""}
          onEnter={handleEnterInvitation}
          lang={lang}
          weddingInfo={weddingInfo}
        />
      )}
      
      {/* Main invitation content */}
      {view === 'invitation' && (
        <>
          {/* Language Toggle - Fixed Position */}
          <Box position="fixed" top={4} right={4} zIndex={1000}>
            <HStack bg="white" borderRadius="full" p={1} shadow="md">
              <Button
                size="sm"
                bg={lang === 'en' ? 'brand.gold' : 'transparent'}
                color={lang === 'en' ? 'white' : 'brand.maroon'}
                onClick={() => setLang('en')}
                borderRadius="full"
                px={3}
              >
                EN
              </Button>
              <Button
                size="sm"
                bg={lang === 'kh' ? 'brand.gold' : 'transparent'}
                color={lang === 'kh' ? 'white' : 'brand.maroon'}
                onClick={() => setLang('kh')}
                borderRadius="full"
                px={3}
              >
                ខ្មែរ
              </Button>
              
              {/* Add Music Toggle Button */}
              <Button
                size="sm"
                bg={isMusicPlaying ? "brand.gold" : "white"}
                color={isMusicPlaying ? "white" : "brand.textPrimary"}
                borderRadius="full"
                p={2}
                onClick={toggleMusic}
                _hover={{ bg: isMusicPlaying ? "brand.darkGold" : "gray.100" }}
                border="1px solid"
                borderColor="brand.gold"
                ml={1}
              >
                {isMusicPlaying ? '🔊' : '🔇'}
              </Button>
            </HStack>
          </Box>

          {/* Offline Indicator */}
          {isOffline && (
            <Box
              position="fixed"
              top={0}
              left={0}
              right={0}
              bg="orange.500"
              color="white"
              py={2}
              textAlign="center"
              fontSize="sm"
              zIndex={999}
            >
              {lang === 'kh' ? '📴 គ្មានអ៊ីនធឺណិត' : '📴 Offline Mode'}
            </Box>
          )}

          {/* Main Content */}
          <Box pt={isOffline ? "40px" : "0"} minH="100vh" position="relative">


            <VStack spacing={8} maxW="md" mx="auto" p={6} animation="slideUp 0.8s ease-out" position="relative" zIndex={1}>
              {/* Header */}
              <VStack spacing={4} textAlign="center">
              {/* Monogram */}
              <Image
                src="/vectors/monogram.svg"
                alt="Wedding Monogram"
                boxSize="120px"
                filter="sepia(15%)"
              />
              
              {/* Title */}
              <Text
                fontSize="2xl"
                fontFamily="khmerHeading"
                fontWeight="bold"
                color="brand.gold"
                textAlign="center"
                lineHeight="shorter"
              >
                {lang === 'kh' ? 'សិរីសួស្ដីអាពាហ៍ពិពាហ៍' : 'Wedding Invitation'}
              </Text>
                
      <Grid templateColumns={{ base: "1fr 1fr", md: "1fr 1fr" }} gap={4} w="full">

      {/* Groom's Family */}
      <Box bg="blue.50" p={4} borderRadius="md">
        <VStack spacing={2}>
        <Text
          fontSize={{ base: "sm", md: "md" }}
          fontFamily={lang === 'kh' ? 'Moul' : 'TrajanPro'}
          fontWeight="bold"
          color="blue.700"
        >
          {lang === 'kh' ? 'មាតាបិតាកូនប្រុស' : "Groom's Family"}
        </Text>
        <Text
          fontSize={{ base: "xs", md: "sm" }}
          fontFamily={lang === 'kh' ? 'AKbalthom' : 'TrajanPro'}
          color="blue.600"
          whiteSpace="nowrap"
        >
          {lang === 'kh' ? 'លោក' : 'Mr.'} {lang === 'kh' 
          ? (weddingInfo.groomFatherName || 'សុម្ ហុង') 
          : (weddingInfo.groomFatherNameEn || 'Som Hong')
          }
        </Text>
        <Text
          fontSize={{ base: "xs", md: "sm" }}
          fontFamily={lang === 'kh' ? 'AKbalthom' : 'TrajanPro'}
          color="blue.600"
          whiteSpace="nowrap"
        >
          {lang === 'kh' ? 'លោកស្រី' : 'Mrs.'} {lang === 'kh' 
          ? (weddingInfo.groomMotherName || 'សុខ្ ចិន្តា') 
          : (weddingInfo.groomMotherNameEn || 'Sokh Chenda')
          }
        </Text>
        </VStack>
      </Box>

      {/* Bride's Family */}
      <Box bg="pink.50" p={4} borderRadius="md">
        <VStack spacing={2}>
        <Text
          fontSize={{ base: "sm", md: "md" }}
          fontFamily={lang === 'kh' ? 'Moul' : 'TrajanPro'}
          fontWeight="bold"
          color="pink.700"
        >
          {lang === 'kh' ? 'មាតាបិតាកូនស្រី' : "Bride's Family"}
        </Text>
        <Text
          fontSize={{ base: "xs", md: "sm" }}
          fontFamily={lang === 'kh' ? 'AKbalthom' : 'TrajanPro'}
          color="pink.600"
          whiteSpace="nowrap"
        >
          {lang === 'kh' ? 'លោក' : 'Mr.'} {lang === 'kh' 
          ? (weddingInfo.brideFatherName || 'លី្ អាង') 
          : (weddingInfo.brideFatherNameEn || 'Li Ang')
          }
        </Text>
        <Text
          fontSize={{ base: "xs", md: "sm" }}
          fontFamily={lang === 'kh' ? 'AKbalthom' : 'TrajanPro'}
          color="pink.600"
          whiteSpace="nowrap"
        >
          {lang === 'kh' ? 'លោកស្រី' : 'Mrs.'} {lang === 'kh' 
          ? (weddingInfo.brideMotherName || 'ស្រែ្ ចេង') 
          : (weddingInfo.brideMotherNameEn || 'Sre Cheng')
          }
        </Text>
        </VStack>
      </Box>
      </Grid>



      <VStack spacing={4} w="full">
        {/* Title + Message Side-by-Side */}
        <HStack
        spacing={4}
        align="start"
        justify="center"
        w="full"
        flexWrap="wrap"
        >
        {/* Title */}
        <Text
          fontSize="lg"
          fontFamily={lang === 'kh' ? 'Moul' : 'TrajanPro'}
          fontWeight="bold"
          color="brand.gold"
          textAlign="left"
          maxW="300px"
        >
          {lang === 'kh' ? 'សូមគោរពអញ្ជើញ' : 'Respectfully Invited'}
        </Text>

        {/* Message */}
        <Box maxW="500px" p={2}>
          <Text
          fontSize="sm"
          fontFamily={lang === 'kh' ? 'AKbalthom' : 'khmerbody'} 
          lineHeight="tall"
          textAlign="center"
          color="white"
          >
          {lang === 'kh'
            ? 'ឯកឧត្តម លោកអ្នកឧកញ៉ា អ្នកឧកញ៉ា ឧកញ៉ា លោកជំទាវ លោក លោកស្រី អ្នកនាង កញ្ញា អញ្ជើញចូលរួម ជាអធិបតី និងជាភ្ញៀវកិត្តិយស ដើម្បីប្រសិទ្ធិពរជ័យសិរីមង្គលក្នុងពិធីពិសាស្លាដក់កន្សែង កូនប្រុស កូនស្រី របស់យើងខ្ញុំ'
            : 'His Excellency, Lok Oknha, Neak Oknha, Oknha, Lok Chumteav, Lok, Lok Srey, Neak Neang, and Kagna are graciously invited to honor our son\'s and daughter\'s ceremonial scarf offering as presiding guests and distinguished participants, bestowing blessings upon the celebration.'}
          </Text>
        </Box>
        </HStack>
      </VStack>
      {/* Main Couple Names */}
      <HStack spacing={8} justify="center" w="full">
        {/* Groom on the left */}
        <VStack spacing={2} textAlign="center" flex={1}>
        <Text fontSize="sm" fontFamily={lang === 'kh' ? 'AKbalthom' : 'tra'} fontWeight="bold" color="brand.textSecondary">
          {lang === 'kh' ? 'នាមកូនប្រុស' : 'Groom'}
        </Text>
        <Text fontSize="xl" fontFamily="khmerHeading" fontWeight="bold" color="brand.gold" whiteSpace="nowrap">
          {lang === 'kh' 
          ? (weddingInfo.groomName || 'សុខ្ សុវីរ៉ាម') 
          : (weddingInfo.groomNameEn || weddingInfo.groomName || 'Sokh Suviram')
          }
        </Text>
        </VStack>
        
        {/* Bride on the right */}
        <VStack spacing={2} textAlign="center" flex={1}>
        <Text fontSize="sm" fontFamily={lang === 'kh' ? 'AKbalthom' : 'TrajanPro'} fontWeight="bold" color="brand.textSecondary">
          {lang === 'kh' ? 'នាមកូនស្រី' : 'Bride'}
        </Text>
        <Text fontSize="xl" fontFamily={lang === 'kh' ? 'Moul' : 'TrajanPro'} fontWeight="bold" color="brand.gold" whiteSpace="nowrap">
          {lang === 'kh' 
          ? (weddingInfo.brideName || 'លី្ សុភ័រ៉ាម') 
          : (weddingInfo.brideNameEn || weddingInfo.brideName || 'Li Sophearam')
          }
        </Text>
        </VStack>
      </HStack>

              {/* Wedding Details */}
              <Box bg="brand.gold" color="white" p={3} borderRadius="md" w="full" textAlign="center" opacity={0.9}>
                <VStack spacing={1}>
                <Text fontSize="xl" fontFamily={lang === 'kh' ? 'AKbalthom' : 'khmerbody'} fontWeight="bold" color="white">
                  {lang === 'kh' ? 'ពិធីសូត្រមន្តនឹងប្រព្រឹត្តនៅ' : 'Wedding Ceremony Details'}
                </Text>
                <Text fontSize="sm" fontFamily={lang === 'kh' ? 'AKbalthom' : 'khmerbody'}>
                  {formatDate(weddingInfo.date, lang)}
                </Text>
                <Text fontSize="sm" fontFamily={lang === 'kh' ? 'AKbalthom' : 'khmerbody'}>
                  {formatTime(weddingInfo.time, lang)}
                </Text>
                </VStack>
              </Box>

{/* Venue Information */}
<Box bg="green.50" p={4} borderRadius="md" w="full" textAlign="center">
  <VStack spacing={2}>
    <Text fontSize="md" fontFamily={lang === 'kh' ? 'AKbalthom' : 'TrajanPro'} fontWeight="bold" color="green.700">
      {lang === 'kh' ? 'ទីកន្លែង' : 'Venue'}
    </Text>
    <Text fontSize="sm" fontFamily={lang === 'kh' ? 'AKbalthom' : 'khmerbody'} color="green.600" lineHeight="tall">
      {lang === 'kh' 
        ? (weddingInfo.venue || 'ទីកន្លែងមិនស្គាល់') 
        : (weddingInfo.venueEn || 'Unknown venue')
      }
    </Text>
  </VStack>
</Box>
              </VStack>

              {/* Traditional Khmer Wedding Invitation Content */}
              <Box 
              bg="rgba(255, 255, 255, 0.9)" 
              p={6} 
              borderRadius="lg" 
              shadow="lg" 
              w="full"
              border="1px solid"
              borderColor="brand.gold"
              backdropFilter="blur(10px)"
              >
              <VStack spacing={6}>
                {/* Main Title */}
                <Text 
                fontSize="2xl" 
                fontFamily="khmerHeading" 
                fontWeight="bold" 
                color="brand.gold" 
                textAlign="center"
                lineHeight="shorter"
                >
                {lang === 'kh' ? 'កម្មវិធីពិធីមង្គលការ' : 'Wedding Ceremony Program'}
                </Text>

                {/* Ceremony Schedule */}
                <VStack spacing={4} w="full">
                {/* Morning Ceremony */}
                <Box bg="brand.ivory" p={4} borderRadius="md" w="full">
                  <HStack spacing={4} align="start">
                  <Box 
                    bg="brand.gold" 
                    color="white" 
                    px={3} 
                    py={2} 
                    borderRadius="full" 
                    fontSize="sm" 
                    fontWeight="bold"
                    minW="60px"
                    textAlign="center"
                  >
                    07:30
                  </Box>
                  <VStack align="start" spacing={1} flex={1}>
                    <Text fontSize="md" fontFamily="khmerBody" fontWeight="bold" color="brand.textPrimary">
                    {lang === 'kh' ? 'ការបកស្រុបសំបុត្រសំណព្វឫស្សី' : 'Morning Blessing Ceremony'}
                    </Text>
                    <Text fontSize="sm" fontFamily="khmerBody" color="brand.textSecondary">
                    {lang === 'kh' ? 'និមន្តភ្ញៀវដោយសមាជិកក្រុមគ្រួសារ និងមិត្ដភ្ញៀវជិតខាង' : 'Traditional blessing and gift ceremony'}
                    </Text>
                  </VStack>
                  </HStack>
                </Box>

                {/* Main Ceremony */}
                <Box bg="brand.maroon" color="white" p={4} borderRadius="md" w="full">
                  <HStack spacing={4} align="start">
                  <Box 
                    bg="white" 
                    color="brand.maroon" 
                    px={3} 
                    py={2} 
                    borderRadius="full" 
                    fontSize="sm" 
                    fontWeight="bold"
                    minW="60px"
                    textAlign="center"
                  >
                    10:00
                  </Box>
                  <VStack align="start" spacing={1} flex={1}>
                    <Text fontSize="md" fontFamily="khmerBody" fontWeight="bold">
                    {lang === 'kh' ? 'ការមង្គលការផ្តាក់ពិពាហ៍' : 'Main Wedding Ceremony'}
                    </Text>
                    <Text fontSize="sm" fontFamily="khmerBody" opacity={0.9}>
                    {lang === 'kh' ? 'ពិធីសីរីស្វាគមន៍ និងប្រគល់មង្គលប័ណ្ណដោយក្រុមគ្រួសារ' : 'Traditional Khmer wedding rituals and vows'}
                    </Text>
                  </VStack>
                  </HStack>
                </Box>

                {/* Evening Reception */}
                <Box bg="brand.brown" color="white" p={4} borderRadius="md" w="full">
                  <HStack spacing={4} align="start">
                  <Box 
                    bg="brand.gold" 
                    color="white" 
                    px={3} 
                    py={2} 
                    borderRadius="full" 
                    fontSize="sm" 
                    fontWeight="bold"
                    minW="60px"
                    textAlign="center"
                  >
                    11:30
                  </Box>
                  <VStack align="start" spacing={1} flex={1}>
                    <Text fontSize="md" fontFamily="khmerBody" fontWeight="bold">
                    {lang === 'kh' ? 'ការអបអរសាទរពិធីបុណ្យទទួលភរិយា' : 'Reception Celebration'}
                    </Text>
                    <Text fontSize="sm" fontFamily="khmerBody" opacity={0.9}>
                    {lang === 'kh' ? 'អាហារពិធីជប់លៀង និងកម្សាន្តនារសាទរ' : 'Banquet dinner and celebration with family and friends'}
                    </Text>
                  </VStack>
                  </HStack>
                </Box>
                </VStack>
                
      {/* Invitation Text */}
      {/* Full Ceremony Schedule */}
      <Box bg="brand.ivory" p={4} borderRadius="md" w="full" textAlign="center">
        <Text
        fontSize="sm"
        fontFamily="khmerBody"
        color="brand.textPrimary"
        lineHeight="tall"
        whiteSpace="pre-line"
        >
        {/* Khmer Version */}
        {lang === 'kh' ? (
          <>
          <Text as="span" fontWeight="bold">កម្មវិធីពេលព្រឹក</Text>{'\n'}
          <Text as="span" fontWeight="bold">ម៉ោង​​ ០៧:៣០ នាទី ព្រឹក</Text>{'\n\n'}
          ជួបជុំឯកឧត្តម លោកជំទាវ លោកអ្នកឧកញ៉ា អ្នកឧកញ៉ា ឧកញ៉ា លោក លោកស្រី អ្នកនាង កញ្ញា ភ្ញៀវកិត្តិយសទាំងអស់នៅផ្ទះកម្មវិធី

          {'\n\n'}<Text as="span" fontWeight="bold">អញ្ជើញទទួលទានអាហារពេលព្រឹក</Text>{'\n\n'}
          <Text as="span" fontWeight="bold">ម៉ោង​​ ០៩:០៩ ព្រឹក</Text>{'\n'}
          ចាប់ផ្តើមកម្មវិធី

          {'\n\n'}អ្នកមហាទាំងបី តំណាងមាតាបិតាទាំងសងខាង និយាយជើងការប្រពៃណីក្នុងទម្រង់ពិធីទទួលស្លាភ្ជាប់ពាក្យ
          {'\n\n'}ពិធីជូន និងពិសារម្លូស្លាភ្ជាប់ពាក្យ
          {'\n\n'}កូនប្រុស កូនស្រី ចេញមកគោរពអ្នកមានគុណ ជំរាបសួរមេបាតូចធំ និងភ្ញៀវកិត្តិយស
          {'\n\n'}ភ្ជាប់ព្រលឹង និងបំពាក់វត្ថុអនុស្សាវរីយ៍
          {'\n\n'}<Text as="span" fontWeight="bold">សែនជំនូន</Text>{'\n\n'}
          កូនប្រុស កូនស្រី គោរពអរគុណ មេបាតូចធំ និងភ្ញៀវកិត្តិយសទាំងសងខាង
          {'\n\n'}ថតរូបអនុស្សាវរីយ៍
          {'\n\n'}អញ្ជើញទទួលទានអាហារថ្ងៃត្រង់
          {'\n\n'}ចប់កម្មវិធី សូមអរគុណ
          </>
        ) : (
          <>
          <Text as="span" fontWeight="bold">Morning Program</Text>{'\n'}
          <Text as="span" fontWeight="bold">07:30 AM</Text>{'\n\n'}
          Honored gathering of His Excellency, Lok Chumteav, Lok Oknha, Neak Oknha, Ladies, Gentlemen, and Distinguished Guests at the ceremony residence

          {'\n\n'}<Text as="span" fontWeight="bold">Breakfast Reception</Text>{'\n\n'}
          <Text as="span" fontWeight="bold">09:09 AM</Text>{'\n'}
          Ceremony officially begins

          {'\n\n'}Blessing speeches delivered by respected elders representing both families
          {'\n\n'}Offering and ceremonial tasting of the traditional scarf (Slah Pchob Peak)
          {'\n\n'}Bride and Groom pay respects to honored guests and elders
          {'\n\n'}Symbolic bonding and gifting of keepsakes
          {'\n\n'}<Text as="span" fontWeight="bold">Gift Ritual</Text>{'\n\n'}
          Expression of gratitude to both families and distinguished guests
          {'\n\n'}Memorial photo session
          {'\n\n'}Traditional Khmer-style lunch served
          {'\n\n'}End of ceremony — Thank you
          </>
        )}
        </Text>
      </Box>

                {/* RSVP Section */}
                <VStack spacing={4} w="full">
                {rsvpStatus === 'confirmed' ? (
                  <Box bg="green.50" p={4} borderRadius="lg" w="full" textAlign="center" border="1px solid" borderColor="green.200">
                  <Text fontSize="lg" fontFamily="khmerBody" color="green.700" fontWeight="bold">
                    ✓ {lang === 'kh' ? 'អ្នកបានបញ្ជាក់ថានឹងចូលរួម' : 'You confirmed attendance'}
                  </Text>
                  </Box>
                ) : rsvpStatus === 'declined' ? (
                  <Box bg="red.50" p={4} borderRadius="lg" w="full" textAlign="center" border="1px solid" borderColor="red.200">
                  <Text fontSize="lg" fontFamily="khmerBody" color="red.700" fontWeight="bold">
                    😢 {lang === 'kh' ? 'អ្នកមិនអាចចូលរួម' : 'You cannot attend'}
                  </Text>
                  </Box>
                ) : (
                  <Button
                  size="lg"
                  bg="brand.gold"
                  color="white"
                  fontFamily="khmerBody"
                  w="full"
                  py={6}
                  fontSize="lg"
                  onClick={() => setShowRSVP(true)}
                  _hover={{ bg: 'brand.darkGold', transform: 'translateY(-2px)' }}
                  transition="all 0.3s ease"
                  shadow="lg"
                  >
                  {lang === 'kh' ? '✅ បញ្ជាក់ការចូលរួម' : '✅ Confirm Attendance'}
                  </Button>
                )}
                </VStack>
                
                                {/* Countdown */}
                                {weddingInfo.date && (
                                <Suspense fallback={<Box h="120px" bg="gray.100" borderRadius="md" />}>
                                  <SimpleCountdown targetDate={weddingInfo.date} lang={lang} />
                                </Suspense>
                                )}
                
                                {/* Map Section - Always Visible */}
                                {weddingInfo.venueMapLink && (
                                  <MapSection venueMapLink={weddingInfo.venueMapLink} venue={weddingInfo.venue} lang={lang} />
                                )}
                                
                                              </VStack>
                                              </Box>
                                
                                {/* Footer - Connected to main content */}
                                <VStack as="footer" spacing={4} mt={0} mb={4} textAlign="center">
                                  {/* Enhanced Contact Info */}
                                  <Box  p={4} borderRadius="lg" shadow="sm" w="full" textAlign="center">
                                    <VStack spacing={3} align="center">
<Box w="500px" h="150px" overflow="hidden" mt={1}> {/* mt = marginTop */}
  <Image
    src="/vectors/Logo.png"
    alt="Astra Decor Logo"
    w="200%"
    h="100%"
    objectFit="contain"
    style={{ imageRendering: 'auto' }}
  />
</Box>




                                      <Text fontSize="sm" fontFamily="khmerBody" color="gray.300" fontStyle="italic">
                                        {lang === 'kh' ? 'ការរៀបចំពិធីបុណ្យនិងព្រឹត្តិការណ៍ព្រីមៀម' : 'Premium Wedding & Event Planning'}
                                      </Text>
                                      <Text fontSize="sm" fontFamily="khmerBody" color="gray.300">
                                        {lang === 'kh' ? 'ទំនាក់ទំនងយើងខ្ញុំ' : 'Contact Us'}
                                      </Text>
                                      
                                      {/* Contact Details with Real Icons */}
                                      <HStack justify="center" spacing={6} flexWrap="wrap">
                                        <HStack 
                                          as="a" 
                                          href="tel:+85569566388" 
                                          spacing={2} 
                                          _hover={{ textDecoration: 'underline', color: 'brand.gold' }}
                                          cursor="pointer"
                                        >
                                          <Icon as={FaPhoneAlt} color="gray.300" boxSize="14px" />
                                          <Text fontSize="sm" fontFamily="khmerBody" color="gray.300">+855 69 566 388</Text>
                                        </HStack>
                                        <HStack 
                                          as="a" 
                                          href="mailto:info@astra-decoration.com" 
                                          spacing={2} 
                                          _hover={{ textDecoration: 'underline', color: 'brand.gold' }}
                                          cursor="pointer"
                                        >
                                          <Icon as={FaEnvelope} color="gray.300" boxSize="14px" />
                                          <Text fontSize="sm" fontFamily="khmerBody" color="gray.300">info@astra-decoration.com</Text>
                                        </HStack>
                                      </HStack>
                                      
                                      {/* Professional Social Media Icons - Connected */}
                                      <HStack justify="center" spacing={0} mt={2}>
                                        {/* Facebook */}
                                        <Box 
                                          as="a" 
                                          href="https://facebook.com/astradecorcambodia" 
                                          target="_blank" 
                                          rel="noopener noreferrer"
                                          bg="blue.600" 
                                          p={2} 
                                          borderLeftRadius="md"
                                          borderRightRadius={0}
                                          borderRight="1px solid"
                                          borderRightColor="white"
                                          cursor="pointer" 
                                          _hover={{ bg: 'blue.700', transform: 'translateY(-2px)' }}
                                          transition="all 0.2s"
                                          display="flex"
                                          alignItems="center"
                                          justifyContent="center"
                                        >
                                          <Icon as={FaFacebookF} color="white" boxSize="16px" />
                                        </Box>
                                        
                                        {/* Instagram */}
                                        <Box 
                                          as="a" 
                                          href="https://instagram.com/astradecorcambodia"
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          bgGradient="linear(135deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%)" 
                                          p={2} 
                                          borderRadius={0}
                                          borderRight="1px solid"
                                          borderRightColor="white"
                                          cursor="pointer" 
                                          _hover={{ opacity: 0.9, transform: 'translateY(-2px)' }}
                                          transition="all 0.2s"
                                          display="flex"
                                          alignItems="center"
                                          justifyContent="center"
                                        >
                                          <Icon as={FaInstagram} color="white" boxSize="16px" />
                                        </Box>
                                        
                                        {/* Telegram */}
                                        <Box 
                                          as="a" 
                                          href="https://t.me/astradecor"
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          bg="blue.400" 
                                          p={2} 
                                          borderRadius={0}
                                          borderRight="1px solid"
                                          borderRightColor="white"
                                          cursor="pointer" 
                                          _hover={{ bg: 'blue.500', transform: 'translateY(-2px)' }}
                                          transition="all 0.2s"
                                          display="flex"
                                          alignItems="center"
                                          justifyContent="center"
                                        >
                                          <Icon as={FaTelegramPlane} color="white" boxSize="16px" />
                                        </Box>
                                        
                                        {/* Website/Link */}
                                        <Box 
                                          as="a" 
                                          href="https://astra-decoration.com"
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          bg="gray.600" 
                                          p={2} 
                                          borderLeftRadius={0}
                                          borderRightRadius="md"
                                          cursor="pointer" 
                                          _hover={{ bg: 'gray.700', transform: 'translateY(-2px)' }}
                                          transition="all 0.2s"
                                          display="flex"
                                          alignItems="center"
                                          justifyContent="center"
                                        >
                                          <Icon as={FaLink} color="white" boxSize="16px" />
                                        </Box>
                                      </HStack>
                                    </VStack>
                                  </Box>
                                  
                                  {/* Copyright and Tagline */}
                                  <VStack spacing={1}>
                                    <Text fontSize="xs" fontFamily="khmerBody" color="gray.400">
                                      {lang === 'kh' ? 'ផ្តល់ជូនដោយ' : 'Powered by'} ASTRA DECOR
                                    </Text>
                                    <Text fontSize="xs" fontFamily="khmerBody" color="gray.400">
                                      © 2025 Astra Decoration
                                    </Text>
                                  </VStack>
                                </VStack>
                
                            </VStack>
                          </Box>
                
                          {/* RSVP Modal */}
                          {showRSVP && (
                            <RSVPForm
                              onClose={() => setShowRSVP(false)}
                              lang={lang}
                              onSubmit={handleRSVPSubmit}
                            />
                          )}
                        </>
                      )}
                    </ChakraProvider>
                  );
                }
