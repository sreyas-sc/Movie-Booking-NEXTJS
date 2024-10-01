'use client';
import React, { Fragment, useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Divider, Button, CardMedia } from '@mui/material';
import { useParams } from 'next/navigation';
import { getMovieDetails, getAllShows } from '@/app/api-helpers/api-helpers.js';
import { useRouter } from 'next/navigation'; // Correct import

interface Movie {
  releaseDate: string | number | Date;
  title: string;
  description?: string;
  posterUrl?: string;
  rating:  number;
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
    seatLayout: number[]; // Assuming seatLayout is an array of numbers
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
  const { id } = useParams(); // Get movie ID from URL
  const [selectedTheaterName, setSelectedTheaterName] = useState<string | null>(null);
  const [selectedTheaterLocation, setSelectedTheaterLocation] = useState<string | null>(null);
  const [selectedTheaterSeatLayout, setSelectedTheaterSeatLayout] = useState<number[]>([]); // Assuming seatLayout is an array of numbers

  const router = useRouter(); // Initialize router

  useEffect(() => {
    // Fetch available shows on component mount
    const fetchShows = async () => {
      try {
        const fetchedShows: Show[] = await getAllShows();
        console.log('Fetched shows from API:', fetchedShows);
        setShows(fetchedShows || []);
      } catch (error) {
        console.error('Error fetching shows:', error);
      }
    };

    fetchShows();
  }, []);

  useEffect(() => {
    // Fetch movie details when the id changes
    if (id) {
      getMovieDetails(id)
        .then((res) => {
          console.log('Response from getMovieDetails:', res);
          if (res && res.movie) {
            setMovie(res.movie);
          } else {
            console.error('Movie not found or invalid response:', res);
          }
        })
        .catch(err => console.error('Error fetching movie details:', err));
    }
  }, [id]);

  useEffect(() => {
    // Group shows by theater and filter by selected movie
    const groupByTheater = () => {
      if (!id) {
        console.warn('No movieId provided');
        return;
      }

      // const filteredShows = shows.filter(show => show.movieId._id === id);
      const filteredShows = shows.filter(show => show.movieId?._id === id);

      console.log('Filtered shows:', filteredShows);

      if (filteredShows.length === 0) {
        console.warn('No shows found for movieId:', id);
      }

      const grouped = filteredShows.reduce((acc, show) => {
        const theaterKey = `${show.theaterId._id}-${show.theaterId.name}-${show.theaterId.location}`;
        if (!acc[theaterKey]) {
          acc[theaterKey] = [];
        }
        acc[theaterKey].push(show);
        return acc;
      }, {} as { [key: string]: Show[] });

      console.log('Grouped Shows:', grouped);
      setGroupedShows(grouped);
    };

    groupByTheater();
  }, [shows, id]);

  const handleDateClick = (date: string, theaterKey: string) => {
    console.log('Selected Theater:', theaterKey);
    console.log('Selected Date:', date);

    const isoDate = new Date(date).toISOString().split('T')[0]; // Convert to YYYY-MM-DD format
    const selectedShows = groupedShows[theaterKey]?.filter(show =>
      show.dates.some(d => new Date(d).toISOString().split('T')[0] === isoDate)
    ) || [];

    console.log('Selected Shows for Date:', selectedShows);

    if (selectedShows.length > 0) {
      const times = selectedShows.flatMap(show => show.times);
      setSelectedDate(date);
      setSelectedTheater(theaterKey);
      setSelectedTimes(prev => ({ ...prev, [theaterKey]: null })); // Clear previous selected time for the theater
      console.log('Available Times:', times);

      // Update theater details
      const theater = selectedShows[0].theaterId; // Assuming all shows are in the same theater
      setSelectedTheaterName(theater.name);
      setSelectedTheaterLocation(theater.location);
      setSelectedTheaterSeatLayout(theater.seatLayout);
    } else {
      console.error('No shows found for the selected date:', date);
    }
  };

  const handleTimeClick = (time: string, theaterKey: string) => {
    console.log('Selected Time:', time);
    setSelectedTimes(prev => ({ ...prev, [theaterKey]: time }));
  };

