// "use client";

// import React, { useEffect, useState } from "react";
// import { AppBar, Autocomplete, Tab, Tabs, TextField, Toolbar } from "@mui/material";
// import MovieIcon from "@mui/icons-material/Movie";
// import { Box } from "@mui/system";
// import { getAllMovies } from "../api-helpers/api-helpers";
// import Link from "next/link";
// import { useDispatch, useSelector } from "react-redux";
// import { adminActions, RootState, userActions } from "../store/index";
// import Swal from "sweetalert2"; // Import SweetAlert

// const Header: React.FC = () => {
//   const isAdminLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIN);
//   const isUserLoggedIn = useSelector((state: RootState) => state.user.isLoggedIN);
//   const [movies, setMovies] = useState<{ title: string }[]>([]);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     getAllMovies()
//       .then((data) => setMovies(data.movies))
//       .catch((err) => console.log(err));
//   }, []);

//   // Function to logout and show a SweetAlert confirmation before logging out
//   const handleLogout = (isAdmin: boolean) => {
//     Swal.fire({
//       title: "Are you sure?",
//       text: "You will be logged out of your account.",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Yes, log me out",
//     }).then((result) => {
//       if (result.isConfirmed) {
//         dispatch(isAdmin ? adminActions.logout() : userActions.logout());
//         Swal.fire("Logged Out!", "You have been successfully logged out.", "success");
//       }
//     });
//   };

//   return (
//     <>
//       {/* AppBar positioned as fixed */}
//       <AppBar position="fixed" sx={{ bgcolor: "#2b2d42" }}>
//         <Toolbar>
//           {/* Home page link with Movie Icon */}
//           <Box width={"20%"}>
//             <Link href="/" passHref>
//               <MovieIcon sx={{ cursor: "pointer" }} />
//             </Link>
//           </Box>

//           {/* Autocomplete textbox to search for the movie names */}
//           <Box width={"50%"} margin={"auto"}>
//             {!isAdminLoggedIn && (
//               <Autocomplete
//                 freeSolo
//                 options={movies && movies.length > 0 ? movies.map((option) => option.title) : []}
//                 renderInput={(params) => (
//                   <TextField
//                     sx={{ input: { color: "white" } }}
//                     variant="standard"
//                     {...params}
//                     placeholder="Search across movies"
//                   />
//                 )}
//               />
//             )}
//           </Box>

//           {/* Box for the Tabs */}
//           <Box display={"flex"}>
//             <Tabs
//               sx={{
//                 color: "rgb(220, 53, 88)",
//                 fontWeight: "1000",
//               }}
//             >
//               <Link href="/components/movies" passHref>
//                 <Tab label="Movies" component="a" sx={{ fontWeight: "bold" }} />
//               </Link>

//               {/* if not logged in, show the auth links */}
//               {!isAdminLoggedIn && !isUserLoggedIn && (
//                 <>
//                   <Link href="/components/auth" passHref>
//                     <Tab label="User" component="a" sx={{ fontWeight: "bold" }} />
//                   </Link>
//                   <Link href="/components/admin" passHref>
//                     <Tab label="Admin" component="a" sx={{ fontWeight: "bold" }} />
//                   </Link>
//                 </>
//               )}

//               {/* if user is logged in, show profile and logout */}
//               {isUserLoggedIn && (
//                 <>
//                   <Link href="/components/user-profile" passHref>
//                     <Tab label="Profile" component="a" sx={{ fontWeight: "bold" }} />
//                   </Link>
//                   <Tab
//                     label="Logout"
//                     sx={{ fontWeight: "bold" }}
//                     onClick={() => handleLogout(false)}
//                   />
//                 </>
//               )}

//               {/* if admin is logged in, show add movie and profile */}
//               {isAdminLoggedIn && (
//                 <>
//                   <Link href="/components/add-movie" passHref>
//                     <Tab label="Add Movie" component="a" sx={{ fontWeight: "bold" }} />
//                   </Link>

//                   <Link href="/components/add-theatre" passHref>
//                     <Tab label="Add Theatre" component="a" sx={{ fontWeight: "bold" }} />
//                   </Link>

//                   <Link href="/components/admin-view-shows" passHref>
//                     <Tab label="Shows" component="a" sx={{ fontWeight: "bold" }} />
//                   </Link>
//                   <Tab
//                     label="Logout"
//                     sx={{ fontWeight: "bold" }}
//                     onClick={() => handleLogout(true)}
//                   />
//                 </>
//               )}
//             </Tabs>
//           </Box>
//         </Toolbar>
//       </AppBar>

