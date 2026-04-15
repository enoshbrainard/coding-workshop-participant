import React, { useEffect, useState } from 'react';
import { Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Chip } from '@mui/material';
import { apiCall } from '../api';
import AddIcon from '@mui/icons-material/Add';
import StarsIcon from '@mui/icons-material/Stars';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

export default function Achievements() {
  const [achievements, setAchievements] = useState([]);
  const [filter, setFilter] = useState('');
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', month: '', team_id: '' });
  
  const fetchAchievements = () => apiCall('/achievement-service').then(setAchievements).catch(console.error);

  useEffect(() => {
    fetchAchievements();
  }, []);

  const handleAdd = async () => {
    try {
      await apiCall('/achievement-service', {
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

  const filteredAchievements = Array.isArray(achievements) ? achievements.filter(acc => acc.title?.toLowerCase().includes(filter.toLowerCase())) : [];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 5 }}>
        <Box>
          <Typography variant="h3" sx={{ mb: 1 }}>Milestones</Typography>
          <Typography sx={{ color: 'var(--text-secondary)' }}>Strategic achievements and key delivery milestones achieved by operational units.</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField 
            size="small" 
            placeholder="Search milestones..." 
            value={filter} 
            onChange={e => setFilter(e.target.value)}
            sx={{ '& .MuiOutlinedInput-root': { color: 'white', bgcolor: 'rgba(255,255,255,0.05)', borderRadius: '12px', '& fieldset': { borderColor: 'var(--glass-border)' } } }}
          />
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => setOpen(true)} 
            sx={{ borderRadius: '12px', background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)', px: 3, color: '#451a03', fontWeight: 700 }}
          >
            Record Achievement
          </Button>
        </Box>
      </Box>

      <TableContainer className="glass-panel" component={Paper} sx={{ border: 'none' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: 'var(--text-secondary)', fontWeight: 700 }}>ACHIEVEMENT</TableCell>
              <TableCell sx={{ color: 'var(--text-secondary)', fontWeight: 700 }}>UNIT</TableCell>
              <TableCell sx={{ color: 'var(--text-secondary)', fontWeight: 700 }}>TIMELINE</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAchievements.map((acc) => (
              <TableRow key={acc.id} sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' } }}>
                <TableCell sx={{ borderBottom: '1px solid var(--glass-border)', py: 3 }}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <StarsIcon sx={{ color: '#fbbf24', mt: 0.5 }} />
                    <Box>
                      <Typography fontWeight={700} color="white">{acc.title}</Typography>
                      <Typography variant="body2" color="var(--text-secondary)" sx={{ maxWidth: '500px' }}>{acc.description}</Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell sx={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <Chip 
                    label={`Unit #${acc.team_id}`} 
                    size="small"
                    sx={{ bgcolor: 'rgba(168, 85, 247, 0.1)', color: '#c084fc', border: '1px solid rgba(168, 85, 247, 0.2)', fontWeight: 700 }}
                  />
                </TableCell>
                <TableCell sx={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarTodayIcon sx={{ color: 'var(--text-secondary)', fontSize: '14px' }} />
                    <Typography variant="body2" color="white" fontWeight={600}>{acc.month}</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog 
        open={open} 
        onClose={() => setOpen(false)} 
        maxWidth="xs" 
        fullWidth
        PaperProps={{ sx: { background: '#0f172a', border: '1px solid var(--glass-border)', borderRadius: '24px', p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: 'white', textAlign: 'center', pt: 3 }}>Achievement Log</DialogTitle>
        <DialogContent sx={{ mt: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, py: 2 }}>
            <TextField label="Achievement Title" fullWidth value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} 
              InputLabelProps={{ sx: { color: 'var(--text-secondary)' } }}
              sx={{ '& .MuiOutlinedInput-root': { color: 'white', '& fieldset': { borderColor: 'var(--glass-border)' } } }} />
            <TextField label="Technical Description" fullWidth multiline rows={3} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
              InputLabelProps={{ sx: { color: 'var(--text-secondary)' } }}
              sx={{ '& .MuiOutlinedInput-root': { color: 'white', '& fieldset': { borderColor: 'var(--glass-border)' } } }} />
            <TextField label="Timeline (e.g. April 2026)" fullWidth value={formData.month} onChange={e => setFormData({ ...formData, month: e.target.value })}
              InputLabelProps={{ sx: { color: 'var(--text-secondary)' } }}
              sx={{ '& .MuiOutlinedInput-root': { color: 'white', '& fieldset': { borderColor: 'var(--glass-border)' } } }} />
            <TextField label="Assigned Unit ID" type="number" fullWidth value={formData.team_id} onChange={e => setFormData({ ...formData, team_id: e.target.value })}
              InputLabelProps={{ sx: { color: 'var(--text-secondary)' } }}
              sx={{ '& .MuiOutlinedInput-root': { color: 'white', '& fieldset': { borderColor: 'var(--glass-border)' } } }} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 4, pt: 1 }}>
          <Button onClick={() => setOpen(false)} sx={{ color: 'var(--text-secondary)' }}>Discard</Button>
          <Button onClick={handleAdd} variant="contained" sx={{ borderRadius: '12px', background: 'var(--primary-gradient)', px: 4, fontWeight: 700 }}>Log Event</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
