
// 'use client';
// import { useState, useEffect } from 'react';
// import { Box, Button, TextField, Typography, Grid, IconButton, Paper, Divider } from '@mui/material';
// import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
// import DeleteIcon from '@mui/icons-material/Delete';
// import { addTheater, getAllTheatres } from '@/app/api-helpers/api-helpers';
// import { useRouter } from 'next/navigation';
// import Swal from 'sweetalert2';

// // Define types for movies, showtimes, and theater
// type ShowTime = { time: string };
// type Theater = {
//   _id: string;
//   name: string;
//   location: string;
//   seatLayout: number[];
//   showtimes: ShowTime[];
// };

// const AddTheater = () => {
//   const [inputs, setInputs] = useState({
//     name: '',
//     location: '',
//     seats: 0,

//   });
//   const [showtimes, setShowtimes] = useState<ShowTime[]>([{ time: '' }]);
//   const [theaters, setTheaters] = useState<Theater[]>([]);
//   const [filteredTheaters, setFilteredTheaters] = useState<Theater[]>([]);
//   const [error, setError] = useState('');
//   const [search, setSearch] = useState({ name: '', location: '' });

//   const router = useRouter();

//   useEffect(() => {
//     getAllTheatres()
//       .then((data: Theater[]) => {
//         setTheaters(data);
//         setFilteredTheaters(data);
//       })
//       .catch(err => console.log(err));
//   }, []);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleAddShowtime = () => {
//     setShowtimes((prev) => [...prev, { time: '' }]);
//   };

//   const handleShowtimeChange = (index: number, value: string) => {
//     const updatedShowtimes = [...showtimes];
//     updatedShowtimes[index].time = value;
//     setShowtimes(updatedShowtimes);
//   };

//   const handleRemoveShowtime = (index: number) => {
//     setShowtimes((prev) => prev.filter((_, i) => i !== index));
//   };

//   const validateInputs = () => {
//     let isValid = true;
//     if (!inputs.name) {
//       isValid = false;
//     }
//     if (!inputs.location) {
//       isValid = false;
//     }
//     if (inputs.seats <= 0) {
//       isValid = false;
//     }
//     return isValid;
//   };

//   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     if (!validateInputs()) {
//       setError('Please fill all fields correctly.');
//       return;
//     }

//     const theaterData = {
//       name: inputs.name,
//       location: inputs.location,
//       seatLayout: new Array(+inputs.seats).fill(1),
//       showtimes,
//     };

//     addTheater(theaterData)
//       .then((res: Theater) => {
//         setTheaters((prev) => [...prev, res]);
//         setFilteredTheaters((prev) => [...prev, res]);
//         setError('');
//         Swal.fire({
//           title: 'Theater Added!',
//           text: 'The theater has been successfully added.',
//           icon: 'success',
//           confirmButtonText: 'OK',
//         }).then(() => {
//           getAllTheatres();
//         });
//       })
//       .catch((err) => {
//         console.error('Error adding theater:', err);
//         setError('Error adding theater');
//       });
//   };

//   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearch((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   useEffect(() => {
//     const filtered = theaters.filter(theater =>
//       (theater.name && theater.name.toLowerCase().includes(search.name?.toLowerCase() || '')) &&
//       (theater.location && theater.location.toLowerCase().includes(search.location?.toLowerCase() || ''))
//     );
//     setFilteredTheaters(filtered);
//   }, [theaters, search]);

//   const handleAddShows = (theater: Theater) => {
//     localStorage.setItem('selectedTheater', JSON.stringify({
//       _id: theater._id,
//       name: theater.name,
//       location: theater.location,
//       seatLayout: theater.seatLayout,
//       showtimes: theater.showtimes,
//     }));
//     router.push('/components/add-shows');
//   };

