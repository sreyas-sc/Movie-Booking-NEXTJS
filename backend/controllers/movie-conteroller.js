// import jwt from 'jsonwebtoken';
import Movie from '../models/Movie.js';
import mongoose from 'mongoose';
import Admin from '../models/Admin.js';
import multer from 'multer';
import path from 'path';
import { upload } from '../config/multer-config.js';  
import { promisify } from 'util';
import jwt from 'jsonwebtoken';



// Promisify jwt.verify
const verifyToken = promisify(jwt.verify);

// export const addMovie = async (req, res) => {
  
//   try {
//       const extractedToken = req.headers.authorization?.split(" ")[1];
//       if (!extractedToken) {
//           return res.status(404).json({ message: "Token not found" });
//       }

//       let adminId;
//       try {
//           const decoded = await verifyToken(extractedToken, 'MYSECRETKEY');
//           adminId = decoded.id;
//       } catch (err) {
//           return res.status(400).json({ message: err.message });
//       }

//         // Destructure fields from the request body
//       const { title, description, releaseDate, duration, featured, genre, rating, cast } = req.body;

//        // Get uploaded file URLs
//        const posterUrl = req.file ? req.file.path : null; // Path to the poster
//        const castPhotos = req.files && req.files.castPhotos ? req.files.castPhotos.map(file => file.path) : []; // Paths to cast photos

      
//       if (!title || !description || !duration) {
//           return res.status(402).json({ message: "Invalid inputs!" });
//       }
//       const parsedCast = Array.isArray(cast) ? cast : JSON.parse(cast || '[]');

//       let movie = new Movie({
//           title,
//           description,
//           releaseDate: new Date(releaseDate),
//           posterUrl,
//           duration,
//           featured,
//           admin: adminId,
//           genre,
//           rating,
//           cast : parsedCast

//       });

//       const session = await mongoose.startSession();
//       session.startTransaction();
//       await movie.save({ session });
//       const adminUser = await Admin.findById(adminId);
//       adminUser.addedMovies.push(movie);
//       await adminUser.save({ session });

//       await session.commitTransaction();
//       return res.status(201).json({ movie });
//   } catch (err) {
//       console.error("Error during movie addition:", err);
//       return res.status(500).json({ message: "Movie creation failed" });
//   }
// };
export const addMovie = async (req, res) => {
  try {
      const extractedToken = req.headers.authorization?.split(" ")[1];
      if (!extractedToken) {
          return res.status(404).json({ message: "Token not found" });
      }

      let adminId;
      try {
          const decoded = await verifyToken(extractedToken, 'MYSECRETKEY');
          adminId = decoded.id;
      } catch (err) {
          return res.status(400).json({ message: err.message });
      }

      // Destructure fields from the request body
      const { title, description, releaseDate, duration, featured, genre, rating, cast } = req.body;

      // Get uploaded file URLs
      const posterUrl = req.files.poster ? req.files.poster[0].path : null; // Path to the poster
      const castPhotos = req.files.castPhotos ? req.files.castPhotos.map(file => file.path) : []; // Paths to cast photos

      if (!title || !description || !duration || !posterUrl) {
          return res.status(400).json({ message: "Invalid inputs! Poster image is required." });
      }

      const parsedCast = Array.isArray(cast) ? cast : JSON.parse(cast || '[]');

      let movie = new Movie({
          title,
          description,
          releaseDate: new Date(releaseDate),
          posterUrl,
          duration,
          featured,
          admin: adminId,
          genre,
          rating,
          cast: parsedCast
      });

      const session = await mongoose.startSession();
      session.startTransaction();
      await movie.save({ session });
      const adminUser = await Admin.findById(adminId);
      adminUser.addedMovies.push(movie);
      await adminUser.save({ session });

      await session.commitTransaction();
      return res.status(201).json({ movie });
  } catch (err) {
      console.error("Error during movie addition:", err);
      return res.status(500).json({ message: "Movie creation failed" });
  }
};

export const getAllMovies = async (req, res, next) => {
    const { genre, rating, showtime } = req.query;
  
    let filters = {};
    
    if (genre) filters.genre = genre;
    if (rating) filters.rating = { $gte: rating }; // example for filtering movies with a minimum rating
    if (showtime) filters.showtime = showtime; // assuming you have a showtime field
  
    try {
      const movies = await Movie.find(filters);
      if (!movies || movies.length === 0) {
        return res.status(404).json({ message: "No movies found" });
      }
      return res.status(200).json({ movies });
    } catch (err) {
      return res.status(500).json({ message: "Request failed, no movies found" });
    }
  };


export const getMovieById = async (req, res) => {
    const movieId = req.params.id;
  
    try {
      const movie = await Movie.findById(movieId); // Replace with your actual method to fetch movie
      if (!movie) {
        console.error('Movie not found');
        return res.status(404).json({ message: 'Movie not found' });
      }
      console.log('Movie found:', movie); // Log the movie details
      return res.status(200).json({ movie });
    } catch (error) {
      console.error('Error fetching movie:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
  