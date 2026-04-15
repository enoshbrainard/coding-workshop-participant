import React, { useEffect, useState } from 'react';
import { Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Box, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Chip, IconButton, Tooltip, Alert, Snackbar } from '@mui/material';
import { apiCall } from '../api';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import MapIcon from '@mui/icons-material/Map';
import LabelIcon from '@mui/icons-material/Label';

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [filter, setFilter] = useState('');
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', location: '', leader_id: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const fetchTeams = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiCall('/team-service');
      setTeams(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleAdd = async () => {
    setError(null);
    try {
      const result = await apiCall('/team-service', {
        method: 'POST',
        body: JSON.stringify({ ...formData, leader_id: formData.leader_id ? Number(formData.leader_id) : null })
      });
      setOpen(false);
      setFormData({ name: '', location: '', leader_id: '' });
      // 💎 Show the generated ID to the user
      setSuccess(`Strategic Unit #${result.id || 'NEW'} Successfully Deployed: ${formData.name}`);
      fetchTeams();
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredTeams = Array.isArray(teams) ? teams.filter(t => t.name?.toLowerCase().includes(filter.toLowerCase()) || String(t.id).includes(filter)) : [];

  return (
    <Box sx={{ p: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 5 }}>
        <Box>
          <Typography variant="h3" sx={{ mb: 1 }}>Team Units</Typography>
          <Typography sx={{ color: 'var(--text-secondary)' }}>Manage and monitor organizational sub-divisions across all global regions.</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField 
            size="small" 
            placeholder="Search teams..." 
            value={filter} 
            onChange={e => setFilter(e.target.value)}
            sx={{ 
              '& .MuiOutlinedInput-root': {
                color: 'white',
                bgcolor: 'rgba(255,255,255,0.05)',
                borderRadius: '12px',
                '& fieldset': { borderColor: 'var(--glass-border)' },
              }
            }}
          />
          <Tooltip title="Refresh Data">
            <IconButton onClick={fetchTeams} sx={{ color: 'white', border: '1px solid var(--glass-border)', borderRadius: '12px' }}>
              <RefreshIcon sx={{ animation: loading ? 'spin 1.5s linear infinite' : 'none' }} />
            </IconButton>
          </Tooltip>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => setOpen(true)} 
            sx={{ 
              borderRadius: '12px', 
              textTransform: 'none', 
              px: 3, 
              background: 'var(--primary-gradient)',
              boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)'
            }}
          >
            Deploy New Team
          </Button>
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: '12px', background: 'rgba(244, 63, 94, 0.1)', color: '#fb7185', border: '1px solid rgba(244, 63, 94, 0.2)' }}>{error}</Alert>}

      <TableContainer className="glass-panel" component={Paper} sx={{ border: 'none' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: 'var(--text-secondary)', fontWeight: 700, borderBottom: '1px solid var(--glass-border)' }}>ID</TableCell>
              <TableCell sx={{ color: 'var(--text-secondary)', fontWeight: 700, borderBottom: '1px solid var(--glass-border)' }}>TEAM NAME</TableCell>
              <TableCell sx={{ color: 'var(--text-secondary)', fontWeight: 700, borderBottom: '1px solid var(--glass-border)' }}>LOCATION</TableCell>
              <TableCell sx={{ color: 'var(--text-secondary)', fontWeight: 700, borderBottom: '1px solid var(--glass-border)' }}>LEADERSHIP UNIT</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTeams.map((team) => (
              <TableRow key={team.id} sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' } }}>
                <TableCell sx={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
                  #{team.id}
                </TableCell>
                <TableCell sx={{ borderBottom: '1px solid var(--glass-border)', py: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <LabelIcon sx={{ color: '#4f46e5' }} fontSize="small" />
                    <Typography fontWeight={700} color="white">{team.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <Chip 
                    icon={<MapIcon style={{ fontSize: '14px', color: 'inherit' }} />} 
                    label={team.location} 
                    size="small"
                    sx={{ bgcolor: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: '1px solid var(--glass-border)', fontWeight: 600 }}
                  />
                </TableCell>
                <TableCell sx={{ borderBottom: '1px solid var(--glass-border)' }}>
                  {team.leader_id ? (
                    <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                      Manager ID: <span style={{ color: '#a855f7', fontWeight: 700 }}>{team.leader_id}</span>
                    </Typography>
                  ) : (
                    <Typography variant="caption" sx={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>Unassigned</Typography>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {filteredTeams.length === 0 && !loading && (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 10, border: 'none' }}>
                  <Typography sx={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                    No team divisions found matching the current trajectory.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
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
        <DialogTitle sx={{ fontWeight: 800, color: 'white', textAlign: 'center', pt: 3 }}>Initialize Team</DialogTitle>
        <DialogContent sx={{ mt: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, py: 2 }}>
            <TextField 
              label="Codename / Name" 
              fullWidth 
              value={formData.name} 
              onChange={e => setFormData({ ...formData, name: e.target.value })} 
              InputLabelProps={{ sx: { color: 'var(--text-secondary)' } }}
              sx={{ '& .MuiOutlinedInput-root': { color: 'white', '& fieldset': { borderColor: 'var(--glass-border)' } } }}
            />
            <TextField 
              label="Regional Location" 
              fullWidth 
              value={formData.location} 
              onChange={e => setFormData({ ...formData, location: e.target.value })}
              InputLabelProps={{ sx: { color: 'var(--text-secondary)' } }}
              sx={{ '& .MuiOutlinedInput-root': { color: 'white', '& fieldset': { borderColor: 'var(--glass-border)' } } }}
            />
            <TextField 
              label="Leader Assignment (ID)" 
              type="number" 
              fullWidth 
              value={formData.leader_id} 
              onChange={e => setFormData({ ...formData, leader_id: e.target.value })}
              InputLabelProps={{ sx: { color: 'var(--text-secondary)' } }}
              sx={{ '& .MuiOutlinedInput-root': { color: 'white', '& fieldset': { borderColor: 'var(--glass-border)' } } }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 4, pt: 1 }}>
          <Button onClick={() => setOpen(false)} sx={{ color: 'var(--text-secondary)' }}>Cancel</Button>
          <Button 
            onClick={handleAdd} 
            variant="contained" 
            sx={{ 
              borderRadius: '12px', 
              background: 'var(--primary-gradient)',
              fontWeight: 700,
              px: 4
            }}
          >
            Authenticate & Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
