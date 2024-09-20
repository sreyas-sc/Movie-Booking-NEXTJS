import express from 'express';
import { addShow, deleteShow, getAllShows } from '../controllers/show-controller.js'; // Note the .js extension

const router = express.Router();

// POST /api/add-show
router.route('/addshow').post(addShow);

router.route('/getallshows').get(getAllShows)

router.route('/shows/deleteShow/:showId').delete(deleteShow);

export default router;
