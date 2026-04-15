import React, { useEffect, useState } from 'react';
import { Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Box, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { apiCall } from '../api';

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [filter, setFilter] = useState('');
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', location: '', leader_id: '' });
  
  const fetchTeams = () => apiCall('/team-service/teams').then(setTeams).catch(console.error);

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleAdd = async () => {
    try {
      await apiCall('/team-service/teams', {
        method: 'POST',
        body: JSON.stringify({ ...formData, leader_id: formData.leader_id ? Number(formData.leader_id) : null })
      });
      setOpen(false);
      setFormData({ name: '', location: '', leader_id: '' });
      fetchTeams();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredTeams = teams.filter(t => t.name?.toLowerCase().includes(filter.toLowerCase()) || String(t.id).includes(filter));

  return (
    <Box sx={{ maxWidth: '1200px', margin: 'auto', p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" color="primary.main">
          Teams
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField 
            size="small" 
            placeholder="Filter teams..." 
            variant="outlined" 
            value={filter} 
            onChange={e => setFilter(e.target.value)}
            sx={{ bgcolor: 'background.paper', borderRadius: 1 }}
          />
          <Button variant="contained" color="primary" onClick={() => setOpen(true)} sx={{ borderRadius: 2, textTransform: 'none', px: 3 }}>
            + Add Team
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: 'primary.main' }}>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Location</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Leader ID</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTeams.map((team, index) => (
              <TableRow key={team.id} hover sx={{ bgcolor: index % 2 === 0 ? 'grey.50' : 'white' }}>
                <TableCell>{team.id}</TableCell>
                <TableCell sx={{ fontWeight: 'medium' }}>{team.name}</TableCell>
                <TableCell>{team.location}</TableCell>
                <TableCell>{team.leader_id}</TableCell>
              </TableRow>
            ))}
            {filteredTeams.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 3, color: 'text.secondary' }}>No teams found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold' }}>Add New Team</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField label="Name" fullWidth value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
          <TextField label="Location" fullWidth value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
          <TextField label="Leader ID (Optional)" type="number" fullWidth value={formData.leader_id} onChange={e => setFormData({ ...formData, leader_id: e.target.value })} />
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setOpen(false)} color="inherit">Cancel</Button>
          <Button onClick={handleAdd} variant="contained" color="primary">Submit</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
