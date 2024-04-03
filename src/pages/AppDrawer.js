// AppDrawer.js

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

              <Link to="/add-equipment">
                <Button onClick={handleDashboardClick}> Add Equipment</Button>
              </Link>

              <Link to="/checkout-item">
                <Button onClick={handleDashboardClick}> Check Out Items </Button>
              </Link>

              <Link to="/checkout-history">
                <Button onClick={handleDashboardClick}> Check Out History </Button>
              </Link>
              
              {/* <Box h='40px' bg='tomato'>
                2
              </Box>
              <Box h='40px' bg='pink.100'>
                3
              </Box> */}
            </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

export default AppDrawer;
