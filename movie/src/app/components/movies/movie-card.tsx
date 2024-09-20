import { Card, CardActions, CardContent, CardMedia, Typography, Button } from '@mui/material';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Import useRouter




// interface MovieCardProps {
//   title: string;
//   description: string;
//   releaseDate: string;
//   posterUrl: string;
//   duration: string;
//   id: String;
//   rating: number;
// }

// const handleClick = () => {
//   const userId = localStorage.getItem('userId'); // Check for userId in localStorage
//   if (userId) {
//     // If userId exists, navigate to booking page
//     router.push(`/booking/${id}`);
//   } else {
//     // If userId does not exist, navigate to auth page
//     router.push('/auth');
//   }
// };


// const MovieCard: React.FC<MovieCardProps> = ({ title, description, releaseDate, posterUrl, duration, id , rating}) => {
//   console.log('MovieCard ID:', id);
//   // console.log
//   return (
//     <Card 
//       sx={{ 
//         width: 300, 
//         height: 600, 
//         borderRadius: 5, 
//         display: 'flex', 
//         flexDirection: 'column',
//         justifyContent: 'space-between', // Ensure the content and button are spaced
//         ":hover": {
//           boxShadow: "10px 10px 20px #ccc"
//         }
//       }}
//     >
//       <CardMedia
//         component="img"
//         width={200}
//         height={350}  // Adjust this value to control the image size
//         image={posterUrl}
//         alt={title}
//       />
//       <CardContent sx={{ flexGrow: 1 }}>
//         <Typography gutterBottom variant='h5' component="div">
//           {title}
//         </Typography>
//         <Typography variant='body2' color='text.secondary'>
//           {description}
//         </Typography>
//         <Typography variant='body2' color='text.secondary'>
//           Release Date:  { new Date (releaseDate).toLocaleDateString() }
//         </Typography>
//         <Typography variant='body2' color='text.secondary'>
//           Duration: {duration}
//         </Typography>
//         <Typography variant='body2' color='text.secondary'>
//           IMDB Rating: {rating}
//         </Typography>
//       </CardContent>
//       <CardActions sx={{ justifyContent: 'center', paddingBottom: 2 }}>
//         {/* <Link href={`/booking/${id}`} legacyBehavior passHref> */}
//         <Button
//         onClick={handleClick}
//           sx={{
//             size: "small",
//             color: "rgb(255, 255, 255)",
//             borderRadius: "8px",
//             backgroundColor: "rgba(248, 68, 100)",
//             border: "1px solid rgb(245, 255, 255)",
//             '&:hover': {
//               backgroundColor: "rgba(248, 68, 100)",
//             }
//           }}
//         >
//           Book Tickets
//         </Button>
//         {/* </Link> */}
//       </CardActions>
//     </Card>
//   );
// };

// export default MovieCard;
interface MovieCardProps {
  title: string;
  description: string;
  releaseDate: string;
  posterUrl: string;
  duration: string;
  id: string;
  rating: number;
}

const MovieCard: React.FC<MovieCardProps> = ({ title, description, releaseDate, posterUrl, duration, id, rating }) => {
  const router = useRouter(); // Initialize router

  const handleClick = () => {
    const userId = localStorage.getItem('userId'); // Check for userId in localStorage
    if (userId) {
      // If userId exists, navigate to booking page
      router.push(`/booking/${id}`);
    } else {
      // If userId does not exist, navigate to auth page
      router.push('components/auth');
    }
  };

  return (
    <Card
      sx={{
        width: 300,
        height: 600,
        borderRadius: 5,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        ":hover": {
          boxShadow: "10px 10px 20px #ccc"
        }
      }}
    >
      <CardMedia
        component="img"
        width={200}
        height={350} // Adjust this value to control the image size
        image={posterUrl}
        alt={title}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant='h5' component="div">
          {title}
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          {description}
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          Release Date: {new Date(releaseDate).toLocaleDateString()}
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          Duration: {duration}
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          IMDB Rating: {rating}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'center', paddingBottom: 2 }}>
        <Button
          onClick={handleClick}
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
          Book Tickets
        </Button>
      </CardActions>
    </Card>
  );
};

export default MovieCard;