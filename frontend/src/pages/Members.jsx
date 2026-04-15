import React, { useEffect, useState } from 'react';
import { Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Chip, Avatar, Alert, Snackbar } from '@mui/material';
import { apiCall } from '../api';
import AddIcon from '@mui/icons-material/Add';
import WorkIcon from '@mui/icons-material/Work';

export default function Members() {
  const [members, setMembers] = useState([]);
  const [filter, setFilter] = useState('');
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', role: '', team_id: '', manager_id: '' });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const fetchMembers = () => apiCall('/member-service').then(setMembers).catch(err => setError(err.message));

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleAdd = async () => {
    try {
      const result = await apiCall('/member-service', {
        method: 'POST',
        body: JSON.stringify({ 
          ...formData, 
          team_id: formData.team_id ? Number(formData.team_id) : null,
          manager_id: formData.manager_id ? Number(formData.manager_id) : null 
        })
      });
      setOpen(false);
      setFormData({ name: '', role: '', team_id: '', manager_id: '' });
      setSuccess(`Onboarding Successful: ${formData.name} (Assigned ID #${result.id})`);
      fetchMembers();
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredMembers = Array.isArray(members) ? members.filter(m => m.name?.toLowerCase().includes(filter.toLowerCase()) || m.role?.toLowerCase().includes(filter.toLowerCase())) : [];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 5 }}>
        <Box>
          <Typography variant="h3" sx={{ mb: 1 }}>Personnel Registry</Typography>
          <Typography sx={{ color: 'var(--text-secondary)' }}>Full institutional roster of strategic and operational human capital.</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField 
            size="small" 
            placeholder="Search roster..." 
            value={filter} 
            onChange={e => setFilter(e.target.value)}
            sx={{ '& .MuiOutlinedInput-root': { color: 'white', bgcolor: 'rgba(255,255,255,0.05)', borderRadius: '12px', '& fieldset': { borderColor: 'var(--glass-border)' } } }}
          />
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => setOpen(true)} 
            sx={{ borderRadius: '12px', background: 'var(--secondary-gradient)', px: 3 }}
          >
            Onboard Member
          </Button>
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: '12px', background: 'rgba(244, 63, 94, 0.1)', color: '#fb7185', border: '1px solid rgba(244, 63, 94, 0.2)' }}>{error}</Alert>}

      <TableContainer className="glass-panel" component={Paper} sx={{ border: 'none' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: 'var(--text-secondary)', fontWeight: 700 }}>MEMBER</TableCell>
              <TableCell sx={{ color: 'var(--text-secondary)', fontWeight: 700 }}>DESIGNATION</TableCell>
              <TableCell sx={{ color: 'var(--text-secondary)', fontWeight: 700 }}>UNIT ALLOCATION</TableCell>
              <TableCell sx={{ color: 'var(--text-secondary)', fontWeight: 700 }}>MANAGEMENT CHAIN</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredMembers.map((member) => (
              <TableRow key={member.id} sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' } }}>
                <TableCell sx={{ borderBottom: '1px solid var(--glass-border)', py: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ background: 'var(--primary-gradient)', fontSize: '0.8rem' }}>{member.name[0]}</Avatar>
                    <Box>
                      <Typography fontWeight={700} color="white">{member.name}</Typography>
                      <Typography variant="caption" color="var(--text-secondary)">ID: #{member.id}</Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell sx={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <Chip 
                    label={member.role} 
                    size="small"
                    sx={{ bgcolor: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.2)', fontWeight: 700 }} 
                  />
                </TableCell>
                <TableCell sx={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WorkIcon sx={{ color: 'var(--text-secondary)', fontSize: '14px' }} />
                    <Typography variant="body2" color="white" fontWeight={500}>Team {member.team_id}</Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{ borderBottom: '1px solid var(--glass-border)' }}>
                  {member.manager_id ? (
                    <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                      Managed by <span style={{ color: '#2dd4bf' }}>#{member.manager_id}</span>
                    </Typography>
                  ) : (
                    <Typography variant="caption" sx={{ color: '#fbbf24', fontWeight: 600 }}>INDEPENDENT</Typography>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar open={!!success} autoHideDuration={6000} onClose={() => setSuccess(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" sx={{ width: '100%', borderRadius: '12px', background: 'var(--secondary-gradient)', color: 'white', fontWeight: 700 }}>
          {success}
        </Alert>
      </Snackbar>

      <Dialog 
        open={open} 
        onClose={() => setOpen(false)} 
        maxWidth="xs" 
        fullWidth
        PaperProps={{ sx: { background: '#0f172a', border: '1px solid var(--glass-border)', borderRadius: '24px', p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: 'white', textAlign: 'center', pt: 3 }}>Member Onboarding</DialogTitle>
        <DialogContent sx={{ mt: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, py: 2 }}>
            <TextField label="Full Name" fullWidth value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} 
              InputLabelProps={{ sx: { color: 'var(--text-secondary)' } }}
              sx={{ '& .MuiOutlinedInput-root': { color: 'white', '& fieldset': { borderColor: 'var(--glass-border)' } } }} />
            <TextField label="Operational Role" fullWidth value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}
              InputLabelProps={{ sx: { color: 'var(--text-secondary)' } }}
              sx={{ '& .MuiOutlinedInput-root': { color: 'white', '& fieldset': { borderColor: 'var(--glass-border)' } } }} />
            <TextField label="Unit ID" type="number" fullWidth value={formData.team_id} onChange={e => setFormData({ ...formData, team_id: e.target.value })}
              InputLabelProps={{ sx: { color: 'var(--text-secondary)' } }}
              sx={{ '& .MuiOutlinedInput-root': { color: 'white', '& fieldset': { borderColor: 'var(--glass-border)' } } }} />
            <TextField label="Manager Assignment (ID)" type="number" fullWidth value={formData.manager_id} onChange={e => setFormData({ ...formData, manager_id: e.target.value })}
              InputLabelProps={{ sx: { color: 'var(--text-secondary)' } }}
              sx={{ '& .MuiOutlinedInput-root': { color: 'white', '& fieldset': { borderColor: 'var(--glass-border)' } } }} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 4, pt: 1 }}>
          <Button onClick={() => setOpen(false)} sx={{ color: 'var(--text-secondary)' }}>Abort</Button>
          <Button onClick={handleAdd} variant="contained" sx={{ borderRadius: '12px', background: 'var(--secondary-gradient)', px: 4, fontWeight: 700 }}>Verify & Enroll</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
