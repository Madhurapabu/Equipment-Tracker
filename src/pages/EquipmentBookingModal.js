import React from 'react';
import { Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton, FormControl, FormLabel, Input, Button, Center } from '@chakra-ui/react'; // Import necessary Chakra UI components

function EquipmentBookingModal({ isOpen, onClose, onSubmit }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={onSubmit}>
            <FormControl>
              <FormLabel htmlFor="equipmentName">Equipment Name</FormLabel>
              <Input type="text" id="equipmentName" name="equipmentName" placeholder="Enter equipment name" />
            </FormControl>
            {/* Add more form fields as needed */}
            <Center>
              <Button mt={4} colorScheme='teal' type='submit'>
                Book Equipment
              </Button>
            </Center>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default EquipmentBookingModal;
