import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  Link,
  Card,
  CardBody,
  useToast,
} from "@chakra-ui/react";
import { auth, db } from "../firebase-config"; // Import Firestore DB
import { createUserWithEmailAndPassword, sendEmailVerification, signOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [employeeNumber, setEmployeeNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save user details in Firestore
      await setDoc(doc(db, "users", user.uid), {
        firstName,
        lastName,
        employeeNumber,
        email,
        uid: user.uid,
      });

      // Send email verification
      await sendEmailVerification(user);
      toast({
        title: "Verification email sent!",
        description: "Check your inbox and verify your email before logging in.",
        status: "info",
        duration: 5000,
        isClosable: true,
      });

      // Log the user out to force email verification
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      toast({
        title: "Signup failed",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box minH="100vh" display="flex" justifyContent="center" alignItems="center" bg="gray.100">
      <Card width="sm" boxShadow="lg" borderRadius="lg" bg="white">
        <CardBody>
          <VStack spacing={4} align="stretch">
            <Heading size="lg" textAlign="center">
              Create an Account
            </Heading>
            <Text fontSize="sm" color="gray.500" textAlign="center">
              Sign up to manage your equipment easily.
            </Text>

            <FormControl id="first-name">
              <FormLabel>First Name</FormLabel>
              <Input
                type="text"
                placeholder="Enter your first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </FormControl>

            <FormControl id="last-name">
              <FormLabel>Last Name</FormLabel>
              <Input
                type="text"
                placeholder="Enter your last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </FormControl>

            <FormControl id="employee-number">
              <FormLabel>Employee Number</FormLabel>
              <Input
                type="text"
                placeholder="Enter your employee number"
                value={employeeNumber}
                onChange={(e) => setEmployeeNumber(e.target.value)}
              />
            </FormControl>

            <FormControl id="email">
              <FormLabel>Email Address</FormLabel>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>

            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>

            <Button
              colorScheme="teal"
              size="lg"
              onClick={handleSignup}
              isLoading={loading}
            >
              Sign Up
            </Button>

            <Text fontSize="sm" textAlign="center">
              Already have an account?{" "}
              <Link color="teal.500" onClick={() => navigate("/login")}>
                Log in
              </Link>
            </Text>
          </VStack>
        </CardBody>
      </Card>
    </Box>
  );
};

export default Signup;
