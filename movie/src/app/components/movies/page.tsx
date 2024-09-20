
'use client'
// import { Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import MovieCard from './movie-card';
import { getAllMovies } from '@/app/api-helpers/api-helpers.js';

import { Box, Typography, Button, Select, MenuItem, TextField } from '@mui/material';
// import React, { useEffect, useState } from 'react';
// import MovieCard from './movie-card';
// import { getAllMovies } from '@/app/api-helpers/api-helpers.js';

const MoviePage = () => {
  // Define the Movie interface
  interface Movie {
    _id: string;
    title: string;
    posterUrl: string;
    releaseDate: string;
    genre: string;
    rating: number;
    duration: string;
  }
  

  const [movies, setMovies] = useState<Movie[]>([]);
  const [genre, setGenre] = useState('');
  const [rating, setRating] = useState('');
  const [showtime, setShowtime] = useState('');

  useEffect(() => {
    fetchMovies();
  }, [genre, rating, showtime]);

  const fetchMovies = () => {
    const filters: any = {};
    if (genre) filters.genre = genre;
    if (rating) filters.rating = rating;
    if (showtime) filters.showtime = showtime;

    getAllMovies(filters)
      .then((data) => {
        if (data && data.movies) {
          console.log("Fetched movies:", data.movies); // Log the fetched movies
          setMovies(data.movies);
        }
      })
      .catch((err) => {
        console.error("Error fetching movies:", err);
      });
  };

  return (
    <Box margin={"auto"} marginTop={4} display='flex' flexDirection="column" gap={3} padding={5}>
      {/* Filter section */}
      <Box 
  display="flex" 
  gap={2} 
  justifyContent="center"  // Align filters to center
  alignItems="center"       // Align vertically to center
  marginBottom={3}          // Add some margin below filters
>
  <Select value={genre} onChange={(e) => setGenre(e.target.value)} fullWidth displayEmpty>
    <MenuItem value="">All Genres</MenuItem>
    <MenuItem value="Action">Action</MenuItem>
    <MenuItem value="Comedy">Comedy</MenuItem>
    {/* Add more genres as needed */}
  </Select>

  <TextField
    fullWidth
    type="number"
    label="Min Rating"
    value={rating}
    onChange={(e) => setRating(e.target.value)}
    InputProps={{ inputProps: { min: 0, max: 10 } }}
  />

  <TextField
  fullWidth
    type="text"
    label="Showtime"
    value={showtime}
    onChange={(e) => setShowtime(e.target.value)}
    placeholder="e.g., 7:00 PM"
  />


  <Button variant="contained" 
    onClick={fetchMovies} 
    sx={{
          whiteSpace: 'nowrap' , minWidth: 'fit-content',
          minHeight: '40px',
          backgroundColor: 'transparent',
          color: 'rgba(248, 68, 100)',
          borderColor: 'rgba(248, 68, 100)',
          '&:hover': {
          backgroundColor:  'rgba(248, 68, 100, 0.1)',
          },
          margin: '2px',
        }}>
          Apply Filter
    </Button>
</Box>

      {/* The movie cards section */}
      <Box width={'100%'} margin="auto" display={'flex'} justifyContent="center" gap={3} padding={5} flexWrap='wrap'>
        {movies.map((movie: Movie) => (
          <MovieCard
            key={movie._id}
            id={movie._id}
            title={movie.title}
            posterUrl={movie.posterUrl}
            releaseDate={movie.releaseDate}
            description={`Description for ${movie.title}`} // Placeholder description
            duration={movie.duration}
            rating={movie.rating}
          />
        ))}
      </Box>
    </Box>
  );
};

export default MoviePage;
