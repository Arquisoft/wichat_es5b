import React, { useState, useContext } from 'react';
import { TextField, Button, Box, List, ListItem, ListItemText, Paper } from '@mui/material';
import axios from 'axios';

import { blueGrey } from '@mui/material/colors';
import { LanguageContext } from "../LanguageContext";

import { RingLoader } from "react-spinners";
import { Typewriter } from "react-simple-typewriter";

const Chatbot = ({ movieName, imageUrl, setScore }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isMinimized, setIsMinimized] = useState(true);
    const { translations, currentLang } = useContext(LanguageContext);
    const [imageHintUsed, setImageHintUsed] = useState(false);

    const DEFAULT_MODEL = 'empathy';
    const QWEN_MODEL = 'empathyQwen';

    const [currentModel, setCurrentModel] = useState(DEFAULT_MODEL);
    
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
                          Pregunta del usuario: ${input}.
                          Responde en ${currentLang === 'es' ? 'español' : 'english'}`,
                model: currentModel
            });

            
            if (typeof response.data.answer === 'string' && 
                response.data.answer.includes('status code 504')) {
                throw new Error('QWEN_TIMEOUT');
            }
            
            const botMessage = { text: response.data.answer, sender: 'bot' };
            setMessages(prev => [...prev, botMessage]);

            const chatBotUsedResponse = await axios.post(`${apiEndpoint}/chatBotUsed`);
            setScore(chatBotUsedResponse.data.score);

        } catch (error) {

            console.error("Error al comunicarse con el LLM:", error);
            
            let errorMessage = { 
                text: "Lo siento, hubo un error al procesar tu solicitud. Intenta de nuevo más tarde.", 
                sender: 'bot' 
            };

            if (error.message === 'QWEN_TIMEOUT' || 
                (error.response && error.response.status === 504 && currentModel === QWEN_MODEL)) {
                errorMessage.text = "⚠️ Qwen no está disponible (Error 504: Tiempo de espera agotado). Cambiando a Mistral...";
                
                setCurrentModel(DEFAULT_MODEL);
                
                const systemMessage = {
                    text: "Se ha cambiado automáticamente al modelo Mistral.",
                    sender: 'system'
                };
                setMessages(prev => [...prev, errorMessage, systemMessage]);
            } else {
                setMessages(prev => [...prev, errorMessage]);
            }
        }
    };

    const handleImageHint = async () => {
        if (!imageUrl) {
            const errorMessage = { 
                text: "No hay imagen disponible para esta película", 
                sender: 'bot' 
            };
            return setMessages(prev => [...prev, errorMessage]);
        }
        
        const userImageMessage = { 
            text: "Te envío esta imagen para que me des una pista:", 
            sender: 'user',
            imageUrl: imageUrl
        };

        setMessages(prev => [...prev, userImageMessage]);
        
        try {
            const loadingMessage = { 
                text: "Analizando la imagen para darte una pista...", 
                sender: 'bot' 
            };
            setMessages(prev => [...prev, loadingMessage]);
            
            const response = await axios.post(`${apiEndpoint}/askWithImage`, { 
                question: `Estoy jugando a adivinar una película o actor. Dame una pista útil basada en esta imagen sin revelar directamente el nombre.`,
                imageUrl: imageUrl
            });
    
            const botMessage = { 
                text: response.data.answer || "No pude generar una pista basada en la imagen.", 
                sender: 'bot' 
            };

            setMessages(prev => [...prev, botMessage]);
            setImageHintUsed(true);
            
            await axios.post(`${apiEndpoint}/chatBotUsed`);
            setScore(prevScore => prevScore - 1); 

        } catch (error) {
            console.error("Error al procesar la imagen:", error);
            const errorMessage = { 
                text: error.response?.data?.error || 
                     "Lo siento, no pude analizar la imagen. Intenta con otra pista.", 
                sender: 'bot' 
            };

            setMessages(prev => [...prev, errorMessage]);
        }
        setIsLoading(false);
    };

    const toggleModel = () => {
        const newModel = currentModel === DEFAULT_MODEL ? QWEN_MODEL : DEFAULT_MODEL;
        setCurrentModel(newModel);
        
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
            bottom: '42px',
            width: '320px',
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
                <Box sx={{ 
                    display: 'flex',
                    justifyContent: isMinimized ? 'center' : 'space-between',
                    alignItems: 'center',
                    backgroundColor: '#c46331',
                    width: '100%',
                    minHeight: '40px',
                    position: 'relative',
                    px: 1
                }}>
                    <Button 
                        onClick={() => setIsMinimized(!isMinimized)}
                        sx={{ 
                            color: 'white',
                            '&:hover': { 
                                backgroundColor: '#a6532a',
                            },
                            fontWeight: 'bold',
                            fontSize: '0.8rem',
                            width: isMinimized ? '100%' : 'auto',
                            minWidth: isMinimized ? '100%' : '120px',
                            textTransform: 'none',
                            px: 1,
                            mr: isMinimized ? 0 : 1,
                            justifyContent: 'center',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}
                    >
                        {translations.chatbot_title || "Chat de Pistas"} {isMinimized ? '▲' : '▼'}
                    </Button>
                    
                    {!isMinimized && (
                        <Box sx={{ display: 'flex', gap: '6px' }}>
                            <Button 
                                variant="contained"
                                onClick={handleImageHint}
                                disabled={imageHintUsed || !imageUrl}
                                sx={{ 
                                    backgroundColor: blueGrey, 
                                    color: 'white',
                                    '&:hover': { 
                                        backgroundColor: '#2980b9', 
                                    },
                                    '&:disabled': {
                                        backgroundColor: '#bdc3c7',
                                        color: '#7f8c8d'
                                    },
                                    textTransform: 'none',
                                    fontWeight: 'bold',
                                    fontSize: '0.65rem',
                                    height: '30px',
                                    minWidth: '85px',
                                    px: 0.5,
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}
                            >
                                {imageHintUsed 
                                ? (translations.chatbot_visual_hint_used || 'Pista usada')
                                : (translations.chatbot_visual_hint || 'Pista visual')} 
                            </Button>
                            
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
                                    fontSize: '0.7rem',
                                    mr: 1,
                                    height: '30px',
                                    minWidth: '85px',
                                    textTransform: 'none',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}
                            >
                                {currentModel === DEFAULT_MODEL 
                                ? (translations.chatbot_use_qwen || 'Usar Qwen') 
                                : (translations.chatbot_use_mistral || 'Usar Mistral')}
                            </Button>
                        </Box>
                    )}
                </Box>
    
                {!isMinimized && (
                    <>
                        <List sx={{ 
                            flexGrow: 1,
                            overflowY: 'auto',
                            p: 1.5,
                            backgroundColor: '#f8f1eb',
                            minHeight: '400px',
                            maxHeight: '400px'
                        }}>
                            {messages.map((msg, index) => (
                                <ListItem key={index} sx={{ 
                                    justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                    p: 0.5,
                                    alignItems: 'flex-start'
                                }}>
                                    <Box sx={{
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
                                    }}>
                                        <ListItemText 
                                            primary={msg.text} 
                                            sx={{ whiteSpace: 'pre-wrap' }}
                                        />
                                        {msg.imageUrl && (
                                            <Box sx={{ 
                                                mt: 1,
                                                display: 'flex',
                                                justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                                            }}>
                                                <img 
                                                    src={msg.imageUrl} 
                                                    alt="Pista visual" 
                                                    style={{ 
                                                        maxWidth: '100%', 
                                                        maxHeight: '200px', 
                                                        borderRadius: '8px',
                                                        border: '2px solid #c46331'
                                                    }} 
                                                />
                                            </Box>
                                        )}
                                    </Box>
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
                                    padding: '0 16px',
                                    fontSize: '0.9rem',
                                    height: '45px',
                                    minWidth: '80px'
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