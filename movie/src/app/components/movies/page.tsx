'use client'
import React, { useEffect, useState, useCallback } from 'react';
import MovieCard from './movie-card';
import { getAllMovies } from '@/app/api-helpers/api-helpers.js';

import { Box, Button, Select, MenuItem, TextField } from '@mui/material';

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
  
  const fetchMovies = useCallback(() => {
    const filters: Record<string, string | number> = {};
    if (genre) filters.genre = genre;
    if (rating) filters.rating = rating;

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
  }, [genre, rating]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  return (
    <Box margin={"auto"} marginTop={4} display='flex' flexDirection="column" gap={3} padding={5}>
      {/* Filter section */}
      <Box 
        display="flex" 
        gap={2} 
        justifyContent="center"
        alignItems="center"
        marginBottom={3}
      >
        <Select value={genre} onChange={(e) => setGenre(e.target.value)} fullWidth displayEmpty>
          <MenuItem value="">All Genres</MenuItem>
          <MenuItem value="Action">Action</MenuItem>
          <MenuItem value="Comedy">Comedy</MenuItem>
          <MenuItem value="Fantasy">Fantasy</MenuItem>
          <MenuItem value="Romance">Romance</MenuItem>
          <MenuItem value="Fiction">Fiction</MenuItem>
          <MenuItem value="Thriller">Thriller</MenuItem>
          <MenuItem value="Horror">Horror</MenuItem>
          <MenuItem value="Fantasy">Fnatasy</MenuItem>
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

        <Button 
          variant="contained" 
          onClick={fetchMovies} 
          sx={{
            whiteSpace: 'nowrap', 
            minWidth: 'fit-content',
            minHeight: '40px',
            backgroundColor: 'transparent',
            color: 'rgba(248, 68, 100)',
            borderColor: 'rgba(248, 68, 100)',
            '&:hover': {
              backgroundColor:  'rgba(248, 68, 100, 0.1)',
            },
            margin: '2px',
          }}
        >
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
