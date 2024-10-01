'use client'
import React, { useEffect, useState } from 'react';
import { deleteShow, getAllShows } from '@/app/api-helpers/api-helpers';
import Swal from 'sweetalert2';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Container,
  Box,
  CardActions,
} from '@mui/material';

interface Show {
  _id: string;
  theaterId: { name: string; location: string };
  movieId: { title: string };
  dates: Date[];
  times: string[];
}

const AdminShowsPage = () => {
  const [shows, setShows] = useState<Show[]>([]);

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const response = await getAllShows();
        console.log("response is :", response);
        setShows(response);
      } catch (err) {
        console.error('Error fetching shows:', err);
      }
    };

    fetchShows(); // Call the async function
  }, []);

  const handleDelete = (showId: string) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this show!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteShow(showId)
          .then(() => {
            Swal.fire('Deleted!', 'The show has been deleted.', 'success');
            setShows((prev) => prev.filter((show) => show._id !== showId)); // Update local state
          })
          .catch((err: Error) => {
            console.error(err);
            Swal.fire('Error!', 'An error occurred while deleting the show.', 'error');
          });
      }
    });
  };
  
  return (
    <Container>
      <Box textAlign="center" my={4}>
        <Typography variant="h4" gutterBottom>
          All Shows
        </Typography>
      </Box>
      <Grid container spacing={4}>
        {shows.map((show) => (
          <Grid item xs={12} sm={6} md={4} key={show._id}>
            <Card elevation={3} sx={{ 
        width: 300, 
        height: 250, 
        borderRadius: 5, 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'space-between', // Ensure the content and button are spaced
        ":hover": {
          boxShadow: "10px 10px 20px #ccc"
        }
      }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                {show.movieId ? show.movieId.title : 'Title not available'}
                </Typography>
                <Typography variant="body1">
                  <strong>Theatre:</strong> {show.theaterId.name} ({show.theaterId.location})
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Date:</strong> {new Date(show.dates[0]).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Times:</strong> {show.times.join(', ')}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleDelete(show._id)}
                  fullWidth
                sx={{
                    size: "small",
            color: "rgb(255, 255, 255)",
            borderRadius: "8px",
            backgroundColor: "rgba(248, 68, 100)",
            border: "1px solid rgb(245, 255, 255)",
            '&:hover': {
              backgroundColor: "rgba(248, 68, 100)",
            }
                }}
                
                >
                  Delete Show
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default AdminShowsPage;
