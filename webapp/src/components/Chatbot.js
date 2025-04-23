import React, { useState, useContext } from 'react';
import { TextField, Button, Box, List, ListItem, ListItemText, Paper } from '@mui/material';
import axios from 'axios';

import { LanguageContext } from "../LanguageContext";

import { RingLoader } from "react-spinners";
import { Typewriter } from "react-simple-typewriter";


const Chatbot = ({ movieName, setScore }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isMinimized, setIsMinimized] = useState(true);
    const { translations } = useContext(LanguageContext);

    const DEFAULT_MODEL = 'empathy';
    const QWEN_MODEL = 'empathyQwen';

    const [currentModel, setCurrentModel] = useState(DEFAULT_MODEL); //modelo por defecto: mistral
    
    const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

    const [isLoading, setIsLoading] = useState(false);

    const handleSendMessage = async () => {
        if (!input.trim()) return;
        
        const userMessage = { text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        
        try {
            const response = await axios.post(`${apiEndpoint}/askllm`, { 
                question: `El usuario está jugando a adivinar películas y necesita pistas sobre "${movieName}". 
                          Responde de manera útil pero sin revelar directamente el nombre de la película. 
                          Pregunta del usuario: ${input}`,
                model: currentModel
            });
            
            const botMessage = { text: response.data.answer, sender: 'bot' };
            setMessages(prev => [...prev, botMessage]);

            const chatBotUsedResponse = await axios.post(`${apiEndpoint}/chatBotUsed`)
            setScore(chatBotUsedResponse.data.score)

        } catch (error) {
            console.error("Error al comunicarse con el LLM:", error);
            const errorMessage = { 
                text: "Lo siento, hubo un error al procesar tu solicitud. Intenta de nuevo más tarde.", 
                sender: 'bot' 
            };
            setMessages(prev => [...prev, errorMessage]);
        }
        setIsLoading(false);
    };

    const toggleModel = () => {
        const newModel = currentModel === DEFAULT_MODEL ? QWEN_MODEL : DEFAULT_MODEL;
        setCurrentModel(newModel);
        
        //que aparezca mensaje informativo al chat del cambio de modelo
        const modelName = newModel === DEFAULT_MODEL ? 'Mistral' : 'Qwen';
        const infoMessage = {
            text: (translations.chatbot_model_change || "Se ha cambiado el modelo a") + ` ${modelName}.`,
            sender: 'system'
        };
        setMessages(prev => [...prev, infoMessage]);
    };

    return (
        <div style={{
            position: 'fixed',
            left: '20px',
            bottom: '42px', //antes 20
            width: '320px', //antes 380 
            zIndex: 1000,
            borderRadius: '8px',
            overflow: 'hidden'
        }}>
            <Paper 
                elevation={3} 
                role="region"
            sx={{ 
                display: 'flex',
                flexDirection: 'column',
                height: isMinimized ? '40px' : '520px',
                transition: 'height 0.3s ease',
                overflow: 'hidden',
                border: '2px solid #c46331',
                paddingBottom: '0'
            }}>
                {/* Cabecera con título y botón de modelo */}
                <Box sx={{ 
                    display: 'flex',
                    justifyContent: isMinimized ? 'center' : 'space-between',
                    alignItems: 'center',
                    backgroundColor: '#c46331',
                    width: '100%',
                    minHeight: '40px',
                    position: 'relative'
                }}>
                    <Button 
                        onClick={() => setIsMinimized(!isMinimized)}
                        sx={{ 
                            color: 'white',
                            '&:hover': { 
                                backgroundColor: '#a6532a',
                            },
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            flexGrow: isMinimized ? 0 : 1,
                            textAlign: isMinimized ? 'center' : 'left',
                            justifyContent: 'center',
                            px: 2,
                            textTransform: 'none',
                            position: isMinimized ? 'static' : 'relative',
                            minWidth: isMinimized ? 'auto' : 0
                        }}
                    >
                        {translations.chatbot_title || "Chat de pistas"} {isMinimized ? '▲' : '▼'}
                    </Button>
                    
                    {!isMinimized && (
                        <Button 
                            variant="outlined"
                            onClick={toggleModel}
                            sx={{ 
                                backgroundColor: '#f0e6de',
                                color: '#5a2d16',
                                borderColor: '#c46331',
                                '&:hover': { 
                                    backgroundColor: '#e8d5c9',
                                    borderColor: '#a6532a'
                                },
                                fontSize: '0.8rem',
                                mr: 1,
                                height: '30px',
                                minWidth: '100px',
                                textTransform: 'none'
                            }}
                        >
                            {currentModel === DEFAULT_MODEL 
                            ? (translations.chatbot_use_qwen || 'Usar Qwen') 
                            : (translations.chatbot_use_mistral || 'Usar Mistral')}

                        </Button>
                    )}
                </Box>
    
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
                                        primary={msg.sender === 'bot' ? <Typewriter words={[msg.text]} typeSpeed={5} /> : msg.text } 
                                        sx={{
                                            bgcolor: msg.sender === 'user' ? '#e8d5c9' : 
                                                    msg.sender === 'system' ? '#e0e0e0' : '#f0e6de',
                                            p: 1.5,
                                            borderRadius: '12px',
                                            maxWidth: '90%',
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
                            {isLoading && (
                                <ListItem sx={{ justifyContent: 'flex-start', p: 0.5 }}>
                                    <RingLoader color="#c46331" size={30} />
                                </ListItem>
                            )}
                        </List>
    
                        <Box sx={{ 
                            display: 'flex', 
                            p: 2,
                            backgroundColor: '#f8f1eb',
                            borderTop: '2px solid #c46331'
                        }}>
                            <TextField
                                fullWidth
                                size="medium"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={translations.chatbot_question || "Escribe tu pregunta..."}
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
                                {translations.send || "Enviar"}
                            </Button>
                        </Box>
                    </>
                )}
            </Paper>
        </div>
    );
};

export default Chatbot;