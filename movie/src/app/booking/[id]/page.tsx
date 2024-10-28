'use client';
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  Button,
  CardMedia,
  Container,
  Grid,
  Paper,
  Stack,
  CircularProgress
} from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { getMovieDetails, getAllShows } from '@/app/api-helpers/api-helpers.js';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StarIcon from '@mui/icons-material/Star';
import GroupIcon from '@mui/icons-material/Group';

interface Movie {
  releaseDate: string | number | Date;
  title: string;
  description?: string;
  posterUrl?: string;
  rating: number;
  cast: string;
}

interface Show {
  _id: string;
  movieId: {
    _id: string;
    title: string;
    posterUrl?: string;
  };
  theaterId: {
    _id: string;
    name: string;
    location: string;
    seatLayout: number[];
    showtimes: string[];
  };
  dates: string[];
  times: string[];
}

const Booking: React.FC = () => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [shows, setShows] = useState<Show[]>([]);
  const [groupedShows, setGroupedShows] = useState<{ [key: string]: Show[] }>({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTheater, setSelectedTheater] = useState<string | null>(null);
  const [selectedTimes, setSelectedTimes] = useState<{ [key: string]: string | null }>({});
  const [selectedTheaterSeatLayout, setSelectedTheaterSeatLayout] = useState<number[]>([]);
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const fetchedShows: Show[] = await getAllShows();
        setShows(fetchedShows || []);
      } catch (error) {
        console.error('Error fetching shows:', error);
      }
    };
    fetchShows();
  }, []);

  useEffect(() => {
    if (id) {
      getMovieDetails(id)
        .then((res) => {
          if (res && res.movie) {
            setMovie(res.movie);
          }
        })
        .catch(err => console.error('Error fetching movie details:', err));
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;

    const filteredShows = shows.filter(show => show.movieId?._id === id);
    const grouped = filteredShows.reduce((acc, show) => {
      const theaterKey = `${show.theaterId._id}-${show.theaterId.name}-${show.theaterId.location}`;
      if (!acc[theaterKey]) {
        acc[theaterKey] = [];
      }
      acc[theaterKey].push(show);
      return acc;
    }, {} as { [key: string]: Show[] });

    setGroupedShows(grouped);
  }, [shows, id]);

  const handleDateClick = (date: string, theaterKey: string) => {
    const isoDate = new Date(date).toISOString().split('T')[0];
    const selectedShows = groupedShows[theaterKey]?.filter(show =>
      show.dates.some(d => new Date(d).toISOString().split('T')[0] === isoDate)
    ) || [];

    if (selectedShows.length > 0) {
      setSelectedDate(date);
      setSelectedTheater(theaterKey);
      setSelectedTimes(prev => ({ ...prev, [theaterKey]: null }));
      setSelectedTheaterSeatLayout(selectedShows[0].theaterId.seatLayout);
    }
  };

  const handleTimeClick = (time: string, theaterKey: string) => {
    setSelectedTimes(prev => ({ ...prev, [theaterKey]: time }));
  };

  const handleProceedToBook = () => {
    if (selectedTheater && movie) {
      const movieId = Array.isArray(id) ? id[0] : id;
      localStorage.setItem('selectedMovie', movie.title);
      localStorage.setItem('selectedMoviePoster', movie.posterUrl || '');
      localStorage.setItem('selectedMovieId', movieId || '');
      localStorage.setItem('selectedDate', selectedDate || '');
      localStorage.setItem('selectedTheater', selectedTheater);
      localStorage.setItem('selectedTimes', JSON.stringify(selectedTimes));
      localStorage.setItem('seatLayout', JSON.stringify(selectedTheaterSeatLayout));
      router.push('/components/seat-selection');
    }
  };

  if (!movie) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" align="center" gutterBottom sx={{ 
        fontWeight: 'bold',
        mb: 4,
        color: 'primary.main'
      }}>
         {movie.title}
      </Typography>

      <Grid container spacing={4} sx={{ mb: 6 }}>
        {/* Movie Poster */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ 
            borderRadius: 2,
            overflow: 'hidden',
            height: '100%'
          }}>
            <CardMedia
              component="img"
              image={movie.posterUrl ? `https://movie-booking-nextjs.onrender.com/uploads/${movie.posterUrl.split('\\').pop()}` : '/placeholder.jpg'}
              alt={movie.title}
              sx={{ 
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </Paper>
        </Grid>

        {/* Movie Details */}
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ 
            height: '100%',
            borderRadius: 2,
            backgroundColor: 'background.paper'
          }}>
            <CardContent>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="h5" gutterBottom fontWeight="bold">
                    {movie.title}
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <StarIcon sx={{ color: 'warning.main' }} />
                    <Typography variant="subtitle1">
                      {movie.rating} IMDB Rating
                    </Typography>
                  </Box>
                </Box>

                <Typography variant="body1" color="text.secondary">
                  {movie.description}
                </Typography>

                <Stack spacing={2}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <CalendarTodayIcon color="primary" />
                    <Typography variant="body1">
                      Release Date: {new Date(movie.releaseDate).toLocaleDateString()}
                    </Typography>
                  </Box>

                  <Box display="flex" alignItems="center" gap={1}>
                    <GroupIcon color="primary" />
                    <Typography variant="body1">
                      Cast: {movie.cast}
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Theater Selection */}
      <Box sx={{ mb: 4 }}>
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          {Object.entries(groupedShows).map(([theaterKey, shows]) => (
            <Card key={theaterKey} sx={{ mb: 3, borderRadius: 2 }}>
              <CardContent>
                <Box mb={3}>
                  <Typography variant="h6" gutterBottom>
                    {theaterKey.split('-')[1]}
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                    <LocationOnIcon color="primary" fontSize="small" />
                    <Typography variant="body2" color="text.secondary">
                      {theaterKey.split('-')[2]}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Dates */}
                <Box mb={3}>
                  <Typography variant="subtitle2" gutterBottom>
                    Select Date
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {shows.flatMap(show => show.dates).map(date => {
                      const isPastDate = new Date(date) < new Date(); // Check if the date is in the past
                      return (
                        <Button
                          key={date}
                          variant={selectedDate === date && selectedTheater === theaterKey ? "contained" : "outlined"}
                          size="small"
                          onClick={() => handleDateClick(date, theaterKey)}
                          disabled={isPastDate} // Disable button for past dates
                          sx={{
                            mb: 1,
                            color: "rgba(248, 68, 100, 1)",
                            minWidth: '100px',
                            backgroundColor: isPastDate ? "lightgray" : "white", // Change color for past dates
                            borderColor: "rgba(248, 68, 100, 1)",
                            '&:hover': {
                              backgroundColor: isPastDate ? "lightgray" : "rgba(248, 68, 100, 0.9)",
                              color: isPastDate ? "black" : "white"
                            }
                          }}
                          startIcon={<CalendarTodayIcon />}
                        >
                          {new Date(date).toLocaleDateString()}
                        </Button>
                      );
                    })}
                  </Stack>
                </Box>

                {/* Times */}
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Select Showtime
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {(groupedShows[theaterKey]?.[0]?.times || []).map(time => (
                      <Button
                        key={time}
                        variant={selectedTimes[theaterKey] === time ? "contained" : "outlined"}
                        size="small"
                        onClick={() => handleTimeClick(time, theaterKey)}
                        sx={{
                          mb: 1,
                          color: "rgba(248, 68, 100, 1)",
                          minWidth: '100px',
                          backgroundColor: "white",
                          borderColor: "rgba(248, 68, 100, 1)",
                          '&:hover': {
                            backgroundColor: "rgba(248, 68, 100, 0.9)",
                            color: "black"
                          }
                        }}
                        startIcon={<AccessTimeIcon />}
                      >
                        {time}
                      </Button>
                    ))}
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Paper>
      </Box>

      {/* Proceed to Book */}
      <Box textAlign="center">
        <Button
          onClick={handleProceedToBook}
          variant="contained"
          color="primary"
          disabled={!selectedDate || !selectedTheater || !selectedTimes[selectedTheater]}
          sx={{
            py: 1.5,
            px: 4,
            fontWeight: "bold",
            fontSize: "1.2rem",
            backgroundColor: "rgba(248, 68, 100, 1)",
            color: "white",
            borderRadius: "8px",
            "&:hover": {
              backgroundColor: "rgba(248, 68, 100, 0.9)"
            }
          }}
        >
          Proceed to Book
        </Button>
      </Box>
    </Container>
  );
};

export default Booking;
