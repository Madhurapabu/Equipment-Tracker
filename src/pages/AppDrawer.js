import React from 'react';
import { Link } from 'react-router-dom';
import { 
    Drawer,
    DrawerOverlay, 
    DrawerContent, 
    DrawerCloseButton, 
    DrawerHeader, 
    DrawerBody, 
    VStack,
    StackDivider,
    Button,
 } from '@chakra-ui/react'; // Import necessary Chakra UI components

function AppDrawer({ isOpen, onClose }) {
    const handleDashboardClick = () => {
        onClose(); // Close the drawer when Dashboard button is clicked
    }

    const handleLogout = () => {
        // Add your logout logic here, like clearing authentication tokens
        console.log("Logging out...");
        // Example: If you're using localStorage/sessionStorage, you can clear them
        // localStorage.removeItem('authToken');
        // sessionStorage.removeItem('authToken');
        
        // Redirect to the login page or home page
        window.location.href = '/login'; // Example redirect
    }

  return (
    <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Menu</DrawerHeader>
        <DrawerBody>
            <VStack
              divider={<StackDivider borderColor='gray.200' />}
              spacing={4}
              align='stretch'
            >
              <Link to="/">
                <Button onClick={handleDashboardClick}> Dashboard</Button>
              </Link>

              <Link to="/checkout-item">
                <Button onClick={handleDashboardClick}> Check Out Items </Button>
              </Link>

              <Link to="/checkout-history">
                <Button onClick={handleDashboardClick}> Check Out History </Button>
              </Link>

              <Link to="/equipment-booking">
                <Button onClick={handleDashboardClick}> Equipment Reservation </Button>
              </Link>

              <Link to="/add-equipment">
                <Button onClick={handleDashboardClick}> Add Equipment</Button>
              </Link>
              
              {/* Log Out Button */}
              <Button onClick={handleLogout} colorScheme="red">Log Out</Button>
            </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

export default AppDrawer;
