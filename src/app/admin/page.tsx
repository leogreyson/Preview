'use client';

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { auth, db, storage } from "@/lib/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

import {
  Box,
  Button,
  Heading,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  FormLabel,
  Avatar,
  Text,
  TableContainer,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Flex,
  Spacer,
} from "@chakra-ui/react";

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [clients, setClients] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [clientEmail, setClientEmail] = useState("");
  const [clientPassword, setClientPassword] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editName, setEditName] = useState("");
  const [editDate, setEditDate] = useState("");
  const [monogramUrl, setMonogramUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) router.push("/login");
      else {
        setUser(currentUser);
        fetchClients();
      }
    });
    return unsub;
  }, [router]);

  const fetchClients = async () => {
    const snapshot = await getDocs(collection(db, "Users"));
    setClients(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  const handleSaveClient = async () => {
    if (!clientEmail || !clientPassword) {
      toast({ title: "Email and password are required", status: "error", duration: 3000 });
      return;
    }
    try {
      await setDoc(doc(db, "Users", clientEmail), {
        email: clientEmail,
        password: clientPassword,
        name: "",
        createdAt: serverTimestamp(),
      });
      setClientEmail("");
      setClientPassword("");
      fetchClients();
      toast({ title: "Client added", status: "success", duration: 3000 });
    } catch {
      toast({ title: "Failed to add client", status: "error", duration: 3000 });
    }
  };

  const handleSaveEdit = async () => {
    if (!selected) return;
    try {
     const updateData: any = { name: editName, "weddingInfo.date": editDate, monogramUrl };
     if (editPassword) updateData.password = editPassword;
     await updateDoc(doc(db, "Users", selected.id), updateData);
     setSelected(null);
     fetchClients();
     toast({ title: "Client updated", status: "success", duration: 3000 });
    } catch {
      toast({ title: "Update failed", status: "error", duration: 3000 });
    }
  };

  const handleUploadMonogram = async (e: any) => {
    if (!selected) return;
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const storageRef = ref(storage, `monograms/${selected.id}/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setMonogramUrl(url);
      toast({ title: "Monogram uploaded", status: "success", duration: 3000 });
    } catch {
      toast({ title: "Upload failed", status: "error", duration: 3000 });
    }
  };

  const handleDeleteMonogram = async () => {
    if (!selected || !monogramUrl) return;
    try {
      const storageRef = ref(storage, monogramUrl);
      await deleteObject(storageRef);
      setMonogramUrl("");
      toast({ title: "Monogram deleted", status: "success", duration: 3000 });
    } catch {
      toast({ title: "Delete failed", status: "error", duration: 3000 });
    }
  };

  const handleDeleteClient = async () => {
    if (!selected) return;
    try {
      await deleteDoc(doc(db, "Users", selected.id));
      onClose();
      fetchClients();
      setSelected(null);
      toast({ title: "Client deleted", status: "success", duration: 3000 });
    } catch {
      toast({ title: "Delete failed", status: "error", duration: 3000 });
    }
  };

  // Guests subcollection operations (to be implemented as needed)

  return (
    <Box maxW="6xl" mx="auto" p={8}>
      <Heading mb={6} textAlign="center" fontFamily="Arial, sans-serif" color="#a88c5a">
        Astra Decor Admin Dashboard
      </Heading>

      <Flex mb={6} gap={3} alignItems="center">
        <Input
          placeholder="Client Email"
          value={clientEmail}
          onChange={(e) => setClientEmail(e.target.value)}
          size="md"
          fontFamily="Arial, sans-serif"
        />
        <Input
          placeholder="Password"
          type="password"
          value={clientPassword}
          onChange={e => setClientPassword(e.target.value)}
          size="md"
          fontFamily="Arial, sans-serif"
        />
<Button
  width="200px"
  colorScheme="yellow"
  onClick={handleSaveClient}
  fontFamily="Arial, sans-serif"
>
  Add Client
</Button>
      </Flex>

      <TableContainer borderRadius="lg" overflow="hidden" boxShadow="xl">
        <Table variant="simple" size="md">
          <Thead bg="#a88c5a">
            <Tr>
              <Th color="white" fontFamily="Arial, sans-serif">
                Name
              </Th>
              <Th color="white" fontFamily="Arial, sans-serif">
                Email
              </Th>
              <Th color="white" fontFamily="Arial, sans-serif">
                Wedding Date
              </Th>
              <Th color="white" fontFamily="Arial, sans-serif">
                Actions
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {clients.map((client) => (
              <Tr
                key={client.id}
                _hover={{ bg: "gray.50", cursor: "pointer" }}
                fontFamily="Arial, sans-serif"
              >
                <Td>{client.name || "-"}</Td>
                <Td>{client.email}</Td>
                <Td>{client.weddingInfo?.date || "-"}</Td>
                <Td>
                  <Button size="sm" onClick={() => {
                      setSelected(client);
                      setEditName(client.name || "");
                      setEditDate(client.weddingInfo?.date || "");
                      setMonogramUrl(client.monogramUrl || "");
                    }}>
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    ml={2}
                    colorScheme="red"
                    onClick={() => {
                      setSelected(client);
                      onOpen();
                    }}
                  >
                    Delete
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      {/* Edit Modal */}
      {selected && (
        <Modal isOpen={!!selected} onClose={() => setSelected(null)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader fontFamily="Arial, sans-serif" color="#a88c5a">
              Edit Client: {selected.email}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody fontFamily="Arial, sans-serif">
              <FormLabel>Name</FormLabel>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                mb={3}
              />

              <FormLabel>Wedding Date</FormLabel>
              <Input
                type="date"
                value={editDate}
                onChange={(e) => setEditDate(e.target.value)}
                mb={3}
              />

              <FormLabel>Password (leave blank to keep existing)</FormLabel>
              <Input
                type="password"
                value={editPassword}
                onChange={e => setEditPassword(e.target.value)}
                mb={3}
              />

              <FormLabel>Monogram</FormLabel>
              {monogramUrl ? (
                <Box mb={3} textAlign="center">
                  <Avatar src={monogramUrl} size="xl" mx="auto" />
                  <Button
                    mt={2}
                    colorScheme="red"
                    onClick={handleDeleteMonogram}
                  >
                    Remove Monogram
                  </Button>
                </Box>
              ) : (
                <Text mb={3} textAlign="center">
                  No monogram uploaded.
                </Text>
              )}

              <Button onClick={() => fileInputRef.current?.click()}>
                Upload Monogram (PNG/SVG)
              </Button>
              <Input
                type="file"
                accept="image/png,image/svg+xml"
                hidden
                ref={fileInputRef}
                onChange={handleUploadMonogram}
              />
            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme="yellow"
                mr={3}
                onClick={handleSaveEdit}
                fontFamily="Arial, sans-serif"
              >
                Save Changes
              </Button>
              <Button
                variant="ghost"
                onClick={() => setSelected(null)}
                fontFamily="Arial, sans-serif"
              >
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}

      {/* Delete Confirmation */}
      <AlertDialog
        isOpen={isOpen}
        onClose={onClose}
        leastDestructiveRef={cancelRef}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontFamily="Arial, sans-serif" color="#a88c5a">
              Delete Client?
            </AlertDialogHeader>
            <AlertDialogBody fontFamily="Arial, sans-serif">
              Are you sure you want to delete this client? This action cannot be
              undone.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose} fontFamily="Arial, sans-serif">
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={handleDeleteClient}
                ml={3}
                fontFamily="Arial, sans-serif"
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <Button
        mt={6}
        colorScheme="gray"
        onClick={() => signOut(auth).then(() => router.push("/login"))}
        fontFamily="Arial, sans-serif"
      >
        Logout
      </Button>
    </Box>
  );
}
