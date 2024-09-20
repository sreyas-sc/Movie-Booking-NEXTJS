'use client';
import { deleteBooking, getUserBooking, getUserDetails } from '@/app/api-helpers/api-helpers.js';
import { Box, Card, CardContent, CardHeader, Grid, IconButton, Typography } from '@mui/material';
import React, { Fragment, useEffect, useState } from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

interface Booking {
  _id: string;
  movieName: string;
  theaterName: string;
  date: string;
  time: string;
  seatNumbers: string[];
  paymentStatus: string;
}

interface User {
  name: string;
  email: string;
}

const UserProfile = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [user, setUser] = useState<User>({} as User);

  useEffect(() => {
    console.log("Fetching user details...");

    getUserBooking()
      .then((res) => {
        console.log("Bookings API Response:", res);
        if (res && res.bookings) {
          setBookings(res.bookings);
        }
      })
      .catch((err) => console.log("Bookings API Error:", err));

    getUserDetails()
      .then((res) => {
        console.log("User Details API Response:", res);
        if (res) {
          setUser(res);
          console.log("User details fetched:", res);
        } else {
          console.log("User not found");
        }
      })
      .catch((err) => console.log("User Details API Error:", err));
  }, []);

  

  return (
    <Box display="flex" flexDirection="column" width="100%" height="100vh" padding={2}>
      {/* User profile section */}
      <Box display="flex" justifyContent="flex-end" alignItems="center" mb={2}>
        <AccountCircleIcon sx={{ fontSize: "4rem", mr: 2 }} />
        <Typography variant="h6">
          Email: {user.email}
        </Typography>
      </Box>

      {/* Booking list section */}
      <Box display="flex" flexDirection="column" width="100%">
        <Typography variant="h4" fontFamily="Verdana" textAlign="center" mb={2}>
          Your Bookings
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          {bookings.map((booking) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={booking._id}>
              <Card sx={{ maxWidth: 345,
                borderRadius: 5, 
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'space-between', // Ensure the content and button are spaced
                ":hover": {
                  boxShadow: "10px 10px 20px #ccc"
                }
                }}>
                <CardHeader
                  title={booking.movieName}
                  subheader={`Date: ${new Date(booking.date).toLocaleDateString()} | Time: ${booking.time}`}
                                 />
                <CardContent>
                  <Typography variant="body1">
                    Theater: {booking.theaterName}
                  </Typography>
                  <Typography variant="body1">
                    Seats: {booking.seatNumbers.join(', ')}
                  </Typography>
                  <Typography variant="body1">
                    Payment Status: {booking.paymentStatus}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default UserProfile;