  return (
    <div>
      {movie ? (
        <Fragment>
          <Typography padding={3} fontFamily="fantasy" variant='h4' textAlign={"center"}>
            Book tickets for the movie: {movie.title}
          </Typography>
          <Box display={'flex'} justifyContent={'center'} alignItems={'flex-start'}>
            <Box
              display={'flex'}
              flexDirection={'column'}
              width='50%'
              marginLeft={'50px'}
              marginRight={'auto'}
            >
              {/* The poster image of the movie using CardMedia */}
                <CardMedia
                component="img"
                height={"50%"} // Keep this to set the height
                image={movie.posterUrl ? `http://localhost:5000/uploads/${movie.posterUrl.split('\\').pop()}` : ''}
                alt={movie.title}
                sx={{ width: '50%', maxWidth: '50%', objectFit: 'cover' }} // Adjust width and maintain aspect ratio
              />

            </Box>
            <Box width='40%' marginLeft={3}>
              {/* Movie details card */}
              <Card variant="outlined" elevation={3} sx={{ 
                width: 300, 
                minHeight: 600,
                borderRadius: 5, 
                borderBlockColor:  '#e51022',
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'space-between',
                ":hover": {
                  borderColor: "red",
                  boxShadow: "10px 10px 20px #ccc"
                }
              }}>
                <CardContent>
                  <Typography variant="h5" component="div">
                    {movie.title}
                  </Typography>
                  <Divider style={{ margin: '10px 0' }} />
                  <Typography variant="body2">
                    {movie.description}
                  </Typography>
                  <Typography variant="body2" fontWeight={'bold'} mt={2}>
                    Release Date: {new Date(movie.releaseDate).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" fontWeight={'bold'} mt={2}>
                    IMDB Rating: {movie.rating} ⭐
                  </Typography>
                  <Typography variant="body2" fontWeight={'bold'} mt={2}>
                    Starring: 🎭 {movie.cast} 
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Box>
          {/* Theater Cards */}
          <Box display={'flex'} flexDirection={'column'} padding={3}>
            {Object.entries(groupedShows).map(([theaterKey, shows]) => (
              <Card key={theaterKey} variant="outlined" style={{ marginBottom: '20px' }}>
                <CardContent>
                  <Typography variant="h6" component="div">
                    Theater: {theaterKey.split('-')[1]}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    Location: {theaterKey.split('-')[2]}
                  </Typography>
                  <Divider style={{ margin: '10px 0' }} />
                  <Box>
                    {shows.flatMap(show => show.dates).map(date => (
                      <Button
                        key={date}
                        variant={selectedDate === date && selectedTheater === theaterKey ? "contained" : "outlined"}
                        onClick={() => handleDateClick(date, theaterKey)}
                        sx={{
                          marginRight: '10px',
                          marginBottom: '10px',
                          color: selectedDate === date && selectedTheater === theaterKey ? 'white' : 'rgba(248, 68, 100)',
                          borderColor: selectedDate === date && selectedTheater === theaterKey ? 'rgba(248, 68, 100)' : 'rgba(248, 68, 100)',
                          backgroundColor: selectedDate === date && selectedTheater === theaterKey ? 'rgba(248, 68, 100)' : 'transparent',
                          '&:hover': {
                            backgroundColor: selectedDate === date && selectedTheater === theaterKey ? 'darkred' : 'rgba(248, 68, 100, 0.1)',
                            borderColor: selectedDate === date && selectedTheater === theaterKey ? 'rgba(248, 68, 100)' : 'rgba(248, 68, 100)',
                          },
                        }}
                      >
                        {new Date(date).toLocaleDateString()}
                      </Button>
                    ))}
                  </Box>
                  <Box>
                    {shows.flatMap(show => show.times).map(time => (
                      <Button
                        key={time}
                        variant={selectedTimes[theaterKey] === time ? "contained" : "outlined"}
                        onClick={() => handleTimeClick(time, theaterKey)}
                        sx={{
                          marginRight: '10px',
                          marginBottom: '10px',
                          color: selectedTimes[theaterKey] === time ? 'white' : 'rgba(248, 68, 100)',
                          borderColor: selectedTimes[theaterKey] === time ? 'rgba(248, 68, 100)' : 'rgba(248, 68, 100)',
                          backgroundColor: selectedTimes[theaterKey] === time ? 'rgba(248, 68, 100)' : 'transparent',
                          '&:hover': {
                            backgroundColor: selectedTimes[theaterKey] === time ? 'darkred' : 'rgba(248, 68, 100, 0.1)',
                            borderColor: selectedTimes[theaterKey] === time ? 'rgba(248, 68, 100)' : 'rgba(248, 68, 100)',
                          },
                        }}
                      >
                        {time}
                      </Button>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>

          {/* Proceed to Book Button */}
          <Box display={'flex'} justifyContent={'center'} padding={2}>
            <Button
              variant="contained"
              onClick={() => {
                console.log('Selected Date:', selectedDate);
                console.log('Selected Theater:', selectedTheater);
                console.log('Selected Times:', selectedTimes);

                const movieId = Array.isArray(id) ? id[0] : id;

                 // Find the selected show based on theater and time
                const selectedShow = shows.find(show =>
                  `${show.theaterId._id}-${show.theaterId.name}-${show.theaterId.location}` === selectedTheater &&
                  show.times.includes(selectedTimes[selectedTheater] || '')
                );

                console.log("selected Show is", selectedShow)

                // Save seat layout and selected details to localStorage
                if (selectedTheater) {
                  localStorage.setItem('selectedMovie',  movie.title);
                  localStorage.setItem('selectedMovieId', movieId || ''); // Save movie ID
                  localStorage.setItem('selectedDate', selectedDate || '');
                  localStorage.setItem('selectedTheater', selectedTheater);
                  localStorage.setItem('selectedTimes', JSON.stringify(selectedTimes));
                  localStorage.setItem('seatLayout', JSON.stringify(selectedTheaterSeatLayout));
                  // localStorage.setItem('selectedShowId', selectedShow._id); // Save the selected show ID


                  router.push('/components/seat-selection'); // Navigate to seat selection page
                } else {
                  console.error('No theater selected');
                }
              }}
              sx={{ backgroundColor: 'rgba(248, 68, 100)' }}
            >
              Proceed to Book
            </Button>
          </Box>
        </Fragment>
      ) : (
        <Typography variant="h6" color="text.secondary" textAlign={'center'}>
          Loading movie details...
        </Typography>
      )}
    </div>
  );
};

export default Booking;
