'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Box, Input, Button, Heading, Text } from "@chakra-ui/react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      // Try Admin login via Firebase Auth
      await signInWithEmailAndPassword(auth, email, password);
      return router.push("/admin");
    } catch (err: any) {
      // Fall back to client login via Firestore
      const clientRef = doc(db, "Users", email);
      const clientSnap = await getDoc(clientRef);
      if (!clientSnap.exists() || clientSnap.data().password !== password) {
        setError("Invalid email or password.");
        return;
      }
      // Successful client login: store email and redirect
      localStorage.setItem("clientEmail", email);
      router.push("/client");
    }
  };

  return (
    <Box maxW="sm" mx="auto" mt={24} p={8} borderRadius="lg" boxShadow="lg" bg="white" textAlign="center">
      <Heading as="h2" mb={6} fontFamily="Arial, sans-serif">Client Login</Heading>
      <form onSubmit={handleLogin}>
        <Input
          placeholder="Email"
          type="email"
          mb={3}
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <Input
          placeholder="Password"
          type="password"
          mb={3}
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <Button colorScheme="yellow" type="submit" w="full">Login</Button>
      </form>
      {error && <Text color="red.500" mt={3} fontFamily="Arial, sans-serif">{error}</Text>}
    </Box>
  );
}