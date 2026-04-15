import React, { useEffect, useState } from 'react';
import { Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { apiCall } from '../api';

export default function Achievements() {
  const [achievements, setAchievements] = useState([]);
  const [filter, setFilter] = useState('');
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', month: '', team_id: '' });
  
  const fetchAchievements = () => apiCall('/achievement-service/achievements').then(setAchievements).catch(console.error);

  useEffect(() => {
    fetchAchievements();
  }, []);

  const handleAdd = async () => {
    try {
      await apiCall('/achievement-service/achievements', {
        method: 'POST',
        body: JSON.stringify({ 
          ...formData, 
          team_id: formData.team_id ? Number(formData.team_id) : null 
        })
      });
      setOpen(false);
      setFormData({ title: '', description: '', month: '', team_id: '' });
      fetchAchievements();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredAchievements = achievements.filter(acc => acc.title?.toLowerCase().includes(filter.toLowerCase()));

  return (
    <Box sx={{ maxWidth: '1200px', margin: 'auto', p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" color="primary.main">
          Achievements
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField 
            size="small" 
            placeholder="Filter achievements..." 
            variant="outlined" 
            value={filter} 
            onChange={e => setFilter(e.target.value)}
            sx={{ bgcolor: 'background.paper', borderRadius: 1 }}
          />
          <Button variant="contained" color="primary" onClick={() => setOpen(true)} sx={{ borderRadius: 2, textTransform: 'none', px: 3 }}>
            + Add Achievement
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: 'primary.main' }}>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Team ID</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Title</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Description</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Month</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAchievements.map((acc, index) => (
              <TableRow key={acc.id} hover sx={{ bgcolor: index % 2 === 0 ? 'grey.50' : 'white' }}>
                <TableCell>{acc.id}</TableCell>
                <TableCell>{acc.team_id}</TableCell>
                <TableCell sx={{ fontWeight: 'medium' }}>{acc.title}</TableCell>
                <TableCell>{acc.description}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{acc.month}</TableCell>
              </TableRow>
            ))}
            {filteredAchievements.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3, color: 'text.secondary' }}>No achievements found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold' }}>Add New Achievement</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField label="Title" fullWidth value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
          <TextField label="Description" fullWidth multiline rows={3} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
          <TextField label="Month (e.g. 2026-04)" fullWidth value={formData.month} onChange={e => setFormData({ ...formData, month: e.target.value })} />
          <TextField label="Team ID" type="number" fullWidth value={formData.team_id} onChange={e => setFormData({ ...formData, team_id: e.target.value })} />
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setOpen(false)} color="inherit">Cancel</Button>
          <Button onClick={handleAdd} variant="contained" color="primary">Submit</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
