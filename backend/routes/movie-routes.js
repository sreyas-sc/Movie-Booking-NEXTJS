import express from 'express';
import { addMovie, getAllMovies, getMovieById } from '../controllers/movie-conteroller.js';
import { upload } from '../config/multer-config.js'; // Import Multer config

const movieRouter = express.Router();

// Route to add new movies by the admin with image upload
// movieRouter.post("/", upload('poster'), addMovie);  // Ensure this route is active
movieRouter.post("/", upload, addMovie);  // Use upload without specifying fields if defined in the multer config

// Route to get the movies list
movieRouter.get("/", getAllMovies);

// Route to get the movie by the Id of the movie
movieRouter.get("/:id", getMovieById);

export default movieRouter;