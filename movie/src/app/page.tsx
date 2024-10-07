"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Grid, Card, CardMedia, CardContent, Button } from '@mui/material';
import MovieCard from './components/movies/movie-card';
import Link from 'next/link';
import { getAllMovies } from './api-helpers/api-helpers.js';

interface UpcomingMovie {
  id: string;
  overview:  string;
  vote_average:  number;
  title: string;
  poster_path: string;
  original_language: string;
  release_date: string;
  genre: string;
  duration: string; 
}

interface UpcomingMovieResponse {
  results: UpcomingMovie[];
}

interface Movie {
  _id: string;
  title: string;
  posterUrl: string;
  releaseDate: string;
  rating:  number;
  genre: string;

}

export default function Homepage() {
  const [upcomingMovies, setUpcomingMovies] = useState<UpcomingMovie[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]); // Explicitly set the type here


  useEffect(() => {
    console.log("tryng to find the user id")
    const fetchUserId = async () => {
      const userEmail = localStorage.getItem('userEmail');
      if (userEmail) {
        try {
          const response = await axios.post('https://movie-booking-nextjs.onrender.com/user/getUserByEmail', { email: userEmail });
          const userId = response.data.userId;

          // Store the userId in localStorage
          localStorage.setItem('userId', userId);
          console.log('User ID fetched and stored:', userId);
        } catch (error) {
          console.error('Error fetching user ID:', error);
        }
      }
    };

    fetchUserId();
  }, []); // Empty dependency array to run this effect once on component mount



    // carousel starts here
    const images = [
      "https://image.tmdb.org/t/p/original/xrCYSgZ7hMF7CkDl3MWhRg8eR6q.jpg",
      "https://image.tmdb.org/t/p/original/v9acaWVVFdZT5yAU7J2QjwfhXyD.jpg",
      "https://image.tmdb.org/t/p/original/yDHYTfA3R0jFYba16jBB1ef8oIt.jpg",
    ];

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const handleNext = () => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    };
  
    const handlePrev = () => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? images.length - 1 : prevIndex - 1
      );
    };

    // Carousel ends here

  useEffect(() => {
    getAllMovies()
      .then((data) => setMovies(data.movies)) // Ensure that data.movies matches the Movie interface
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    axios
      .get<UpcomingMovieResponse>(
        "https://api.themoviedb.org/3/movie/upcoming?api_key=446d69b8e014e2930a30c318caf3cfd1"
      )
      .then((res) => {
        const upcoming: UpcomingMovie[] = res.data.results;
        setUpcomingMovies(upcoming);
        console.log(res.data.results);
        
      })
      .catch((error) => {
        console.error("Error fetching upcoming movies:", error);
      });
  }, []);

  

  return (
    <Box width={'100%'} height={'100%'} margin="auto" marginTop={2}>
      <Box
      width={"100%"}
      height={"100%"}
      margin="auto"
      marginTop={2}
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      {/* Image Display */}
      <Box margin="auto" width={"90%"} height={"500px"} position="relative">
        <img
          src={images[currentImageIndex]}
          alt="Carousel Image"
          width={"100%"}
          height={"100%"}
          style={{ objectFit: "cover", borderRadius: "8px" , transform: "scale(1.1)",
            transition: "transform 0.3s ease-in-out"}}
        />

        {/* Left & Right Buttons */}
        <Button
          onClick={handlePrev}
          sx={{
            position: "absolute",
            top: "50%",
            left: "10px",
            transform: "translateY(-50%)",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            color: "white",
            minWidth: "40px",
            minHeight: "40px",
            borderRadius: "50%",
          }}
        >
          {"<"}
        </Button>

        <Button
          onClick={handleNext}
          sx={{
            position: "absolute",
            top: "50%",
            right: "10px",
            transform: "translateY(-50%)",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            color: "white",
            minWidth: "40px",
            minHeight: "40px",
            borderRadius: "50%",
          }}
        >
          {">"}
        </Button>
      </Box>

      {/* Round Indicator Buttons */}
      <Box display="flex" justifyContent="center">
        {images.map((_, index) => (
          <Button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            sx={{
              width: "12px",
              height: "12px",
              backgroundColor:
                currentImageIndex === index ? "black" : "gray",
              margin: "0 5px",
              borderRadius: "50%",
              minWidth: "12px",
              padding: 0,
            }}
          />
        ))}
      </Box>
    </Box>

      {/* /////////////// */}

      <Box padding={5} margin='auto'>
        <Typography variant='h4' textAlign={"center"}>
          Latest Releases
        </Typography>
      </Box>

      <Box
        display='flex'
        justifyContent='center'
        gap={3}
        padding={5}
        flexWrap='wrap'>
        
        {movies && movies.slice(0,4).map((movie) => (
          <MovieCard
            key={movie._id}
            id={movie._id}
            title={movie.title}
            posterUrl={movie.posterUrl}
            releaseDate={movie.releaseDate}
            description={`Description for ${movie.title}`} // Placeholder description
            duration="N/A" // Adjust this if you have duration data
            genre={movie.genre}
            rating={movie.rating}
          />
        ))}
      </Box>

      <Box display="flex" justifyContent="center" padding={5}>
        <Link href="/components/movies" passHref legacyBehavior>
          <Button
            variant="outlined"
            sx={{
              whiteSpace: 'nowrap',
              paddingLeft: 10,
              paddingRight: 10
            }}
          >
            View All Movies
          </Button>
        </Link>
      </Box>

      <Box padding={5} margin='auto'>
        <Typography variant='h4' textAlign={"center"}>
          Trending Movies
        </Typography>
      </Box>

      <Grid container spacing={4} justifyContent="center" paddingX={5} flexWrap="wrap">
  {upcomingMovies.map((movie) => (
    <Grid item xs={12} sm={6} md={4} key={movie.id}>
      <Card sx={{
        width: 500,
        height: 650,
        borderRadius: 5,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: '0.3s',
        '&:hover': {
          boxShadow: "10px 10px 20px #ccc"
        }
      }} onClick={() => console.log(movie.id)}>
        <CardMedia
          component="img"
          height="450"
          image={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
          alt={movie.title}
        />
        <CardContent>
          <Typography variant="h6">
            {movie.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Language: {movie.original_language}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Release Date: {new Date(movie.release_date).toLocaleDateString()}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ marginTop: 1 }}>
            Rating: {movie.vote_average}/10
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ marginTop: 1 }}>
            {movie.overview.length > 100 ? `${movie.overview.substring(0, 100)}...` : movie.overview}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  ))}
</Grid>

    </Box>
  );
}
