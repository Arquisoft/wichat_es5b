import React, { useState } from 'react';
import { Container, TextField, Button, Box, List, ListItem, ListItemText, Paper } from '@mui/material';
import axios from 'axios';

const Chatbot = ({ movieName }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

    const handleSendMessage = async () => {
        if (!input.trim()) return;
        
        // Agregar mensaje del usuario
        const userMessage = { text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        
        try {
            // Enviar al LLM
            const model = "empathy";

            const response = await axios.post(`${apiEndpoint}/askllm`, { 
                question: `El usuario está jugando a adivinar películas y necesita pistas sobre "${movieName}". 
                          Responde de manera útil pero sin revelar directamente el nombre de la película. 
                          Pregunta del usuario: ${input}`,
                model 
            });
            
            // Agregar respuesta del bot
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
        <Container maxWidth="sm" sx={{ mt: 2, mb: 4 }}>
            <Paper elevation={3} sx={{ p: 2, height: '400px', overflow: 'auto' }}>
                <List>
                    {messages.map((msg, index) => (
                        <ListItem key={index} sx={{ 
                            justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                            textAlign: msg.sender === 'user' ? 'right' : 'left'
                        }}>
                            <ListItemText 
                                primary={msg.text} 
                                sx={{
                                    bgcolor: msg.sender === 'user' ? '#e3f2fd' : '#f5f5f5',
                                    p: 2,
                                    borderRadius: 2,
                                    maxWidth: '80%',
                                    display: 'inline-block'
                                }}
                            />
                        </ListItem>
                    ))}
                </List>
            </Paper>
            <Box sx={{ display: 'flex', mt: 2 }}>
                <TextField
                    fullWidth
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Pregunta por pistas sobre la película..."
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
        </Container>
    );
};

export default Chatbot;