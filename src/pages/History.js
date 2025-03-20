// src/pages/History.js

import React, { useEffect, useState } from 'react';
import { db } from '../firebase-config';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
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
} from '@chakra-ui/react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

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
            checkOutDate: checkOutData.checkout_time.toDate(),
            checkInPerson: checkOutData.checkin_person || 'Not checked in',
            checkInDate: checkOutData.checkin_time ? checkOutData.checkin_time.toDate() : null,
          });
        }
        // Sort the data array by checkOutDate in descending order (newest first)
        data.sort((a, b) => b.checkOutDate - a.checkOutDate);
        setHistoryData(data);
      } catch (error) {
        console.error('Error fetching check out history:', error);
      }
    };
    fetchData();
  }, []);

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      historyData.map(item => ({
        'Equipment Name': item.equipmentName,
        'Check Out Reason': item.checkOutReason,
        'Check Out Person': item.checkOutPerson,
        'Check Out Date': item.checkOutDate.toLocaleDateString(),
        'Check In Person': item.checkInPerson,
        'Check In Date': item.checkInDate ? item.checkInDate.toLocaleDateString() : 'Not checked in',
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'CheckOutHistory');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'CheckOutHistory.xlsx');
  };

  return (
    <Flex flexDirection="column" alignItems="center">
      <Box overflowY="auto" maxHeight="100%" width="100%">
        <Button colorScheme='teal' onClick={downloadExcel} mb={4}>Download Excel</Button>
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
                <Td>{item.checkOutDate.toLocaleDateString()}</Td>
                <Td>{item.checkInPerson}</Td>
                <Td>{item.checkInDate ? item.checkInDate.toLocaleDateString() : 'Not checked in'}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Flex>
  );
}

export default History;
