import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, Snackbar, Alert } from '@mui/material';
import { LanguageContext } from "../LanguageContext";

import SelectionScreen from "./GameSelectionScreen";

const Login = ({ userForHistory }) => {
  const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [createdAt, setCreatedAt] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

   const { translations, currentLang } = useContext(LanguageContext);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const username = localStorage.getItem('username');
      const createdAt = localStorage.getItem('createdAt');

      if (username) {
        setUsername(username);
        setLoginSuccess(true);

        // Parsear la fecha correctamente

        if (createdAt) {
          try {
            const date = new Date(createdAt);
            if (!isNaN(date.getTime())) {
              setCreatedAt(date.toISOString());
            }
          } catch (e) {
            console.error("Error parsing date:", e);
          }
        }
      }
    }
  }, [apiEndpoint]);
  const loginHistory = () => {
    userForHistory(username);
  };

  const loginUser = async () => {
    try {
      const response = await axios.post(`${apiEndpoint}/login`, { username, password });
      
      // Mover la lógica de éxito aquí
      const { createdAt: userCreatedAt } = response.data;
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', username);

      const createdAtDate = new Date(response.data.createdAt);
      localStorage.setItem('createdAt', createdAtDate.toISOString());

      // Llamar a userForHistory SOLO cuando el login es exitoso
      userForHistory(username);
      
      setCreatedAt(createdAtDate.toISOString());
      setLoginSuccess(true);
      setOpenSnackbar(true);
    } catch (error) {
      setError(error.response?.data?.error || "Login failed");
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
                marginBottom: 4,
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
                        {translations.login || "Login"}
                    </Typography>
                    <TextField
                        margin="normal"
                        fullWidth
                        label={translations.login_username || "Usuario"}
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        name="password"
                        label={translations.login_password || "Contraseña"}
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button 
                      fullWidth 
                      variant="contained" 
                      color="primary" 
                      onClick={loginUser} // Eliminar loginHistory de aquí
                      sx={{color: "#d87152", backgroundColor: "#faf5ea"}}
                    >
                      {translations.login_button || "Iniciar Sesión"}
                    </Button>
                    <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                            Login successful
                        </Alert>
                    </Snackbar>
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