// src/components/AddUser.js
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, Snackbar,Alert } from '@mui/material';
import { LanguageContext } from "../LanguageContext";

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

const AddUser = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const { translations } = useContext(LanguageContext);

  const addUser = async () => {
    try {
      await axios.post(`${apiEndpoint}/adduser`, { username, password });
      setOpenSnackbar(true);
    } catch (error) {
      setError(error.response.data.error);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ marginTop: 4 }}>
      <Typography component="h1" variant="h5">
        {translations.register || "Add User"}
      </Typography>
      <TextField
        name="username"
        margin="normal"
        fullWidth
        label={translations.register_username || "Usuario"}
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextField
        name="password"
        margin="normal"
        fullWidth
        label={translations.register_password || "Contraseña"}
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button fullWidth id="add-user-btn" variant="contained" color="primary" onClick={addUser}>
        {translations.register_button || "Crear Usuario"}
      </Button>
      {/* Mensaje de éxito */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {translations.register_message || "Usuario añadido correctamente"}
        </Alert>
      </Snackbar>

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
    </Container>
  );
};

export default AddUser;
