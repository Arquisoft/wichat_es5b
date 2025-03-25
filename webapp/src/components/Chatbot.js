import React, { useState } from 'react';
import { TextField, Button, Box, List, ListItem, ListItemText, Paper } from '@mui/material';
import axios from 'axios';

const Chatbot = ({ movieName }) => {

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isMinimized, setIsMinimized] = useState(true); //estado para minimizar/expandir
    const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

    const handleSendMessage = async () => {
        if (!input.trim()) return;
        
        const userMessage = { text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        
        try {

            const model = "empathy";

            const response = await axios.post(`${apiEndpoint}/askllm`, { 
                question: `El usuario está jugando a adivinar películas y necesita pistas sobre "${movieName}". 
                          Responde de manera útil pero sin revelar directamente el nombre de la película. 
                          Pregunta del usuario: ${input}`,
                model 
            });
            
            const botMessage = { text: response.data.answer, sender: 'bot' };
            setMessages(prev => [...prev, botMessage]);

        } catch (error) {

            console.error("Error al comunicarse con el LLM:", error);

            const errorMessage = { 
                text: "Lo siento, hubo un error al procesar tu solicitud. Intenta de nuevo más tarde.", 
                sender: 'bot' 
            };

            setMessages(prev => [...prev, errorMessage]);
        }
    };

    return (

        <div style={{
            position: 'fixed',
            left: '20px',
            bottom: '20px',
            width: '300px',
            zIndex: 1000
        }}>

            <Paper elevation={3} sx={{ 
                display: 'flex',
                flexDirection: 'column',
                height: isMinimized ? '40px' : '400px',
                transition: 'height 0.3s ease',
                overflow: 'hidden'
            }}>

                {/* Botón de minimizar/expandir */}
                <Button 
                    onClick={() => setIsMinimized(!isMinimized)}
                    sx={{ 
                        width: '100%',
                        backgroundColor: '#1976d2',
                        color: 'white',
                        '&:hover': { backgroundColor: '#1565c0' }
                    }}
                >
                    {isMinimized ? 'Chat de Pistas ▲' : 'Chat de Pistas ▼'}
                </Button>

                {!isMinimized && (
                    <>
                        <List sx={{ 

                            flexGrow: 1,
                            overflowY: 'auto',
                            p: 1
                        }}>

                            {messages.map((msg, index) => (

                                <ListItem key={index} sx={{ 
                                    justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                    p: 0.5
                                }}>
                                    <ListItemText 
                                        primary={msg.text} 
                                        sx={{
                                            bgcolor: msg.sender === 'user' ? '#e3f2fd' : '#f5f5f5',
                                            p: 1,
                                            borderRadius: 2,
                                            maxWidth: '80%',
                                            display: 'inline-block'
                                        }}
                                    />
                                </ListItem>

                            ))}

                        </List>

                        <Box sx={{ 
                            display: 'flex', 
                            p: 1,
                            borderTop: '1px solid #e0e0e0'
                        }}>
                            <TextField
                                fullWidth
                                size="small"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Pregunta por pistas..."
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            />

                            <Button 
                                variant="contained" 
                                onClick={handleSendMessage}
                                sx={{ ml: 1 }}
                            >
                                Enviar
                            </Button>
                            
                        </Box>
                    </>
                )}
            </Paper>
        </div>
    );
};

export default Chatbot;