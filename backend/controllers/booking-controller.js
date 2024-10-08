
import mongoose from 'mongoose';
import Bookings from '../models/Bookings.js';
import Movie from '../models/Movie.js';
import razorpay from 'razorpay';
import QRCode from 'qrcode';
import dotenv from 'dotenv';
import Twilio from 'twilio';
import ImageKit from 'imagekit';

dotenv.config();

// Initialize Twilio client with account SID and Auth token from environment variables
const client = new Twilio(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);

// Initialize Razorpay instance
const razorpayInstance = new razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET,
});

// Initialize ImageKit
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

// *****************Send WhatsApp message with Twilio******************
async function sendWhatsappMessage(to, message, qrCodeUrl) {
  const fullMessage = `${message}\n\nQR Code: \n\n${qrCodeUrl}`;

  try {
    const response = await client.messages.create({
      body: fullMessage,
      from: `whatsapp:${process.env.WHATSAPP_NO}`, // Twilio WhatsApp sandbox number
      to: `whatsapp:${+918111904512}`, // Customer's WhatsApp number
      mediaUrl: [qrCodeUrl],
    });
    console.log("response of twilio message", response)
  } catch (error) {
    console.error("Error sending WhatsApp message:", error);
    throw new Error("Error sending WhatsApp message");
  }
}

// ********************Create a new booking***********************
export const newBooking = async (req, res) => {
  const { movieName, movieId, theaterName, theaterId, date, time, seatNumbers, totalAmount, userId, paymentId } = req.body;

  try {
    // Create a new booking instance
    const booking = new Bookings({
      movieName,
      movieId,
      theaterName,
      theaterId,
      date,
      time,
      seatNumbers,
      totalAmount,
      userId,
      paymentId,
      paymentStatus: 'paid',
    });

    // Convert booking info to QR code
    const qrCodeUrl = await QRCode.toDataURL(JSON.stringify(booking));

    // Upload QR Code to ImageKit
    const uploadResponse = await imagekit.upload({
      file: qrCodeUrl, // base64 encoded string
      fileName: "qr-code.png",
    });


    // Save the booking to the database
    const savedBooking = await booking.save();

    // Send WhatsApp message with QR code
    const message = `Hi! \n Your booking for *${movieName}* on *${new Date(date).toLocaleDateString('en-IN')}* at *${time}* is confirmed 🎊 for seat  numbers *${seatNumbers}* \n Thank you for booking with us. \n Happy watching🎥`;

    await sendWhatsappMessage(userId, message, uploadResponse.url);

    return res.status(201).json({ message: 'Booking successful', booking: savedBooking });
  } catch (error) {
    console.error('Error creating booking:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// ****************Get booking by ID*********************
export const getBookingById = async (req, res) => {
  const id = req.params.id;
  let booking;

  try {
    booking = await Bookings.findById(id);
  } catch (err) {
    return console.log(err);
  }

  if (!booking) {
    return res.status(404).json({ message: "Booking not found with the given ID" });
  }
  return res.status(200).json({ booking });
};

// *************Delete a booking by ID**********************
export const deleteBooking = async (req, res) => {
  const id = req.params.id;
  let booking;

  try {
    booking = await Bookings.findByIdAndRemove(id).populate("user movie");
    const session = await mongoose.startSession();
    session.startTransaction();
    await booking.user.bookings.pull(booking);
    await booking.movie.bookings.pull(booking);
    await booking.movie.save({ session });
    await booking.user.save({ session });

    await session.commitTransaction();
  } catch (err) {
    return console.log(err);
  }

  if (!booking) {
    return res.status(500).json({ message: "Unable to delete" });
  }

  return res.status(200).json({ message: "Successfully deleted the booking" });
};

// ************* Get the booked seats****************
// Server-side function to handle requests
export const getBookedSeatsHandler = async (req, res) => {
  const { movieId, theaterId, date, time } = req.query;

  try {
    // Fetch bookings that match the provided parameters
    const bookings = await Bookings.find({
      movieId,
      theaterId,
      date,
      time,
    });

    // Extract the seat numbers from the bookings
    const bookedSeats = bookings.flatMap(booking => booking.seatNumbers);
    console.log(bookedSeats)
    
    res.status(200).json(bookedSeats);
  } catch (error) {
    console.error('Error fetching booked seats:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



// *************Razorpay setup******************
export const razorpayOrder = async (req, res) => {
  try {
    const { totalAmount, userId, movieName, theaterName, bookingDate, phoneNumber } = req.body;
    // Create Razorpay order
    const razorpayOrder = await razorpayInstance.orders.create({
      amount: totalAmount * 100, // Amount in paise
      currency: 'INR',
      receipt: 'receipt_id',
    });
    // Send the response back first
    res.json({
      key: process.env.RAZORPAY_KEY_ID, // Your Razorpay Key ID
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      orderId: razorpayOrder.id, // Razorpay order ID
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    // In case of error, ensure response hasn't been sent already
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to create Razorpay order' });
    }
  }
};


// *************Fetech selected seats*******************
export const fetchBookedSeats = async (req, res) => {
  const { movieId, theaterId, date, time } = req.body;

  try {
    // Find all bookings that match the given criteria
    const bookings = await Bookings.find({
      movieId,
      theaterId,
      date,
      time,
    });

    // Collect all booked seats for the specified show
    const bookedSeats = new Set();
    bookings.forEach(booking => {
      booking.seatNumbers.forEach(seat => bookedSeats.add(seat));
    });

    // Respond with an array of booked seats
    return res.status(200).json({ bookedSeats: Array.from(bookedSeats) });
  } catch (error) {
    console.error('Error fetching booked seats:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
