import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, TextField, Typography, Alert, InputAdornment, IconButton, Radio, RadioGroup, FormControl, FormControlLabel, FormLabel, Snackbar } from '@mui/material';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from 'axios';

function Register() {
  const [registerFormData, setregisterFormData] = useState({
    fullname: '',
    phonenumber: '',
    email: '',
    typeofuser: '',
    username: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setConfirmPassword] = useState(null);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleclickShowConfirmPassword = () => setConfirmPassword((show) => !show);

  const navigate = useNavigate();

  const handleMouseDownPassword = (Event) => {
    Event.preventDefault();
  };

  const validateRegForm = () => {

    const { fullname, password, confirmPassword, phonenumber } = registerFormData;
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(fullname)) {
      setError("FullName should only contain alphabets and spaces!");
      return false;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phonenumber)) {
      setError("Enter valid Phone number!");
      return false;
    }

    const passwordValidation = /^(?=.*[A-Z])(?=.*\W)(?=.*[a-z]).{8,}$/;
    if (!passwordValidation.test(password)) {
      const pwdErrMsg = <ul><b>Your Password must contain:</b>
        < li > Atleast 8 character long </li >
        <li>Atleast 1 uppercase letter</li>
        <li>Atleast 1 Special character</li>
      </ul >
      setError(pwdErrMsg);
      return false;
    }

    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return false;
    }

    return true;
  }

  const handleChange = (e) => {
    setregisterFormData({
      ...registerFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    console.log(registerFormData);

    if (!validateRegForm()) {
      return;
    }

    try {
      const url = 'http://127.0.0.1:5000/register';

      const response = await axios.post(url, registerFormData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setSuccess(true);
      // setTimeout(() => {
      //   navigate('/login');
      // }, 3000);
      console.log('Signup successful:', response.data);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message); 
    } else {
        setError('An unexpected error occurred'); 
    }
      console.error('There was an error!', error);
    }
  };

  return (
    
      <Container maxWidth="xs">
        <Box sx={{ mt: 5 }}>
          <Typography variant="h5" gutterBottom>
            Create Tarang account
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              label="Full Name"
              name="fullname"
              fullWidth
              type='text'
              value={registerFormData.fullname}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              label="Phone Number"
              name="phonenumber"
              type='number'
              fullWidth
              value={registerFormData.phonenumber}
              onChange={handleChange}
              margin="normal"
              required
            />

            <TextField
              label="Email"
              name="email"
              type="email"
              fullWidth
              value={registerFormData.email}
              onChange={handleChange}
              margin="normal"
              required
            />

            <FormControl>
              <FormLabel sx={{ mt: 2, fontSize: '1rem' }}>Type Of User</FormLabel>
              <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name='typeofuser' value={registerFormData.typeofuser} onChange={handleChange}>
                <FormControlLabel value='user' control={<Radio />} label="User" />
                <FormControlLabel value='admin' control={<Radio />} label="Admin" />
                <FormControlLabel value='superAdmin' control={<Radio />} label="Super Admin" />
              </RadioGroup>
            </FormControl>

            <TextField
              label="User Name"
              name="username"
              fullWidth
              type='text'
              value={registerFormData.username}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              value={registerFormData.password}
              onChange={handleChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge='end'>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              margin="normal"
              required
            />
            <TextField
              label="Confirm Password"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              fullWidth
              value={registerFormData.confirmPassword}
              onChange={handleChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      aria-label='toggele password visibility'
                      onClick={handleclickShowConfirmPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge='end'>
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              margin="normal"
              required
            />
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2, marginBottom: 2 }}>
              Sign Up
            </Button>
          </Box>
          {error && <Alert sx={{ mb: 3 }} severity="error">{error}</Alert>}
          {success && <Alert sx={{ mb: 3 }} severity="success">Signup successful!</Alert>}
        </Box>
      </Container>
      
    
  );
}

export default Register;
