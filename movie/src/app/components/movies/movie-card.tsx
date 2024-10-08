import React, { useState } from 'react';
import { Card, CardActions, CardContent, CardMedia, Typography, Button, Modal, Box } from '@mui/material';
import { useRouter } from 'next/navigation';

interface MovieCardProps {
  title: string;
  description: string;
  releaseDate: string;
  posterUrl?: string;
  duration: string;
  id: string;
  genre: string;
  rating: number;
}

const MovieCard: React.FC<MovieCardProps> = ({ title, description, releaseDate, posterUrl, duration, id, genre, rating }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false); // State to manage modal visibility

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const isUserLoggedIn = Boolean(localStorage.getItem('userId'));
  const isAdminLoggedIn = Boolean(localStorage.getItem('adminId'));

  const handleClick = () => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      router.push(`/booking/${id}`);
    } else {
      router.push('/components/auth');
    }
  };

  const imageUrl = posterUrl 
    ? `https://movie-booking-nextjs.onrender.com/uploads/${posterUrl.split('\\').pop()}` 
    : '/default-image.jpg';

  return (
    <>
      <Card
        sx={{
          width: 300,
          height: 650,
          borderRadius: 5,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          transition: '0.3s',
          '&:hover': {
            boxShadow: "10px 10px 20px #ccc",
            cursor: 'pointer' // Change cursor to pointer
          }
        }}
        onClick={handleOpen} // Open modal on card click
      >
        <CardMedia
          component="img"
          height={350}
          image={imageUrl}
          alt={title}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant='h5' component="div">
            {title}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            {description.length > 50 ? `${description.substring(0, 50)}...` : description} {/* Show truncated description */}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Release Date: {new Date(releaseDate).toLocaleDateString()}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Duration: {duration} hours
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            IMDB Rating: {rating}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Genre: {genre}
          </Typography>
        </CardContent>
        {isUserLoggedIn && !isAdminLoggedIn && (
          <CardActions sx={{ justifyContent: 'center', paddingBottom: 2 }}>
            <Button
              onClick={handleClick}
              sx={{
                color: "white",
                borderRadius: "8px",
                backgroundColor: "rgba(248, 68, 100, 1)",
                border: "1px solid rgba(245, 255, 255, 0.5)",
                '&:hover': {
                  backgroundColor: "rgba(248, 68, 100, 0.9)",
                }
              }}
            >
              Book Tickets
            </Button>
          </CardActions>
        )}
      </Card>

      {/* Modal for movie details */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)', 
          width: '80%',  
          maxWidth: 800, 
          bgcolor: 'background.paper', 
          boxShadow: 24, 
          p: 4,
          borderRadius: 2,
          display: 'flex', 
          flexDirection: 'row', 
        }}>
          <CardMedia
            component="img"
            height={200}
            image={imageUrl}
            alt={title}
            sx={{ 
              height: '50%',
              width: '50%', 
              marginRight: 2, 
            }}
          />
          <Box sx={{ flex: 1 }}> {/* Box to hold text details */}
            <Typography id="modal-title" variant="h6" component="h2" gutterBottom>
              {title}
            </Typography>
            <Typography id="modal-description" variant="body2" color='text.secondary' paragraph>
              {description}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Release Date: {new Date(releaseDate).toLocaleDateString()}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Duration: {duration} hours
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              IMDB Rating: {rating}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Genre: {genre}
            </Typography>
            <Button onClick={handleClose} sx={{ marginTop: 2 }} variant="contained">Close</Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default MovieCard;
