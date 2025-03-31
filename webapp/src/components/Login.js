// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, Snackbar, Alert } from '@mui/material';
import { Typewriter } from "react-simple-typewriter";
import Game from './game/GameQuestion';



const Login = ({userForHistory}) => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [createdAt, setCreatedAt] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [startGame, setStartGame] = useState(false);
  const [keyReinicio, setKeyReinicio] = useState(0);


  const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

  const loginHistory = () =>{
    userForHistory(username);
  }

  const loginUser = async () => {
    // Verifica si los campos están vacíos
    if (!username || !password) {
      setError("Username and password are required");
      return; // Detiene la ejecución si hay campos vacíos
    }

    try {
      const response = await axios.post(`${apiEndpoint}/login`, { username, password });

      const question = "Please, generate a greeting message for a student called " + username + " that is a student of the Software Architecture course in the University of Oviedo. Be nice and polite. Two to three sentences max.";
      const model = "empathy"
      const message = await axios.post(`${apiEndpoint}/askllm`, { question, model })
      setMessage(message.data.answer);

      // Extract data from the response
      const { createdAt: userCreatedAt } = response.data;

      setCreatedAt(userCreatedAt);
      setLoginSuccess(true);

      setOpenSnackbar(true);
    } catch (error) {
      setError(error.response.data.error);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  async function start() {
    const res= await axios.post(apiEndpoint + "/start");
    return res;
  } 

  const reinicio = () => {
    setStartGame(false);
    setKeyReinicio(keyReinicio + 1);
    //start();
  }

  if (startGame) {
    return (
      <div>
      <Game username={username} key={keyReinicio}/>
      <Button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700" onClick={() => reinicio()}>
        Volver
      </Button>
      </div>
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
            Your account was created on {new Date(createdAt).toLocaleDateString()}.
          </Typography>
          <Button variant="contained" color="primary" onClick={async () => { await start(); setStartGame(true);}} sx={{ marginTop: 2 }}>
            Start Game
          </Button>


        </div>
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
          <Button variant="contained" color="primary" onClick={()=>{loginUser();loginHistory();}} sx={{color: "#d87152", backgroundColor: "#faf5ea"}}>
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
