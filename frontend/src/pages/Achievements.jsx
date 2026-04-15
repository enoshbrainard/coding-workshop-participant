import React, { useEffect, useState } from 'react';
import { Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, Button } from '@mui/material';
import { apiCall } from '../api';

export default function Achievements() {
  const [achievements, setAchievements] = useState([]);
  
  useEffect(() => {
    apiCall('/achievements').then(setAchievements).catch(console.error);
  }, []);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4">Achievements</Typography>
        <Button variant="contained">Add Achievement</Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Team ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Month</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {achievements.map((acc) => (
              <TableRow key={acc.id}>
                <TableCell>{acc.id}</TableCell>
                <TableCell>{acc.team_id}</TableCell>
                <TableCell>{acc.title}</TableCell>
                <TableCell>{acc.description}</TableCell>
                <TableCell>{acc.month}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
