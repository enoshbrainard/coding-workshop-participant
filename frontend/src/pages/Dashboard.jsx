import React, { useEffect, useState } from 'react';
import { Typography, Grid, Box, CircularProgress, Paper, Container } from '@mui/material';
import { apiCall } from '../api';
import MapIcon from '@mui/icons-material/Map';
import GroupsIcon from '@mui/icons-material/Groups';
import FilterTiltShiftIcon from '@mui/icons-material/FilterTiltShift';
import AccountTreeIcon from '@mui/icons-material/AccountTree';

const AnalyticsCard = ({ title, icon: Icon, data, renderItem }) => (
  <Paper className="glass-panel" sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1.5 }}>
      <Box sx={{ 
        p: 1, 
        borderRadius: '12px', 
        background: 'var(--primary-gradient)',
        display: 'flex',
        color: 'white'
      }}>
        <Icon size="small" />
      </Box>
      <Typography variant="h6" sx={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '1.1rem' }}>
        {title}
      </Typography>
    </Box>
    
    <Box sx={{ flexGrow: 1, overflowY: 'auto', maxHeight: '300px' }}>
      {!data || data.length === 0 ? (
        <Typography sx={{ color: 'var(--text-secondary)', fontStyle: 'italic', textAlign: 'center', py: 4, fontSize: '0.9rem' }}>
          No records identified
        </Typography>
      ) : (
        data.map((item, i) => (
          <Box key={i} sx={{ 
            p: 1.5, 
            mb: 1.5, 
            borderRadius: '12px', 
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.05)',
            '&:hover': { background: 'rgba(255,255,255,0.05)', borderColor: 'var(--glass-border)' }
          }}>
            {renderItem(item)}
          </Box>
        ))
      )}
    </Box>
  </Paper>
);

export default function Dashboard() {
  const [data, setData] = useState({
    notColocated: [],
    nonDirectStaff: [],
    highNonDirectTeams: [],
    orgLeaderTeams: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const [
          notColocated,
          nonDirectStaff,
          highNonDirectTeams,
          orgLeaderTeams
        ] = await Promise.all([
          apiCall('/team-service/analytics/not-colocated'),
          apiCall('/member-service/analytics/non-direct-staff'),
          apiCall('/member-service/analytics/high-non-direct-teams'),
          apiCall('/member-service/analytics/org-leader-teams')
        ]);

        setData({
          notColocated: Array.isArray(notColocated) ? notColocated : [],
          nonDirectStaff: Array.isArray(nonDirectStaff) ? nonDirectStaff : [],
          highNonDirectTeams: Array.isArray(highNonDirectTeams) ? highNonDirectTeams : [],
          orgLeaderTeams: Array.isArray(orgLeaderTeams) ? orgLeaderTeams : []
        });

      } catch (err) {
        console.error("❌ Analytics Sync Errored", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress sx={{ color: '#a855f7' }} />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 2 }}>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h3" sx={{ mb: 1, fontSize: '2.5rem' }}>Intelligence Dashboard</Typography>
        <Typography sx={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '600px' }}>
          Real-time organizational insights and anomalies detected via our cross-service analysis engine.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6} lg={3}>
          <AnalyticsCard 
            title="Remote Management" 
            icon={MapIcon}
            data={data.notColocated}
            renderItem={(item) => (
              <>
                <Typography sx={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.95rem' }}>{item.leader_name}</Typography>
                <Typography variant="caption" sx={{ color: 'var(--text-secondary)', display: 'block', mt: 0.5 }}>
                  Located in <b>{item.leader_location}</b>
                </Typography>
                <Typography variant="caption" sx={{ color: 'var(--text-secondary)', opacity: 0.8 }}>
                  Leads <u>{item.team_name}</u> ({item.team_location})
                </Typography>
              </>
            )}
          />
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <AnalyticsCard 
            title="External Assignments" 
            icon={GroupsIcon}
            data={data.nonDirectStaff}
            renderItem={(item) => (
              <>
                <Typography sx={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.95rem' }}>{item.name}</Typography>
                <Typography variant="caption" sx={{ color: 'var(--text-secondary)', display: 'block', mt: 0.5 }}>
                  Functionally reports to: 
                </Typography>
                <Typography variant="caption" sx={{ color: '#3b82f6', fontWeight: 600 }}>
                  {item.team_name}
                </Typography>
              </>
            )}
          />
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <AnalyticsCard 
            title="Cross-Team Bloat" 
            icon={FilterTiltShiftIcon}
            data={data.highNonDirectTeams}
            renderItem={(item) => (
              <>
                <Typography sx={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.95rem' }}>{item.name}</Typography>
                <Typography variant="caption" sx={{ color: '#fb7185', fontWeight: 600, display: 'block', mt: 0.5 }}>
                  CRITICAL: High non-direct ratio
                </Typography>
              </>
            )}
          />
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <AnalyticsCard 
            title="Org Head Directs" 
            icon={AccountTreeIcon}
            data={data.orgLeaderTeams}
            renderItem={(item) => (
              <>
                <Typography sx={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.95rem' }}>{item.team_name}</Typography>
                <Typography variant="caption" sx={{ color: 'var(--text-secondary)', display: 'block', mt: 0.5 }}>
                  Direct reporting path verified
                </Typography>
                <Typography variant="caption" sx={{ color: 'var(--text-secondary)', opacity: 0.8 }}>
                  Lead: {item.leader_name}
                </Typography>
              </>
            )}
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 6 }}>
        <Paper className="glass-panel" sx={{ p: 3, background: 'rgba(15, 23, 42, 0.4)', border: '1px dashed var(--glass-border)' }}>
          <Grid container spacing={2} textAlign="center" alignItems="center">
            <Grid item xs={12} md={4}>
              <Typography variant="h3" sx={{ m: 0, fontSize: '3rem' }}>{data.notColocated.length + data.nonDirectStaff.length}</Typography>
              <Typography variant="overline" sx={{ color: 'var(--text-secondary)', tracking: 2 }}>Anomalies Syncing</Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ width: '2px', height: '60px', background: 'var(--glass-border)', mx: 'auto', display: { xs: 'none', md: 'block' } }} />
              <Typography variant="h4" sx={{ 
                m: 0, 
                background: 'var(--secondary-gradient)', 
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 900
              }}>
                OPERATIONAL
              </Typography>
              <Typography variant="overline" sx={{ color: 'var(--text-secondary)' }}>System Integrity</Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h3" sx={{ m: 0, color: '#2dd4bf', fontSize: '3rem' }}>{data.highNonDirectTeams.length}</Typography>
              <Typography variant="overline" sx={{ color: 'var(--text-secondary)' }}>Risk Segments</Typography>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
}