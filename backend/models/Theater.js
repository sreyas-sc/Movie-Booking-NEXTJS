// import mongoose from "mongoose";

// const seatSchema = new mongoose.Schema({
//   number: String, // Seat identifier
//   isBooked: { type: Boolean, default: false }, 
//   bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // Reference to the user who booked it
// });

// const showtimeSchema = new mongoose.Schema({
//   movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
//   date: { type: Date, required: true },
//   time: { type: String, required: true }, 
//   seats: [seatSchema],
// });

// // const theaterSchema = new mongoose.Schema({
// //   name: { type: String, required: true },
// //   location: { type: String, required: true },
// //   totalSeats: Number,
// //   seatLayout: [], 
// //   showtimes: []
// // });

// const theatreSchema = new mongoose.Schema({
//   name: String,
//   location: String,
//   seatLayout: { type: [Number], default: [] }, // Ensure seatLayout is an array
//   showtimes: [{ time: String }]
// });

// export const Theatre = mongoose.model('Theatre', theatreSchema);


// // export default mongoose.model("Theater", theaterSchema)


// models/Theater.js

import mongoose from "mongoose";

const seatSchema = new mongoose.Schema({
  number: String, // Seat identifier
  isBooked: { type: Boolean, default: false }, 
  bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // Reference to the user who booked it
});

const showtimeSchema = new mongoose.Schema({
  time: { type: String, required: true },  // Only time is required
});

const theatreSchema = new mongoose.Schema({
  name: { type: String, required: true },  // Make name required
  location: { type: String, required: true },  // Make location required
  seatLayout: { type: [Number], default: [] }, // Ensure seatLayout is an array
  showtimes: [showtimeSchema],  // Array of showtimes with only time
});

export const Theatre = mongoose.model('Theatre', theatreSchema);
