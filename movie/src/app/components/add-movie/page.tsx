'use client';
import { useState, useEffect } from 'react';
import { addMovie, getAllTheatres } from '@/app/api-helpers/api-helpers';
import { Box, Button, TextField, Typography, Checkbox, Card, CardMedia, CardContent, Grid } from '@mui/material';

// Define a type for TMDB movie
interface TmdbMovie {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  vote_average: number;
  poster_path: string | null; // Poster path may be null if no poster is available
}

interface InputState {
  title: string;
  description: string;
  releaseDate: string;
  duration: string;
  featured: boolean;
  genre: string;
  rating: string;
}

const TMDB_API_KEY = '446d69b8e014e2930a30c318caf3cfd1'; // Replace with your API key

const AddMovie = () => {
  const [inputs, setInputs] = useState<InputState>({
    title: '',
    description: '',
    releaseDate: '',
    duration: '',
    featured: false,
    genre: '',
    rating: ''
  });
  
  const [poster, setPoster] = useState<File | null>(null);
  const [castPhotos, setCastPhotos] = useState<File[]>([]);
  const [error] = useState('');
  const [cast, setCast] = useState<string[]>([]);
  const [newCastMember, setNewCastMember] = useState('');
  const [tmdbQuery, setTmdbQuery] = useState('');
  const [tmdbMovies, setTmdbMovies] = useState<TmdbMovie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<TmdbMovie | null>(null);
  const genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Romance']; // Example genres

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      if (e.target.name === 'poster') {
        setPoster(e.target.files[0]);
      } else if (e.target.name === 'castPhotos') {
        setCastPhotos(Array.from(e.target.files)); // Store File objects for submission
      }
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs((prev) => ({ ...prev, featured: e.target.checked }));
  };

  const handleCastChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCastMember(e.target.value);
  };

  const addCastMember = () => {
    if (newCastMember.trim()) {
      setCast((prev) => [...prev, newCastMember.trim()]);
      setNewCastMember('');
    }
  };

  

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', inputs.title);
    formData.append('description', inputs.description);
    formData.append('releaseDate', inputs.releaseDate);
    formData.append('duration', inputs.duration);
    formData.append('featured', String(inputs.featured));
    if (poster) formData.append('poster', poster); // Include poster
    castPhotos.forEach((photo) => formData.append('castPhotos', photo)); // Include cast photos
    formData.append('genre', inputs.genre);
    formData.append('rating', inputs.rating);
    formData.append('cast', JSON.stringify(cast)); // Cast members

    addMovie(formData)
      .then((res) => console.log('Movie added:', res))
      .catch((err) => console.error('Error adding movie:', err));
  };

  useEffect(() => {
    getAllTheatres()
      .then((data) => console.log(data.movies))
      .catch(err => console.log(err));
  }, []);

  const handleTmdbSearch = () => {
    if (!tmdbQuery) return;
    fetch(`https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${tmdbQuery}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.results) {
          setTmdbMovies(data.results);
          console.log("The TMDB API returned the following movies:", data.results);
        }
      })
      .catch((err) => console.error('Error fetching TMDB movies:', err));
  };

  const selectTmdbMovie = (movie: TmdbMovie) => {
    setSelectedMovie(movie);
    setInputs({
      title: movie.title,
      description: movie.overview,
      releaseDate: movie.release_date,
      duration: '',
      featured: false,
      genre: '',
      rating: String(movie.vote_average)
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box width={"50%"} padding="20px" margin="auto" display="flex" flexDirection="column" boxShadow="10px 10px 20px #ccc">
        <Typography textAlign="center" variant="h5" fontFamily="Verdana">Add Movie</Typography>
        {error && <Typography color="red">{error}</Typography>}

        {/* TMDB Search Section */}
        <TextField
          label="Search Movie on TMDB"
          variant="standard"
          margin="normal"
          value={tmdbQuery}
          onChange={(e) => setTmdbQuery(e.target.value)}
        />
        <Button type="button" variant="contained" onClick={handleTmdbSearch}>Search</Button>

        {/* Display TMDB Search Results */}
        <Grid container spacing={2} marginTop={2}>
          {tmdbMovies.map((movie, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card onClick={() => selectTmdbMovie(movie)} sx={{ cursor: 'pointer', height: '100%' }}>
                <CardMedia
                  component="img"
                  image={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                  alt={movie.title}
                  sx={{ height: 300 }}
                />
                <CardContent>
                  <Typography variant="h6">{movie.title}</Typography>
                  <Typography variant="body2" color="textSecondary">{movie.release_date}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Form Fields */}
        <TextField name="title" label="Movie Title" variant="standard" margin="normal" value={inputs.title} onChange={handleChange} />
        <TextField name="description" label="Description" variant="standard" margin="normal" value={inputs.description} onChange={handleChange} />
        <TextField name="releaseDate" label="Release Date" type="date" variant="standard" margin="normal" value={inputs.releaseDate} onChange={handleChange} />
        <TextField name="duration" label="Duration" variant="standard" margin="normal" value={inputs.duration} onChange={handleChange} />
        <TextField
          select
          name="genre"
          label="Genre"
          variant="standard"
          margin="normal"
          value={inputs.genre}
          onChange={handleChange}
          SelectProps={{ native: true }}
        >
          <option value="" disabled>Select Genre</option>
          {genres.map((genre, index) => (
            <option key={index} value={genre}>{genre}</option>
          ))}
        </TextField>

        <TextField
          name="rating"
          label="Rating"
          type="number"
          variant="standard"
          margin="normal"
          value={inputs.rating}
          onChange={handleChange}
          inputProps={{ min: 0, max: 10, step: 0.1 }}
        />

        <Checkbox name="featured" checked={inputs.featured} onChange={handleCheckboxChange} />
        <Typography>Featured</Typography>

        <label htmlFor="poster">Poster</label>
        <input type="file" name="poster" id="poster" onChange={handleFileChange} />

        <input type="file" name="castPhotos" multiple onChange={handleFileChange} />
        <TextField
          name="newCastMember"
          label="Add Cast Member"
          variant="standard"
          margin="normal"
          value={newCastMember}
          onChange={handleCastChange}
        />
        <Button type="button" variant="contained" onClick={addCastMember}>Add Cast</Button>

        <Typography>Cast Members:</Typography>
        <ul>
          {cast.map((member, index) => (
            <li key={index}>{member}</li>
          ))}
        </ul>

        <Button type="submit" variant="contained" sx={{ width: "30%", bgcolor: "#2b2d42", marginTop: '10px' }}>Add Movie</Button>
      </Box>

      {/* Selected Movie Preview */}
      {selectedMovie && (
        <Box width={"50%"} margin="auto" padding="20px" boxShadow="10px 10px 20px #ccc" marginTop="20px">
          <Card>
            <CardMedia
              component="img"
              height="400"
              image={`https://image.tmdb.org/t/p/w500/${selectedMovie.poster_path}`}
              alt={selectedMovie.title}
            />
            <CardContent>
              <Typography variant="h6">{selectedMovie.title}</Typography>
              <Typography variant="body2" color="textSecondary">{selectedMovie.overview}</Typography>
              <Typography variant="body2" color="textSecondary">Release Date: {selectedMovie.release_date}</Typography>
              <Typography variant="body2" color="textSecondary">Rating: {selectedMovie.vote_average}</Typography>
            </CardContent>
          </Card>
        </Box>
      )}
    </form>
  );
};

export default AddMovie;
