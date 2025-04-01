import React, { useState } from 'react';
import { TextField, Button, Box, List, ListItem, ListItemText, Paper } from '@mui/material';
import axios from 'axios';

const Chatbot = ({ movieName }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isMinimized, setIsMinimized] = useState(true);

    const DEFAULT_MODEL = 'empathy';
    const QWEN_MODEL = 'empathyQwen';

    const [currentModel, setCurrentModel] = useState(DEFAULT_MODEL); // Modelo por defecto
    
    const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

    const handleSendMessage = async () => {
        if (!input.trim()) return;
        
        const userMessage = { text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        
        try {
            const response = await axios.post(`${apiEndpoint}/askllm`, { 
                question: `El usuario está jugando a adivinar películas y necesita pistas sobre "${movieName}". 
                          Responde de manera útil pero sin revelar directamente el nombre de la película. 
                          Pregunta del usuario: ${input}`,
                model: currentModel
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

    const toggleModel = () => {
        const newModel = currentModel === DEFAULT_MODEL ? QWEN_MODEL : DEFAULT_MODEL;
        setCurrentModel(newModel);
        
        // Añadir mensaje informativo al chat
        const modelName = newModel === DEFAULT_MODEL ? 'Mistral' : 'Qwen';
        const infoMessage = {
            text: `Se ha cambiado el modelo a ${modelName}.`,
            sender: 'system'
        };
        setMessages(prev => [...prev, infoMessage]);
    };

    return (
        <div style={{
            position: 'fixed',
            left: '20px',
            bottom: '20px',
            width: '380px',  
            zIndex: 1000,
            borderRadius: '8px',
            overflow: 'hidden'
        }}>
            <Paper elevation={3} sx={{ 
                display: 'flex',
                flexDirection: 'column',
                height: isMinimized ? '40px' : '520px',
                transition: 'height 0.3s ease',
                overflow: 'hidden',
                border: '2px solid #c46331',
                paddingBottom: '0'
            }}>
                <Button 
                    onClick={() => setIsMinimized(!isMinimized)}
                    sx={{ 
                        width: '100%',
                        backgroundColor: '#c46331',
                        color: 'white',
                        '&:hover': { 
                            backgroundColor: '#a6532a',
                            borderBottom: '2px solid #8a4524'
                        },
                        borderRadius: 0,
                        minHeight: '40px',
                        fontWeight: 'bold',
                        fontSize: '1rem'
                    }}
                >
                    {isMinimized ? 'Chat de Pistas ▲' : 'Chat de Pistas ▼'}
                </Button>

                {!isMinimized && (
                    <>
                        <List sx={{ 
                            flexGrow: 1,
                            overflowY: 'auto',
                            p: 1.5,
                            backgroundColor: '#f8f1eb',
                            minHeight: '400px'
                        }}>
                            {messages.map((msg, index) => (
                                <ListItem key={index} sx={{ 
                                    justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                    p: 0.5,
                                    alignItems: 'flex-start'
                                }}>
                                    <ListItemText 
                                        primary={msg.text} 
                                        sx={{
                                            bgcolor: msg.sender === 'user' ? '#e8d5c9' : 
                                                    msg.sender === 'system' ? '#e0e0e0' : '#f0e6de',
                                            p: 1.5,
                                            borderRadius: '12px',
                                            maxWidth: '85%',
                                            display: 'inline-block',
                                            color: msg.sender === 'user' ? '#5a2d16' : 
                                                  msg.sender === 'system' ? '#333' : '#4a2512',
                                            border: '1px solid #d4b8a8',
                                            wordBreak: 'break-word',
                                            fontStyle: msg.sender === 'system' ? 'italic' : 'normal'
                                        }}
                                    />
                                </ListItem>
                            ))}
                        </List>

                        <Box sx={{ 
                            display: 'flex', 
                            flexDirection: 'column',
                            p: 2,
                            backgroundColor: '#f8f1eb',
                            borderTop: '2px solid #c46331'
                        }}>
                            <Box sx={{ display: 'flex', mb: 1 }}>
                                <Button 
                                    variant="outlined"
                                    onClick={toggleModel}
                                    sx={{ 
                                        ml: 'auto',
                                        backgroundColor: '#f0e6de',
                                        color: '#5a2d16',
                                        borderColor: '#c46331',
                                        '&:hover': { 
                                            backgroundColor: '#e8d5c9',
                                            borderColor: '#a6532a'
                                        },
                                        fontSize: '0.8rem'
                                    }}
                                >
                                    {currentModel === DEFAULT_MODEL ? 'Usar Qwen' : 'Usar Mistral'}
                                </Button>
                            </Box>
                            
                            <Box sx={{ display: 'flex' }}>
                                <TextField
                                    fullWidth
                                    size="medium"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Escribe tu pregunta..."
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: '#c46331',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#a6532a',
                                            },
                                        },
                                        '& .MuiInputBase-input': {
                                            padding: '12px'
                                        },
                                        height: '45px'
                                    }}
                                />

                                <Button 
                                    variant="contained" 
                                    onClick={handleSendMessage}
                                    sx={{ 
                                        ml: 1.5,
                                        backgroundColor: '#c46331',
                                        color: 'white',
                                        '&:hover': { 
                                            backgroundColor: '#a6532a' 
                                        },
                                        padding: '0 20px',
                                        fontSize: '1rem',
                                        height: '45px'
                                    }}
                                >
                                    Enviar
                                </Button>
                            </Box>
                        </Box>
                    </>
                )}
            </Paper>
        </div>
    );
};

export default Chatbot;