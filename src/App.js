import React, { useState, useEffect } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './firebase-config';
import { onAuthStateChanged, setPersistence, browserLocalPersistence } from 'firebase/auth';
import './App.css';
import Dashboard from './pages/Dashboard';
import AppDrawer from './pages/AppDrawer';
import AddEquipment from './pages/AddEquipment';
import CheckOutItem from './pages/CheckOutItem';
import History from './pages/History';
import EqDetail from './pages/EqDetail';
import Eq_Booking from './pages/Eq_booking';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { IconButton } from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';

function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Ensure we wait for Firebase Auth check

  useEffect(() => {
    // Set Firebase auth persistence
    setPersistence(auth, browserLocalPersistence).then(() => {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setLoading(false); // Stop loading after auth check
      });
      return () => unsubscribe();
    });
  }, []);

  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  if (loading) return <p>Loading...</p>; // Prevent flashing login screen

  return (
    <ChakraProvider>
      <Router>
        {user && (
          <div>
            <IconButton
              isRound={true}
              variant='solid'
              colorScheme='teal'
              aria-label='Menu'
              fontSize='20px'
              icon={<HamburgerIcon />}
              onClick={handleDrawerOpen} mx={4} my={4}
            />
            <AppDrawer isOpen={isDrawerOpen} onClose={handleDrawerClose} />
          </div>
        )}
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes */}
          <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/add-equipment" element={user ? <AddEquipment /> : <Navigate to="/login" />} />
          <Route path="/checkout-item" element={user ? <CheckOutItem /> : <Navigate to="/login" />} />
          <Route path="/checkout-history" element={user ? <History /> : <Navigate to="/login" />} />
          <Route path="/equipment-details" element={user ? <EqDetail /> : <Navigate to="/login" />} />
          <Route path="/equipment-booking" element={user ? <Eq_Booking /> : <Navigate to="/login" />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
