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
    localStorage.clear();
    navigate('/login');
  };

  const navItems = [
    { text: 'Analytics', path: '/', icon: <DashboardIcon /> },
    { text: 'Teams', path: '/teams', icon: <GroupsIcon /> },
    { text: 'Members', path: '/members', icon: <PersonIcon /> },
    { text: 'Achievements', path: '/achievements', icon: <EmojiEventsIcon /> },
  ];

  const role = localStorage.getItem('role') || 'User';
  const username = localStorage.getItem('username') || 'Active Session';

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
            background: 'rgba(15, 23, 42, 0.9)',
            backdropFilter: 'blur(20px)',
            borderRight: '1px solid var(--glass-border)',
            color: 'white',
          },
        }}
        anchor="left"
      >
        <Box sx={{ p: 4, mb: 4 }}>
          <Typography variant="h5" sx={{ 
            fontWeight: 900, 
            letterSpacing: '-1.5px',
            background: 'var(--primary-gradient)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            ACME CORE
          </Typography>
          <Typography variant="caption" sx={{ color: 'var(--text-secondary)', fontWeight: 700, tracking: 1 }}>
            INTELLIGENCE PORTAL v1.0
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
                    borderRadius: '16px',
                    py: 1.5,
                    background: active ? 'var(--primary-gradient)' : 'transparent',
                    boxShadow: active ? '0 4px 15px rgba(99, 102, 241, 0.3)' : 'none',
                    '&:hover': {
                      background: active ? 'var(--primary-gradient)' : 'rgba(255,255,255,0.05)',
                    },
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  <ListItemIcon sx={{ color: active ? 'white' : 'var(--text-secondary)', minWidth: 40 }}>
                    {React.cloneElement(item.icon, { fontSize: 'small' })}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    primaryTypographyProps={{ 
                      fontWeight: active ? 800 : 500,
                      fontSize: '0.9rem',
                      letterSpacing: '0.3px'
                    }} 
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        <Box sx={{ mt: 'auto', p: 3, mb: 2 }}>
          <Paper className="glass-panel" sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, mb: 3, background: 'rgba(255,255,255,0.02)' }}>
            <Avatar sx={{ background: 'var(--secondary-gradient)', width: 32, height: 32, fontSize: '0.8rem', fontWeight: 800 }}>
              {role[0].toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 800, fontSize: '0.85rem' }}>{role}</Typography>
              <Typography variant="caption" sx={{ color: 'var(--text-secondary)', display: 'block' }}>{username}</Typography>
            </Box>
          </Paper>
          <Button 
            fullWidth 
            variant="outlined" 
            color="inherit"
            startIcon={<LogoutIcon sx={{ fontSize: '1rem' }} />}
            onClick={handleLogout}
            sx={{ 
              borderRadius: '16px', 
              py: 1.2,
              textTransform: 'none',
              fontWeight: 700,
              borderColor: 'var(--glass-border)',
              '&:hover': { background: 'rgba(244, 63, 94, 0.1)', borderColor: 'var(--accent-color)', color: 'var(--accent-color)' }
            }}
          >
            System Exit
          </Button>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 4, position: 'relative' }}>
          {/* Subtle background glow */}
          <Box sx={{ 
            position: 'absolute', 
            top: '10%', 
            right: '10%', 
            width: '300px', 
            height: '300px', 
            background: 'var(--primary-gradient)', 
            filter: 'blur(150px)', 
            opacity: 0.1,
            zIndex: -1 
          }} />
        {children}
      </Box>
    </Box>
  );
}
