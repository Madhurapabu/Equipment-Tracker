import React, { useEffect, useState } from 'react';
import { db } from '../firebase-config';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import {
  Table,
  TableCaption,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Flex,
  Box,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  useToast,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

function EqDetail() {
  const [equipmentData, setEquipmentData] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const toast = useToast();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'equipment'));
        const data = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
  
        // Filter out items that don't have a 'name' property
        const filteredData = data.filter(item => item.name);
  
        // Sort filtered data alphabetically by 'name'
        const sortedData = filteredData.sort((a, b) => a.name.localeCompare(b.name));
  
        setEquipmentData(sortedData);
      } catch (error) {
        console.error('Error fetching equipment data:', error);
      }
    };
    fetchData();
  }, []);
  

  const onSubmit = async (data) => {
    try {
      const equipmentDoc = doc(db, 'equipment', selectedEquipment.id);
      await updateDoc(equipmentDoc, {
        name: data.name,
        make: data.make,
        model: data.model,
        serial_number: data.serial_number,
        calibrate_date: data.calibrate_date // Store as string
      });
      setEquipmentData(equipmentData.map(equipment =>
        equipment.id === selectedEquipment.id ? { ...equipment, ...data } : equipment
      ));
      toast({
        title: 'Equipment updated.',
        description: 'The equipment details have been updated successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      console.error('Error updating equipment:', error);
      toast({
        title: 'Error updating equipment.',
        description: 'There was an error updating the equipment details. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };
  console.log(equipmentData)
  const handleEditClick = (equipment) => {
    setSelectedEquipment(equipment);
    reset({
      name: equipment.name,
      make: equipment.make,
      model: equipment.model,
      serial_number: equipment.serial_number || '',
      calibrate_date: equipment.calibrate_date || '' // Directly use the string date
    });
    onOpen();
  };

  return (
    <Flex flexDirection="column" alignItems="center">
      <Box overflowY="auto" maxHeight="100%" width="100%">
        <Table variant='simple'>
          <TableCaption>Equipment Details</TableCaption>
          <Thead>
            <Tr>
              <Th>Equipment Name</Th>
              <Th>Make</Th>
              <Th>Model</Th>
              <Th>Serial Number</Th>
              <Th>Last Calibration Date</Th>
              <Th>Edit</Th>
            </Tr>
          </Thead>
          <Tbody>
            {equipmentData.map((equipment) => (
              <Tr key={equipment.id}>
                <Td>{equipment.name}</Td>
                <Td>{equipment.make}</Td>
                <Td>{equipment.model}</Td>
                <Td>{equipment.serial_number}</Td>
                <Td>{equipment.calibrate_date ? new Date(equipment.calibrate_date).toLocaleDateString() : 'Not available'}</Td>
                <Td>
                  <Button onClick={() => handleEditClick(equipment)}>Edit</Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Equipment</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormControl isInvalid={errors.name}>
                <FormLabel htmlFor='name'>Equipment Name</FormLabel>
                <Input
                  id='name'
                  placeholder='Equipment Name'
                  {...register('name', { required: 'This is required' })}
                />
              </FormControl>

              <FormControl isInvalid={errors.make} mt={4}>
                <FormLabel htmlFor='make'>Make</FormLabel>
                <Input
                  id='make'
                  placeholder='Make'
                  {...register('make', { required: 'This is required' })}
                />
              </FormControl>

              <FormControl isInvalid={errors.model} mt={4}>
                <FormLabel htmlFor='model'>Model</FormLabel>
                <Input
                  id='model'
                  placeholder='Model'
                  {...register('model', { required: 'This is required' })}
                />
              </FormControl>

              <FormControl isInvalid={errors.serial_number} mt={4}>
                <FormLabel htmlFor='serial_number'>Serial Number</FormLabel>
                <Input
                  id='serial_number'
                  placeholder='Serial Number'
                  {...register('serial_number', { required: 'This is required' })}
                />
              </FormControl>

              <FormControl isInvalid={errors.calibrate_date} mt={4}>
                <FormLabel htmlFor='calibrate_date'>Last Calibration Date</FormLabel>
                <Input
                  id='calibrate_date'
                  type='date'
                  {...register('calibrate_date', { required: 'This is required' })}
                />
              </FormControl>

              <ModalFooter>
                <Button colorScheme='blue' mr={3} onClick={onClose}>
                  Close
                </Button>
                <Button
                  colorScheme='teal'
                  isLoading={isSubmitting}
                  type='submit'
                >
                  Save
                </Button>
              </ModalFooter>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
}

export default EqDetail;
