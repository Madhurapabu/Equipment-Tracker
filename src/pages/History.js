import React, { useEffect, useState } from 'react';
import { db } from '../firebase-config';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
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
} from '@chakra-ui/react';

function History() {
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'check_outs'));
        const data = [];
        for (const docSnap of querySnapshot.docs) {
          const checkOutData = docSnap.data();
          const equipmentDoc = await getDoc(doc(db, 'equipment', checkOutData.testEquipment));
          const equipmentData = equipmentDoc.data();
          data.push({
            id: docSnap.id,
            equipmentName: equipmentData?.name || 'Unknown',
            checkOutReason: checkOutData.reason,
            checkOutPerson: checkOutData.name,
            checkOutDate: checkOutData.checkout_time.toDate().toLocaleDateString(),
            checkInPerson: checkOutData.checkin_person || 'Not checked in',
            checkInDate: checkOutData.checkin_time ? checkOutData.checkin_time.toDate().toLocaleDateString() : 'Not checked in',
          });
        }
        // Sort the data array by checkInDate in descending order (newest first)
        data.sort((a, b) => new Date(b.checkInDate) - new Date(a.checkInDate));
        setHistoryData(data);
      } catch (error) {
        console.error('Error fetching check out history:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <Flex flexDirection="column" alignItems="center">
      <Box overflowY="auto" maxHeight="100%" width="100%">
        <Table variant='simple'>
          <TableCaption>Check Out History</TableCaption>
          <Thead>
            <Tr>
              <Th>Equipment Name</Th>
              <Th>Check Out Reason</Th>
              <Th>Check Out Person</Th>
              <Th>Check Out Date</Th>
              <Th>Check In Person</Th>
              <Th>Check In Date</Th>
            </Tr>
          </Thead>
          <Tbody>
            {historyData.map((item) => (
              <Tr key={item.id}>
                <Td>{item.equipmentName}</Td>
                <Td>{item.checkOutReason}</Td>
                <Td>{item.checkOutPerson}</Td>
                <Td>{item.checkOutDate}</Td>
                <Td>{item.checkInPerson}</Td>
                <Td>{item.checkInDate}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Flex>
  );
}

export default History;
