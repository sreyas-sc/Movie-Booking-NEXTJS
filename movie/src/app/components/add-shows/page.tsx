// 'use client'
// import { useEffect, useState } from 'react';
// import { getAllMovies, addShows } from '@/app/api-helpers/api-helpers.js';
// import Swal from 'sweetalert2';
// import { Card, CardContent, CardMedia, Typography } from '@mui/material';

// interface Theater {
//   _id: string;
//   name: string;
//   location: string;
//   seatLayout: number[]; 
//   showtimes: { time: string; _id: string }[]; 
// }

// interface Movie {
//   _id: string;
//   title: string;
//   posterUrl: string;
//   releaseDate: string;
//   duration: string;
// }

// const AddShows = () => {
//   const [theater, setTheater] = useState<Theater | null>(null);
//   const [movies, setMovies] = useState<Movie[]>([]);
//   const [selectedMovie, setSelectedMovie] = useState<string | null>(null);
//   const [dates, setDates] = useState<string[]>([]);
//   const [selectedTimes, setSelectedTimes] = useState<Set<string>>(new Set());
//   const [movieDetails, setMovieDetails] = useState<Movie | null>(null);
//   const [showtimes, setShowtimes] = useState<{ time: string; _id: string }[]>([]);

//   useEffect(() => {
//     const theaterData = localStorage.getItem('selectedTheater');
//     if (theaterData) {
//       const theaterInfo = JSON.parse(theaterData);
//       setTheater(theaterInfo);
//       setShowtimes(theaterInfo.showtimes || []); // Set showtimes from theater data
//       localStorage.removeItem('selectedTheater');
//     }

//     const fetchMovies = async () => {
//       try {
//         const data = await getAllMovies();
//         setMovies(data.movies);
//       } catch (error) {
//         console.error('Error fetching movies:', error);
//       }
//     };

//     fetchMovies();
//   }, []);

//   useEffect(() => {
//     if (selectedMovie) {
//       const movie = movies.find((movie) => movie._id === selectedMovie);
//       setMovieDetails(movie || null);
//     }
//   }, [selectedMovie, movies]);

//   const handleAddShow = async () => {
//     if (!theater || !selectedMovie || dates.length === 0 || selectedTimes.size === 0) {
//       alert('Please select a movie, date(s), and time(s).');
//       return;
//     }

//     try {
//       const movie = movies.find((movie) => movie._id === selectedMovie);
//       const posterUrl = movie ? movie.posterUrl : '';

//       const formData = {
//         theaterId: theater._id,
//         movieId: selectedMovie,
//         dates,
//         times: Array.from(selectedTimes),
//         posterUrl, // Add the poster URL to the form data
//       };


//       await addShows(formData);
//       Swal.fire({
//         title: "Show Added!",
//         text: "The show was successfully added",
//         icon: "success"
//       });
//     } catch (error) {
//       console.error('Error adding shows:', error);
//       alert('Failed to add shows');
//     }
//   };

//   const handleAddDate = () => {
//     setDates([...dates, '']);
//   };

//   const handleDateChange = (index: number, value: string) => {
//     const newDates = [...dates];
//     newDates[index] = value;
//     setDates(newDates);
//   };

//   const handleRemoveDate = (index: number) => {
//     const newDates = dates.filter((_, i) => i !== index);
//     setDates(newDates);
//   };

//   const handleToggleTime = (time: string) => {
//     const newTimes = new Set(selectedTimes);
//     if (newTimes.has(time)) {
//       newTimes.delete(time);
//     } else {
//       newTimes.add(time);
//     }
//     setSelectedTimes(newTimes);
//   };

//   const getTodayDate = () => {
//     const today = new Date();
//     return today.toISOString().split('T')[0];
//   };

//   return (
//     <div style={{ display: 'flex', padding: '20px', maxWidth: '1200px', margin: 'auto', gap: '20px' }}>
//       {/* Movie Details Card */}
//       {movieDetails && (
//         <Card sx={{ flex: 1, borderRadius: 5, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
//           <CardMedia
//             component="img"
//             height={350}
//             image={`http://localhost:5000/uploads/${movieDetails.posterUrl.split('\\').pop()}`}
//             alt={movieDetails.title}
//           />
//           <CardContent>
//             <Typography gutterBottom variant='h5' component="div">
//               {movieDetails.title}
//             </Typography>
//             <Typography variant='body2' color='text.secondary'>
//               Release Date: {new Date(movieDetails.releaseDate).toLocaleDateString()}
//             </Typography>
//             <Typography variant='body2' color='text.secondary'>
//               Duration: {movieDetails.duration}
//             </Typography>
//           </CardContent>
//         </Card>
//       )}

