// 'use client';
// import React, { useEffect, useState } from 'react';
// import { Box, Typography, Button, Grid } from '@mui/material';
// import toast from 'react-hot-toast'; 
// import styles from './seat.module.css';
// import Swal from 'sweetalert2'


// interface RazorpayPaymentResponse {
//   razorpay_payment_id: string;
//   razorpay_order_id: string;
//   razorpay_signature: string;
// }

// const SeatSelection: React.FC = () => {
//   const [seatLayout, setSeatLayout] = useState<string[][]>([]);
//   const [selectedSeats, setSelectedSeats] = useState<Set<string>>(new Set());
//   const [selectedDate, setSelectedDate] = useState<string | null>(null);
//   const [selectedTheater, setSelectedTheater] = useState<string | null>(null);
//   const [movieName, setMovieName] = useState<string | null>(null);
//   const [movieId, setMovieId] = useState<string | null>(null);
//   const [selectedTimes, setSelectedTimes] = useState<{ [key: string]: string | null }>({});

//   useEffect(() => {
//     const movieNameFromStorage = localStorage.getItem('selectedMovie');
//     const movieId = localStorage.getItem('selectedMovieId');
//     const savedDate = localStorage.getItem('selectedDate');
//     const savedTheater = localStorage.getItem('selectedTheater');
//     const savedTimes = localStorage.getItem('selectedTimes');
//     const savedSeatLayout = localStorage.getItem('seatLayout');

//     if (movieNameFromStorage) setMovieName(movieNameFromStorage);
//     if (movieId) setMovieId(movieId);
//     if (savedDate) setSelectedDate(savedDate);
//     if (savedTheater) setSelectedTheater(savedTheater);
//     if (savedTimes) setSelectedTimes(JSON.parse(savedTimes));
//     if (savedSeatLayout) {
//       const seatNumbers = JSON.parse(savedSeatLayout);
//       setSeatLayout(generateSeatLayout(seatNumbers));
//     }
//   }, []);

//   useEffect(() => {
//     const script = document.createElement('script');
//     script.src = 'https://checkout.razorpay.com/v1/checkout.js';
//     script.async = true;
//     script.onload = () => {
//       console.log('Razorpay script loaded successfully.');
//     };
//     script.onerror = () => {
//       console.error('Failed to load Razorpay script.');
//     };
//     document.body.appendChild(script);
  
//     return () => {
//       document.body.removeChild(script);
//     };
//   }, []);
  

//   const handleSeatClick = (seatLabel: string) => {
//     setSelectedSeats(prev => {
//       const newSelection = new Set(prev);
//       if (newSelection.has(seatLabel)) {
//         newSelection.delete(seatLabel);
//       } else if (newSelection.size < 10) {
//         newSelection.add(seatLabel);
//       }
//       return newSelection;
//     });
//   };


// const handleBookSeats = () => {
//     const script = document.createElement('script');
//     script.src = 'https://checkout.razorpay.com/v1/checkout.js'; // Razorpay script URL
//     script.async = true;
//     script.onload = () => proceedBooking(); // Proceed to booking once Razorpay is loaded
//     script.onerror = () => {
//       console.error('Failed to load Razorpay.');
//       toast.error('Failed to load payment gateway.');
//     };
//     document.body.appendChild(script);
//     proceedBooking(); // Proceed if Razorpay is already loaded
//   };
  
//   const proceedBooking = async () => {
//     try {
//       const response = await fetch('http://localhost:5000/booking/razorpay', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           movieName,
//           movieId,
//           theaterName: selectedTheater?.split('-')[1] || '',
//           theaterId: selectedTheater?.split('-')[0] || '',
//           date: selectedDate,
//           time: Object.values(selectedTimes).join(', '),
//           seatNumbers: Array.from(selectedSeats),
//           totalAmount: totalCost,
//           userId: localStorage.getItem('userId'),
//           amount: totalCost * 100, // Razorpay amount in paise
//           currency: 'INR',
//         }),
//       });
      
//       const data = await response.json();
//       if (!data || !data.orderId) {
//         console.error('Order creation failed:', data);
//         toast.error('Failed to create booking order.');
//         return;
//       }
  
//       const options = {
//         key: data.key,
//         amount: data.amount,
//         currency: data.currency,
//         name: 'Movie Booking',
//         description: 'Seat Booking',
//         order_id: data.orderId,
//         handler: async (response: RazorpayPaymentResponse) =>{
//           console.log('Payment successful!');
          
//           // Send booking data to the backend after successful payment
//           const bookingResponse = await fetch('http://localhost:5000/booking/book', {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//               movieName,
//               movieId,
//               userId: localStorage.getItem('userId'),
//               theaterName: selectedTheater?.split('-')[1] || '',
//               theaterId: selectedTheater?.split('-')[0] || '',
//               date: selectedDate,
//               time: Object.values(selectedTimes).join(', '),
//               seatNumbers: Array.from(selectedSeats),
//               totalAmount: totalCost, // Total cost in rupees
//               paymentId: response.razorpay_payment_id, // Razorpay payment ID
//             }),
//           });
          
