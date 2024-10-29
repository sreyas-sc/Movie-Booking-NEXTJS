'use client';
import { getUserBooking, getUserDetails } from '@/app/api-helpers/api-helpers.js';
import { Box, Card, CardContent, CardHeader,Container,Grid, Typography,Avatar,Paper,Divider,Chip,IconButton,Tab,Tabs,Skeleton,Stack,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MovieIcon from '@mui/icons-material/Movie';
import DateRangeIcon from '@mui/icons-material/DateRange';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TheatersIcon from '@mui/icons-material/Theaters';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import PaymentIcon from '@mui/icons-material/Payment';
import CalendarViewMonthIcon from '@mui/icons-material/CalendarViewMonth';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { FaHistory } from "react-icons/fa";


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
  const [loading, setLoading] = useState(true);
  const [viewType, setViewType] = useState(0);
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsRes, userRes] = await Promise.all([
          getUserBooking(),
          getUserDetails()
        ]);

        if (bookingsRes && bookingsRes.bookings) {
          setBookings(bookingsRes.bookings);
        }
        if (userRes) {
          setUser(userRes);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleViewChange = (event: React.SyntheticEvent, newValue: number) => {
    setViewType(newValue);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const filterBookings = () => {
    const today = new Date();
    if (selectedTab === 1) {
      // Upcoming Bookings
      return bookings.filter((booking) => new Date(booking.date) >= today);
    } else if (selectedTab === 2) {
      // Past Bookings
      return bookings.filter((booking) => new Date(booking.date) < today);
    }
    return bookings; // All Bookings
  };

  const UserProfileSection = () => (
    <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
      <Box display="flex" alignItems="center" gap={3}>
        <Avatar
          sx={{
            width: 100,
            height: 100,
            bgcolor: 'primary.main',
            fontSize: '3rem'
          }}
        >
          {user.email?.[0]?.toUpperCase() || <AccountCircleIcon fontSize="large" />}
        </Avatar>
        <Box>
          {/*  */}
          <Typography variant="body1" color="text.secondary">
            {user.email}
          </Typography>
          <Box mt={2}>
            <Chip
              icon={<MovieIcon />}
              label={`${bookings.length} Bookings`}
              color="primary"
              sx={{ mr: 1 }}
            />
          </Box>
        </Box>
      </Box>
    </Paper>
  );

  const BookingCard = ({ booking }: { booking: Booking }) => (
    <Card
      elevation={3}
      sx={{
        borderRadius: 2,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
        }
      }}
    >
      <CardHeader
        title={
          <Box display="flex" alignItems="center" gap={1}>
            <MovieIcon color="primary" />
            <Typography variant="h6" component="span">
              {booking.movieName}
            </Typography>
          </Box>
        }
      />
      <Divider />
      <CardContent>
        <Stack spacing={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <TheatersIcon color="action" />
            <Typography variant="body1">
              {booking.theaterName}
            </Typography>
          </Box>
          
          <Box display="flex" alignItems="center" gap={1}>
            <DateRangeIcon color="action" />
            <Typography variant="body1">
              {formatDate(booking.date)}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            <AccessTimeIcon color="action" />
            <Typography variant="body1">
              {booking.time}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            <EventSeatIcon color="action" />
            <Typography variant="body1">
              Seats: {booking.seatNumbers.join(', ')}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            <PaymentIcon color="action" />
            <Chip
              label={booking.paymentStatus}
              color={getStatusColor(booking.paymentStatus)}
              size="small"
            />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );

  const BookingList = ({ booking }: { booking: Booking }) => (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        mb: 2,
        borderRadius: 2,
        '&:hover': {
          bgcolor: 'action.hover',
        }
      }}
    >
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={3}>
          <Typography variant="h6" component="div">
            {booking.movieName}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <TheatersIcon color="action" fontSize="small" />
            <Typography variant="body2">
              {booking.theaterName}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <DateRangeIcon color="action" fontSize="small" />
            <Typography variant="body2">
              {new Date(booking.date).toLocaleDateString()}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <EventSeatIcon color="action" fontSize="small" />
            <Typography variant="body2">
              {booking.seatNumbers.join(', ')}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Box display="flex" justifyContent="flex-end">
            <Chip
              label={booking.paymentStatus}
              color={getStatusColor(booking.paymentStatus)}
              size="small"
            />
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
        </Box>
        <Grid container spacing={3}>
          {[1, 2, 3, 4].map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item}>
              <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <UserProfileSection />
      
      <Paper elevation={3} sx={{ borderRadius: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            aria-label="booking tabs"
            centered
          >
            <Tab 
              icon={<MovieIcon />} 
              label="All Bookings" 
            />
            <Tab 
              icon={<DateRangeIcon />} 
              label="Upcoming" 
            />
            <Tab 
              icon={<FaHistory />} 

              label="Past Bookings" 
            />
          </Tabs>
        </Box>

        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5">
              {selectedTab === 0 ? 'All Bookings' : selectedTab === 1 ? 'Upcoming Bookings' : 'Past Bookings'}
            </Typography>
            <Box>
              <IconButton 
                color={viewType === 0 ? 'primary' : 'default'}
                onClick={(e) => handleViewChange(e, 0)}
              >
                <CalendarViewMonthIcon />
              </IconButton>
              <IconButton 
                color={viewType === 1 ? 'primary' : 'default'}
                onClick={(e) => handleViewChange(e, 1)}
              >
                <ListAltIcon />
              </IconButton>
            </Box>
          </Box>

          {viewType === 0 ? (
            <Grid container spacing={3}>
              {filterBookings().map((booking) => (
                <Grid item xs={12} sm={6} md={4} key={booking._id}>
                  <BookingCard booking={booking} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box>
              {filterBookings().map((booking) => (
                <BookingList key={booking._id} booking={booking} />
              ))}
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default UserProfile;