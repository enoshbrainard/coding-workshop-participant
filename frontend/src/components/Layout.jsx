import React from 'react';
import { Box, Drawer, List, Typography, ListItem, ListItemButton, ListItemIcon, ListItemText, Button, Avatar } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonIcon from '@mui/icons-material/Person';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LogoutIcon from '@mui/icons-material/Logout';

const drawerWidth = 280;

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const navItems = [
    { text: 'Analytics', path: '/', icon: <DashboardIcon /> },
    { text: 'Teams', path: '/teams', icon: <GroupsIcon /> },
    { text: 'Members', path: '/members', icon: <PersonIcon /> },
    { text: 'Achievements', path: '/achievements', icon: <EmojiEventsIcon /> },
  ];

  const role = localStorage.getItem('role') || 'Guest';

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-gradient)' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(10px)',
            borderRight: '1px solid var(--glass-border)',
            color: 'white',
          },
        }}
        anchor="left"
      >
        <Box sx={{ p: 4, mb: 4 }}>
          <Typography variant="h5" sx={{ 
            fontWeight: 900, 
            letterSpacing: '-1px',
            background: 'var(--primary-gradient)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            ACME CORE
          </Typography>
          <Typography variant="caption" sx={{ color: 'var(--text-secondary)', fontWeight: 600 }}>
            ORG TRANSFORMATION PORTAL
          </Typography>
        </Box>

        <List sx={{ px: 2 }}>
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                <ListItemButton 
                  onClick={() => navigate(item.path)}
                  sx={{
                    borderRadius: '12px',
                    background: active ? 'var(--primary-gradient)' : 'transparent',
                    '&:hover': {
                      background: active ? 'var(--primary-gradient)' : 'rgba(255,255,255,0.05)',
                    },
                    transition: 'all 0.2s'
                  }}
                >
                  <ListItemIcon sx={{ color: active ? 'white' : 'var(--text-secondary)', minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    primaryTypographyProps={{ 
                      fontWeight: active ? 700 : 500,
                      fontSize: '0.95rem'
                    }} 
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        <Box sx={{ mt: 'auto', p: 3, mb: 2 }}>
          <Box className="glass-panel" sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Avatar sx={{ background: 'var(--secondary-gradient)' }}>
              {role[0]}
            </Avatar>
            <Box>
              <Typography variant="body2" fontWeight={700}>{role}</Typography>
              <Typography variant="caption" color="var(--text-secondary)">Verified Session</Typography>
            </Box>
          </Box>
          <Button 
            fullWidth 
            variant="outlined" 
            color="inherit"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{ 
              borderRadius: '12px', 
              borderColor: 'var(--glass-border)',
              '&:hover': { background: 'rgba(244, 63, 94, 0.1)', borderColor: 'var(--accent-color)', color: 'var(--accent-color)' }
            }}
          >
            Logout
          </Button>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
        {children}
      </Box>
    </Box>
  );
}