//           const bookingData = await bookingResponse.json();
//           if (bookingData) {
//             Swal.fire({
//               title: "Payment Done!",
//               text: "The movie booking is completed",
//               icon: "success"
//             });
//           }
//         },
//         prefill: {
//           name: '', // Prefill user details if available
//           email: '',
//           contact: '',
//         },
//         theme: {
//           color: '#F37254',
//         },
//       };
  
//       // const payment = new (window as any).Razorpay(options);
//       const payment = new (window as { Razorpay: new (options: typeof options) => { open: () => void } }).Razorpay(options); 
//       payment.open();
//     } catch (error) {
//       console.error('Failed to create Razorpay order:', error);
//       toast.error('Failed to create order.');
//     }
//   };
  
// const generateSeatLayout = (seatNumbers: number[]): string[][] => {
//     const seatLabels: string[] = [];
//     let index = 0;
  
//     // Generate seat labels based on seat numbers
//     for (let i = 0; i < seatNumbers.length; i++) {
//       if (seatNumbers[i] === 1) {
//         const rowLabel = String.fromCharCode(65 + Math.floor(index / 20)); // 20 seats per row
//         const seatNumber = (index % 20) + 1;
//         seatLabels.push(`${rowLabel}${seatNumber}`);
//         index++;
//       }
//     }
  
//     // Split the seat labels into rows
//     const result: string[][] = [];
//     for (let i = 0; i < Math.ceil(seatLabels.length / 20); i++) {
//       result.push(seatLabels.slice(i * 20, i * 20 + 20)); // 20 seats per row
//     }
  
//     return result;
//   };
  
  
//   const seatCost = 120;
//   const totalCost = selectedSeats.size * seatCost;

//   const formatDate = (date: string | null) => {
//     if (!date) return '';
//     const d = new Date(date);
//     return d.toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     });
//   };

//   const getTheaterDetails = (theater: string | null) => {
//     if (!theater) return { name: '', place: '' };
//     const parts = theater.split('-');
//     const name = parts[1] || '';
//     const place = parts[2] || '';
//     return { name, place };
//   };

//   const { name: theaterName, place: theaterPlace } = getTheaterDetails(selectedTheater);

//   return (
//     <div>
//       <Typography variant="h4" textAlign={'center'} padding={3}>
//         Select Seats
//       </Typography>

//       <Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
//         <Typography variant="h6">
//           Movie: {movieName}
//         </Typography>
//         <Typography variant="h6">
//           Date: {formatDate(selectedDate)}
//         </Typography>
//         <Typography variant="h6">
//           Theater: {theaterName} {theaterPlace && `(${theaterPlace})`}
//         </Typography>
//         <Typography variant="h6">
//           Time: {Object.values(selectedTimes).join(', ')}
//         </Typography>

//         <Box
//           width="70%"
//           height="50px"
//           mt={10}
//           mb={10}
//           sx={{
//             alignContent: "center",
//             textAlign: "center",
//             background: "grey",
//             borderRadius: "0 0 50px 50px",
//             borderTopLeftRadius: 0,
//             borderTopRightRadius: 0,
//           }}
//         >
//           <Typography sx={{ color: "white", fontWeight: 700 }}>All eyes this way</Typography>
//         </Box>

//         <Box marginTop={3} width="100%"  mx="auto">
//           {seatLayout.map((row, rowIndex) => (
//             <Grid container spacing={1} key={rowIndex} justifyContent="center" marginBottom={1}>
//               {row.map(seat => (
//                 <Grid item key={seat}>
//                   <Button
//                     key={seat}
//                     variant={selectedSeats.has(seat) ? 'contained' : 'outlined'}
//                     onClick={() => handleSeatClick(seat)}
//                     className={styles.seatButton}
//                     sx={{
//                         minWidth: 0,
//                         width: '100%',
//                         height: '40px',
//                         backgroundColor: selectedSeats.has(seat) ? 'rgba(248, 68, 100)' : 'transparent',
//                         color: selectedSeats.has(seat) ? 'white' : 'rgba(248, 68, 100)',
//                         borderColor: 'rgba(248, 68, 100)',
//                         '&:hover': {
//                         backgroundColor: selectedSeats.has(seat) ? 'darkred' : 'rgba(248, 68, 100, 0.1)',
//                         },
//                         margin: '2px',
//                         fontSize: '0.75rem',
//                     }}
//                     >
//                     {seat}
//                 </Button>

//                 </Grid>
//               ))}
//             </Grid>
//           ))}
//         </Box>

//         <Box marginTop={2} textAlign={'center'}>
//           <Typography variant="h6">
//             Selected Seats: {Array.from(selectedSeats).join(', ')}
//           </Typography>
//           <Typography variant="h6" marginTop={1}>
//             Total Cost: ₹{totalCost}
//           </Typography>
//         </Box>

//         <Box display={'flex'} justifyContent={'center'} padding={2}>
//           <Button
//             variant="contained"
//             onClick={handleBookSeats}
//             sx={{ backgroundColor: 'rgba(248, 68, 100)' }}
//           >
//             Book Selected Seats
//           </Button>
//         </Box>
//       </Box>
//     </div>
//   );
// };

