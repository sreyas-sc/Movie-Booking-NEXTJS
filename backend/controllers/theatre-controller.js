
// import Theatre from '../models/Theater.js'; 
import mongoose from 'mongoose';
import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import { Theatre } from '../models/Theater.js';


const verifyToken = promisify(jwt.verify);

export const addTheatre = async (req, res) => {

    try {
        const extractedToken = req.headers.authorization?.split(" ")[1];
        if (!extractedToken) {
            return res.status(404).json({ message: "Token not found" });
        }

        let adminId;
        try {
            const decoded = await verifyToken(extractedToken, 'MYSECRETKEY');
            adminId = decoded.id;
        } catch (err) {
            return res.status(400).json({ message: err.message });
        }

        const { name, location, seatLayout, showtimes } = req.body;

        if (!name || !location || !seatLayout.length || !showtimes.length) {
            return res.status(402).json({ message: "Invalid inputs!" });
        }

        // Create a new Theatre object
        let theatre = new Theatre({
            name,
            location,
            seatLayout,
            showtimes,
            admin: adminId,
        });
        // Start a transaction to ensure atomic operations
        const session = await mongoose.startSession();
        session.startTransaction();
        await theatre.save({ session });

       /*  const adminUser = await Admin.findById(adminId);
        adminUser.addedTheatres.push(theatre);
        await adminUser.save({ session }); */

        await session.commitTransaction();
        return res.status(201).json({ theatre });
    } catch (err) {
        console.error("Error during theatre addition:", err);
        return res.status(500).json({ message: "Theatre creation failed" });
    }
};



export const getAllTheatres = async (req, res) => {
    try {
      const theatres = await Theatre.find();
      const formattedTheatres = theatres.map(theater => ({
        ...theater.toObject(),
        seatLayout: theater.seatLayout || [], // Default to empty array if undefined
      }));
      return res.status(200).json(formattedTheatres);
    } catch (err) {
      console.error("Error fetching theatres:", err);
      return res.status(500).json({ message: "Error fetching theatres" });
    }
  };
  
