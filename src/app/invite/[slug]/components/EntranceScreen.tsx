"use client";
import { useState, useEffect } from "react";
import { Box, Button } from "@chakra-ui/react";

export default function LanguageSwitcher() {
  const [lang, setLang] = useState<"en" | "kh">(
    () => (localStorage.getItem("lang") as "en" | "kh") || "kh"
  );

  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  return (
    <Box
      bg="rgba(255, 255, 255, 0.15)"
      backdropFilter="blur(12px)"
      borderRadius="full"
      p={1}
      border="1px solid rgba(255, 255, 255, 0.2)"
      boxShadow="0 4px 16px rgba(0, 0, 0, 0.1)"
    >
      <Button
        size={{ base: "xs", md: "sm" }}
        bg={lang === "en" ? "rgba(196, 166, 106, 0.8)" : "transparent"}
        color={lang === "en" ? "white" : "brand.textPrimary"}
        _hover={{ bg: "rgba(196, 166, 106, 0.6)" }}
        borderRadius="full"
        px={{ base: 2, md: 3 }}
        py={1}
        fontSize={{ base: "10px", md: "xs" }}
        fontWeight="semibold"
        onClick={() => setLang("en")}
        transition="all 0.3s ease"
        minW={{ base: "30px", md: "auto" }}
      >
        EN
      </Button>
      <Button
        size={{ base: "xs", md: "sm" }}
        bg={lang === "kh" ? "rgba(196, 166, 106, 0.8)" : "transparent"}
        color={lang === "kh" ? "white" : "brand.textPrimary"}
        _hover={{ bg: "rgba(196, 166, 106, 0.6)" }}
        borderRadius="full"
        px={{ base: 2, md: 3 }}
        py={1}
        fontSize={{ base: "10px", md: "xs" }}
        fontWeight="semibold"
        fontFamily="'Battambang', serif"
        onClick={() => setLang("kh")}
        transition="all 0.3s ease"
        minW={{ base: "30px", md: "auto" }}
      >
        ខ្មែរ
      </Button>
    </Box>
  );
}