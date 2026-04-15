import React, { useEffect, useState } from 'react';
import { Typography, Grid, Box, CircularProgress, Card, CardContent } from '@mui/material';
import { apiCall } from '../api';

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
          notColocated: notColocated || [],
          nonDirectStaff: nonDirectStaff || [],
          highNonDirectTeams: highNonDirectTeams || [],
          orgLeaderTeams: orgLeaderTeams || []
        });

      } catch (err) {
        console.error("❌ Failed to fetch analytics", err);

        // prevent crash → fallback empty data
        setData({
          notColocated: [],
          nonDirectStaff: [],
          highNonDirectTeams: [],
          orgLeaderTeams: []
        });

      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        Analytics Dashboard
      </Typography>

      <Grid container spacing={3}>

        {/* NOT COLOCATED */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Leaders Not Co-located</Typography>

              {data.notColocated.length === 0 ? (
                <Typography variant="body2">None found.</Typography>
              ) : (
                data.notColocated.map((item, i) => (
                  <Typography key={i} variant="body2" sx={{ mt: 1 }}>
                    {item.leader_name} in {item.leader_location} → leads {item.team_name} in {item.team_location}
                  </Typography>
                ))
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* NON DIRECT STAFF */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Non-Direct Staff</Typography>

              {data.nonDirectStaff.length === 0 ? (
                <Typography variant="body2">None found.</Typography>
              ) : (
                data.nonDirectStaff.map((item, i) => (
                  <Typography key={i} variant="body2" sx={{ mt: 1 }}>
                    {item.name} in {item.team_name}
                  </Typography>
                ))
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* HIGH NON DIRECT */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">&gt;20% Non-Direct Staff Teams</Typography>

              {data.highNonDirectTeams.length === 0 ? (
                <Typography variant="body2">None found.</Typography>
              ) : (
                data.highNonDirectTeams.map((item, i) => (
                  <Typography key={i} variant="body2" sx={{ mt: 1 }}>
                    Team: {item.name}
                  </Typography>
                ))
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* ORG LEADER */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Teams Reporting to Org Leader</Typography>

              {data.orgLeaderTeams.length === 0 ? (
                <Typography variant="body2">None found.</Typography>
              ) : (
                data.orgLeaderTeams.map((item, i) => (
                  <Typography key={i} variant="body2" sx={{ mt: 1 }}>
                    {item.team_name} (Leader: {item.leader_name})
                  </Typography>
                ))
              )}
            </CardContent>
          </Card>
        </Grid>

      </Grid>
    </Box>
  );
}