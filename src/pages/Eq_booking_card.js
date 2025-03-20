// src/components/Eq_booking_card.js

import React from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Heading,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Center,
} from '@chakra-ui/react';

function Eq_Booking() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const finalRef = React.useRef(null);

  return (
    <>
      <Card>
        <CardHeader>
          <Heading size='md'>Equipment Booking</Heading>
          <Heading size='sm'> Details </Heading>
        </CardHeader>
        <CardBody></CardBody>
        <CardFooter>
          <Link to="/equipment-booking">
                <Button> Equipment Booking </Button>
          </Link>
        </CardFooter>
      </Card>

      <Modal finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <Center>
              <Button colorScheme='teal' mr={3}>
                <Link to='/equipment-booking'>Go to Booking Page</Link>
              </Button>
              <Button colorScheme='blue' onClick={onClose}>
                Close
              </Button>
            </Center>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default Eq_Booking;