//   return (
//     <Box
//       component="form"
//       onSubmit={handleSubmit}
//       sx={{ width: '50%', margin: 'auto', padding: '20px', boxShadow: '10px 10px 20px #ccc' }}
//     >
//       <Typography variant="h5" textAlign="center" marginBottom={2}>
//         Add Theater
//       </Typography>
//       {error && <Typography color="error">{error}</Typography>}
      
//       <TextField
//         name="name"
//         label="Theater Name"
//         variant="standard"
//         fullWidth
//         margin="normal"
//         value={inputs.name}
//         onChange={handleChange}
//         className={!inputs.name ? 'error' : ''}
//       />
//       <TextField
//         name="location"
//         label="Location"
//         variant="standard"
//         fullWidth
//         margin="normal"
//         value={inputs.location}
//         onChange={handleChange}
//         className={!inputs.location ? 'error' : ''}
//       />
//       <TextField
//         name="seats"
//         label="Total Seats"
//         type="number"
//         variant="standard"
//         fullWidth
//         margin="normal"
//         value={inputs.seats}
//         onChange={handleChange}
//         className={inputs.seats <= 0 ? 'error' : ''}
//       />

//       <Typography variant="h6" marginTop={2}>
//         Showtimes
//       </Typography>
//       {showtimes.map((showtime, index) => (
//   <Grid container spacing={2} key={index} alignItems="center" className="showtime-container">
//     <Grid item xs={10}>
//       <TextField
//         fullWidth
//         type="number"
//         label={`Showtime ${index + 1}`}
//         value={showtime.time}
//         onChange={(e) => handleShowtimeChange(index, e.target.value)}
//         variant="outlined"
//         className={
//           !showtime.time || Number(showtime.time) < 1 || Number(showtime.time) > 12 ? 'error' : ''
//         }
//         InputProps={{
//           inputProps: {
//             min: 1,
//             max: 12,
//           },
//         }}
//       />
//     </Grid>
//     <Grid item xs={2}>
//       <IconButton onClick={() => handleRemoveShowtime(index)} color="error" className="showtime-delete-button">
//         <DeleteIcon />
//       </IconButton>
//     </Grid>
//   </Grid>
// ))}

//       <Button
//         startIcon={<AddCircleOutlineIcon />}
//         onClick={handleAddShowtime}
//         variant="outlined"
//         color="primary"
//         sx={{ mt: 2 }}
//       >
//         Add Showtime
//       </Button>

//       <Button
//         type="submit"
//         variant="contained"
//         color="primary"
//         fullWidth
//         sx={{ mt: 3 }}
//       >
//         Add Theater
//       </Button>

//       {/* Search and Filter UI */}
//       <Box mt={4}>
//         <Typography variant="h6">Filter Theaters</Typography>
//         <TextField
//           name="name"
//           label="Name"
//           variant="outlined"
//           fullWidth
//           margin="normal"
//           value={search.name}
//           onChange={handleSearchChange}
//         />
//         <TextField
//           name="location"
//           label="Location"
//           variant="outlined"
//           fullWidth
//           margin="normal"
//           value={search.location}
//           onChange={handleSearchChange}
//         />
//       </Box>

//       {/* Theater List */}
//       <Box alignItems={"center"} mt={4}>
//   <Typography variant="h6">Available Theaters</Typography>
//   <Paper className="theater-list">
//   {filteredTheaters.length > 0 ? (
//     filteredTheaters.map((theater, index) => (
//       <Box key={index} sx={{ marginBottom: 2 }}>
//         <Typography variant="h6">{theater.name}</Typography>
//         <Typography variant="body2">Location: {theater.location}</Typography>
//         <Typography variant="body2">
//           Total Seats: {theater.seatLayout ? theater.seatLayout.length : 0}
//         </Typography>
//         <Typography variant="body2">
//           Show Times: 
//           {Array.isArray(theater.showtimes) && theater.showtimes.length > 0 ? (
//             theater.showtimes.map((showtime, index) => (
//               <span key={index}>
//                 {showtime.time} {/* Adjust according to your ShowTime object structure */}
//                 {index < theater.showtimes.length - 1 && ', '}
//               </span>
//             ))
//           ) : (
//             'No showtimes available.'
//           )}
//         </Typography>
//         <Button variant="outlined" onClick={() => handleAddShows(theater)}>
//           Add Shows
//         </Button>
//         <Divider sx={{ margin: '10px 0' }} />
//       </Box>
//     ))
//   ) : (
//     <Typography>No theaters found.</Typography>
//   )}
// </Paper>


