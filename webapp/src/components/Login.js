// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, Snackbar, Alert } from '@mui/material';
import SelectionScreen from "./GameSelectionScreen";

const Login = ({userForHistory}) => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

  const loginHistory = () =>{
    userForHistory(username);
  }

  const loginUser = async () => {
    try {
      const response = await axios.post(`${apiEndpoint}/login`, { username, password });

      localStorage.setItem('token', response.data.token);

      setLoginSuccess(true);

      setOpenSnackbar(true);
    } catch (error) {
      setError(error.response.data.error);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container
  component="main"
  sx={{
    marginTop: 4,
    width: "100%",
    height: "100%",
    backgroundColor: "#a9c8c4",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "4px solid #c46331",
    boxSizing: "border-box"
  }}
  >
      {loginSuccess ? (
          <SelectionScreen username={username}/>
      ) : (
            <div>
              <Typography component="h1" variant="h5" sx={{color: "#d87152"}}>
                Login
              </Typography>
              <TextField
                  margin="normal"
                  fullWidth
                  label="Username"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                  margin="normal"
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
              />
              <Button fullWidth variant="contained" color="primary" onClick={()=>{loginUser();loginHistory();}} sx={{color: "#d87152", backgroundColor: "#faf5ea"}}>
                Login
              </Button>
              <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar} message="Login successful" />
              {/* Mensaje de error en rojo con Alert */}
              {error && (
                  <Snackbar
                      open={!!error}
                      autoHideDuration={6000}
                      onClose={() => setError('')}
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                  >
                    <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
                      {error}
                    </Alert>
                  </Snackbar>
              )}
            </div>
        )}
      </Container>
  );

};

export default Login;