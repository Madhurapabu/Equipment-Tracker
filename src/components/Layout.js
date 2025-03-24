// src/components/Layout.js
import React, { useState } from "react";
import { IconButton } from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import AppDrawer from "../pages/AppDrawer";

const Layout = ({ children }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleDrawerOpen = () => setIsDrawerOpen(true);
  const handleDrawerClose = () => setIsDrawerOpen(false);

  return (
    <div>
      <IconButton
        isRound={true}
        variant="solid"
        colorScheme="teal"
        aria-label="Menu"
        fontSize="20px"
        icon={<HamburgerIcon />}
        onClick={handleDrawerOpen}
        mx={4}
        my={4}
      />
      <AppDrawer isOpen={isDrawerOpen} onClose={handleDrawerClose} />
      {children}
    </div>
  );
};

export default Layout;
