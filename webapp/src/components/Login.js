<<<<<<< HEAD
// src/components/Login.js
import React, { useState, useContext } from 'react';
=======
import React, { useState, useEffect } from 'react';
>>>>>>> development
import axios from 'axios';
import { Container, Typography, TextField, Button, Snackbar, Alert, ButtonGroup, Box } from '@mui/material';
import { Typewriter } from "react-simple-typewriter";
import Game from './game/GameQuestion';
import LoadingScreen from './LoadingScreen';
import { LanguageContext } from "../LanguageContext";

const Login = ({userForHistory}) => {
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
<<<<<<< HEAD
  const { translations } = useContext(LanguageContext);
=======
  const [nQuestions, setNQuestions] = useState(6);
  const [loadingMessage, setLoadingMessage] = useState(false);
>>>>>>> development

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

        // Generar mensaje de bienvenida solo si no existe
        if (!message) {
          generateWelcomeMessage(username);
        }
      }
    }
  }, [apiEndpoint]);

  const generateWelcomeMessage = async (username) => {
    setLoadingMessage(true);
    try {
      const question = `Welcome back message for ${username}, student of Software Architecture at University of Oviedo. Be nice and polite. Two sentences max.`;
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

      // Guardar datos en localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', username);
      
      // Asegurarse de que la fecha está en formato ISO
      const createdAtDate = new Date(response.data.createdAt);
      localStorage.setItem('createdAt', createdAtDate.toISOString());

      // Generar mensaje de bienvenida
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
      <Container
        component="div"
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
        <div>
          <Game username={username} nQuestions={nQuestions} key={keyReinicio}/>
          <Button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700" onClick={() => reinicio()}>
            Volver
          </Button>
        </div>
      </Container>
    );
  }

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
<<<<<<< HEAD
      >
      <div>
      <Game username={username} key={keyReinicio}/>
      <Button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700" onClick={() => reinicio()}>
        {translations.go_back || "Volver"}
      </Button>
      </div>
      </Container>

    );
  }

  

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
        <div>
          <Typewriter
            words={[message]} // Pass your message as an array of strings
            cursor
            cursorStyle="|"
            typeSpeed={50} // Typing speed in ms
          />
          <Typography component="p" variant="body1" sx={{ textAlign: 'center', marginTop: 2 }}>
            {translations.welcome_account_creation_date || "Tu cuenta fue creada el "} {new Date(createdAt).toLocaleDateString()}.
          </Typography>
          <Button variant="contained" color="primary" onClick={async () => { setMostrarPantalla(true); await start(); setMostrarPantalla(false); setStartGame(true);}} sx={{ marginTop: 2 }}>
            {translations.welcome_start_button || "Comenzar Juego"}
=======
    >
      {loginSuccess ? (
  <div style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}>
    {/* Contenedor del mensaje */}
    <Box sx={{ 
      minHeight: '80px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 2,
      textAlign: 'center'
    }}>
      {loadingMessage ? (
            <Typography>Loading welcome message...</Typography>
          ) : message ? (
              <Typewriter
                words={[message]}
                cursor
                cursorStyle="|"
                typeSpeed={50}
                style={{ 
                  display: 'inline-block',
                  width: '100%'
                }}
              />
            ) : null}
          </Box>
          
          {createdAt && (
            <Typography component="p" variant="body1" sx={{ 
              textAlign: 'center', 
              marginBottom: 3,
              color: '#555'
            }}>
              Your account was created on {new Date(createdAt).toLocaleDateString()}.
            </Typography>
          )}
          
          <Typography component="p" variant="body1" sx={{ 
            textAlign: 'center', 
            marginBottom: 2,
            fontWeight: 'bold',
            color: '#333'
          }}>
            Escoge la longitud de la partida:
          </Typography>
          
          {/* Contenedor de botones mejorado */}
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: 3,
            gap: 0, 
            '& .MuiButton-root': {
              flex: 1,
              maxWidth: '120px',
              boxShadow: 'none', // Elimina sombras
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
            <Button 
              disabled={nQuestions === 6} 
              onClick={() => setNQuestions(6)}
              sx={{ 
                borderTopLeftRadius: '8px',
                borderBottomLeftRadius: '8px'
              }}
            >
              Corta
            </Button>
            <Button 
              disabled={nQuestions === 12} 
              onClick={() => setNQuestions(12)}
              sx={{ 
                borderRadius: 0
              }}
            >
              Normal
            </Button>
            <Button 
              disabled={nQuestions === 18} 
              onClick={() => setNQuestions(18)}
              sx={{ 
                borderTopRightRadius: '8px',
                borderBottomRightRadius: '8px'
              }}
            >
              Larga
            </Button>
          </Box>
          
          <Button 
            variant="contained" 
            color="primary" 
            onClick={async () => { 
              setMostrarPantalla(true); 
              await start(); 
              setMostrarPantalla(false); 
              setStartGame(true);
            }} 
            sx={{ 
              width: '100%',
              maxWidth: '200px',
              display: 'block',
              margin: '0 auto',
              backgroundColor: '#c46331',
              '&:hover': {
                backgroundColor: '#e07a4d'
              }
            }}
          >
            Start Game
>>>>>>> development
          </Button>
        </div>
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
            label={translations.login_password || "Password"}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
<<<<<<< HEAD
          <Button fullWidth variant="contained" color="primary" onClick={()=>{loginUser();loginHistory();}} sx={{color: "#d87152", backgroundColor: "#faf5ea"}}>
            {translations.login_button || "Iniciar Sesión"}
=======
          <Button 
            fullWidth 
            variant="contained" 
            color="primary" 
            onClick={() => {
              loginUser();
              loginHistory();
            }} 
            sx={{color: "#d87152", backgroundColor: "#faf5ea"}}
          >
            Login
>>>>>>> development
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