import React, { useState } from "react";
import { auth, db } from "../firebase-config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  Text,
  VStack,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [empNumber, setEmpNumber] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), {
        firstName,
        lastName,
        empNumber,
        email,
        uid: user.uid,
      });
      alert("Signup Successful!");
      navigate("/");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minH="100vh" bgGradient="linear(to-r, blue.500, purple.500)">
      <Box bg="white" p={8} borderRadius="lg" shadow="lg" maxW="md" w="full">
        <Heading size="lg" textAlign="center" color="blue.600">Sign Up</Heading>
        {error && (
          <Alert status="error" mt={4} borderRadius="md">
            <AlertIcon />
            {error}
          </Alert>
        )}
        <VStack as="form" spacing={4} mt={4} onSubmit={handleSignup}>
          <FormControl>
            <FormLabel>First Name</FormLabel>
            <Input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
          </FormControl>
          <FormControl>
            <FormLabel>Last Name</FormLabel>
            <Input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
          </FormControl>
          <FormControl>
            <FormLabel>Employee Number</FormLabel>
            <Input type="text" value={empNumber} onChange={(e) => setEmpNumber(e.target.value)} required />
          </FormControl>
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </FormControl>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </FormControl>
          <Button colorScheme="blue" width="full" type="submit">Sign Up</Button>
        </VStack>
      </Box>
    </Box>
  );
};

export default Signup;