import React, { useState } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Dashboard from './pages/Dashboard'; // Import Dashboard component
import AppDrawer from './pages/AppDrawer'; // Import your drawer component
import AddEquipment from './pages/AddEquipment';
import CheckOutItem from './pages/CheckOutItem';
import History from './pages/History';
import { IconButton } from '@chakra-ui/react'
import { HamburgerIcon } from '@chakra-ui/icons'

function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // State to control drawer open/close

  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  return (
    <ChakraProvider>
      <Router>
        <div>
          <IconButton
          isRound={true}
          variant='solid'
          colorScheme='teal'
          aria-label='Done'
          fontSize='20px'
          icon={<HamburgerIcon />}
          onClick={handleDrawerOpen} mx={4} my={4}
          />
          <AppDrawer isOpen={isDrawerOpen} onClose={handleDrawerClose} /> {/* Include the drawer */}
        </div>
        <Routes>
          {/* Define the default route to the Dashboard component */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/add-equipment" element={<AddEquipment />} />
          <Route path='/checkout-item' element={<CheckOutItem/>}/>
          <Route path='/checkout-history' element={<History/>}/>
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
