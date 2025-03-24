import React, { useState, useEffect } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { auth } from "./firebase-config";
import { onAuthStateChanged, setPersistence, browserLocalPersistence } from "firebase/auth";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import AddEquipment from "./pages/AddEquipment";
import CheckOutItem from "./pages/CheckOutItem";
import History from "./pages/History";
import EqDetail from "./pages/EqDetail";
import Eq_Booking from "./pages/Eq_booking";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Layout from "./components/Layout";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up Firebase auth persistence and listen for auth state changes
    const initAuth = async () => {
      await setPersistence(auth, browserLocalPersistence);
      onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setLoading(false); // Stop loading when auth check completes
      });
    };

    initAuth();
  }, []);

  if (loading) return <p>Loading...</p>; // Show loading only until auth check completes

  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Routes (Wrapped Inside Layout) */}
          {user ? (
            <>
              <Route path="/" element={<Layout><Dashboard /></Layout>} />
              <Route path="/add-equipment" element={<Layout><AddEquipment /></Layout>} />
              <Route path="/checkout-item" element={<Layout><CheckOutItem /></Layout>} />
              <Route path="/checkout-history" element={<Layout><History /></Layout>} />
              <Route path="/equipment-details" element={<Layout><EqDetail /></Layout>} />
              <Route path="/equipment-booking" element={<Layout><Eq_Booking /></Layout>} />
            </>
          ) : (
            <Route path="*" element={<Navigate to="/login" />} />
          )}
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
