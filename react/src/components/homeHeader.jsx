import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { styled } from '@mui/system';
import Home from '../indexHome-pages/home';
import Contactus from '../indexHome-pages/contactus';
import Login from '../indexHome-pages/login';
import Register from '../indexHome-pages/register';
import "../components/homeHeader.css";

const NavButton = styled(Button)(({ theme }) => ({
  color: 'white',
  margin: '0 8px',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: theme.palette.action.hover || '#f0f0f0',
  },
}));

function HomeHeader() {
  const [currentPage, setCurrentPage] = useState('');

  useEffect(() => {
    setCurrentPage(window.location.pathname); // Initialize with current path
  }, []);

  const handleNavigation = (path) => {
    window.history.pushState({}, '', path); // Change the URL without reloading
    setCurrentPage(path); // Update the current page state
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPage(window.location.pathname); // Update currentPage when back/forward buttons are used
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const renderComponent = () => {
    switch (currentPage) {
      case '/':
      case '/home':
        return <Home />;
      case '/contactus':
        return <Contactus />;
      case '/login':
        return <Login />;
      case '/register':
        return <Register />;
      default:
        return <Home />; // Default to Home if the path doesn't match
    }
  };

  return (
    <div>
      <AppBar position="static" color="secondary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            T A R A N G
          </Typography>
          <NavButton onClick={() => handleNavigation('/home')}>
            Home
          </NavButton>
          <NavButton onClick={() => handleNavigation('/contactus')}>
            Contact Us
          </NavButton>
          <NavButton
            sx={{
              '&:hover': {
                boxShadow: '0 0 10px rgba(210, 62, 247, 0.8)',
                transform: 'scale(1.05)',
                transition: '0.3s ease-in-out',
              },
            }}
            onClick={() => handleNavigation('/login')}
          >
            Login
          </NavButton>
          <NavButton
            sx={{
              '&:hover': {
                boxShadow: '0 0 10px rgba(210, 62, 247, 0.8)',
                transform: 'scale(1.05)',
                transition: '0.3s ease-in-out',
              },
            }}
            onClick={() => handleNavigation('/register')}
          >
            Register
          </NavButton>
        </Toolbar>
      </AppBar>
      <Container sx={{ marginTop: 4 }}>
        {renderComponent()}
      </Container>
    </div>
  );
}
    
export default HomeHeader;
