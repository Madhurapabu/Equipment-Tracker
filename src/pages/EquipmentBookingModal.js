import React from 'react';
import { 
  Card,
  CardHeader, 
  Heading, 
  CardBody, 
  CardFooter, 
  Button,
  Modal,
  ModalBody,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Center  
} from '@chakra-ui/react'; // Import necessary Chakra UI components

function EquipmentBookingModal({ isOpen, onClose, onSubmit }) {
  return (
    <Card>
    <CardHeader>
      <Heading size='xl'> Booking </Heading>
      <Heading size='md'>  Test Equipment </Heading>
    </CardHeader>
    <CardBody>
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
    </CardBody>
    <CardFooter>
      <Button> Book Test Equipment</Button>
    </CardFooter>
  </Card>
  );
}

export default EquipmentBookingModal;
