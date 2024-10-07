import express from 'express';
import { getBookingById, newBooking, razorpayOrder, fetchBookedSeats } from '../controllers/booking-controller.js';

const bookingsRouter = express.Router();

bookingsRouter.post("/book",newBooking);

bookingsRouter.post("/razorpay",razorpayOrder);

bookingsRouter.get("/:id",getBookingById);

bookingsRouter.post('/fetch-seats', fetchBookedSeats);

bookingsRouter.delete("/:id",);






export default bookingsRouter;