'use client';

import React, { useState, useCallback } from 'react';
import { Box, Text, VStack, HStack, Button } from '@chakra-ui/react';
import { useInView } from 'react-intersection-observer';

interface MapSectionProps {
  venueMapLink: string;
  venue: string;
  lang: 'kh' | 'en';
}

const MapSection: React.FC<MapSectionProps> = ({ venueMapLink, venue, lang }) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
    rootMargin: '50px'
  });

  const createMapEmbedUrl = useCallback((mapLink: string, venue: string): string => {
    if (!mapLink) return '';
    
    try {
      if (mapLink.includes('q=') && mapLink.includes(',')) {
        const coordsMatch = mapLink.match(/q=([^&]+)/);
        if (coordsMatch) {
          const coords = coordsMatch[1];
          return `https://www.google.com/maps?q=${coords}&output=embed`;
        }
      }
      
      if (mapLink.includes('maps.google.com') || mapLink.includes('maps.app.goo.gl')) {
        const coordsRegex = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
        const coordsMatch = mapLink.match(coordsRegex);
        if (coordsMatch) {
          const lat = coordsMatch[1];
          const lng = coordsMatch[2];
          return `https://www.google.com/maps?q=${lat},${lng}&output=embed`;
        }
        
        const placeMatch = mapLink.match(/place\/([^\/\?]+)/);
        if (placeMatch) {
          const placeName = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '));
          return `https://www.google.com/maps?q=${encodeURIComponent(placeName)}&output=embed`;
        }
        
        if (venue) {
          return `https://www.google.com/maps?q=${encodeURIComponent(venue)}&output=embed`;
        }
      }
      
      if (venue) {
        return `https://www.google.com/maps?q=${encodeURIComponent(venue)}&output=embed`;
      }
      
      return '';
    } catch (error) {
      console.error('Error creating map embed URL:', error);
      return '';
    }
  }, []);

  return (
    <Box ref={ref} w="100%" maxW={{ base: "95%", md: "600px" }} mx="auto">
      <Text
        fontFamily="khmerSubheading"
        fontSize={{ base: 'lg', md: 'xl' }}
        fontWeight="bold"
        color="brand.gold"
        textAlign="center"
        mb={4}
        textShadow="0 2px 4px rgba(196, 166, 106, 0.3)"
      >
        {lang === 'kh' ? 'ទីតាំងលើផែនទី' : 'Location on Map'}
      </Text>
      
      <Box
        position="relative"
        borderRadius="xl"
        overflow="hidden"
        boxShadow="0 12px 40px rgba(0, 0, 0, 0.15)"
        border="3px solid"
        borderColor="brand.gold"
        bg="white"
      >
        {!inView ? (
          <Box
            h={{ base: "300px", md: "380px" }}
            bg="linear-gradient(135deg, #f5f3ed 0%, #e8e6df 100%)"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <VStack spacing={4}>
              <Box fontSize="3xl" color="brand.gold">📍</Box>
              <Text fontSize="md" color="brand.maroon" fontFamily="khmerBody">
                {lang === 'kh' ? 'ទីតាំងកំពុងត្រៀមផ្ទុក...' : 'Preparing location...'}
              </Text>
            </VStack>
          </Box>
        ) : (
          <>
            {!mapLoaded && !mapError && (
              <Box
                position="absolute"
                inset={0}
                bg="linear-gradient(135deg, #f5f3ed 0%, #e8e6df 100%)"
                display="flex"
                alignItems="center"
                justifyContent="center"
                zIndex={2}
              >
                <VStack spacing={4}>
                  <Box fontSize="3xl" color="brand.gold">🗺️</Box>
                  <Text fontSize="md" color="brand.maroon" fontFamily="khmerBody">
                    {lang === 'kh' ? 'ផែនទីកំពុងផ្ទុក...' : 'Loading map...'}
                  </Text>
                </VStack>
              </Box>
            )}
            
            <Box
              as="iframe"
              src={createMapEmbedUrl(venueMapLink, venue)}
              w="100%"
              h={{ base: "300px", md: "380px" }}
              border="0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={lang === 'kh' ? 'ផែនទីទីតាំងពិធីមង្គលការ' : 'Wedding Venue Location Map'}
              onLoad={() => setMapLoaded(true)}
              onError={() => {
                setMapError(true);
                setMapLoaded(true);
              }}
              opacity={mapLoaded ? 1 : 0}
              transition="opacity 0.5s ease"
            />
          </>
        )}
      </Box>

      <HStack spacing={4} justify="center" mt={6} flexWrap="wrap" gap={3}>
        <Button
          as="a"
          href={venueMapLink}
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
          href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(venue || '')}`}
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
  );
};

export default MapSection;