import React, {useState} from 'react'
import {Box, Button, Container, TextField, Typography, Alert, InputAdornment, IconButton    } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function Login() {

    const [loginformdata, setloginformdata] = useState({
        username:'',
        password:''
    });

    const [error, seterror] = useState(null);
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (Event) => {
        Event.preventDefault();
    };

    const handleChange = (e) => {
        setloginformdata({
            ...loginformdata,
            [e.target.name]:e.target.value,
        });
    };

    const handleloginSubmit = async (e) => {
        e.preventDefault();
        seterror(null);
        setSuccess(false);
        console.log(loginformdata);

        try{
          const url = 'http://127.0.0.1:5000/login';
          const response = await axios.post(url,loginformdata,{
            header: {
              'Content-type': 'application/json'
            }
          });
          setSuccess(true);
          console.log('LogIn Successful:',response.data)

          const { role } = response.data;

            // Navigate based on user role
            if (role === 'superAdmin') {
                navigate('/super-admin-portal');  // Navigate to Admin route
            } else if (role === 'admin') {
                navigate('/admin-portal');  // Navigate to User route
            } else {
                // Handle other roles or default
                navigate('/user-portal');
            }

        }
        catch (error) {
          if (error.response && error.response.data && error.response.data.message) {
            seterror(error.response.data.message); 
        } else {
            seterror('An unexpected error occurred'); 
        }
          console.error('There was an error!', error);
        }

    };

  return (
    <div>
        <Container maxWidth="xs">
      <Box sx={{ mt: 5 }}>
        <Typography variant="h5"  gutterBottom>
            Sign In To Tarang
        </Typography>
        
        <Box component="form" onSubmit={handleloginSubmit} sx={{ mt: 1 }}>
          <TextField
            label="User Name"
            name="username"
            fullWidth
            type='text'
            value={loginformdata.username}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            value={loginformdata.password}
            onChange={handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton
                    // aria-label='toggele password visibility'
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
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2, marginBottom: 2 }}>
            Log In
          </Button>
          </Box>
          {error && <Alert sx={{ mb: 3 }} severity="error">{error}</Alert>}
          {success && <Alert sx={{ mb: 3 }} severity="success">Login successful!</Alert>}
          </Box>
          </Container>
    </div>    
  )
}

export default Login