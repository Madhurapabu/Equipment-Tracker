import React, { useEffect, useState } from 'react';
import { db } from '../firebase-config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  Box // Import Box component
} from '@chakra-ui/react';

function CheckOutItem() {
  const [checkouts, setCheckouts] = useState([]);

  useEffect(() => {
    const getCheckouts = async () => {
      const q = query(collection(db, 'equipment'), where('status', '==', false));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCheckouts(data);
    };
    getCheckouts();
  }, []);

  // Function to format the Firestore timestamp to display only the date
  const formatDate = (timestamp) => {
    if (!timestamp) return ''; // Handle case where timestamp is undefined
    const date = timestamp.toDate(); // Convert Firestore timestamp to JavaScript Date object
    return date.toLocaleDateString(); // Format the date to display only the date part
  };

  return (
    <Flex flexDirection="column" alignItems="center">
      <Box overflowY="auto" maxHeight="400px" width="100%"> {/* Wrap the table inside Box component */}
        <Table variant='simple' size='md'>
          <Thead>
            <Tr>
              <Th>Equipment Name</Th>
              <Th>Last User</Th>
              <Th>Last Check Out Date</Th>
            </Tr>
          </Thead>
          <Tbody>
            {checkouts.map((checkout, index) => (
              <Tr key={index}>
                <Td>{checkout.name}</Td>
                <Td>{checkout.last_user}</Td>
                <Td>{formatDate(checkout.last_checkout_date)}</Td> {/* Format the date here */}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Flex>
  );
}

export default CheckOutItem;