//       {/* Add Shows Form */}
//       <div style={{ flex: 2, backgroundColor: '#f9f9f9', borderRadius: '8px', padding: '20px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
//         <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Add Shows</h1>
//         {theater ? (
//           <div>
//             <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>{theater.name}</h2>
//             <p style={{ fontSize: '16px', marginBottom: '20px' }}>Location: {theater.location}</p>

//             {/* Movie Selection */}
//             <div style={{ marginBottom: '20px' }}>
//               <label style={{ fontSize: '16px' }}>Select Movie:</label>
//               <select
//                 value={selectedMovie || ''}
//                 onChange={(e) => setSelectedMovie(e.target.value)}
//                 style={{ marginLeft: '10px', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }}
//               >
//                 <option value="">-- Select a movie --</option>
//                 {movies.map((movie) => (
//                   <option key={movie._id} value={movie._id}>
//                     {movie.title}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Date Selection */}
//             <div style={{ marginBottom: '20px' }}>
//               <label style={{ fontSize: '16px' }}>Add Dates:</label>
//               {dates.map((date, index) => (
//                 <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
//                   <input
//                     type="date"
//                     value={date}
//                     onChange={(e) => handleDateChange(index, e.target.value)}
//                     style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', marginRight: '10px', width: '70%' }}
//                   />
//                   <button
//                     onClick={() => handleRemoveDate(index)}
//                     style={{
//                       backgroundColor: '#ff4d4d',
//                       color: 'white',
//                       border: 'none',
//                       borderRadius: '4px',
//                       padding: '8px 12px',
//                       cursor: 'pointer',
//                     }}
//                   >
//                     Remove
//                   </button>
//                 </div>
//               ))}
//               <button
//                 onClick={handleAddDate}
//                 style={{
//                   backgroundColor: '#28a745',
//                   color: 'white',
//                   border: 'none',
//                   borderRadius: '4px',
//                   padding: '8px 12px',
//                   cursor: 'pointer',
//                 }}
//               >
//                 Add Date
//               </button>
//             </div>

//             {/* Time Selection */}
//             <div style={{ marginBottom: '20px' }}>
//               <label style={{ fontSize: '16px' }}>Select Times:</label>
//               {showtimes.map(({ time, _id }) => (
//                 <div key={_id} style={{ marginBottom: '10px' }}>
//                   <input
//                     type="checkbox"
//                     checked={selectedTimes.has(time)}
//                     onChange={() => handleToggleTime(time)}
//                   />
//                   <span style={{ marginLeft: '10px' }}>{time}</span>
//                 </div>
//               ))}
//             </div>

//             <button
//               onClick={handleAddShow}
//               style={{
//                 backgroundColor: '#007bff',
//                 color: 'white',
//                 border: 'none',
//                 borderRadius: '4px',
//                 padding: '10px 15px',
//                 cursor: 'pointer',
//                 fontSize: '16px',
//               }}
//             >
//               Add Show
//             </button>
//           </div>
//         ) : (
//           <p>No theater selected.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AddShows;


'use client'
import { useEffect, useState } from 'react';
import { getAllMovies, addShows } from '@/app/api-helpers/api-helpers.js';
import Swal from 'sweetalert2';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';

interface Theater {
  _id: string;
  name: string;
  location: string;
  seatLayout: number[]; 
  showtimes: { time: string; _id: string }[]; 
}

interface Movie {
  _id: string;
  title: string;
  posterUrl: string;
  releaseDate: string;
  duration: string;
}

