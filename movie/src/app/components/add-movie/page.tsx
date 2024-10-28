'use client';
import React, { useState, useEffect, useRef } from 'react';
import { addMovie, getAllTheatres } from '@/app/api-helpers/api-helpers';
import Swal from 'sweetalert2';
import styles from './add-movie.module.css';
import Image from 'next/image';

interface TmdbMovie {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  vote_average: number;
  poster_path: string | null;
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

interface ValidationState {
  title: boolean;
  description: boolean;
  releaseDate: boolean;
  duration: boolean;
  genre: boolean;
  rating: boolean;
}

const TMDB_API_KEY = '446d69b8e014e2930a30c318caf3cfd1';

const AddMovie: React.FC = () => {
  const [inputs, setInputs] = useState<InputState>({
    title: '',
    description: '',
    releaseDate: '',
    duration: '',
    featured: false,
    genre: '',
    rating: ''
  });

  const [validations, setValidations] = useState<ValidationState>({
    title: true,
    description: true,
    releaseDate: true,
    duration: true,
    genre: true,
    rating: true
  });

  const [poster, setPoster] = useState<File | null>(null);
  const [castPhotos, setCastPhotos] = useState<File[]>([]);
  const [cast, setCast] = useState<string[]>([]);
  const [newCastMember, setNewCastMember] = useState('');
  const [posterPreview, setPosterPreview] = useState<string | null>(null); // New state for preview
  const [tmdbQuery, setTmdbQuery] = useState('');
  const [tmdbMovies, setTmdbMovies] = useState<TmdbMovie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<TmdbMovie | null>(null);
  const genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Romance'];


  const [castPhotosPreviews, setCastPhotosPreviews] = useState<string[]>([]);

  const titleRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const validateField = (name: string, value: string) => {
    let isValid = true;
    switch (name) {
      case 'title':
      case 'description':
      case 'genre':
        isValid = value.trim() !== '';
        break;
      case 'releaseDate':
        isValid = /^\d{4}-\d{2}-\d{2}$/.test(value);
        break;
      case 'duration':
        const duration = parseFloat(value);
        isValid = !isNaN(duration) && duration >= 1.5 && duration <= 4.5;
        break;
      case 'rating':
        const rating = parseFloat(value);
        isValid = !isNaN(rating) && rating >= 0 && rating <= 9.9;
        break;
    }
    setValidations((prev) => ({ ...prev, [name]: isValid }));
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      if (e.target.name === 'poster') {
        const selectedFile = e.target.files[0];
        setPoster(selectedFile);
        setPosterPreview(URL.createObjectURL(selectedFile));
      } else if (e.target.name === 'castPhotos') {
        const selectedFiles = Array.from(e.target.files);
        setCastPhotos(prevPhotos => [...prevPhotos, ...selectedFiles]);
        const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
        setCastPhotosPreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
      }
    }
  };

