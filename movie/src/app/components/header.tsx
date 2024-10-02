"use client"; 

import React, { useEffect, useState } from "react";
import { AppBar, Autocomplete, Tab, Tabs, TextField, Toolbar } from "@mui/material";
import MovieIcon from "@mui/icons-material/Movie";
import { Box } from "@mui/system";
import { getAllMovies } from '../api-helpers/api-helpers';
import Link from 'next/link';
import { useDispatch, useSelector } from "react-redux";
import { adminActions, RootState, userActions } from "../store/index"; // Import RootState for type inference

const Header: React.FC = () => {
  const isAdminLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIN);
  const isUserLoggedIn = useSelector((state: RootState) => state.user.isLoggedIN);
  const [movies, setMovies] = useState<{ title: string }[]>([]); // Define state type for movies
  const dispatch = useDispatch()

  useEffect(() => {
    getAllMovies()
      .then((data) => setMovies(data.movies))
      .catch((err) => console.log(err));
  }, []);

  // Function to logout and clear the local storage
  const logout = (isAdmin: boolean) => {
    dispatch(isAdmin ? adminActions.logout() : userActions.logout());
  };

  return (
    <AppBar position="sticky" sx={{ bgcolor: "#2b2d42" }}>
      <Toolbar>
        {/* Home page link with Movie Icon */}
        <Box width={"20%"}>
          <Link href="/" legacyBehavior passHref>
            <a>
              <MovieIcon />
            </a>
          </Link>
        </Box>

        {/* Autocomplete textbox to search for the movie names */}
        <Box width={"50%"} margin={"auto"}>
          {!isAdminLoggedIn && (
            <Autocomplete
              freeSolo
              options={movies && movies.length > 0 ? movies.map((option) => option.title) : []}
              renderInput={(params) => (
                <TextField
                  sx={{ input: { color: "white" } }}
                  variant="standard"
                  {...params}
                  placeholder="Search across movies"
                />
              )}
            />
          )}
        </Box>

        {/* Box for the Tabs */}
        <Box display={"flex"}>
          <Tabs
            sx={{
              color: 'rgb(220, 53, 88)',
              fontWeight: '1000',
            }}
          >
            <Link href="/components/movies" legacyBehavior passHref>
              <Tab label="Movies" component="a" sx={{ fontWeight: 'bold' }} />
            </Link>

            {/* if logged in, hide the auth links */}
            {!isAdminLoggedIn && !isUserLoggedIn && (
              <>
                <Link href="/components/auth" legacyBehavior passHref>
                  <Tab label="User" component="a" sx={{ fontWeight: 'bold' }} />
                </Link>
                <Link href="/components/admin" legacyBehavior passHref>
                  <Tab label="Admin" component="a" sx={{ fontWeight: 'bold' }} />
                </Link>
              </>
            )}

            {/* if user is logged in, show profile and logout */}
            {isUserLoggedIn && (
              <>
                <Link href="/components/user-profile" legacyBehavior passHref>
                  <Tab label="Profile" component="a" sx={{ fontWeight: 'bold' }} />
                </Link>
                <Link href="/" legacyBehavior passHref>
                  <Tab onClick={() => logout(false)} label="Logout" component="a" sx={{ fontWeight: 'bold' }} />
                </Link>
              </>
            )}

            {/* if admin is logged in, show add movie and profile */}
            {isAdminLoggedIn && (
              <>
                <Link href="/components/add-movie" legacyBehavior passHref>
                  <Tab label="Add Movie" component="a" sx={{ fontWeight: 'bold' }} />
                </Link>

                <Link href="/components/add-theatre" legacyBehavior passHref>
                  <Tab label="Add Theatre" component="a" sx={{ fontWeight: 'bold' }} />
                </Link>

                <Link href="/components/admin-view-shows" legacyBehavior passHref>
                  <Tab label="Shows" component="a" sx={{ fontWeight: 'bold' }} />
                </Link>
                <Link href="/" legacyBehavior passHref>
                  <Tab onClick={() => logout(true)} label="Logout" component="a" sx={{ fontWeight: 'bold' }} />
                </Link>
              </>
            )}
          </Tabs>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
