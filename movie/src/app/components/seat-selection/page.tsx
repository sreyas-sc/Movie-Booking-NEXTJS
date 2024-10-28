'use client';
import React, { useEffect, useState } from 'react';
import { Typography, Button, Box } from '@mui/material';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { useRouter } from "next/navigation";
import { ArmchairIcon } from 'lucide-react';
import { checkSeatAvailability } from '@/app/api-helpers/api-helpers.js';
import styles from './seat.module.css'

interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface TheaterDetails {
  name: string;
  place: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayPaymentResponse) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
}

interface RazorpayWindow extends Window {
  Razorpay: new (options: RazorpayOptions) => {
    open: () => void;
  };
}

const SeatSelection = () => {
  const router = useRouter();
  const [seatLayout, setSeatLayout] = useState<string[][]>([]);
  const [selectedSeats, setSelectedSeats] = useState<Set<string>>(new Set());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTheater, setSelectedTheater] = useState<string | null>(null);
  const [movieName, setMovieName] = useState<string | null>(null);
  const [movieId, setMovieId] = useState<string | null>(null);
  const [selectedTimes, setSelectedTimes] = useState<{ [key: string]: string | null }>({});
  const [bookedSeats, setBookedSeats] = useState<Set<string>>(new Set());

  useEffect(() => {
    const movieNameFromStorage = localStorage.getItem('selectedMovie');
    const movieId = localStorage.getItem('selectedMovieId');
    const savedDate = localStorage.getItem('selectedDate');
    const savedTheater = localStorage.getItem('selectedTheater');
    const savedTimes = localStorage.getItem('selectedTimes');
    const savedSeatLayout = localStorage.getItem('seatLayout');

    if (movieNameFromStorage) setMovieName(movieNameFromStorage);
    if (movieId) setMovieId(movieId);
    if (savedDate) setSelectedDate(savedDate);
    if (savedTheater) setSelectedTheater(savedTheater);
    if (savedTimes) setSelectedTimes(JSON.parse(savedTimes));
    if (savedSeatLayout) {
      const seatNumbers = JSON.parse(savedSeatLayout) as number[];
      setSeatLayout(generateSeatLayout(seatNumbers));
    }

    const fetchBookedSeats = async () => {
      const selectedTimesString = localStorage.getItem('selectedTimes');
      if (selectedTimesString) {
        const selectedTimes = JSON.parse(selectedTimesString);
        const time = selectedTimes[Object.keys(selectedTimes)[0]];

        if (movieId && savedTheater && savedDate && time) {
          const booked = await checkSeatAvailability({
            movieId,
            theaterId: savedTheater.split('-')[0],
            date: savedDate,
            time: Object.values(selectedTimes).join(', '),
          });
          setBookedSeats(new Set(booked));
        }
      }
    };

    fetchBookedSeats();
  }, []);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleSeatClick = (seatLabel: string) => {
    if (bookedSeats.has(seatLabel)) return;
    setSelectedSeats(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(seatLabel)) {
        newSelection.delete(seatLabel);
      } else if (newSelection.size < 10) {
        newSelection.add(seatLabel);
      }
      return newSelection;
    });
  };

  const generateSeatLayout = (seatNumbers: number[]): string[][] => {
    const seatLabels: string[] = [];
    let index = 0;

    for (let i = 0; i < seatNumbers.length; i++) {
      if (seatNumbers[i] === 1) {
        const rowLabel = String.fromCharCode(65 + Math.floor(index / 20));
        const seatNumber = (index % 20) + 1;
        seatLabels.push(`${rowLabel}${seatNumber}`);
        index++;
      }
    }

    const result: string[][] = [];
    for (let i = 0; i < Math.ceil(seatLabels.length / 20); i++) {
      result.push(seatLabels.slice(i * 20, i * 20 + 20));
    }

    return result;
  };

  const handleBookSeats = () => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => proceedBooking();
    script.onerror = () => {
      console.error('Failed to load Razorpay.');
      toast.error('Failed to load payment gateway.');
    };
    document.body.appendChild(script);
    proceedBooking();
  };

  const proceedBooking = async () => {
    try {
      const response = await fetch('https://movie-booking-nextjs.onrender.com/booking/razorpay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          movieName,
          movieId,
          theaterName: selectedTheater?.split('-')[1] || '',
          theaterId: selectedTheater?.split('-')[0] || '',
          date: selectedDate,
          time: Object.values(selectedTimes).join(', '),
          seatNumbers: Array.from(selectedSeats),
          totalAmount: totalCost,
          userId: localStorage.getItem('userId'),
          amount: totalCost * 100,
          currency: 'INR',
        }),
      });

      const data = await response.json();
      if (!data || !data.orderId) {
        console.error('Order creation failed:', data);
        toast.error('Failed to create booking order.');
        return;
      }

      const options: RazorpayOptions = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: 'Movie Booking',
        description: 'Seat Booking',
        order_id: data.orderId,
        handler: async (response: RazorpayPaymentResponse) => {
          console.log('Payment successful!');
          const bookingResponse = await fetch('https://movie-booking-nextjs.onrender.com/booking/book', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              movieName,
              movieId,
              userId: localStorage.getItem('userId'),
              theaterName: selectedTheater?.split('-')[1] || '',
              theaterId: selectedTheater?.split('-')[0] || '',
              date: selectedDate,
              time: Object.values(selectedTimes).join(', '),
              seatNumbers: Array.from(selectedSeats),
              totalAmount: totalCost,
              paymentId: response.razorpay_payment_id,
            }),
          });

          const bookingData = await bookingResponse.json();
          if (bookingData) {
            Swal.fire({
              title: "Payment Done!",
              text: "The movie booking is completed",
              icon: "success"
            });
            router.push('/components/user-profile');
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: '',
        },
        theme: {
          color: '#F37254',
        },
      };

      // const payment = new (window as any).Razorpay(options);
      const Razorpay = window as RazorpayWindow;
      const payment = new Razorpay.Razorpay(options);
      payment.open();
    } catch (error) {
      console.error('Failed to create Razorpay order:', error);
      toast.error('Failed to create order.');
    }
  };

  const seatCost = 120;
  const totalCost = selectedSeats.size * seatCost;

  const formatDate = (date: string | null): string => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTheaterDetails = (theater: string | null): TheaterDetails => {
    if (!theater) return { name: '', place: '' };
    const parts = theater.split('-');
    return { 
      name: parts[1] || '',
      place: parts[2] || ''
    };
  };

  const { name: theaterName, place: theaterPlace } = getTheaterDetails(selectedTheater);

  // const SeatIcon = ({ label, isSelected, isBooked }: { label: string; isSelected: boolean; isBooked: boolean }) => (
  //   <div className="flex flex-col items-center m-2">
  //     <Button
  //       variant="contained"
  //       disabled={isBooked}
  //       onClick={() => handleSeatClick(label)}
  //       sx={{
  //         backgroundColor: isBooked ? 'red' : isSelected ? 'green' : '#1976d2',
  //         color: 'white',
  //         '&:hover': {
  //           backgroundColor: isBooked ? 'darkred' : isSelected ? 'darkgreen' : '#1565c0',
  //         },
  //         width: '40px',
  //         height: '40px',
  //       }}
  //     >
  //       {/* {label} */}
  //       <ArmchairIcon/>
  //     </Button>
  //     <Typography variant="caption" sx={{ color: isBooked ? 'red' : 'black' }}>
  //       {isBooked ? 'Booked' : isSelected ? 'Selected' : 'Available'}
  //     </Typography>
  //   </div>
  // );
  const SeatIcon = ({ label, isSelected, isBooked }: { label: string; isSelected: boolean; isBooked: boolean }) => (
    <div className="flex flex-col items-center m-2">
      <Button
        variant="outlined" // Change to 'outlined' for the red border
        disabled={isBooked}
        onClick={() => handleSeatClick(label)}
        sx={{
          backgroundColor: isBooked ? 'grey' : isSelected ? 'rgba(248, 68, 100, 1)' : 'white', // White background when not selected
          borderColor: isBooked ? 'red' : 'grey', // Red border
          color: isBooked ? 'white' : isSelected ? 'white' : 'black', // Text color based on state
          '&:hover': {
            backgroundColor: isBooked ? 'darkred' : isSelected ? 'rgba(248, 68, 100, 1)' : 'rgba(255, 0, 0, 0.1)', // Light red background on hover if not booked
          },
          width: '40px',
          height: '40px',
          padding: '10px',
          marginLeft: '10px'
        }}
      >
        <ArmchairIcon/>
      </Button>
      {/* <Typography variant="caption" sx={{ color: isBooked ? 'red' : 'black' }}>
        {isBooked ? '' : isSelected ? '' : ''}
      </Typography> */}
    </div>
  );
  
  return (
    
    <Box sx={{ p: 4 }}>
      <div className={styles.headercontainer}>
      <Typography variant="h4" component="h1" gutterBottom>
        {movieName}
      </Typography>
      <Typography variant="h6" gutterBottom>
        {theaterName} - {theaterPlace}
      </Typography>
      <Typography variant="body1" gutterBottom>
        {formatDate(selectedDate)} - {Object.values(selectedTimes).join(', ')}
      </Typography>
      {/* <Typography variant="body1" gutterBottom>
        Time: {Object.values(selectedTimes).join(', ')}
      </Typography> */}
      <Typography variant="h6" gutterBottom>
        Selected Seats: {Array.from(selectedSeats).join(', ') || 'None'}
      </Typography>
     
      </div>
      <div className={styles.mainscreenconatiner}>
        <div className={styles.screenContainer}>
          <p className={styles.allEyesThisWay}>All eyes this way</p>
        </div>
      </div>
      <div className={styles.seatContainer}>
      <Box display="flex" flexDirection="column" alignItems="center">
        {seatLayout.map((row, rowIndex) => (
          <Box key={rowIndex} display="flex" justifyContent="center" mb={1}>
            {row.map((seatLabel) => {
              const isBooked = bookedSeats.has(seatLabel);
              const isSelected = selectedSeats.has(seatLabel);
              return <SeatIcon key={seatLabel} label={seatLabel} isSelected={isSelected} isBooked={isBooked} />;
            })}
          </Box>
        ))}
      </Box>
      </div>
      <div className={styles.priceContainer}>
        <div className={styles.subpriceContainer}>
          <Typography variant="h6" gutterBottom>
            Total Cost: ₹{totalCost}
          </Typography>
        </div>
      </div>
      <div className={styles.btncontainer}>
      
      <Button
        variant="contained"
        onClick={handleBookSeats}
        disabled={selectedSeats.size === 0}
        sx={{
          marginTop: 2,
          backgroundColor: '#4CAF50',
          '&:hover': {
            backgroundColor: '#388E3C',
          },
        }}
      >
        Book Seats
      </Button>
      </div>
    </Box>
  );
};

export default SeatSelection;