//       {/* Add a spacer to avoid content overlap */}
//       <Box sx={{ height: "64px" }}></Box>
//     </>
//   );
// };

// export default Header;
"use client";

import React, { useEffect, useState } from "react";
import {
  AppBar,
  Autocomplete,
  Tab,
  Tabs,
  TextField,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery,
  Box,
  Container
} from "@mui/material";
import MovieIcon from "@mui/icons-material/Movie";
import MenuIcon from "@mui/icons-material/Menu";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { adminActions, RootState, userActions } from "../store/index";
import { getAllMovies } from "../api-helpers/api-helpers";
import Swal from "sweetalert2";

const Header: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [movies, setMovies] = useState<{ title: string }[]>([]);
  const dispatch = useDispatch();
  
  const isAdminLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIN);
  const isUserLoggedIn = useSelector((state: RootState) => state.user.isLoggedIN);

  useEffect(() => {
    getAllMovies()
      .then((data) => setMovies(data.movies))
      .catch((err) => console.log(err));
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = (isAdmin: boolean) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, log me out",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(isAdmin ? adminActions.logout() : userActions.logout());
        setMobileOpen(false);
        Swal.fire("Logged Out!", "You have been successfully logged out.", "success");
      }
    });
  };

  const menuItems = [
    { label: "Movies", href: "/components/movies" },
    ...(!isAdminLoggedIn && !isUserLoggedIn
      ? [
          { label: "User", href: "/components/auth" },
          { label: "Admin", href: "/components/admin" },
        ]
      : []),
    ...(isUserLoggedIn
      ? [
          { label: "Profile", href: "/components/user-profile" },
          { label: "Logout", onClick: () => handleLogout(false) },
        ]
      : []),
    ...(isAdminLoggedIn
      ? [
          { label: "Add Movie", href: "/components/add-movie" },
          { label: "Add Theatre", href: "/components/add-theatre" },
          { label: "Shows", href: "/components/admin-view-shows" },
          { label: "Logout", onClick: () => handleLogout(true) },
        ]
      : []),
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.label}>
            {item.href ? (
              <Link href={item.href} passHref style={{ width: '100%', textDecoration: 'none', color: 'inherit' }}>
                <ListItemText primary={item.label} />
              </Link>
            ) : (
              <ListItemText 
                primary={item.label} 
                onClick={item.onClick}
                sx={{ cursor: 'pointer' }}
              />
            )}
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="fixed" sx={{ bgcolor: "#2b2d42" }}>
        <Container maxWidth="xl">
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', p: { xs: 1, sm: 2 } }}>
            {/* Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Link href="/" passHref>
                <MovieIcon sx={{ cursor: "pointer", fontSize: { xs: 28, sm: 32 } }} />
              </Link>
            </Box>

            {/* Search Bar */}
            {!isAdminLoggedIn && !isMobile && (
              <Box sx={{ flexGrow: 1, mx: 4 }}>
                <Autocomplete
                  freeSolo
                  options={movies && movies.length > 0 ? movies.map((option) => option.title) : []}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      size="small"
                      placeholder="Search across movies"
                      sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: 1,
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.3)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.5)',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.7)',
                          },
                        },
                        '& .MuiInputBase-input': {
                          color: 'white',
                        },
                      }}
                    />
                  )}
                />
              </Box>
            )}

            {/* Desktop Navigation */}
            {!isMobile && (
              <Box sx={{ display: 'flex' }}>
                <Tabs 
                  value={false}
                  sx={{
                    '& .MuiTab-root': {
                      color: 'white',
                      fontWeight: 'bold',
                      minWidth: 'auto',
                      px: 2,
                    },
                  }}
                >
                  {menuItems.map((item) => (
                    item.href ? (
                      <Link key={item.label} href={item.href} passHref>
                        <Tab label={item.label} component="a" />
                      </Link>
                    ) : (
                      <Tab
                        key={item.label}
                        label={item.label}
                        onClick={item.onClick}
                      />
                    )
                  ))}
                </Tabs>
              </Box>
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ ml: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Navigation Drawer */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        {drawer}
      </Drawer>

      {/* Spacer */}
      <Toolbar />
    </>
  );
};

export default Header;