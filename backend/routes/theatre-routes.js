import express from 'express';
import { addTheatre, getAllTheatres } from '../controllers/theatre-controller.js';


const theaterRouter = express.Router();

// theaterRouter.get("/", getAllTheatres);

theaterRouter.post("/add", addTheatre);

theaterRouter.get("/", getAllTheatres);


export default theaterRouter;