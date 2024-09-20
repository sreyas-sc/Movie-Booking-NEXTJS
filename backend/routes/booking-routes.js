import express from 'express';
import { checkSeatAvailability, getBookingById, newBooking, razorpayOrder } from '../controllers/booking-controller.js';

const bookingsRouter = express.Router();

bookingsRouter.post("/book",newBooking);

bookingsRouter.post("/razorpay",razorpayOrder);

bookingsRouter.get("/:id",getBookingById);

bookingsRouter.delete("/:id",);

bookingsRouter.post("/check-availability", checkSeatAvailability)





export default bookingsRouter;