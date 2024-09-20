// // import express from 'express';
// // import { addMovie, getAllMovies, getMovieById } from '../controllers/movie-conteroller.js';
// // const movieRouter = express.Router();

// // // Route to add new movies by the admin
// // movieRouter.post("/", addMovie);

// // // Route to get the movies  list
// // movieRouter.get("/",getAllMovies);

// // // Route to get the movie by the Id of the movie
// // movieRouter.get("/:id",getMovieById);

// // // Route for booking
// // // movieRouter.get("/:id",getMovieById);

// // export default movieRouter;

// import express from 'express';
// import { addMovie, getAllMovies, getMovieById } from '../controllers/movie-conteroller.js';
// // import  upload  from '../config/multer-config.js'; // Import Multer config


// const movieRouter = express.Router();


// // Route to add new movies by the admin
// movieRouter.post("/", addMovie);


// // Route to add new movies by the admin with image upload
// // movieRouter.post("/", upload.single('poster'), addMovie);  // Upload single poster image

// // Route to get the movies list
// movieRouter.get("/", getAllMovies);

// // Route to get the movie by the Id of the movie
// movieRouter.get("/:id", getMovieById);

// export default movieRouter;
// /




// // import express from 'express';
// // import { addMovie, getAllMovies, getMovieById } from '../controllers/movie-conteroller.js';
// // const movieRouter = express.Router();

// // // Route to add new movies by the admin
// // movieRouter.post("/", addMovie);

// // // Route to get the movies  list
// // movieRouter.get("/",getAllMovies);

// // // Route to get the movie by the Id of the movie
// // movieRouter.get("/:id",getMovieById);

// // // Route for booking
// // // movieRouter.get("/:id",getMovieById);

// // export default movieRouter;

// import express from 'express';
// import { addMovie, getAllMovies, getMovieById } from '../controllers/movie-conteroller.js';
// import { upload } from '../config/multer-config.js'; // Import Multer config


// const movieRouter = express.Router();


// // Route to add new movies by the admin
// movieRouter.post("/", addMovie);


// // Route to add new movies by the admin with image upload
// // movieRouter.post("/add", upload.single('poster'), addMovie);  // Upload single poster image

// // Route to get the movies list
// movieRouter.get("/", getAllMovies);

// // Route to get the movie by the Id of the movie
// movieRouter.get("/:id", getMovieById);

// export default movieRouter;
import express from 'express';
import { addMovie, getAllMovies, getMovieById } from '../controllers/movie-conteroller.js';
import { upload } from '../config/multer-config.js'; // Import Multer config

const movieRouter = express.Router();

// Route to add new movies by the admin with image upload
movieRouter.post("/", upload.single('poster'), addMovie);  // Ensure this route is active

// Route to get the movies list
movieRouter.get("/", getAllMovies);

// Route to get the movie by the Id of the movie
movieRouter.get("/:id", getMovieById);

export default movieRouter;