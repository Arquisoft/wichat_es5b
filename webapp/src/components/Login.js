import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, Snackbar, Alert, Box } from '@mui/material';
import { Typewriter } from "react-simple-typewriter";
import Game from './game/GameQuestion';
import LoadingScreen from './LoadingScreen';
import { LanguageContext } from "../LanguageContext";

const Login = ({ userForHistory }) => {
  const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [createdAt, setCreatedAt] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [startGame, setStartGame] = useState(false);
  const [keyReinicio, setKeyReinicio] = useState(0);
  const [mostrarPantalla, setMostrarPantalla] = useState(false);
  const { translations, currentLang } = useContext(LanguageContext);
  const [nQuestions, setNQuestions] = useState(6);
  const [loadingMessage, setLoadingMessage] = useState(false);

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

        if (!message) {
          generateWelcomeMessage(username, currentLang);
        }
      }
    }
  }, [apiEndpoint]);

  const generateWelcomeMessage = async (username, lang) => {
    setLoadingMessage(true);
    try {
      const question = `Welcome back message for ${username}, student of Software Architecture at University of Oviedo. Be nice and polite. Two sentences max. Respond in ${lang}.`;
      const model = "empathy";
      const response = await axios.post(`${apiEndpoint}/askllm`, { question, model });
      setMessage(response.data.answer);
    } catch (error) {
      console.error("Error generating welcome message:", error);
      setMessage(`Welcome back, ${username}! Ready to continue learning?`);
    } finally {
      setLoadingMessage(false);
    }
  };

  const loginHistory = () => {
    userForHistory(username);
  };

  const loginUser = async () => {
    try {
      const response = await axios.post(`${apiEndpoint}/login`, { username, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', username);

      const createdAtDate = new Date(response.data.createdAt);
      localStorage.setItem('createdAt', createdAtDate.toISOString());

      await generateWelcomeMessage(username);

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
    }}>
      {loginSuccess ? (
        <div style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}>
          <Box sx={{
            minHeight: '80px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 2,
            textAlign: 'center'
          }}>
            {loadingMessage ? (
              <Typography>{translations.welcome_loading || "Cargando mensaje de bienvenida..."}</Typography>
            ) : message ? (
              <Typewriter
                words={[message]}
                cursor
                cursorStyle="|"
                typeSpeed={50}
              />
            ) : null}
          </Box>

          {createdAt && (
            <Typography variant="body1" sx={{ textAlign: 'center', marginBottom: 3, color: '#555' }}>
              {translations.welcome_account_creation_date || "Your account was created on"} {new Date(createdAt).toLocaleDateString()}.
            </Typography>
          )}

          <Typography variant="body1" sx={{ textAlign: 'center', marginBottom: 2, fontWeight: 'bold', color: '#333' }}>
            {translations.welocme_select_length_title || "Escoge la longitud de la partida:"}
          </Typography>

          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: 3,
            gap: 0,
            '& .MuiButton-root': {
              flex: 1,
              maxWidth: '120px',
              boxShadow: 'none',
              border: '1px solid #c46331',
              '&:not(:last-child)': {
                borderRight: 'none'
              },
              '&:hover': {
                backgroundColor: '#e07a4d'
              }
            },
            '& .Mui-disabled': {
              backgroundColor: '#f0a988',
              color: 'white'
            }
          }}>
            <Button disabled={nQuestions === 6} onClick={() => setNQuestions(6)} sx={{ borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px' }}>
              {translations.welocme_select_length_short || "Corta"}
            </Button>
            <Button disabled={nQuestions === 12} onClick={() => setNQuestions(12)} sx={{ borderRadius: 0 }}>
              {translations.welocme_select_length_normal || "Normal"}
            </Button>
            <Button disabled={nQuestions === 18} onClick={() => setNQuestions(18)} sx={{ borderTopRightRadius: '8px', borderBottomRightRadius: '8px' }}>
              {translations.welocme_select_length_long || "Larga"}
            </Button>
          </Box>

          <Button variant="contained" color="primary" onClick={async () => {
            setMostrarPantalla(true);
            await start();
            setMostrarPantalla(false);
            setStartGame(true);
          }} sx={{
            width: '100%',
            maxWidth: '200px',
            margin: '0 auto',
            backgroundColor: '#c46331',
            '&:hover': {
              backgroundColor: '#e07a4d'
            }
          }}>
            {translations.welcome_start_button || "Comenzar Juego"}
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
            label={translations.login_password || "Password"}
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