'use client';

import { Box, Heading, Text, VStack, Button } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

export default function OfflinePage() {
  const router = useRouter();

  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" p={4}>
      <VStack spacing={6} textAlign="center" maxW="md">
        <Text fontSize="6xl">📴</Text>
        <Heading size="lg" color="gray.700">
          You&apos;re Offline
        </Heading>
        <Text color="gray.600" lineHeight="1.6">
          No internet connection detected. Some features may be limited, but you can still view cached invitations and make RSVPs that will sync when you&apos;re back online.
        </Text>
        <Button 
          colorScheme="blue" 
          onClick={() => router.back()}
        >
          Go Back
        </Button>
      </VStack>
    </Box>
  );
}