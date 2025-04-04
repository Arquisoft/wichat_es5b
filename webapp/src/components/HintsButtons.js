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
        const model = "empathy";

        const hintUsedResponse = await axios.post(`${apiEndpoint}/hintUsed`, {numHint})
        props.setScore(hintUsedResponse.data.score)

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

