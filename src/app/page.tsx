'use client';

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box,
  Button,
  Center,
  Container,
  VStack,
  Heading,
  Text,
  Image,
  Grid,
  GridItem,
  Badge,
} from '@chakra-ui/react'
import { keyframes } from '@emotion/react'

// Modern animations
const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(2deg); }
`;

const waveAnimation = keyframes`
  0%, 100% { 
    transform: translateX(-50%) translateY(0px) rotate(0deg); 
  }
  50% { 
    transform: translateX(-50%) translateY(-10px) rotate(1deg); 
  }
`;

const fadeInUp = keyframes`
  from { 
    opacity: 0; 
    transform: translateY(40px) scale(0.98); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0) scale(1); 
  }
`;

const gradientShift = keyframes`
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
`;

export default function Home() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <Box
      minH="100vh"
      position="relative"
      overflow="hidden"
      fontFamily="'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    >
      {/* Modern Aurora Background */}
      <Box
        position="absolute"
        inset={0}
        bgGradient="linear(135deg, #e0e7ff 0%, #c7d2fe 25%, #a5b4fc 50%, #8b5cf6 75%, #7c3aed 100%)"
        backgroundSize="400% 400%"
        animation={`${gradientShift} 15s ease infinite`}
      />
      
      {/* Frosted Glass Overlay */}
      <Box
        position="absolute"
        inset={0}
        bg="rgba(255, 255, 255, 0.1)"
        backdropFilter="blur(100px)"
      />

      {/* Animated Wave Blob */}
      <Box
        position="absolute"
        top="10%"
        left="50%"
        transform="translateX(-50%)"
        width="800px"
        height="600px"
        background="linear-gradient(45deg, rgba(139, 92, 246, 0.1), rgba(168, 85, 247, 0.1), rgba(236, 72, 153, 0.1))"
        borderRadius="50% 40% 60% 30%"
        filter="blur(40px)"
        animation={`${waveAnimation} 20s ease-in-out infinite`}
        zIndex={1}
      />

      {/* Secondary Floating Elements */}
      <Box
        position="absolute"
        top="20%"
        right="10%"
        width="200px"
        height="200px"
        background="linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))"
        borderRadius="full"
        filter="blur(30px)"
        animation={`${floatAnimation} 25s ease-in-out infinite`}
        zIndex={1}
      />

      <Box
        position="absolute"
        bottom="20%"
        left="15%"
        width="150px"
        height="150px"
        background="linear-gradient(45deg, rgba(168, 85, 247, 0.1), rgba(236, 72, 153, 0.1))"
        borderRadius="30% 70% 40% 60%"
        filter="blur(25px)"
        animation={`${floatAnimation} 30s ease-in-out infinite reverse`}
        zIndex={1}
      />

      {/* Main Content */}
      <Center minH="100vh" position="relative" zIndex={2}>
        <Container maxW="7xl" px={{ base: 6, md: 8 }}>
          <VStack spacing={{ base: 12, md: 16 }}>
            {/* Hero Logo Section */}
            <VStack 
              spacing={8} 
              animation={`${fadeInUp} 1s ease-out`}
              textAlign="center"
            >
              <Box
                position="relative"
                p={8}
                bg="rgba(255, 255, 255, 0.1)"
                backdropFilter="blur(20px)"
                borderRadius="3xl"
                border="1px solid rgba(255, 255, 255, 0.2)"
                boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.1)"
                transition="all 0.3s ease"
                _hover={{
                  transform: "translateY(-5px)",
                  boxShadow: "0 35px 60px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.2)",
                }}
              >
                <Image
                  src="/vectors/Astra.png"
                  alt="Astra Invite Logo"
                  width="120px"
                  height="120px"
                  objectFit="contain"
                  fallbackSrc="/vectors/Astra.png"
                  filter="drop-shadow(0 10px 30px rgba(139, 92, 246, 0.2))"
                />
              </Box>
              
              <Badge
                px={6}
                py={3}
                borderRadius="full"
                fontSize="sm"
                fontWeight="600"
                bg="linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(168, 85, 247, 0.1))"
                backdropFilter="blur(10px)"
                border="1px solid rgba(139, 92, 246, 0.2)"
                color="purple.700"
                textTransform="none"
              >
                ✨ Premium Wedding Invitations
              </Badge>
            </VStack>

            {/* Modern Hero Text */}
            <VStack 
              spacing={6} 
              animation={`${fadeInUp} 1s ease-out 0.2s both`}
              textAlign="center"
              maxW="4xl"
            >
              <Heading
                as="h1"
                fontSize={{ base: "4xl", md: "6xl", lg: "7xl" }}
                fontWeight="800"
                background="linear-gradient(135deg, #1e293b, #475569, #8b5cf6)"
                backgroundClip="text"
                color="transparent"
                lineHeight="1.1"
                letterSpacing="-0.02em"
              >
                Astra Invite
              </Heading>
              
              <Text
                fontSize={{ base: "xl", md: "2xl" }}
                color="slate.600"
                fontWeight="400"
                lineHeight="1.6"
                maxW="3xl"
              >
                Create stunning wedding invitations with{' '}
                <Text as="span" fontWeight="600" color="purple.600">
                  traditional Khmer elegance
                </Text>{' '}
                and modern design sophistication.
              </Text>
            </VStack>

            {/* Modern Dashboard Cards */}
            <VStack 
              spacing={10} 
              w="100%" 
              animation={`${fadeInUp} 1s ease-out 0.4s both`}
              maxW="6xl"
            >
              <Text 
                fontSize={{ base: "lg", md: "xl" }}
                fontWeight="600"
                color="slate.700"
                textAlign="center"
              >
                Choose Your Dashboard
              </Text>
              
              <Grid
                templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
                gap={8}
                w="100%"
              >
                {/* Client Dashboard Card */}
                <GridItem>
                  <Box
                    p={{ base: 8, md: 10 }}
                    bg="rgba(255, 255, 255, 0.1)"
                    backdropFilter="blur(20px)"
                    borderRadius="2xl"
                    border="1px solid rgba(255, 255, 255, 0.2)"
                    boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.1)"
                    transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
                    cursor="pointer"
                    onClick={() => router.push('/client')}
                    _hover={{
                      transform: "translateY(-8px) scale(1.02)",
                      bg: "rgba(255, 255, 255, 0.15)",
                      boxShadow: "0 35px 70px -12px rgba(139, 92, 246, 0.3), 0 0 0 1px rgba(139, 92, 246, 0.2)",
                      borderColor: "rgba(139, 92, 246, 0.3)",
                    }}
                  >
                    <VStack spacing={6}>
                      <Box
                        w="80px"
                        h="80px"
                        borderRadius="2xl"
                        background="linear-gradient(135deg, #8b5cf6, #a855f7, #c084fc)"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        fontSize="3xl"
                        boxShadow="0 20px 40px -12px rgba(139, 92, 246, 0.4)"
                      >
                        👰🏻
                      </Box>
                      
                      <VStack spacing={4} textAlign="center">
                        <Heading
                          size="lg"
                          fontWeight="700"
                          color="slate.800"
                        >
                          Client Dashboard
                        </Heading>
                        <Text
                          fontSize="md"
                          color="slate.600"
                          lineHeight="1.7"
                          maxW="300px"
                        >
                          Design and customize your perfect wedding invitation with our intuitive tools and elegant templates.
                        </Text>
                      </VStack>
                      
                      <Button
                        size="lg"
                        borderRadius="full"
                        background="linear-gradient(135deg, #8b5cf6, #a855f7)"
                        color="white"
                        fontWeight="600"
                        px={8}
                        py={6}
                        _hover={{
                          background: "linear-gradient(135deg, #7c3aed, #8b5cf6)",
                          transform: "translateY(-2px)",
                          boxShadow: "0 20px 40px -12px rgba(139, 92, 246, 0.4)",
                        }}
                        rightIcon={<span style={{ fontSize: '18px' }}>→</span>}
                      >
                        Get Started
                      </Button>
                    </VStack>
                  </Box>
                </GridItem>

                {/* Admin Panel Card */}
                <GridItem>
                  <Box
                    p={{ base: 8, md: 10 }}
                    bg="rgba(255, 255, 255, 0.1)"
                    backdropFilter="blur(20px)"
                    borderRadius="2xl"
                    border="1px solid rgba(255, 255, 255, 0.2)"
                    boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.1)"
                    transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
                    cursor="pointer"
                    onClick={() => router.push('/admin')}
                    _hover={{
                      transform: "translateY(-8px) scale(1.02)",
                      bg: "rgba(255, 255, 255, 0.15)",
                      boxShadow: "0 35px 70px -12px rgba(59, 130, 246, 0.3), 0 0 0 1px rgba(59, 130, 246, 0.2)",
                      borderColor: "rgba(59, 130, 246, 0.3)",
                    }}
                  >
                    <VStack spacing={6}>
                      <Box
                        w="80px"
                        h="80px"
                        borderRadius="2xl"
                        background="linear-gradient(135deg, #3b82f6, #2563eb, #1d4ed8)"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        fontSize="3xl"
                        boxShadow="0 20px 40px -12px rgba(59, 130, 246, 0.4)"
                      >
                        ⚙️
                      </Box>
                      
                      <VStack spacing={4} textAlign="center">
                        <Heading
                          size="lg"
                          fontWeight="700"
                          color="slate.800"
                        >
                          Admin Panel
                        </Heading>
                        <Text
                          fontSize="md"
                          color="slate.600"
                          lineHeight="1.7"
                          maxW="300px"
                        >
                          Manage clients, oversee projects, and configure system settings with powerful administrative tools.
                        </Text>
                      </VStack>
                      
                      <Button
                        size="lg"
                        borderRadius="full"
                        background="linear-gradient(135deg, #3b82f6, #2563eb)"
                        color="white"
                        fontWeight="600"
                        px={8}
                        py={6}
                        _hover={{
                          background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                          transform: "translateY(-2px)",
                          boxShadow: "0 20px 40px -12px rgba(59, 130, 246, 0.4)",
                        }}
                        rightIcon={<span style={{ fontSize: '18px' }}>→</span>}
                      >
                        Access Panel
                      </Button>
                    </VStack>
                  </Box>
                </GridItem>
              </Grid>
            </VStack>

            {/* Secondary Actions */}
            <VStack 
              spacing={8} 
              animation={`${fadeInUp} 1s ease-out 0.6s both`}
              textAlign="center"
            >
              {/* Login Link */}
                <Text fontSize="lg" color="slate.600" fontWeight="400">
                  Don&apos;t have an account?{' '}
                  <Button
                    variant="link"
                    color="blue.600"
                    fontWeight="600"
                    fontSize="lg"
                    _hover={{
                      color: "blue.700",
                      textDecoration: "none",
                    }}
                    onClick={() => window.open('https://t.me/Astra_decor', '_blank')}
                    leftIcon={<span style={{ fontSize: '16px' }}>📱</span>}
                  >
                    Sign Up via Telegram
                  </Button>
              </Text>

              {/* Demo Section */}
              <Box
                p={8}
                bg="rgba(255, 255, 255, 0.08)"
                backdropFilter="blur(15px)"
                borderRadius="2xl"
                border="1px solid rgba(255, 255, 255, 0.15)"
                boxShadow="0 20px 40px -12px rgba(0, 0, 0, 0.1)"
                transition="all 0.3s ease"
                _hover={{
                  bg: "rgba(255, 255, 255, 0.12)",
                  borderColor: "rgba(255, 255, 255, 0.25)",
                  transform: "translateY(-3px)",
                }}
              >
                <VStack spacing={5}>
                  <Text fontSize="lg" fontWeight="600" color="slate.700">
                    Experience Our Craft
                  </Text>
                  <Button
                    size="lg"
                    variant="outline"
                    borderColor="purple.400"
                    color="purple.600"
                    fontWeight="600"
                    borderRadius="full"
                    px={8}
                    py={6}
                    borderWidth="2px"
                    _hover={{
                      bg: "purple.500",
                      borderColor: "purple.500",
                      color: "white",
                      transform: "translateY(-2px)",
                      boxShadow: "0 15px 30px -8px rgba(139, 92, 246, 0.4)",
                    }}
                    onClick={() => router.push('/invite/kyk1h7')}
                    leftIcon={<span style={{ fontSize: '20px' }}>📮</span>}
                  >
                    View Demo Invitation
                  </Button>
                </VStack>
              </Box>
            </VStack>

            {/* Modern Footer */}
            <VStack 
              spacing={6} 
              pt={12} 
              animation={`${fadeInUp} 1s ease-out 0.8s both`}
              textAlign="center"
            >
              <Box
                w="120px"
                h="1px"
                background="linear-gradient(90deg, transparent, rgba(148, 163, 184, 0.6), transparent)"
              />
              <Text 
                fontSize="sm" 
                color="slate.500" 
                fontWeight="400"
                letterSpacing="0.025em"
              >
                © 2025 Astra Invite — Crafting Modern Wedding Experiences
              </Text>
            </VStack>
          </VStack>
        </Container>
      </Center>
    </Box>
  );
}
