
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