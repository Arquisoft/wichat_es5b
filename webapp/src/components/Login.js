import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, Snackbar, Alert, ButtonGroup, Box } from '@mui/material';
import { Typewriter } from "react-simple-typewriter";
import Game from './game/GameQuestion';
import LoadingScreen from './LoadingScreen';

import { LanguageContext } from "../LanguageContext";

import CssBaseline from '@mui/material/CssBaseline';



const Login = ({ userForHistory }) => {
  const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [createdAt, setCreatedAt] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [startGame, setStartGame] = useState(false);
  const [keyReinicio, setKeyReinicio] = useState(0);
  const [mostrarPantalla, setMostrarPantalla] = useState(false);
  const { translations, currentLang } = useContext(LanguageContext);
  const [nQuestions, setNQuestions] = useState(6);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const username = localStorage.getItem('username');
      const createdAt = localStorage.getItem('createdAt');

      if (username) {
        setUsername(username);
        setLoginSuccess(true);

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

      // Extract data from the response
      const { createdAt: userCreatedAt } = response.data;

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', username);

      const createdAtDate = new Date(response.data.createdAt);
      localStorage.setItem('createdAt', createdAtDate.toISOString());

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

  async function start() {
    const res = await axios.post(apiEndpoint + "/start", {
      nQuestions: nQuestions
    });
    return res;
  }

  const reinicio = () => {
    setStartGame(false);
    setKeyReinicio(keyReinicio + 1);
  };

  if (mostrarPantalla) {
    return <LoadingScreen />;
  }

  if (startGame) {
    return (
      <Container sx={{
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
      }}>
        <div>
          <Game username={username} nQuestions={nQuestions} key={keyReinicio} />
          <Button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700" onClick={() => reinicio()}>
            {translations.go_back || "Volver"}
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container sx={{
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
        <div>
          <Typography component="h1" variant="h2" sx={{ textAlign: 'center', marginTop: 4 }}>🎬{translations.login_welcome || "¡Bienvenido a Wichat!"}</Typography>
          <Typography component="h2" variant="h5" sx={{ textAlign: 'center', marginTop: 4 }}>{translations.login_question|| "¿Preparado para poner a prueba tus conocimientos en el mundo del cine?"}</Typography>
          <Typography component="p" variant="body1" sx={{ textAlign: 'left', marginTop: 2}}>{translations.login_choose || "Escoge la longitud de la partida:"}Escoge la longitud de la partida:</Typography>
          <Box sx={{display: 'flex', justifyContent: 'space-between', mt: 2, mb: 2}}>
            <ButtonGroup variant="contained" aria-label="outlined primary button group" sx={{width: '100%', display: 'flex', justifyContent: 'space-between'}}>
              <Button disabled={nQuestions === 6} onClick={() => {setNQuestions(6); console.log("Corta")}} sx={{width: '33%', color: "#d87152", backgroundColor: "#faf5ea"}}>{translations.welocme_select_length_short || "Corta"}</Button>
              <Button disabled={nQuestions === 12} onClick={() => {setNQuestions(12); console.log("Normal")}} sx={{width: '33%', color: "#d87152", backgroundColor: "#faf5ea"}}>{translations.welocme_select_length_normal || "Normal"}</Button>
              <Button disabled={nQuestions === 18} onClick={() => {setNQuestions(18); console.log("Larga")}} sx={{width: '33%', color: "#d87152", backgroundColor: "#faf5ea"}}>{translations.welocme_select_length_long || "Larga"}</Button>
            </ButtonGroup>
          </Box>

          <Typography component="p" variant="body1" sx={{ textAlign: 'left', marginTop: 2}}>{translations.login_ready || "Preparados, listos..."}</Typography>
          <Button variant="contained" color="primary" onClick={async () => { setMostrarPantalla(true); await start(); setMostrarPantalla(false); setStartGame(true);}} sx={{ marginTop: 2, color: "#d87152", backgroundColor: "#faf5ea" }}>
            {translations.login_action || "¡Acción!"}
          </Button>
        </div>
      ) : (
        <div>
          <Typography component="h1" variant="h5" sx={{ color: "#d87152" }}>
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
          <Button fullWidth variant="contained" color="primary" onClick={() => { loginUser(); loginHistory(); }} sx={{ color: "#d87152", backgroundColor: "#faf5ea" }}>
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