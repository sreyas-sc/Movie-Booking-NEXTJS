

import Bookings from '../models/Bookings.js';
import Users from '../models/User.js'; // Ensure this import is correct
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import otpGenerator from 'otp-generator';

// *****************To get all the users********************
export const getAllUsers = async (req, res, next) => {
  let users;
  try {
    users = await Users.find(); 
  } catch (err) {
    return console.log(err);
  }

  if (!users) {
    return res.status(500).json({ message: "Unexpected error occurred" });
  }
  return res.status(200).json({ users });
};


// ***************User sign-Up***************************
export const signup = async (req, res, next) => {
  const { phone, email, password } = req.body;
  if (!phone || phone.trim() === "" || !email || email.trim() === "" || !password || password.trim() === "") {
    return res.status(422).json({ message: "Please fill in all fields" });
  }

  const hashedPassword = bcrypt.hashSync(password);
  let user;
  try {
    user = new Users({ 
      phone,
      email,
      password: hashedPassword
    });
    user = await user.save();
  } catch (err) {
    return console.log(err);
  }
  if (!user) {
    return res.status(500).json({ message: "Unexpected error occurred" });
  }
  return res.status(201).json({ id: user._id });
};

// ******************for the user login***********************
export const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || email.trim() === "" || !password || password.trim() === "") {
    return res.status(422).json({ message: "Please enter both email and password" });
  }

  let existingUser;
  try {
    existingUser = await Users.findOne({ email }); // Use `Users` instead of `users`
  } catch (err) {
    return console.log(err);
  }

  if (!existingUser) {
    return res.status(404).json({ message: "Unable to find user from this email" });
  }

  const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);
  if (!isPasswordCorrect) {
    return res.status(400).json({ message: "Invalid credentials" });
  }
  return res.status(200).json({ message: "Login success",
    userId: existingUser._id 
   });
};


//  *********************to get the bookings of the user***********************
export const getBookingsOfUser = async (req, res, next) => {
  const id = req.params.id;
  let bookings;
  try {
    bookings = await Bookings.find({ userId: id });
  } catch (err) {
    return console.log(err);
  }
  if (!bookings) {
    return res.status(500).json({ message: "No bookings found for this user" });
  }
  return res.status(200).json({ bookings });
};


// ****************************Google Sign in**********************************
export const googleSignIn = async (req, res, next) => {
  const { email } = req.body;

  if (!email || email.trim() === "") {
    console.log("Email is missing or empty");
    return res.status(422).json({ message: "Email is required" });
  }

  try {
    console.log("Searching for user with email:", email);
    // Check if a user with this email exists
    const user = await Users.findOne({ email });

    if (user) {
      console.log("User found with ID:", user._id);
      // User exists, return the user ID
      return res.status(200).json({ userId: user._id });
    } else {
      console.log("User not found with email:", email);
      // User does not exist
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error during Google Sign-In:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};


// ***********************To get the Logged-in User details*****************
export const getUserDetails = async (req, res) => {
  try {
    const user = await Users.find({_id:req.params.id});
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user[0]);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ***************** To send OTP for email verification ********************
export const sendOtp = async (req, res) => {
  const { email } = req.body;

  try {
      // Check if user exists
      const existingUser = await Users.findOne({ email });
      if (!existingUser) {
          return res.status(404).json({ message: "User not found" });
      }

      // Generate OTP and expiry
      const otp = otpGenerator.generate(6, { digits: true, upperCaseAlphabets: false, specialChars: false });
      const otpExpiry = Date.now() + 4 * 60 * 1000; // 4 minutes expiry

      // Save OTP to user's record
      existingUser.otp = otp;
      existingUser.otpExpiry = otpExpiry;
      await existingUser.save();

      // Configure nodemailer
      const transporter = nodemailer.createTransport({
          service: 'gmail',
          secure: true,
          port: 465,
          auth: {
              user: process.env.EMAIL_ID,
              pass: process.env.EMAIL_PASS
          }
      });

      // Email options
      const mailOptions = {
          from: process.env.EMAIL_ID,
          to: email,
          subject: 'OTP FOR LOGIN',
          text: `Hi,\n\nPlease use the following OTP to verify your Login\n\nOTP: ${otp}`
      };

      // Send OTP email
      await transporter.sendMail(mailOptions);

      // Send successful response after email is sent
      res.status(200).json({ message: "OTP sent successfully" });

  } catch (error) {
      console.error('Error sending OTP:', error);
      if (!res.headersSent) {
          res.status(500).json({ message: "Error sending OTP" });
      }
  }
};


export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;


  if (!email || !otp) {
    return res.status(422).json({ message: "Email and OTP are required" });
  }

  try {
    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.otp !== otp || Date.now() > user.otpExpiry) {
      user.otp = null;
      user.otpExpiry = null;
      await user.save();
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.otp = null;
    user.otpExpiry = null;
    await user.save();
    res.status(200).json({ success: true, message: "OTP verified successfully" });
    // res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: "Error verifying OTP" });
  }
};


// **************to get the userid of the loggedin user from google login***************
export const getUserByEmail = async (req, res) => {
  const { email } = req.body;

  try {
    // Find the user by email in the database
    const user = await Users.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Send back the user ID if found
    res.status(200).json({ userId: user._id });
  } catch (error) {
    console.error('Error fetching user by email:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};