  const removeCastPhoto = (index: number) => {
    setCastPhotos(prevPhotos => prevPhotos.filter((_, i) => i !== index));
    setCastPhotosPreviews(prevPreviews => prevPreviews.filter((_, i) => i !== index));
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
    
    // Validate all fields before submission
    let isValid = true;
    Object.entries(inputs).forEach(([key, value]) => {
      validateField(key, value.toString());
      if (!validations[key as keyof ValidationState]) {
        isValid = false;
      }
    });

    if (!isValid) {
      Swal.fire({
        title: 'Error!',
        text: 'Please fill in all required fields correctly.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return;
    }

    const formData = new FormData();
    Object.entries(inputs).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });
    if (poster) formData.append('poster', poster);
    castPhotos.forEach((photo) => {
      formData.append(`castPhotos`, photo);
    });

    formData.append('cast', JSON.stringify(cast));

    addMovie(formData)
      .then((res) => {
        console.log('Movie added:', res);
        Swal.fire({
          title: 'Success!',
          text: 'Movie added successfully!',
          icon: 'success',
          confirmButtonText: 'OK',
        });
      })
      .catch((err) => {
        console.error('Error adding movie:', err);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to add movie. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      });
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
      rating: movie.vote_average.toFixed(1)
    });
    titleRef.current?.focus();
  };

  return (
    <form onSubmit={handleSubmit} className={styles.add_movie_form}>
      <h2 className={styles.title}>Add Movie</h2>

      <div className={styles.field}>
        <input
          type="text"
          placeholder="Search Movie on TMDB"
          value={tmdbQuery}
          onChange={(e) => setTmdbQuery(e.target.value)}
          className={styles.input}
        />
        <button type="button" onClick={handleTmdbSearch} className={styles.button}>Search</button>
      </div>

      <div className={styles.gridContainer}>
      {tmdbMovies.map((movie, index) => (
  <div className={styles.card} key={index} onClick={() => selectTmdbMovie(movie)}>
    <Image
      src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
      alt={movie.title}
      onError={(e) => {
        // Fallback to a placeholder image when the URL is broken
        e.currentTarget.src = "https://via.placeholder.com/500";
      }}
      className={styles.moviePoster}
    />
    <h3 className={styles.cardTitle}>{movie.title}</h3>
  </div>
))}

      </div>

      {selectedMovie && (
      <div className={styles.selectedMovie}>
        <h3 className={styles.selectedMovieTitle}>Selected Movie: {selectedMovie.title}</h3>
        <p className={styles.selectedMovieDescription}>{selectedMovie.overview}</p>
        {/* Banner for selected movie */}
        <div className={styles.banner}>
          <Image
            width={50}
            height={50}
            src={`https://image.tmdb.org/t/p/w500/${selectedMovie.poster_path}`}
            alt={selectedMovie.title}
            className={styles.bannerImage}
          />
        </div>
      </div>
    )}

      <div className={styles.field}>
        <input
          type="text"
          name="title"
          placeholder="Movie Title"
          value={inputs.title}
          onChange={handleChange}
          ref={titleRef}
          className={`${styles.input} ${!validations.title ? styles.invalid : ''}`}
        />
      </div>

      <div className={styles.field}>
        <textarea
          name="description"
          placeholder="Movie Description"
          value={inputs.description}
          onChange={handleChange}
          className={`${styles.textarea} ${!validations.description ? styles.invalid : ''}`}
        />
      </div>

      <div className={styles.field}>
        <input
          type="date"
          name="releaseDate"
          value={inputs.releaseDate}
          onChange={handleChange}
          className={`${styles.input} ${!validations.releaseDate ? styles.invalid : ''}`}
        />
      </div>

      <div className={styles.field}>
        <input
          type="number"
          name="duration"
          placeholder="Duration (1.5 - 4.5 hours)"
          value={inputs.duration}
          onChange={handleChange}
          step="0.1"
          min="1.5"
          max="4.5"
          className={`${styles.input} ${!validations.duration ? styles.invalid : ''}`}
        />
      </div>
      
      <div className={styles.field}>
        <label>
          <input
            type="checkbox"
            name="featured"
            checked={inputs.featured}
            onChange={handleCheckboxChange}
            className={styles.checkbox}/>
          Featured
        </label>
      </div>

      <div className={styles.field}>
        <select
          name="genre"
          value={inputs.genre}
          onChange={handleChange}
          className={`${styles.select} ${!validations.genre ? styles.invalid : ''}`}
        >
          <option value="">Select Genre</option>
          {genres.map((genre) => (
            <option key={genre} value={genre}>{genre}</option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <input
          type="number"
          name="rating"
          placeholder="Rating (0 - 9.9)"
          value={inputs.rating}
          onChange={handleChange}
          step="0.1"
          min="0"
          max="9.9"
          className={`${styles.input} ${!validations.rating ? styles.invalid : ''}`}
        />
      </div>

      <div className={styles.field}>
        <input
          type="file"
          name="poster"
          onChange={handleFileChange}
          className={styles.input}
        />
      </div>

      {posterPreview && (
        <div className={styles.imagePreview}>
          <Image height={450} width={450} src={posterPreview} alt="Poster Preview" className={styles.previewImg} />
        </div>
      )}

      <div className={styles.field}>
        <input
          type="text"
          placeholder="Add Cast Member"
          value={newCastMember}
          onChange={handleCastChange}
          className={styles.input}
        />
        <button type="button" onClick={addCastMember} className={styles.button}>Add Cast</button>
      </div>

      {cast.length > 0 && (
        <div className={styles.castList}>
          <h4>Cast:</h4>
          <ul>
            {cast.map((member, index) => (
              <li key={index}>{member}</li>
            ))}
          </ul>
        </div>
      )}

<div className={styles.field}>
        <input
          type="file"
          name="castPhotos"
          onChange={handleFileChange}
          multiple
          accept="image/*"
          className={styles.input}
        />
      </div>

      {castPhotosPreviews.length > 0 && (
        <div className={styles.castPhotosPreviews}>
          {castPhotosPreviews.map((preview, index) => (
            <div key={index} className={styles.castPhotoPreview}>
              <Image width={100} height={100} src={preview} alt={`Cast member ${index + 1}`} />
              <button type="button" onClick={() => removeCastPhoto(index)} className={styles.removePhotoButton}>
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      <button type="submit" className={styles.submitButton}>Add Movie</button>
    </form>
  );
};

export default AddMovie;