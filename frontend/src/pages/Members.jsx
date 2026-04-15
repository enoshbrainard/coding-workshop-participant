import React, { useEffect, useState } from 'react';
import { Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { apiCall } from '../api';

export default function Members() {
  const [members, setMembers] = useState([]);
  const [filter, setFilter] = useState('');
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', role: '', team_id: '', manager_id: '' });
  
  const fetchMembers = () => apiCall('/member-service').then(setMembers).catch(console.error);

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleAdd = async () => {
    try {
      await apiCall('/member-service', {
        method: 'POST',
        body: JSON.stringify({ 
          ...formData, 
          team_id: formData.team_id ? Number(formData.team_id) : null,
          manager_id: formData.manager_id ? Number(formData.manager_id) : null 
        })
      });
      setOpen(false);
      setFormData({ name: '', role: '', team_id: '', manager_id: '' });
      fetchMembers();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredMembers = members.filter(m => m.name?.toLowerCase().includes(filter.toLowerCase()) || m.role?.toLowerCase().includes(filter.toLowerCase()));

  return (
    <Box sx={{ maxWidth: '1200px', margin: 'auto', p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" color="primary.main">
          Members
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField 
            size="small" 
            placeholder="Filter members..." 
            variant="outlined" 
            value={filter} 
            onChange={e => setFilter(e.target.value)}
            sx={{ bgcolor: 'background.paper', borderRadius: 1 }}
          />
          <Button variant="contained" color="primary" onClick={() => setOpen(true)} sx={{ borderRadius: 2, textTransform: 'none', px: 3 }}>
            + Add Member
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: 'primary.main' }}>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Role</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Team ID</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Manager ID</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredMembers.map((member, index) => (
              <TableRow key={member.id} hover sx={{ bgcolor: index % 2 === 0 ? 'grey.50' : 'white' }}>
                <TableCell>{member.id}</TableCell>
                <TableCell sx={{ fontWeight: 'medium' }}>{member.name}</TableCell>
                <TableCell>{member.role}</TableCell>
                <TableCell>{member.team_id}</TableCell>
                <TableCell>{member.manager_id}</TableCell>
              </TableRow>
            ))}
            {filteredMembers.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3, color: 'text.secondary' }}>No members found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold' }}>Add New Member</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField label="Name" fullWidth value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
          <TextField label="Role (e.g. Employee, Director)" fullWidth value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} />
          <TextField label="Team ID" type="number" fullWidth value={formData.team_id} onChange={e => setFormData({ ...formData, team_id: e.target.value })} />
          <TextField label="Manager ID (Optional)" type="number" fullWidth value={formData.manager_id} onChange={e => setFormData({ ...formData, manager_id: e.target.value })} />
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setOpen(false)} color="inherit">Cancel</Button>
          <Button onClick={handleAdd} variant="contained" color="primary">Submit</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
