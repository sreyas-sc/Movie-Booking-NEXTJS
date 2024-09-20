'use client';
import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Grid } from '@mui/material';
import { useRouter } from 'next/navigation';

const SeatSelection: React.FC = () => {
  const [seatLayout, setSeatLayout] = useState<number[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<Set<number>>(new Set());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTheater, setSelectedTheater] = useState<string | null>(null);
  const [selectedTimes, setSelectedTimes] = useState<{ [key: string]: string | null }>({});
  const router = useRouter();

  useEffect(() => {
    const savedDate = localStorage.getItem('selectedDate');
    const savedTheater = localStorage.getItem('selectedTheater');
    const savedTimes = localStorage.getItem('selectedTimes');
    const savedSeatLayout = localStorage.getItem('seatLayout');

    if (savedDate) setSelectedDate(savedDate);
    if (savedTheater) setSelectedTheater(savedTheater);
    if (savedTimes) setSelectedTimes(JSON.parse(savedTimes));
    if (savedSeatLayout) setSeatLayout(JSON.parse(savedSeatLayout));
  }, []);

  const handleSeatClick = (seatNumber: number) => {
    setSelectedSeats(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(seatNumber)) {
        newSelection.delete(seatNumber);
      } else {
        newSelection.add(seatNumber);
      }
      return newSelection;
    });
  };

  const handleBookSeats = () => {
    console.log('Selected Seats:', Array.from(selectedSeats));

    // Proceed with booking logic here

    router.push('/confirmation'); // Redirect to confirmation page
  };

  return (
    <div>
      <Typography variant="h4" textAlign={'center'} padding={3}>
        Select Seats
      </Typography>

      <Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
        <Typography variant="h6">
          Date: {selectedDate}
        </Typography>
        <Typography variant="h6">
          Theater: {selectedTheater}
        </Typography>
        <Typography variant="h6">
          Time: {Object.values(selectedTimes).join(', ')}
        </Typography>

        <Grid container spacing={2} justifyContent="center" marginTop={3}>
          {seatLayout.map((seat, index) => (
            <Grid item key={index}>
              <Button
                variant={selectedSeats.has(index) ? 'contained' : 'outlined'}
                onClick={() => handleSeatClick(index)}
                sx={{
                  minWidth: '40px',
                  minHeight: '40px',
                  backgroundColor: selectedSeats.has(index) ? 'rgba(248, 68, 100)' : 'transparent',
                  color: selectedSeats.has(index) ? 'white' : 'rgba(248, 68, 100)',
                  borderColor: 'rgba(248, 68, 100)',
                  '&:hover': {
                    backgroundColor: selectedSeats.has(index) ? 'darkred' : 'rgba(248, 68, 100, 0.1)',
                  },
                }}
              >
                {index + 1}
              </Button>
            </Grid>
          ))}
        </Grid>

        <Box display={'flex'} justifyContent={'center'} padding={2}>
          <Button
            variant="contained"
            onClick={handleBookSeats}
            sx={{ backgroundColor: 'rgba(248, 68, 100)' }}
          >
            Book Selected Seats
          </Button>
        </Box>
      </Box>
    </div>
  );
};

export default SeatSelection;
