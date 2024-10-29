
import React, { useState, useEffect } from 'react';
import { Card, CardActions, CardContent, CardMedia, Typography, Button, Modal, Box, Grid } from '@mui/material';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface MovieCardProps {
  title: string;
  description: string;
  releaseDate: string;
  posterUrl?: string;
  duration: string;
  id: string;
  genre: string;
  rating: number;
  cast: string[];
  castPhotos?: string[];
}

const MovieCard: React.FC<MovieCardProps> = ({ 
  title, description, releaseDate, posterUrl, duration, id, genre, rating, cast, castPhotos 
}) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if adminId exists in local storage
    const adminId = localStorage.getItem('adminId'); // Assuming adminId is stored in local storage
    setIsAdmin(!!adminId); // Set isAdmin to true if adminId exists
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
          width: 280,
          height: 'auto',
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          transition: '0.3s',
          backgroundColor: '#fff',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
            cursor: 'pointer'
          }
        }}
        onClick={handleOpen}
      >
        <CardMedia
          component="img"
          height={400}
          width={400}
          image={imageUrl}
          alt={title}
          sx={{
            objectFit: 'cover',
          }}
        />
        <CardContent sx={{ p: 2 }}>
          <Typography gutterBottom variant='h6' sx={{ fontWeight: 600, mb: 1 }}>
            {title}
          </Typography>
          <Typography variant='body2' color='text.secondary' sx={{ mb: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {description}
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant='body2' color='text.secondary' sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
              ⭐ {rating} • {duration}h • {genre}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              {new Date(releaseDate).toLocaleDateString()}
            </Typography>
          </Box>
        </CardContent>
        <CardActions sx={{ p: 2, pt: 0 }}>
          {/* Conditionally render the button based on user role */}
          {!isAdmin && (
            <Button
              fullWidth
              onClick={(e) => {
                e.stopPropagation();
                handleClick();
              }}
              sx={{
                color: "white",
                borderRadius: "8px",
                backgroundColor: "rgba(248, 68, 100, 1)",
                textTransform: 'none',
                py: 1,
                '&:hover': {
                  backgroundColor: "rgba(248, 68, 100, 0.9)",
                }
              }}
            >
              Book Tickets
            </Button>
          )}
        </CardActions>
      </Card>

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
          width: '95%',
          maxWidth: 900,
          maxHeight: '90vh',
          bgcolor: '#fff',
          borderRadius: 2,
          overflow: 'hidden',
          outline: 'none'
        }}>
          <Box sx={{ 
            height: '90vh',
            overflowY: 'auto',
            px: { xs: 2, sm: 3 },
            py: { xs: 2, sm: 3 },
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(0,0,0,0.1)',
              borderRadius: '4px',
            },
          }}>
            <Box sx={{ mb: 3 }}>
              <Typography id="modal-title" variant="h4" component="h2" sx={{ fontWeight: 600, mb: 2 }}>
                {title}
              </Typography>

              <Box sx={{ 
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                flexWrap: 'wrap',
                mb: 3
              }}>
                <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  ⭐ {rating}
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  {duration} hours
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  {genre}
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  {new Date(releaseDate).toLocaleDateString()}
                </Typography>
              </Box>

              <Grid container spacing={4}>
                <Grid item xs={12} md={5}>
                  <Box sx={{
                    width: '100%',
                    borderRadius: 2,
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}>
                    <Image
                      src={imageUrl}
                      alt={title}
                      width={400}
                      height={600}
                      style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block'
                      }}
                    />
                  </Box>
                </Grid>

                <Grid item xs={12} md={7}>
                  <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.7 }}>
                    {description}
                  </Typography>

                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Cast</Typography>
                  <Grid container spacing={2}>
                    {cast && cast.length > 0 ? (
                      cast.map((member, index) => (

                        <Grid item xs={6} sm={4} key={index}>
                          <Box sx={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center',
                            gap: 1
                          }}>
                            {castPhotos && castPhotos[index] ? (
                              <Image
                                src={`https://movie-booking-nextjs.onrender.com/uploads/${castPhotos[index].split('\\').pop()}`}
                                alt={member}
                                width={80}
                                height={80}
                                style={{ 
                                  borderRadius: '50%', 
                                  objectFit: 'cover',
                                }}
                              />
                            ) : (
                              <Box
                                sx={{
                                  width: 80,
                                  height: 80,
                                  borderRadius: '50%',
                                  bgcolor: 'rgba(0,0,0,0.05)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: 'text.secondary',
                                  fontWeight: 500,
                                  fontSize: '1.25rem'
                                }}
                              >
                                {member.charAt(0)}
                              </Box>
                            )}
                            <Typography 
                              variant="body2" 
                              align="center"
                              sx={{ 
                                fontWeight: 500,
                                maxWidth: '100%',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {member}
                            </Typography>
                          </Box>
                        </Grid>
                      ))
                    ) : (
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">
                          No cast information available.
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Box>

            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'flex-end', 
              gap: 2,
              mt: 4,
              pt: 2,
              borderTop: '1px solid rgba(0, 0, 0, 0.1)'
            }}>
              <Button onClick={handleClose} color="primary">
                Close
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default MovieCard;


