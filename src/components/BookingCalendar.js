// src/components/BookingCalendar.js

import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { db } from '../firebase-config';
import { collection, getDocs } from 'firebase/firestore';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useDisclosure,
} from '@chakra-ui/react';
import './BookingCalendar.css'; // Import custom CSS

function BookingCalendar() {
  const [bookings, setBookings] = useState([]);
  const [equipment, setEquipment] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedBookings, setSelectedBookings] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchBookings = async () => {
      const bookingsCollection = collection(db, 'bookings');
      const bookingsSnapshot = await getDocs(bookingsCollection);
      const bookingsData = bookingsSnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        start_date: doc.data().start_date.toDate(),
        end_date: doc.data().end_date.toDate(),
      }));
      setBookings(bookingsData);
    };

    const fetchEquipment = async () => {
      const equipmentCollection = collection(db, 'equipment');
      const equipmentSnapshot = await getDocs(equipmentCollection);
      const equipmentData = {};
      equipmentSnapshot.docs.forEach(doc => {
        equipmentData[doc.id] = doc.data().name;
      });
      setEquipment(equipmentData);
    };

    fetchBookings();
    fetchEquipment();
  }, []);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    const bookingsForDate = bookings.filter(
      booking =>
        date >= booking.start_date && date <= booking.end_date
    );
    setSelectedBookings(bookingsForDate);
    onOpen();
  };

  const tileContent = ({ date }) => {
    const bookingsForDate = bookings.filter(
      booking =>
        date >= booking.start_date && date <= booking.end_date
    );

    if (bookingsForDate.length > 0) {
      return (
        <ul className="booking-list">
          {bookingsForDate.map(booking => (
            <li key={booking.id}>
              {booking.equipment.map(equipmentId => equipment[equipmentId]).join(', ')}
            </li>
          ))}
        </ul>
      );
    }
    return null;
  };

  return (
    <div className="booking-calendar">
      <Calendar
        onClickDay={handleDateClick}
        tileContent={tileContent}
      />

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Bookings for {selectedDate?.toDateString()}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedBookings.length > 0 ? (
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Equipment Name</Th>
                    <Th>Booked Dates</Th>
                    <Th>User Name</Th>
                    <Th>Project Code</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {selectedBookings.map(booking => (
                    <Tr key={booking.id}>
                      <Td>{booking.equipment.map(equipmentId => equipment[equipmentId]).join(', ')}</Td>
                      <Td>
                        {booking.start_date.toDateString()} - {booking.end_date.toDateString()}
                      </Td>
                      <Td>{booking.user_name}</Td>
                      <Td>{booking.project_code}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            ) : (
              <p>No bookings for this date.</p>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default BookingCalendar;