// export default SeatSelection;
'use client';
import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Grid } from '@mui/material';
import toast from 'react-hot-toast'; 
import styles from './seat.module.css';
import Swal from 'sweetalert2';

// Interface for Razorpay payment response
interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

// Interface for theater details
interface TheaterDetails {
  name: string;
  place: string;
}

// Interface for Razorpay options
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

// Main SeatSelection component
const SeatSelection: React.FC = () => {
  const [seatLayout, setSeatLayout] = useState<string[][]>([]);
  const [selectedSeats, setSelectedSeats] = useState<Set<string>>(new Set());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTheater, setSelectedTheater] = useState<string | null>(null);
  const [movieName, setMovieName] = useState<string | null>(null);
  const [movieId, setMovieId] = useState<string | null>(null);
  const [selectedTimes, setSelectedTimes] = useState<{ [key: string]: string | null }>({});

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
  }, []);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      console.log('Razorpay script loaded successfully.');
    };
    script.onerror = () => {
      console.error('Failed to load Razorpay script.');
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);
  
  const handleSeatClick = (seatLabel: string) => {
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

  const handleBookSeats = () => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'; // Razorpay script URL
    script.async = true;
    script.onload = () => proceedBooking(); // Proceed to booking once Razorpay is loaded
    script.onerror = () => {
      console.error('Failed to load Razorpay.');
      toast.error('Failed to load payment gateway.');
    };
    document.body.appendChild(script);
    proceedBooking(); // Proceed if Razorpay is already loaded
  };
  
  const proceedBooking = async () => {
    try {
      const response = await fetch('http://localhost:5000/booking/razorpay', {
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
          amount: totalCost * 100, // Razorpay amount in paise
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

          // Send booking data to the backend after successful payment
          const bookingResponse = await fetch('http://localhost:5000/booking/book', {
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
              totalAmount: totalCost, // Total cost in rupees
              paymentId: response.razorpay_payment_id, // Razorpay payment ID
            }),
          });

          const bookingData = await bookingResponse.json();
          if (bookingData) {
            Swal.fire({
              title: "Payment Done!",
              text: "The movie booking is completed",
              icon: "success"
            });
          }
        },
        prefill: {
          name: '', // Prefill user details if available
          email: '',
          contact: '',
        },
        theme: {
          color: '#F37254',
        },
      };

      const payment = new (window as { Razorpay: new (options: RazorpayOptions) => { open: () => void } }).Razorpay(options); 
      payment.open();
    } catch (error) {
      console.error('Failed to create Razorpay order:', error);
      toast.error('Failed to create order.');
    }
  };

  const generateSeatLayout = (seatNumbers: number[]): string[][] => {
    const seatLabels: string[] = [];
    let index = 0;

    // Generate seat labels based on seat numbers
    for (let i = 0; i < seatNumbers.length; i++) {
      if (seatNumbers[i] === 1) {
        const rowLabel = String.fromCharCode(65 + Math.floor(index / 20)); // 20 seats per row
        const seatNumber = (index % 20) + 1;
        seatLabels.push(`${rowLabel}${seatNumber}`);
        index++;
      }
    }

    // Split the seat labels into rows
    const result: string[][] = [];
    for (let i = 0; i < Math.ceil(seatLabels.length / 20); i++) {
      result.push(seatLabels.slice(i * 20, i * 20 + 20)); // 20 seats per row
    }

    return result;
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
    const name = parts[1] || '';
    const place = parts[2] || '';
    return { name, place };
  };

  const { name: theaterName, place: theaterPlace } = getTheaterDetails(selectedTheater);

  return (
    <div>
      <Typography variant="h4" textAlign={'center'} padding={3}>
        Select Seats
      </Typography>

      <Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
        <Typography variant="h6">
          Movie: {movieName}
        </Typography>
        <Typography variant="h6">
          Theater: {theaterName} - {theaterPlace}
        </Typography>
        <Typography variant="h6">
          Date: {formatDate(selectedDate)}
        </Typography>

        <Box
          sx={{
            border: '1px solid white',
            borderRadius: '4px',
            padding: '16px',
            marginTop: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            maxWidth: '400px',
          }}
        >
          <Typography variant="h5" color={"white"}>
            Total Amount: ₹{totalCost} 
          </Typography>
        </Box>

        <Grid container spacing={2}>
          {seatLayout.map((row, rowIndex) => (
            <Grid container item key={rowIndex} justifyContent="center">
              {row.map((seatLabel) => {
                const isSelected = selectedSeats.has(seatLabel);
                return (
                  <Grid item key={seatLabel}>
                    <Button
                      variant="outlined"
                      className={isSelected ? styles.selected : styles.available}
                      onClick={() => handleSeatClick(seatLabel)}
                    >
                      {seatLabel}
                    </Button>
                  </Grid>
                );
              })}
            </Grid>
          ))}
        </Grid>
        
        <Button
          variant="contained"
          color="primary"
          onClick={handleBookSeats}
          disabled={selectedSeats.size === 0}
          sx={{ mt: 3 }}
        >
          Book Seats
        </Button>
      </Box>
    </div>
  );
};

export default SeatSelection;
