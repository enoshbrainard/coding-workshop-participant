import React, { useEffect, useState } from 'react';
import { Typography, Grid, Paper, Box, CircularProgress, Card, CardContent } from '@mui/material';
import { apiCall } from '../api';

export default function Dashboard() {
  const [data, setData] = useState({ notColocated: [], nonDirectStaff: [], highNonDirectTeams: [], orgLeaderTeams: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const [notColocated, nonDirectStaff, highNonDirectTeams, orgLeaderTeams] = await Promise.all([
          apiCall('/teams/analytics/not-colocated'),
          apiCall('/members/analytics/non-direct-staff'),
          apiCall('/members/analytics/high-non-direct-teams'),
          apiCall('/members/analytics/org-leader-teams')
        ]);
        setData({ notColocated, nonDirectStaff, highNonDirectTeams, orgLeaderTeams });
      } catch (err) {
        console.error("Failed to fetch analytics", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>Analytics Dashboard</Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
             <CardContent>
               <Typography variant="h6">Leaders Not Co-located</Typography>
               {data.notColocated.map((item, i) => (
                 <Typography key={i} variant="body2" sx={{ mt: 1 }}>
                   {item.leader_name} resides in {item.leader_location} but leads {item.team_name} in {item.team_location}.
                 </Typography>
               ))}
               {data.notColocated.length === 0 && <Typography variant="body2">None found.</Typography>}
             </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
             <CardContent>
               <Typography variant="h6">Non-Direct Staff</Typography>
               <Typography variant="body2" color="text.secondary">Members not reporting directly to team leader:</Typography>
               {data.nonDirectStaff.map((item, i) => (
                 <Typography key={i} variant="body2" sx={{ mt: 1 }}>
                   {item.name} in {item.team_name}
                 </Typography>
               ))}
             </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
             <CardContent>
               <Typography variant="h6">&gt;20% Non-Direct Staff Teams</Typography>
               {data.highNonDirectTeams.map((item, i) => (
                 <Typography key={i} variant="body2" sx={{ mt: 1 }}>
                   Team: {item.name}
                 </Typography>
               ))}
               {data.highNonDirectTeams.length === 0 && <Typography variant="body2">None found.</Typography>}
             </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
             <CardContent>
               <Typography variant="h6">Teams Reporting to Org Leader</Typography>
               {data.orgLeaderTeams.map((item, i) => (
                 <Typography key={i} variant="body2" sx={{ mt: 1 }}>
                   {item.team_name} (Led by {item.leader_name})
                 </Typography>
               ))}
             </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