// </Box>

//     </Box>
//   );
// };

// export default AddTheater;
'use client';
import { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Grid, IconButton, Paper, Card, CardContent, CardActions } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import { addTheater, getAllTheatres } from '@/app/api-helpers/api-helpers';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

// Define types for showtimes and theater
type ShowTime = { hour: number; minute: number; period: 'AM' | 'PM' };
type Theater = {
  _id: string;
  name: string;
  location: string;
  seatLayout: number[];
  showtimes: ShowTime[];
};

const AddTheater = () => {
  const [inputs, setInputs] = useState({
    name: '',
    location: '',
    seats: 0,
  });
  
  // Initialize showtimes as an empty array
  const [showtimes, setShowtimes] = useState<ShowTime[]>([]);
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [filteredTheaters, setFilteredTheaters] = useState<Theater[]>([]);
  const [error, setError] = useState('');
  const [search, setSearch] = useState({ name: '', location: '' });

  const router = useRouter();

  useEffect(() => {
    const fetchTheaters = async () => {
      try {
        const data = await getAllTheatres();
        setTheaters(data);
        setFilteredTheaters(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTheaters();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddShowtime = () => {
    setShowtimes((prev) => [...prev, { hour: 1, minute: 0, period: 'AM' }]);
  };

  const handleShowtimeChange = (
    index: number,
    field: 'hour' | 'minute' | 'period',
    value: number | 'AM' | 'PM'
  ) => {
    const updatedShowtimes = [...showtimes];
    updatedShowtimes[index] = {
      ...updatedShowtimes[index],
      [field]: value,
    };
    setShowtimes(updatedShowtimes);
  };

  const handleRemoveShowtime = (index: number) => {
    setShowtimes((prev) => prev.filter((_, i) => i !== index));
  };

  const validateInputs = () => {
    const { name, location, seats } = inputs;
    return (
      name &&
      location &&
      seats > 0 &&
      showtimes.every((st) => st.hour > 0 && st.hour <= 12 && st.minute >= 0 && st.minute < 60)
    );
  };

  // Move formatShowtimes function declaration here
  const formatShowtimes = (showtimes: ShowTime[]) => {
    return showtimes.map(({ hour, minute, period }) => {
      // Format hour and minute to ensure two digits
      const formattedHour = hour % 12 || 12; // Convert to 12-hour format
      const formattedMinute = String(minute).padStart(2, '0'); // Ensure two digits
      return `${formattedHour}:${formattedMinute} ${period}`; // e.g., "1:20 AM"
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formattedShowtimes = formatShowtimes(showtimes);

    if (!validateInputs()) {
      setError('Please fill all fields correctly.');
      return;
    }

    const theaterData = {
      name: inputs.name,
      location: inputs.location,
      seatLayout: new Array(+inputs.seats).fill(1),
      showtimes: formattedShowtimes.map(time => ({ time })),
    };
    try {
      const res: Theater = await addTheater(theaterData);
      setTheaters((prev) => [...prev, res]);
      setFilteredTheaters((prev) => [...prev, res]);
      setInputs({ name: '', location: '', seats: 0 });
      setShowtimes([]); // Reset showtimes
      setError('');
      
      // Fetch updated list of theaters
      

      Swal.fire({
        title: 'Theater Added!',
        text: 'The theater has been successfully added.',
        icon: 'success',
        confirmButtonText: 'OK',
      }).then(() => {
        getAllTheatres(); // Refresh theaters
      });
    } catch (err) {
      console.error('Error adding theater:', err);
      setError('Error adding theater');
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    const filtered = theaters.filter((theater) => {
      const theaterName = theater.name || '';
      const theaterLocation = theater.location || '';
      return (
        (theaterName.toLowerCase().includes(search.name.toLowerCase()) || search.name === '') &&
        (theaterLocation.toLowerCase().includes(search.location.toLowerCase()) || search.location === '')
      );
    });
    setFilteredTheaters(filtered);
  }, [theaters, search]);
  
  const handleAddShows = (theater: Theater) => {
    localStorage.setItem('selectedTheater', JSON.stringify(theater));
    router.push('/components/add-shows');
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ width: '50%', margin: 'auto', padding: '20px', boxShadow: '10px 10px 20px #ccc' }}
    >
      <Typography variant="h5" textAlign="center" marginBottom={2}>
        Add Theater
      </Typography>
      {error && <Typography color="error">{error}</Typography>}

      <TextField
        name="name"
        label="Theater Name"
        variant="standard"
        fullWidth
        margin="normal"
        value={inputs.name}
        onChange={handleChange}
      />
      <TextField
        name="location"
        label="Location"
        variant="standard"
        fullWidth
        margin="normal"
        value={inputs.location}
        onChange={handleChange}
      />
      <TextField
        name="seats"
        label="Total Seats"
        type="number"
        variant="standard"
        fullWidth
        margin="normal"
        value={inputs.seats}
        onChange={handleChange}
      />

      <Typography variant="h6" marginTop={2}>
        Showtimes
      </Typography>
      {showtimes.map((showtime, index) => (
        <Grid container spacing={2} key={index}>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label={`Hour`}
              type="number"
              value={showtime.hour}
              onChange={(e) => handleShowtimeChange(index, 'hour', Number(e.target.value))}
              variant="outlined"
              inputProps={{ min: 1, max: 12 }}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label={`Minute`}
              type="number"
              value={showtime.minute}
              onChange={(e) => handleShowtimeChange(index, 'minute', Number(e.target.value))}
              variant="outlined"
              inputProps={{ min: 0, max: 59 }}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              select
              fullWidth
              label="Period"
              value={showtime.period}
              onChange={(e) => handleShowtimeChange(index, 'period', e.target.value as 'AM' | 'PM')}
              variant="outlined"
              SelectProps={{
                native: true,
              }}
            >
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <IconButton onClick={() => handleRemoveShowtime(index)} color="error">
              <DeleteIcon />
            </IconButton>
          </Grid>
        </Grid>
      ))}
      <Button
        startIcon={<AddCircleOutlineIcon />}
        onClick={handleAddShowtime}
        variant="outlined"
        color="primary"
        sx={{ mt: 2 }}
      >
        Add Showtime
      </Button>

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 3 }}
      >
        Add Theater
      </Button>

      {/* Search and Filter UI */}
      <Box mt={4}>
        <Typography variant="h6">Filter Theaters</Typography>
        <TextField
          name="name"
          label="Theater Name"
          variant="outlined"
          value={search.name}
          onChange={handleSearchChange}
          sx={{ mr: 2 }}
        />
        <TextField
          name="location"
          label="Location"
          variant="outlined"
          value={search.location}
          onChange={handleSearchChange}
        />
      </Box>


<Paper sx={{ marginTop: 2, padding: 2 }}>
  <Typography variant="h6">Available Theaters</Typography>
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
    {filteredTheaters.map((theater) => (
      <Card key={theater._id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 2 }}>
        <CardContent>
          <Typography variant="h6">{theater.name}</Typography>
          <Typography variant="body1">{theater.location}</Typography>
          
        </CardContent>
        <CardActions>
          <Button variant="outlined" onClick={() => handleAddShows(theater)}>
            Add Shows
          </Button>
        </CardActions>
      </Card>
    ))}
  </Box>
</Paper>

    </Box>
  );
};

export default AddTheater;
