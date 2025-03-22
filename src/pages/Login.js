import React, { useState } from "react";
import { auth } from "../firebase-config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Box, Button, Input, FormControl, FormLabel, Text, Alert, AlertIcon } from "@chakra-ui/react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (!userCredential.user.emailVerified) {
        setError("Please verify your email before logging in.");
        return;
      }
      navigate("/");
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        setError("No account found. Redirecting to signup...");
        setTimeout(() => navigate("/signup"), 3000);
      } else {
        setError(error.message);
      }
    }
  };

  return (
    <Box p={8} maxWidth="400px" mx="auto">
      <Text fontSize="2xl" fontWeight="bold" mb={4}>Login</Text>
      {error && <Alert status="error"><AlertIcon />{error}</Alert>}
      <form onSubmit={handleLogin}>
        <FormControl isRequired>
          <FormLabel>Email</FormLabel>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Password</FormLabel>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </FormControl>
        <Button mt={4} colorScheme="teal" type="submit">Login</Button>
      </form>
      <Text mt={4}>Don't have an account? <Button variant="link" onClick={() => navigate("/signup")}>Sign Up</Button></Text>
    </Box>
  );
};

export default Login;