const AddShows = () => {
  const [theater, setTheater] = useState<Theater | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<string | null>(null);
  const [dates, setDates] = useState<string[]>([]);
  const [selectedTimes, setSelectedTimes] = useState<Set<string>>(new Set());
  const [movieDetails, setMovieDetails] = useState<Movie | null>(null);
  const [showtimes, setShowtimes] = useState<{ time: string; _id: string }[]>([]);

  useEffect(() => {
    const theaterData = localStorage.getItem('selectedTheater');
    if (theaterData) {
      const theaterInfo = JSON.parse(theaterData);
      setTheater(theaterInfo);
      setShowtimes(theaterInfo.showtimes || []); // Set showtimes from theater data
      localStorage.removeItem('selectedTheater');
    }

    const fetchMovies = async () => {
      try {
        const data = await getAllMovies();
        setMovies(data.movies);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchMovies();
  }, []);

  useEffect(() => {
    if (selectedMovie) {
      const movie = movies.find((movie) => movie._id === selectedMovie);
      setMovieDetails(movie || null);
    }
  }, [selectedMovie, movies]);

  const handleAddShow = async () => {
    if (!theater || !selectedMovie || dates.length === 0 || selectedTimes.size === 0) {
      alert('Please select a movie, date(s), and time(s).');
      return;
    }

    try {
      const movie = movies.find((movie) => movie._id === selectedMovie);
      const posterUrl = movie ? movie.posterUrl : '';

      const formData = {
        theaterId: theater._id,
        movieId: selectedMovie,
        dates,
        times: Array.from(selectedTimes),
        posterUrl, // Add the poster URL to the form data
      };

      console.log(formData)

      await addShows(formData);
      Swal.fire({
        title: "Show Added!",
        text: "The show was successfully added",
        icon: "success"
      });
    } catch (error) {
      console.error('Error adding shows:', error);
      alert('Failed to add shows');
    }
  };

  const handleAddDate = () => {
    setDates([...dates, '']);
  };

  const handleDateChange = (index: number, value: string) => {
    const newDates = [...dates];
    newDates[index] = value;
    setDates(newDates);
  };

  const handleRemoveDate = (index: number) => {
    const newDates = dates.filter((_, i) => i !== index);
    setDates(newDates);
  };

  const handleToggleTime = (time: string) => {
    const newTimes = new Set(selectedTimes);
    if (newTimes.has(time)) {
      newTimes.delete(time);
    } else {
      newTimes.add(time);
    }
    setSelectedTimes(newTimes);
  };

  // Helper function to get today's date in 'YYYY-MM-DD' format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div style={{ display: 'flex', padding: '20px', maxWidth: '1200px', margin: 'auto', gap: '20px' }}>
      {/* Movie Details Card */}
      {movieDetails && (
        <Card sx={{ flex: 1, borderRadius: 5, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
          <CardMedia
            component="img"
            height={350}
            image={`http://localhost:5000/uploads/${movieDetails.posterUrl.split('\\').pop()}`}
            alt={movieDetails.title}
          />
          <CardContent>
            <Typography gutterBottom variant='h5' component="div">
              {movieDetails.title}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Release Date: {new Date(movieDetails.releaseDate).toLocaleDateString()}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Duration: {movieDetails.duration}
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Add Shows Form */}
      <div style={{ flex: 2, backgroundColor: '#f9f9f9', borderRadius: '8px', padding: '20px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
        <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Add Shows</h1>
        {theater ? (
          <div>
            <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>{theater.name}</h2>
            <p style={{ fontSize: '16px', marginBottom: '20px' }}>Location: {theater.location}</p>

            {/* Movie Selection */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '16px' }}>Select Movie:</label>
              <select
                value={selectedMovie || ''}
                onChange={(e) => setSelectedMovie(e.target.value)}
                style={{ marginLeft: '10px', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }}
              >
                <option value="">-- Select a movie --</option>
                {movies.map((movie) => (
                  <option key={movie._id} value={movie._id}>
                    {movie.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Selection */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '16px' }}>Add Dates:</label>
              {dates.map((date, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => handleDateChange(index, e.target.value)}
                    min={getTodayDate()}  // Disable dates before today
                    style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', marginRight: '10px', width: '70%' }}
                  />
                  <button
                    onClick={() => handleRemoveDate(index)}
                    style={{
                      backgroundColor: '#ff4d4d',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '8px 12px',
                      cursor: 'pointer',
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                onClick={handleAddDate}
                style={{
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '8px 12px',
                  cursor: 'pointer',
                }}
              >
                Add Date
              </button>
            </div>

            {/* Time Selection */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '16px' }}>Select Times:</label>
              {showtimes.map(({ time, _id }) => (
                <div key={_id} style={{ marginBottom: '10px' }}>
                  <input
                    type="checkbox"
                    checked={selectedTimes.has(time)}
                    onChange={() => handleToggleTime(time)}
                  />
                  <span style={{ marginLeft: '10px' }}>{time}</span>
                </div>
              ))}
            </div>

            <button
              onClick={handleAddShow}
              style={{
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '10px 15px',
                cursor: 'pointer',
                fontSize: '16px',
              }}
            >
              Add Show
            </button>
          </div>
        ) : (
          <p>No theater selected.</p>
        )}
      </div>
    </div>
  );
};

export default AddShows;
