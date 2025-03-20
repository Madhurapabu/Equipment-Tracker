// src/pages/Eq_booking.js

import React, { useEffect, useState } from 'react';
import { db } from '../firebase-config';
import { collection, getDocs, addDoc, updateDoc, doc, query, where, arrayUnion, Timestamp } from 'firebase/firestore';
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  Heading,
  CheckboxGroup,
  Checkbox,
  Stack,
  Select,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function Eq_Booking() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
  const [availableEquipment, setAvailableEquipment] = useState([]);
  const [selectedDates, setSelectedDates] = useState([null, null]);
  const [selectedEquipment, setSelectedEquipment] = useState([]);
  const toast = useToast();

  useEffect(() => {
    if (selectedDates[0] && selectedDates[1]) {
      fetchAvailableEquipment();
    }
  }, [selectedDates]);

  const fetchAvailableEquipment = async () => {
    try {
      const [startDate, endDate] = selectedDates;
      const startTimestamp = Timestamp.fromDate(new Date(startDate));
      const endTimestamp = Timestamp.fromDate(new Date(endDate));

      // Fetch all equipment
      const equipmentQuery = collection(db, 'equipment');
      const equipmentSnapshot = await getDocs(equipmentQuery);
      const data = equipmentSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));

      // Filter out equipment that is booked during the selected dates
      const filteredData = data.filter(equipment => {
        const bookings = equipment.bookings || [];
        const isBookedDuringSelectedDates = bookings.some(booking => {
          const bookingStart = booking.start_date.toDate();
          const bookingEnd = booking.end_date.toDate();
          return !(endDate < bookingStart || startDate > bookingEnd);
        });
        return !isBookedDuringSelectedDates;
      });

      // Sort equipment alphabetically by name
      filteredData.sort((a, b) => (a.name && b.name ? a.name.localeCompare(b.name) : 0));

      setAvailableEquipment(filteredData);
    } catch (error) {
      console.error('Error fetching available equipment:', error);
    }
  };

  const onSubmit = async (data) => {
    try {
      const startDate = Timestamp.fromDate(new Date(selectedDates[0]));
      const endDate = Timestamp.fromDate(new Date(selectedDates[1]));

      // Add booking document
      const bookingRef = await addDoc(collection(db, 'bookings'), {
        user_name: data.user_name,
        project_code: data.project_code,
        start_date: startDate,
        end_date: endDate,
        equipment: selectedEquipment,
      });

      // Update equipment documents with the new booking
      const equipmentPromises = selectedEquipment.map(equipmentId => {
        const equipmentDocRef = doc(db, 'equipment', equipmentId);
        return updateDoc(equipmentDocRef, {
          bookings: arrayUnion({
            start_date: startDate,
            end_date: endDate,
            booking_ref: bookingRef.id,
          }),
        });
      });
      await Promise.all(equipmentPromises);

      toast({
        title: 'Booking created.',
        description: 'The booking details have been saved successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      reset();
      setSelectedDates([null, null]);
      setSelectedEquipment([]);

      // Refresh the page
      window.location.reload();
    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        title: 'Error creating booking.',
        description: 'There was an error saving the booking details. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleEquipmentSelection = (selectedIds) => {
    setSelectedEquipment(selectedIds);
    console.log('Selected Equipment IDs:', selectedIds);
  };

  return (
    <Flex flexDirection="column" alignItems="center">
      <Box width="100%" maxWidth="600px">
        <Heading mb={4}>Book Equipment</Heading>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl isInvalid={errors.user_name} mb={4}>
            <FormLabel htmlFor='user_name'>User Name</FormLabel>
            <Select
              id='user_name'
              placeholder='Select User Name'
              {...register('user_name', { required: 'This is required' })}
            >
              <option value="Chalangana">Chalangana</option>
              <option value="Madhura">Madhura</option>
              <option value="Dananjaya">Dananjaya</option>
              <option value="Nimali">Nimali</option>
              <option value="Haritha">Haritha</option>
              <option value="Hasitha">Hasitha</option>
              <option value="Charith">Charith</option>
              <option value="Chamika">Chamika</option>
              <option value="Suwithi">Suwithi</option>
              <option value="Sajana">Sajana</option>
              <option value="Hasitha_J">Hasitha J</option>
              <option value="Ravindu">Ravindu</option>
              <option value="Kasun">Kasun</option>
              <option value="Ravindu F">Ravindu F</option>
              <option value="Theekshana">Theekshana</option>
            </Select>
          </FormControl>

          <FormControl isInvalid={errors.project_code} mb={4}>
            <FormLabel htmlFor='project_code'>Project Code</FormLabel>
            <Input
              id='project_code'
              placeholder='Project Code'
              {...register('project_code', { required: 'This is required' })}
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel htmlFor='booking_dates'>Booking Dates</FormLabel>
            <DatePicker
              selected={selectedDates[0]}
              onChange={(dates) => setSelectedDates(dates)}
              startDate={selectedDates[0]}
              endDate={selectedDates[1]}
              selectsRange
              inline
            />
          </FormControl>

          {availableEquipment.length > 0 ? (
            <FormControl mb={4}>
              <FormLabel htmlFor='equipment'>Select Equipment</FormLabel>
              <CheckboxGroup onChange={handleEquipmentSelection}>
                <Stack>
                  {availableEquipment.map(equipment => (
                    <Checkbox key={equipment.id} value={equipment.id}>
                      {equipment.name}
                    </Checkbox>
                  ))}
                </Stack>
              </CheckboxGroup>
            </FormControl>
          ) : (
            <p>No available equipment for the selected dates.</p>
          )}

          <Button colorScheme='teal' isLoading={isSubmitting} type='submit'>
            Book Equipment
          </Button>
        </form>
      </Box>
    </Flex>
  );
}

export default Eq_Booking;
