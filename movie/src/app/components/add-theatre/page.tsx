'use client';
import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  IconButton,
  Paper,
  Card,
  CardContent,
  CardActions,
  Tabs,
  Tab,
  Divider,
  Container,
  Alert,
  Fade,
  Stack,
  Chip,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EventIcon from '@mui/icons-material/Event';
import ChairIcon from '@mui/icons-material/Chair';
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

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const AddTheater = () => {
  const [tabValue, setTabValue] = useState(0);
  const [inputs, setInputs] = useState({
    name: '',
    location: '',
    seats: 0,
  });
  const [showtimes, setShowtimes] = useState<ShowTime[]>([]);
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [filteredTheaters, setFilteredTheaters] = useState<Theater[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

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

  const formatShowtimes = (showtimes: ShowTime[]) => {
    return showtimes.map(({ hour, minute, period }) => {
      const formattedHour = hour % 12 || 12;
      const formattedMinute = String(minute).padStart(2, '0');
      return `${formattedHour}:${formattedMinute} ${period}`;
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateInputs()) {
      setError('Please fill all fields correctly.');
      return;
    }

    const formattedShowtimes = formatShowtimes(showtimes);
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
      setShowtimes([]);
      setError('');
      setSuccess('Theater added successfully!');
      
      Swal.fire({
        title: 'Success!',
        text: 'Theater has been successfully added.',
        icon: 'success',
        confirmButtonText: 'OK',
      }).then(() => {
        getAllTheatres();
        setTabValue(1); // Switch to theater list tab
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
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="theater management tabs"
            centered
          >
            <Tab label="Add Theater" />
            <Tab label="View Theaters" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ maxWidth: 800, margin: 'auto', p: 3 }}
          >
            {error && (
              <Fade in>
                <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
              </Fade>
            )}
            {success && (
              <Fade in>
                <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>
              </Fade>
            )}

            <Stack spacing={3}>
              <TextField
                name="name"
                label="Theater Name"
                variant="outlined"
                fullWidth
                value={inputs.name}
                onChange={handleChange}
              />
              <TextField
                name="location"
                label="Location"
                variant="outlined"
                fullWidth
                value={inputs.location}
                onChange={handleChange}
              />
              <TextField
                name="seats"
                label="Total Seats"
                type="number"
                variant="outlined"
                fullWidth
                value={inputs.seats}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <ChairIcon sx={{ mr: 1, color: 'action.active' }} />,
                }}
              />

              <Box>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Showtimes
                  <IconButton
                    onClick={handleAddShowtime}
                    color="primary"
                    sx={{ ml: 2 }}
                  >
                    <AddCircleOutlineIcon />
                  </IconButton>
                </Typography>

                <Stack spacing={2}>
                  {showtimes.map((showtime, index) => (
                    <Paper key={index} sx={{ p: 2 }}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={3}>
                          <TextField
                            fullWidth
                            label="Hour"
                            type="number"
                            value={showtime.hour}
                            onChange={(e) => handleShowtimeChange(index, 'hour', Number(e.target.value))}
                            inputProps={{ min: 1, max: 12 }}
                          />
                        </Grid>
                        <Grid item xs={3}>
                          <TextField
                            fullWidth
                            label="Minute"
                            type="number"
                            value={showtime.minute}
                            onChange={(e) => handleShowtimeChange(index, 'minute', Number(e.target.value))}
                            inputProps={{ min: 0, max: 59 }}
                          />
                        </Grid>
                        <Grid item xs={3}>
                          <TextField
                            select
                            fullWidth
                            label="Period"
                            value={showtime.period}
                            onChange={(e) => handleShowtimeChange(index, 'period', e.target.value as 'AM' | 'PM')}
                            SelectProps={{
                              native: true,
                            }}
                          >
                            <option value="AM">AM</option>
                            <option value="PM">PM</option>
                          </TextField>
                        </Grid>
                        <Grid item xs={3}>
                          <IconButton
                            onClick={() => handleRemoveShowtime(index)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </Paper>
                  ))}
                </Stack>
              </Box>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                sx={{ mt: 3 }}
              >
                Add Theater
              </Button>
            </Stack>
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box sx={{ maxWidth: 800, margin: 'auto' }}>
            <Paper sx={{ p: 2, mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Search Theaters</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="name"
                    label="Theater Name"
                    variant="outlined"
                    fullWidth
                    value={search.name}
                    onChange={handleSearchChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="location"
                    label="Location"
                    variant="outlined"
                    fullWidth
                    value={search.location}
                    onChange={handleSearchChange}
                  />
                </Grid>
              </Grid>
            </Paper>

            <Stack spacing={2}>
              {filteredTheaters.map((theater) => (
                <Card key={theater._id} elevation={2}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {theater.name}
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <LocationOnIcon sx={{ mr: 1, color: 'action.active' }} />
                          <Typography variant="body1">
                            {theater.location}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <ChairIcon sx={{ mr: 1, color: 'action.active' }} />
                          <Typography variant="body1">
                            {/* {theater.seatLayout.length} seats */}
                            {theater.seatLayout ? `${theater.seatLayout.length} seats` : 'No seats defined'}

                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleAddShows(theater)}
                      startIcon={<EventIcon />}
                    >
                      Manage Shows
                    </Button>
                  </CardActions>
                </Card>
              ))}
            </Stack>
          </Box>
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default AddTheater;