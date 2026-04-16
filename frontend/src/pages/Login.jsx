import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Container, Paper, Alert, InputAdornment, IconButton } from '@mui/material';
import { apiCall } from '../api';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await apiCall('/auth-service/login', {
        method: 'POST',
        body: JSON.stringify({ username, password })
      });
      // 💎 Store both role and username for the UI
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role || 'Admin');
      localStorage.setItem('username', username);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'var(--bg-gradient)',
      p: 2
    }}>
      <Container maxWidth="xs">
        <Paper className="glass-panel" sx={{ 
          p: 5, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <Box sx={{ 
            p: 2, 
            borderRadius: '50%', 
            background: 'var(--primary-gradient)',
            mb: 3,
            boxShadow: '0 0 30px rgba(168, 85, 247, 0.4)'
          }}>
            <LockOutlinedIcon sx={{ color: 'white', fontSize: 32 }} />
          </Box>
          
          <Typography variant="h4" sx={{ mb: 1, fontWeight: 900 }}>ACME Core</Typography>
          <Typography sx={{ color: 'var(--text-secondary)', mb: 4, textAlign: 'center' }}>
            Initialize biometric credentials to access the strategic layer.
          </Typography>

          {error && <Alert severity="error" sx={{ width: '100%', mb: 3, borderRadius: '12px', background: 'rgba(244, 63, 94, 0.1)', color: '#fb7185', border: '1px solid rgba(244, 63, 94, 0.2)' }}>{error}</Alert>}

          <Box component="form" onSubmit={handleLogin} sx={{ width: '100%' }}>
            <TextField
              margin="normal" required fullWidth 
              placeholder="Username"
              autoFocus value={username} onChange={e => setUsername(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start"><PersonOutlineIcon sx={{ color: 'var(--text-secondary)' }} /></InputAdornment>,
                sx: { 
                    color: 'white', 
                    bgcolor: 'rgba(255,255,255,0.03)', 
                    borderRadius: '16px',
                    '& fieldset': { borderColor: 'var(--glass-border)' },
                }
              }}
            />
            <TextField
              margin="normal" required fullWidth 
              placeholder="Password"
              type={showPassword ? 'text' : 'password'}
              value={password} onChange={e => setPassword(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start"><LockOutlinedIcon sx={{ color: 'var(--text-secondary)' }} /></InputAdornment>,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} sx={{ color: 'var(--text-secondary)' }}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
                sx: { 
                    color: 'white', 
                    bgcolor: 'rgba(255,255,255,0.03)', 
                    borderRadius: '16px',
                    '& fieldset': { borderColor: 'var(--glass-border)' },
                }
              }}
            />
            
            <Button 
                type="submit" 
                fullWidth 
                variant="contained" 
                disabled={loading}
                sx={{ 
                    mt: 4, 
                    mb: 2, 
                    py: 1.8, 
                    borderRadius: '16px', 
                    background: 'var(--primary-gradient)',
                    fontWeight: 700,
                    fontSize: '1rem',
                    boxShadow: '0 10px 20px rgba(99, 102, 241, 0.3)',
                    '&:hover': { transform: 'scale(1.02)' }
                }}
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </Button>
            
            <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Typography variant="caption" sx={{ color: 'var(--text-secondary)' }}>
                    Authorized Personnel Only — Section 8 Enforcement Active
                </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
