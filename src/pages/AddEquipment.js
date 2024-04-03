import React from 'react';
import { useForm } from 'react-hook-form';
import { db } from '../firebase-config';
import { collection, addDoc } from '@firebase/firestore';
import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
  Flex,
  Heading,
} from '@chakra-ui/react';

function AddEquipment() {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    reset, // Destructure reset method from useForm
  } = useForm();

  const onSubmit = async (values) => {
    try {
      const docRef = await addDoc(collection(db, 'equipment'), {
        name: values.equipment_name,
        code: values.equipment_code,
        calibrate_date: values.calibrate_date,
        status: true,
        last_user: '',
        last_checkout_date: '',
      });

      // Reset the form after successful submission
      reset();
    } catch (error) {
      console.error('Error creating document: ', error);
    }
  };

  return (
    <Flex justifyContent="center" marginTop="20px">
      <Flex direction="column" alignItems="center">
        <Heading as="h1" mb={4}>
          Add Equipment
        </Heading>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl isInvalid={errors.name} mb={4}>
            <FormLabel htmlFor="equipment_name">Equipment Name</FormLabel>
            <Input
              id="equipment_name"
              placeholder="equipment_name"
              {...register('equipment_name', {
                required: 'This is required',
                minLength: { value: 1, message: 'Minimum length should be 1' },
              })}
            />
            <FormLabel htmlFor="equipment_code" my={2}>
              Equipment Code
            </FormLabel>
            <Input
              id="equipment_code"
              placeholder="equipment_code"
              {...register('equipment_code', {
                required: 'This is required',
                minLength: { value: 4, message: 'Minimum length should be 4' },
              })}
            />
            <FormLabel htmlFor="calibrate_date" my={2}>
              Last Calibrate Date
            </FormLabel>
            <Input
              id="calibrate_date"
              placeholder="Select Date and Time"
              size="md"
              type="date"
              {...register('calibrate_date', {
                required: 'This is required',
              })}
            />
            <FormErrorMessage>{errors.name && errors.name.message}</FormErrorMessage>
          </FormControl>
          <Button colorScheme="teal" isLoading={isSubmitting} type="submit">
            Submit
          </Button>
        </form>
      </Flex>
    </Flex>
  );
}

export default AddEquipment;
