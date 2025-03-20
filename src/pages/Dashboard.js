// src/pages/Dashboard.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form'; 
import { db } from '../firebase-config';
import Eq_Calibration from './Eq_detail_card';
import Eq_Booking from './Eq_booking_card';
import { collection, getDocs, addDoc, updateDoc, serverTimestamp, doc, where, query, onSnapshot } from '@firebase/firestore';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  SimpleGrid,
  Button,
  Heading,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Checkbox,
  CheckboxGroup,
  Stack,
  Center,
  Select,
  useToast,
} from '@chakra-ui/react';
import EquipmentBookingModal from './EquipmentBookingModal';
import BookingCalendar from '../components/BookingCalendar'; 

function Dashboard() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalType, setModalType] = useState(null); 
  const finalRef = React.useRef(null);

  const [toastMessage, setToastMessage] = useState(null); // State for toast message
  const toast = useToast(); // Initialize useToast hook
  
  const [selectedEquipment, setSelectedEquipment] = useState([]);
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // State for controlling drawer visibility
  const btnRef = React.useRef()
  
  const {
    handleSubmit: handleSubmitCheckOut,
    register,
    formState: { errors, isSubmitting },
  } = useForm(); 

  const {
    handleSubmit: handleSubmitCheckIn,
    register: checkIn_register,
    formState: { errors: errorsCheckIn, isSubmitting: isSubmittingCheckIn },
  } = useForm()

  const openModal = (type) => {
    setModalType(type);
    onOpen();
  };

  const closeModal = () => {
    setModalType(null);
    onClose();
  };

  const onSubmit = async (data) => {
    try {
      console.log(data)
      const promises = selectedEquipment.map(async (equipmentId) => {
        const docRef = await addDoc(collection(db, 'check_outs'), {
          name: data.name,
          reason: data.reason,
          testEquipment: equipmentId,
          checkout_time: serverTimestamp(),
          checkin_time: "",
          checkin_person: "",
        });

        await updateDoc(doc(db, 'equipment', equipmentId), {
          status: false,
          last_checkout_date: serverTimestamp(),
          last_user: data.name
        });
      });

      await Promise.all(promises);

      setSelectedEquipment([]);

      console.log('Check in successful!');
      toast({
        title: 'Check Out successful!',
        description: `${selectedEquipment.length} Test Equipments were successfully check out by ${data.name}  `,
        status: 'success',
        duration: 5000, // Display duration in milliseconds
        isClosable: true,
      });
    } catch (error) {
      console.error('Error edit document: ', error);
    }
  };

  const onSubmitCheckIn = async (data_in) => {
    try {
      console.log(data_in)
      const promises = selectedEquipment.map(async (equipmentId) => {
        const q = query(
          collection(db, 'check_outs'),
          where("checkin_time", "==", ""),
          where("testEquipment", "==", equipmentId)
        );
        const querySnapshot = await getDocs(q);
        
        querySnapshot.forEach(async (doc) => {
          await updateDoc(doc.ref, {
            checkin_time: serverTimestamp(),
            checkin_person: data_in.cin_name,
          });
        });
  
        await updateDoc(doc(db, 'equipment', equipmentId), {
          status: true,
        });
      });
  
      await Promise.all(promises);
  
      setSelectedEquipment([]);
      toast({
        title: 'Check In successful!',
        description: `${selectedEquipment.length} Test Equipments were successfully check in by ${data_in.cin_name}  `,
        status: 'success',
        duration: 5000, // Display duration in milliseconds
        isClosable: true,
      });      
    } catch (error) {
      console.error('Error updating documents: ', error);
    }
  };

  const [equipment, setEquipment] = useState([]);
  const usersCollectionRef = collection(db, "equipment");
  
  useEffect(() => {
    const unsubscribe = onSnapshot(usersCollectionRef, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setEquipment(data);
    });
  
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div>
      <SimpleGrid spacing={4} templateColumns='repeat(auto-fill, minmax(200px, 5fr))'>
        <Card>
          <CardHeader>
            <Heading size='md'> Borrowing </Heading>
            <Heading size='sm'> Test Equipment </Heading>
          </CardHeader>
          <CardBody>
            <Text>Fill the form before borrowing every test equipment</Text>
          </CardBody>
          <CardFooter>
            <Button mt={4} onClick={() => openModal('checkOut')}>
              Check out
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <Heading size='xl'> Return </Heading>
            <Heading size='md'>  Test Equipment </Heading>
          </CardHeader>
          <CardBody>
          </CardBody>
          <CardFooter>
            <Button onClick={() => openModal('checkIn')}>Equipment List</Button>
          </CardFooter>
        </Card>

        <Eq_Calibration />
        <Eq_Booking />

      </SimpleGrid>

      <BookingCalendar />

      <Modal finalFocusRef={finalRef} isOpen={isOpen} onClose={closeModal} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            {modalType === 'checkOut' && (
              <form onSubmit={handleSubmitCheckOut(onSubmit)}>
                <FormControl isInvalid={errors.name}>
                  <FormLabel htmlFor='name'>User's Name</FormLabel>
                  <Select
                    id='name'
                    placeholder="Select user's name"
                    {...register('name', {
                      required: 'This is required',
                    })}
                  >
                      <option value="Chalangana">Chalangana</option>
                      <option value="Madhura">Madhura</option>
                      <option value="Dananjaya">Dananjaya</option>
                      <option value="Nimali">Nimali</option>
                      <option value="Haritha">Haritha</option>
                      <option value="Charith">Charith</option>
                      <option value="Chamika">Chamika</option>
                      <option value="Suwithi">Suwithi</option>
                      <option value="Sajana">Sajana</option>
                      <option value="Hasitha_J">Hasitha J</option>
                      <option value="Ravindu">Ravindu</option>
                      <option value="Kasun">Kasun</option>
                      <option value="Ravindu_F">Ravindu F</option>
                      <option value="Theekshana">Theekshana</option>
                      <option value="Sajeew">Sajeew</option>
                  </Select>
                  <FormLabel htmlFor='name' mt={4}>Reason for Check out</FormLabel>
                  <Input
                    id='reason'
                    placeholder='Project Code'
                    {...register('reason', {
                      required: 'This is required',
                      minLength: { value: 4, message: 'Minimum length should be 4' },
                    })}
                  />
                  <FormLabel htmlFor='testEquipment' mt={4}>Test Equipment</FormLabel>
                  <CheckboxGroup onChange={setSelectedEquipment} value={selectedEquipment}>
                    <Stack>
                      {equipment
                        .filter(equipment => equipment.status === true)
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((equipment) => (
                          <Checkbox key={equipment.id} value={equipment.id}>{equipment.name}</Checkbox>
                        ))}
                    </Stack>
                  </CheckboxGroup>
                  <FormErrorMessage>
                    {errors.name && errors.name.message}
                  </FormErrorMessage>
                </FormControl>
                <Center>
                  <Button mt={4} colorScheme='teal' isLoading={isSubmitting} type='submit' onClick={onClose}>
                    Submit
                  </Button>
                  <Button colorScheme='blue' mt={4} ml={3} onClick={onClose}>
                    Close
                  </Button>
                </Center>
              </form>
            )}

            {modalType === 'checkIn' && (
               <form onSubmit={handleSubmitCheckIn(onSubmitCheckIn)}>
                  <FormControl isInvalid={errorsCheckIn.cin_name}>
                    <FormLabel htmlFor='cin_name'>User's Name</FormLabel>
                    <Select
                      id='cin_name'
                      placeholder="Select user's name"
                      {...checkIn_register('cin_name', {
                        required: 'This is required',
                      })}
                    >
                      <option value="Chalangana">Chalangana</option>
                      <option value="Madhura">Madhura</option>
                      <option value="Dananjaya">Dananjaya</option>
                      <option value="Nimali">Nimali</option>
                      <option value="Haritha">Haritha</option>
                      <option value="Charith">Charith</option>
                      <option value="Chamika">Chamika</option>
                      <option value="Suwithi">Suwithi</option>
                      <option value="Sajana">Sajana</option>
                      <option value="Hasitha_J">Hasitha J</option>
                      <option value="Ravindu">Ravindu</option>
                      <option value="Kasun">Kasun</option>
                      <option value="Ravindu_F">Ravindu F</option>
                      <option value="Theekshana">Theekshana</option>
                      <option value="Sajeew">Sajeew</option>
                    </Select>
                  <FormLabel htmlFor='testEquipment' mt={4}>Test Equipment</FormLabel>
                  <CheckboxGroup onChange={setSelectedEquipment} value={selectedEquipment}>
                    <Stack>
                      {equipment
                        .filter(equipment => equipment.status === false)
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((equipment) => (
                          <Checkbox key={equipment.id} value={equipment.id}>{equipment.name}</Checkbox>
                        ))}
                    </Stack>
                  </CheckboxGroup>
                  <FormErrorMessage>
                    {errorsCheckIn.cin_name && errorsCheckIn.cin_name.message}
                  </FormErrorMessage>
                </FormControl>
                <Center>
                  <Button mt={4} colorScheme='teal' isLoading={isSubmittingCheckIn} type='submit' onClick={onClose}>
                    Submit
                  </Button>
                  <Button colorScheme='blue' mt={4} ml={3} onClick={onClose}>
                    Close
                  </Button>
                </Center>
             </form>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default Dashboard;
