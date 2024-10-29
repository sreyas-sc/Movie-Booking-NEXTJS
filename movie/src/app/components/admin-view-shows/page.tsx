'use client'
import React, { useEffect, useState } from 'react';
import { deleteShow, getAllShows } from '@/app/api-helpers/api-helpers';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Container,
  Grid,
  Snackbar,
  Typography,
  CircularProgress
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  DeleteOutline as DeleteIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';

interface Show {
  _id: string;
  theaterId: { name: string; location: string };
  movieId: { 
    title: string; 
    posterUrl?: string;
    _id: string;
  };
  dates: Date[];
  times: string[];
}

interface GroupedShows {
  [movieId: string]: {
    movieTitle: string;
    posterUrl: string;
    shows: Show[];
  }
}

const AdminShowsPage = () => {
  // const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [groupedShows, setGroupedShows] = useState<GroupedShows>({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchShows();
  }, []);

  const fetchShows = async () => {
    try {
      setLoading(true);
      const response = await getAllShows();
      // setShows(response);
      
      // Group shows by movie
      const grouped = response.reduce((acc: GroupedShows, show: Show) => {
        const movieId = show.movieId._id;
        if (!acc[movieId]) {
          acc[movieId] = {
            movieTitle: show.movieId.title,
            posterUrl: show.movieId.posterUrl 
              ? `https://movie-booking-nextjs.onrender.com/uploads/${show.movieId.posterUrl.split('\\').pop()}` 
              : '/default-image.jpg',
            shows: []
          };
        }
        acc[movieId].shows.push(show);
        return acc;
      }, {});
      
      setGroupedShows(grouped);
      setError(null);
    } catch (err) {
      setError('Failed to fetch shows. Please try again later.');
      console.error('Error fetching shows:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (showId: string) => {
    try {
      await deleteShow(showId);
      
      // Update both states
      // setShows(prev => prev.filter(show => show._id !== showId))
      
      // Update groupedShows
      const updatedGrouped = { ...groupedShows };
      Object.keys(updatedGrouped).forEach(movieId => {
        updatedGrouped[movieId].shows = updatedGrouped[movieId].shows.filter(
          show => show._id !== showId
        );
        if (updatedGrouped[movieId].shows.length === 0) {
          delete updatedGrouped[movieId];
        }
      });
      setGroupedShows(updatedGrouped);
      
      setSnackbar({
        open: true,
        message: 'Show deleted successfully',
        severity: 'success'
      });
      return true;
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to delete show',
        severity: 'error'
      });
      console.error('Error deleting show:', error);
      return false;
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box m={4}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Movie Shows Management
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Manage all movie shows across different theaters
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        {Object.entries(groupedShows).map(([movieId, movieData]) => (
          <Accordion key={movieId} sx={{ mb: 2 }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{ 
                '& .MuiAccordionSummary-content': {
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2
                }
              }}
            >
              <Box
                component="img"
                src={movieData.posterUrl}
                alt={movieData.movieTitle}
                sx={{ width: 60, height: 60, borderRadius: 1, objectFit: 'cover' }}
              />
              <Box>
                <Typography variant="h6">{movieData.movieTitle}</Typography>
                <Badge 
                  badgeContent={movieData.shows.length} 
                  color="primary"
                  sx={{ '& .MuiBadge-badge': { position: 'relative', transform: 'none', ml: 1 } }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Shows
                  </Typography>
                </Badge>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                {movieData.shows.map((show) => (
                  <Grid item xs={12} sm={6} md={4} key={show._id}>
                    <Card sx={{ 
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 6
                      }
                    }}>
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" gutterBottom>
                          {show.theaterId.name}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <LocationIcon fontSize="small" sx={{ mr: 1 }} />
                          <Typography variant="body2">
                            {show.theaterId.location}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <CalendarIcon fontSize="small" sx={{ mr: 1 }} />
                          <Typography variant="body2">
                            {formatDate(show.dates[0])}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                          <TimeIcon fontSize="small" />
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {show.times.map((time) => (
                              <Box
                                key={time}
                                sx={{
                                  bgcolor: 'primary.main',
                                  color: 'white',
                                  px: 1,
                                  py: 0.5,
                                  borderRadius: 1,
                                  fontSize: '0.75rem'
                                }}
                              >
                                {time}
                              </Box>
                            ))}
                          </Box>
                        </Box>
                      </CardContent>
                      
                      <CardActions>
                        <Button
                          fullWidth
                          variant="contained"
                          color="error"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleDelete(show._id)}
                        >
                          Delete Show
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity as 'success' | 'error'} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminShowsPage;