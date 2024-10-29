'use client'
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  Button,
  Container,
  Grid,
  Paper,
  Stack,
  CircularProgress,
  Tooltip
} from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { getMovieDetails, getAllShows } from '@/app/api-helpers/api-helpers.js';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StarIcon from '@mui/icons-material/Star';
import GroupIcon from '@mui/icons-material/Group';
import MovieIcon from '@mui/icons-material/Movie';
import Image from 'next/image';

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

const NoShowsAvailable = () => (
  <Box
    display="flex"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    py={8}
    px={4}
    textAlign="center"
  >
    <MovieIcon 
      sx={{ 
        fontSize: 120, 
        color: 'rgba(248, 68, 100, 0.2)',
        mb: 4
      }} 
    />
    <Typography 
      variant="h5" 
      component="h2" 
      gutterBottom
      sx={{ 
        color: 'text.primary',
        fontWeight: 'bold'
      }}
    >
      No Shows Available
    </Typography>
    <Typography 
      variant="body1" 
      color="text.secondary"
      sx={{ maxWidth: '600px' }}
    >
      We&apos;re sorry, but there are currently no shows scheduled for this movie. 
      Please check back later or explore other movies.
    </Typography>
  </Box>
);

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

  const isTimeAvailable = (time: string, currentDate: boolean): boolean => {
    if (!currentDate) return true;
    
    const now = new Date();
    const [hours, minutes] = time.split(':').map(Number);
    const showTime = new Date();
    showTime.setHours(hours, minutes, 0);
    
    const bufferTime = 30;
    const bookingDeadline = new Date(showTime.getTime() - bufferTime * 60000);
    
    return now < bookingDeadline;
  };

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

  const isCurrentDate = (date: string): boolean => {
    const today = new Date();
    const checkDate = new Date(date);
    return (
      today.getDate() === checkDate.getDate() &&
      today.getMonth() === checkDate.getMonth() &&
      today.getFullYear() === checkDate.getFullYear()
    );
  };

  const isPastDate = (date: string): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate < today;
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
      <Grid item xs={12} md={4}>
        <Card sx={{ height: '100%' }}>
          <Box sx={{ height: 400, overflow: 'hidden' }}>
            <Image 
            width={400}
            height={600}
              src={movie.posterUrl ? `http://localhost:5000/uploads/${movie.posterUrl.split('\\').pop()}` : '/placeholder.jpg'}
              // src={movie.posterUrl || '/9318694.jpg'} // Add a placeholder for fallback
              alt={movie.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} // Maintain aspect ratio
            />
          </Box>
        </Card>
      </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Movie Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <CalendarTodayIcon color="primary" />
                    <Typography>
                      Release Date: {new Date(movie.releaseDate).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <StarIcon color="primary" />
                    <Typography>
                      Rating: {movie.rating}/10
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <GroupIcon color="primary" />
                    <Typography>
                      Cast: {movie.cast}
                    </Typography>
                  </Box>
                </Grid>
                {movie.description && (
                  <Grid item xs={12}>
                    <Typography variant="body1" color="text.secondary">
                      {movie.description}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {Object.keys(groupedShows).length === 0 ? (
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <NoShowsAvailable />
        </Paper>
      ) : (
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

                  <Box mb={3}>
                    <Typography variant="subtitle2" gutterBottom>
                      Select Date
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {shows.flatMap(show => show.dates).map(date => {
                        const isToday = isCurrentDate(date);
                        const isPast = isPastDate(date);
                        
                        return (
                          <Tooltip 
                            title={isPast ? "Past date" : isToday ? "Today's shows" : ""} 
                            key={date}
                          >
                            <span>
                              <Button
                                variant={selectedDate === date && selectedTheater === theaterKey ? "contained" : "outlined"}
                                size="small"
                                onClick={() => handleDateClick(date, theaterKey)}
                                disabled={isPast}
                                sx={{
                                  mb: 1,
                                  minWidth: '120px',
                                  color: selectedDate === date ? "white" : "rgba(248, 68, 100, 1)",
                                  backgroundColor: selectedDate === date ? "rgba(248, 68, 100, 1)" : "white",
                                  borderColor: "rgba(248, 68, 100, 1)",
                                  '&:hover': {
                                    backgroundColor: "rgba(248, 68, 100, 0.9)",
                                    color: "white"
                                  },
                                  '&.Mui-disabled': {
                                    backgroundColor: '#f5f5f5',
                                    color: '#bdbdbd'
                                  }
                                }}
                                startIcon={<CalendarTodayIcon />}
                              >
                                {isToday ? "Today" : new Date(date).toLocaleDateString()}
                              </Button>
                            </span>
                          </Tooltip>
                        );
                      })}
                    </Stack>
                  </Box>

                  {selectedDate && selectedTheater === theaterKey && (
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        Select Showtime
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {(groupedShows[theaterKey]?.[0]?.times || []).map(time => {
                          const isToday = isCurrentDate(selectedDate);
                          const available = isTimeAvailable(time, isToday);
                          
                          return (
                            <Tooltip 
                              title={!available ? "Booking closed for this show" : ""} 
                              key={time}
                            >
                              <span>
                                <Button
                                  variant={selectedTimes[theaterKey] === time ? "contained" : "outlined"}
                                  size="small"
                                  onClick={() => handleTimeClick(time, theaterKey)}
                                  disabled={!available}
                                  sx={{
                                    mb: 1,
                                    minWidth: '100px',
                                    color: selectedTimes[theaterKey] === time ? "white" : "rgba(248, 68, 100, 1)",
                                    backgroundColor: selectedTimes[theaterKey] === time ? "rgba(248, 68, 100, 1)" : "white",
                                    borderColor: "rgba(248, 68, 100, 1)",
                                    '&:hover': {
                                      backgroundColor: "rgba(248, 68, 100, 0.9)",
                                      color: "white"
                                    },
                                    '&.Mui-disabled': {
                                      backgroundColor: '#f5f5f5',
                                      color: '#bdbdbd'
                                    }
                                  }}
                                  startIcon={<AccessTimeIcon />}
                                >
                                  {time}
                                </Button>
                              </span>
                            </Tooltip>
                          );
                        })}
                      </Stack>
                    </Box>
                  )}
                </CardContent>
              </Card>
            ))}
          </Paper>
        </Box>
      )}

      {Object.keys(groupedShows).length > 0 && (
        <Box textAlign="center">
                <Button
                  onClick={handleProceedToBook}
                  variant="contained"
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
                    },
                    "&.Mui-disabled": {
                      backgroundColor: "#f5f5f5",
                      color: "#bdbdbd"
                    }
                  }}
                >
                  Proceed to Book
                </Button>
              </Box>
      )}
    </Container>
  );
};

export default Booking;