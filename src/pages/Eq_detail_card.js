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

function Eq_Calibration_card() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const finalRef = React.useRef(null);

  return (
    <>
      <Card>
        <CardHeader>
          <Heading size='md'>Equipment</Heading>
          <Heading size='sm'> Details </Heading>
        </CardHeader>
        <CardBody></CardBody>
        <CardFooter>
          <Link to="/equipment-details">
                <Button> Equipment Details </Button>
          </Link>
        </CardFooter>
      </Card>

      <Modal finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <Center>
              <Button  colorScheme='teal'>
                <Link to='/equipment-details'>Go to Calibration Page</Link>
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

export default Eq_Calibration_card;
