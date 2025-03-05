// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, Snackbar } from '@mui/material';
import { Typewriter } from "react-simple-typewriter";

const Login = () => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [createdAt, setCreatedAt] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [hints, setHints] = useState([]);
  const [unlockedIndex, setUnlockedIndex] = useState(0); //estado para el indice desbloqueado
  
  //TODO: eliminar esta constante cuando tengamos hecha la comunicacion con wikidata
  const pelicula = "El Resplandor";


  const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';
  

  const loginUser = async () => {
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

  //metodo para preguntarle a la LLM las pistas
  const handleAskForHint = async (movieName, numHint) => {
    const questions = [
      "De que año y genero es la pelicula " + movieName +" , dame solamente el año y el genero y evita decir el nombre de la pelicula (formato: Fue estrenada en {año})",
      "Nombre del actor protagonista de " + movieName + ", no digas el nombre de la pelicula (Formato: El actor protagonista es {nombre del actor}.)",
      "Quien es el personaje principal de " + movieName + ", no digas el nombre de la pelicula, solo el nombre del personaje protagonista (Formato: El personaje principal es {nombre del personaje}).",
      "Dame un resumen muy breve en una línea de la trama de la película " + movieName + ", no digas el nombre de la película (Formato: La pelicula trata sobre {resumen en una linea})."
    ];
    const model = "empathy";

    

    const question = questions[numHint];
    const message = await axios.post(`${apiEndpoint}/askllm`, { question, model });
    setHints([...hints, message.data.answer]);
      

    //desbloqueo siguiente boton
    if (numHint + 1 < questions.length) {
      setUnlockedIndex(numHint + 1);
    }

  }

  
return (
  <Container component="main" maxWidth="xs" sx={{ marginTop: 4 }}>
    {loginSuccess ? (
      <div>

        <Typewriter
          words={[message]}
          cursor
          cursorStyle="|"
          typeSpeed={50}
        />

        <Typography component="p" variant="body1" sx={{ textAlign: 'center', marginTop: 2 }}>
          Your account was created on {new Date(createdAt).toLocaleDateString()}.
        </Typography>

        {['Primera Pista', 'Segunda Pista', 'Tercera Pista', 'Cuarta Pista'].map((label, index) => (
          
          <Container key={index}>
            {hints[index] ? (

              <Typography variant="p" sx={{ textAlign: 'center', marginTop: 2 }}>
                {hints[index]}
              </Typography>

            ) : (
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => handleAskForHint(pelicula, index)}
                sx={{ mt: 2, width: '100%' }}
                disabled={index > unlockedIndex} //deshabilitar botones segun el indice desbloqueado
              >
                {label}
              </Button>
            )}
          </Container>
        ))}
      </div>
    ) : (
      <div>
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <TextField
          margin="normal"
          fullWidth
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={loginUser}>
          Login
        </Button>

        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar} message="Login successful" />
        {error && (
          <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')} message={`Error: ${error}`} />
        )}
      </div>
    )}
  </Container>
);
};

export default Login;
