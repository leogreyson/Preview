'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Center,
  Heading,
  Text,
  VStack,
  Container,
  Image,
  Flex,
  Icon,
  Grid,
  GridItem,
  Badge,
} from '@chakra-ui/react';
import { keyframes } from '@emotion/react'; // Import keyframes from emotion

// Enhanced animations
const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(1deg); }
`;

const shimmerAnimation = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(196, 166, 106, 0.4); }
  50% { box-shadow: 0 0 40px rgba(196, 166, 106, 0.8), 0 0 60px rgba(212, 175, 55, 0.4); }
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
    >
      {/* Enhanced Background with Layers */}
      <Box
        position="absolute"
        inset={0}
        bgGradient="linear(to-b, brand.ivory 0%, brand.champagne 25%, brand.sandstone 75%, brand.taupe 100%)"
        opacity={0.9}
      />
      
      {/* Subtle Pattern Overlay */}
      <Box
        position="absolute"
        inset={0}
        backgroundImage="url('/textures/khmer-damask-motif-light.png')"
        backgroundSize="300px 300px"
        backgroundRepeat="repeat"
        opacity={0.05}
        mixBlendMode="multiply"
      />

      {/* Decorative Elements */}
      <Box
        position="absolute"
        top="10%"
        left="5%"
        width="80px"
        height="80px"
        backgroundImage="url('/vectors/khmer-ornament.svg')"
        backgroundSize="contain"
        backgroundRepeat="no-repeat"
        opacity={0.1}
        animation={`${floatAnimation} 6s ease-in-out infinite`}
      />
      <Box
        position="absolute"
        bottom="15%"
        right="8%"
        width="60px"
        height="60px"
        backgroundImage="url('/vectors/khmer-ornament.svg')"
        backgroundSize="contain"
        backgroundRepeat="no-repeat"
        opacity={0.1}
        animation={`${floatAnimation} 8s ease-in-out infinite reverse`}
      />

      {/* Main Content */}
      <Center minH="100vh" position="relative" zIndex={1}>
        <Container maxW="6xl" textAlign="center">
          <VStack spacing={12}>
            {/* Premium Logo Section */}
            <VStack spacing={6} animation={`${fadeInUp} 1s ease-out`}>
  <Box
    position="relative"
    w="180px"
    h="180px"
    borderRadius="full"
    bg="rgba(255, 255, 255, 0.15)"
    backdropFilter="blur(20px)"
    border="1px solid rgba(255, 255, 255, 0.2)"
    overflow="hidden" // This ensures the image doesn't overflow the box!
    animation={`${pulseGlow} 4s ease-in-out infinite`}
    mx="auto"
  >
    <Image
      src="/vectors/astra.png"
      alt="Astra Invite Logo"
      w="100%"
      h="100%"
      objectFit="cover"
      borderRadius="full" // for perfect circle crop
      fallbackSrc="/next.svg"
      filter="drop-shadow(0 4px 20px rgba(196, 166, 106, 0.3))"
      // Optionally: remove "maxW" and "height" props!
    />
  </Box>
              
              <Badge
                colorScheme="yellow"
                variant="subtle"
                px={4}
                py={2}
                borderRadius="full"
                fontSize="sm"
                fontWeight="medium"
                bg="rgba(196, 166, 106, 0.1)"
                color="brand.gold"
                border="1px solid rgba(196, 166, 106, 0.3)"
              >
                ✨ Premium Wedding Invitations
              </Badge>
            </VStack>

            {/* Enhanced Heading Section */}
            <VStack spacing={6} animation={`${fadeInUp} 1s ease-out 0.2s both`}>
              <Heading
                as="h1"
                fontSize={{ base: "3xl", md: "5xl", lg: "6xl" }}
                fontWeight="300"
                color="brand.darkBrown"
                fontFamily="'Moulpali', cursive"
                lineHeight="1.2"
                position="relative"
                _after={{
                  content: '""',
                  position: 'absolute',
                  bottom: '-10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '60px',
                  height: '3px',
                  background: 'linear-gradient(90deg, transparent, #c4a66a, transparent)',
                  borderRadius: 'full',
                }}
              >
                Astra Invite
              </Heading>
              
              <Text
                fontSize={{ base: "lg", md: "xl" }}
                color="brand.textSecondary"
                maxW="700px"
                fontFamily="'Battambang', serif"
                lineHeight="1.8"
                fontWeight="400"
              >
                Craft exquisite wedding invitations that blend{' '}
                <Text as="span" color="brand.gold" fontWeight="600">
                  traditional Khmer artistry
                </Text>{' '}
                with modern elegance, creating timeless memories for your special day.
              </Text>
            </VStack>

            {/* Enhanced Action Cards */}
            <VStack spacing={8} w="100%" animation={`${fadeInUp} 1s ease-out 0.4s both`}>
              <Text 
                fontSize="lg" 
                color="brand.gold" 
                fontWeight="600"
                fontFamily="'Battambang', serif"
                position="relative"
                _before={{
                  content: '""',
                  position: 'absolute',
                  left: '-30px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '20px',
                  height: '1px',
                  bg: 'brand.gold',
                }}
                _after={{
                  content: '""',
                  position: 'absolute',
                  right: '-30px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '20px',
                  height: '1px',
                  bg: 'brand.gold',
                }}
              >
                Choose Your Experience
              </Text>
              
              <Grid
                templateColumns={{ base: "1fr", md: "1fr 1fr" }}
                gap={8}
                w="100%"
                maxW="800px"
              >
                {/* Client Card */}
                <GridItem>
                  <Box
                    p={8}
                    bg="rgba(255, 255, 255, 0.08)"
                    backdropFilter="blur(20px)"
                    border="1px solid rgba(255, 255, 255, 0.15)"
                    borderRadius="2xl"
                    transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
                    position="relative"
                    overflow="hidden"
                    cursor="pointer"
                    onClick={() => router.push('/client')}
                    sx={{
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: '-100%',
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
                        transition: 'left 0.6s ease',
                      },
                      '&:hover': {
                        transform: "translateY(-8px) scale(1.02)",
                        bg: "rgba(255, 255, 255, 0.12)",
                        border: "1px solid rgba(196, 166, 106, 0.3)",
                        boxShadow: "0 20px 60px rgba(196, 166, 106, 0.2)",
                        '&::before': {
                          left: '100%',
                        }
                      }
                    }}
                  >
                    <VStack spacing={6}>
                      <Box
                        fontSize="4xl"
                        bg="linear-gradient(135deg, #c4a66a, #d4af37)"
                        borderRadius="full"
                        w="80px"
                        h="80px"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        boxShadow="0 8px 25px rgba(196, 166, 106, 0.3)"
                      >
                        👰🏻
                      </Box>
                      
                      <VStack spacing={3}>
                        <Heading
                          size="lg"
                          color="brand.darkBrown"
                          fontFamily="'Battambang', serif"
                          fontWeight="600"
                        >
                          Client Dashboard
                        </Heading>
                        <Text
                          fontSize="md"
                          color="brand.textSecondary"
                          textAlign="center"
                          lineHeight="1.6"
                        >
                          Design and customize your perfect wedding invitation with our elegant templates and tools
                        </Text>
                      </VStack>
                      
                      <Button
                        variant="ghost"
                        color="brand.gold"
                        fontWeight="600"
                        rightIcon={<span>→</span>}
                        _hover={{
                          bg: "rgba(196, 166, 106, 0.1)",
                          transform: "translateX(4px)",
                        }}
                      >
                        Get Started
                      </Button>
                    </VStack>
                  </Box>
                </GridItem>

                {/* Admin Card */}
                <GridItem>
                  <Box
                    p={8}
                    bg="rgba(255, 255, 255, 0.08)"
                    backdropFilter="blur(20px)"
                    border="1px solid rgba(255, 255, 255, 0.15)"
                    borderRadius="2xl"
                    transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
                    position="relative"
                    overflow="hidden"
                    cursor="pointer"
                    onClick={() => router.push('/admin')}
                    sx={{
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: '-100%',
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
                        transition: 'left 0.6s ease',
                      },
                      '&:hover': {
                        transform: "translateY(-8px) scale(1.02)",
                        bg: "rgba(255, 255, 255, 0.12)",
                        border: "1px solid rgba(92, 44, 44, 0.3)",
                        boxShadow: "0 20px 60px rgba(92, 44, 44, 0.2)",
                        '&::before': {
                          left: '100%',
                        }
                      }
                    }}
                  >
                    <VStack spacing={6}>
                      <Box
                        fontSize="4xl"
                        bg="linear-gradient(135deg, #5c2c2c, #7c6b50)"
                        borderRadius="full"
                        w="80px"
                        h="80px"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        boxShadow="0 8px 25px rgba(92, 44, 44, 0.3)"
                      >
                        ⚙️
                      </Box>
                      
                      <VStack spacing={3}>
                        <Heading
                          size="lg"
                          color="brand.darkBrown"
                          fontFamily="'Battambang', serif"
                          fontWeight="600"
                        >
                          Admin Panel
                        </Heading>
                        <Text
                          fontSize="md"
                          color="brand.textSecondary"
                          textAlign="center"
                          lineHeight="1.6"
                        >
                          Manage clients, oversee projects, and configure system settings with powerful admin tools
                        </Text>
                      </VStack>
                      
                      <Button
                        variant="ghost"
                        color="brand.darkBrown"
                        fontWeight="600"
                        rightIcon={<span>→</span>}
                        _hover={{
                          bg: "rgba(92, 44, 44, 0.1)",
                          transform: "translateX(4px)",
                        }}
                      >
                        Access Panel
                      </Button>
                    </VStack>
                  </Box>
                </GridItem>
              </Grid>
            </VStack>

            {/* Enhanced Secondary Actions */}
            <VStack spacing={6} animation={`${fadeInUp} 1s ease-out 0.6s both`}>
              {/* Login Link */}
              <Text fontSize="md" color="brand.textSecondary">
                Already have an account?{' '}
                <Button
                  variant="link"
                  color="brand.gold"
                  fontWeight="600"
                  textDecoration="underline"
                  textUnderlineOffset="3px"
                  _hover={{
                    color: "brand.darkGold",
                    textDecoration: "none",
                  }}
                  onClick={() => router.push('/login')}
                >
                  Sign In
                </Button>
              </Text>

              {/* Demo Invitation */}
              <Box
                p={6}
                bg="rgba(255, 255, 255, 0.05)"
                backdropFilter="blur(15px)"
                border="1px solid rgba(255, 255, 255, 0.1)"
                borderRadius="xl"
                transition="all 0.3s ease"
                _hover={{
                  bg: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid rgba(196, 166, 106, 0.2)",
                }}
              >
                <VStack spacing={4}>
                  <Text fontSize="md" color="brand.gold" fontWeight="600">
                    Experience Our Craft
                  </Text>
                  <Button
                    size="lg"
                    variant="outline"
                    borderColor="brand.gold"
                    color="brand.gold"
                    fontFamily="'Battambang', serif"
                    fontWeight="600"
                    px={8}
                    borderWidth="2px"
                    _hover={{
                      bg: "brand.gold",
                      color: "white",
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 25px rgba(196, 166, 106, 0.4)",
                    }}
                    onClick={() => router.push('/invite/nuid19')}
                    leftIcon={<span>📮</span>}
                  >
                    View Demo Invitation
                  </Button>
                </VStack>
              </Box>
            </VStack>

            {/* Enhanced Footer */}
            <VStack spacing={4} pt={8} animation={`${fadeInUp} 1s ease-out 0.8s both`}>
              <Box
                w="100px"
                h="1px"
                bg="linear-gradient(90deg, transparent, rgba(196, 166, 106, 0.5), transparent)"
              />
              <Text fontSize="sm" color="brand.textSecondary" opacity={0.8}>
                © 2025 Astra Invite — Crafting Timeless Khmer Wedding Memories
              </Text>
            </VStack>
          </VStack>
        </Container>
      </Center>
    </Box>
  );
}