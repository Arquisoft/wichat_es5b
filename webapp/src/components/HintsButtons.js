import React, { useState } from 'react';
import Container from '@mui/material/Container';
import { Typewriter } from "react-simple-typewriter";
import Button from '@mui/material/Button';
import axios from 'axios';


const HintsButtons = (props) =>{
    const [hints, setHints] = useState([]);
    const [unlockedIndex, setUnlockedIndex] = useState(0); //estado para el indice desbloqueado

    //const pelicula = "El Resplandor";
    const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';


    const handleAskForHint = async (questions, numHint) => {
      /*
        const questions = [
          "De que año y genero es la pelicula " + movieName +" , dame solamente el año y el genero y evita decir el nombre de la pelicula (formato: Fue estrenada en {año})",
          "Nombre del actor protagonista de " + movieName + ", no digas el nombre de la pelicula (Formato: El actor protagonista es {nombre del actor}.)",
          "Quien es el personaje principal de " + movieName + ", no digas el nombre de la pelicula, solo el nombre del personaje protagonista (Formato: El personaje principal es {nombre del personaje}).",
          "Dame un resumen muy breve en una línea de la trama de la película " + movieName + ", no digas el nombre de la película (Formato: La pelicula trata sobre {resumen en una linea})."
        ];*/
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
        <Container className="bg-orange shadow-lg rounded-lg" component="div" maxWidth="s" sx={{ mt: 5, display: "flex", justifyContent:"center", alignContent: "center"}}>
            {['Primera Pista', 'Segunda Pista', 'Tercera Pista', 'Cuarta Pista'].map((label, index) => (
                
                <Container key={index} >
                {hints[index] ? (
    
                    <Typewriter
                      sx={{mt:4,mb:4}}
                      words={[hints[index]]}
                      typeSpeed={20}
                    />
    
                ) : (
                    <Button 
                        onClick={() => handleAskForHint(props.questionsLlm, index)}
                        sx={{ 
                          mt: 1,
                          mb: 1, 
                          width:'75%', 
                          minWidth:'150px',
                          color:'black', 
                          backgroundColor: '#faf5ea', 
                          '&:hover':{backgroundColor:'orange'} 
                        }}
                        disabled={index > unlockedIndex} //deshabilitar botones segun el indice desbloqueado
                    >
                    {label}
                    </Button>
                )}
            </Container>
          ))}
          </Container>
          
          
    );
    
};

export default HintsButtons;

