// import mongoose, { mongo } from "mongoose";
// const bookingSchema = new mongoose.Schema({
//     movie :{
//         type: mongoose.Types.ObjectId,
//         ref: "Movie",
//         required: true
//     },
//     date:{
//         type: Date,
//         required: true
//     },
//     seatNumber:{
//         type: Number,
//         required: true
//     },
//     user:{
//         type: mongoose.Types.ObjectId,
//         ref: "User",
//         required: true
//     },
// })

// export default mongoose.model("Booking", bookingSchema);
import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  movieName: { type: String, required: true },
  movieId: { type: String, required: true },
  theaterName: { type: String, required: true },
  theaterId: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  seatNumbers: { type: [String], required: true },
  totalAmount: { type: Number, required: false },
  userId: { type: String, required: true },
  paymentId: { type: String, required: false }, // Razorpay payment ID
  paymentStatus: { type: String, required: true, enum: ['pending', 'paid'], default: 'pending' }
}, { timestamps: true });

export default mongoose.model('Bookings', bookingSchema);
