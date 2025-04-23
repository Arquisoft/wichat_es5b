import { Button, ButtonGroup, Box, Typography, Container, Paper } from "@mui/material";
import React, { useState } from "react";
import { ThemeProvider } from '@mui/material/styles';
import axios from "axios";
import LoadingScreen from "./LoadingScreen";
import Game from "./game/GameQuestion";
import theme from './estilos/temas';

export default function SelectionScreen({ username }) {
    const [startGame, setStartGame] = useState(false);
    const [mostrarPantalla, setMostrarPantalla] = useState(false);
    const [modoJuego, setModoJuego] = useState('normal');
    const [nQuestions, setNQuestions] = useState(6);

    const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

    async function start() {
        const res= await axios.post(apiEndpoint + "/start", {
            nQuestions: nQuestions,
            gameMode: modoJuego
        });
        return res;    }

    const reinicio = () => {
        setStartGame(false);
    }

    if (mostrarPantalla) return <LoadingScreen />;
    if (startGame) {
        return (
            <div>
                <Game username={username} nQuestions={nQuestions} modoJuego={modoJuego}/>
                <Button
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                    onClick={() => reinicio()}
                >
                    Volver
                </Button>
            </div>
        );
    }

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="md" sx={{ mt: 6, mb: 6 }}>
                <Typography component="h1" variant="h2" align="center" gutterBottom>
                    🎦¡Bienvenido a Wichat!
                </Typography>
                <Typography component="h2" variant="h5" align="center" sx={{ mb: 6 }}>
                    ¿Preparado para poner a prueba tus conocimientos en el mundo del cine?
                </Typography>

                <Paper
                    elevation={6}
                    sx={{
                        backgroundColor: '#c46331',
                        borderRadius: 3,
                        p: 4,
                        mb: 4,
                    }}
                >
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                        MODALIDAD DE JUEGO
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 3 }}>
                        Escoge el modo de juego:
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <ButtonGroup fullWidth>
                            <Button
                                variant={modoJuego === 'normal' ? 'contained' : 'outlined'}
                                color={modoJuego === 'normal' ? 'primary' : 'inherit'}
                                onClick={() => setModoJuego('normal')}
                                sx={{ borderRadius: 2, fontWeight: 'bold', textTransform: 'none', color: '#fff' }}
                            >
                                NORMAL
                            </Button>
                            <Button
                                variant={modoJuego === 'bateriaSabios' ? 'contained' : 'outlined'}
                                color={modoJuego === 'bateriaSabios' ? 'primary' : 'inherit'}
                                onClick={() => setModoJuego('bateriaSabios')}
                                sx={{ borderRadius: 2, fontWeight: 'bold', textTransform: 'none', color: '#fff' }}
                            >
                                BATERÍA DE SABIOS
                            </Button>
                        </ButtonGroup>
                    </Box>
                </Paper>

                <Paper
                    elevation={6}
                    sx={{
                        backgroundColor: '#c46331',
                        borderRadius: 3,
                        p: 4,
                        mb: 4,
                    }}
                >
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                        DIFICULTAD DEL JUEGO
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 3 }}>
                        Escoge la longitud de la partida:
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <ButtonGroup fullWidth>
                            <Button
                                variant={nQuestions === 6 ? 'contained' : 'outlined'}
                                color={nQuestions === 6 ? 'primary' : 'inherit'}
                                onClick={() => setNQuestions(6)}
                                sx={{ borderRadius: 2, fontWeight: 'bold', textTransform: 'none', color: '#fff' }}
                            >
                                CORTA
                            </Button>
                            <Button
                                variant={nQuestions === 12 ? 'contained' : 'outlined'}
                                color={nQuestions === 12 ? 'primary' : 'inherit'}
                                onClick={() => setNQuestions(12)}
                                sx={{ borderRadius: 2, fontWeight: 'bold', textTransform: 'none', color: '#fff' }}
                            >
                                NORMAL
                            </Button>
                            <Button
                                variant={nQuestions === 18 ? 'contained' : 'outlined'}
                                color={nQuestions === 18 ? 'primary' : 'inherit'}
                                onClick={() => setNQuestions(18)}
                                sx={{ borderRadius: 2, fontWeight: 'bold', textTransform: 'none', color: '#fff' }}
                            >
                                LARGA
                            </Button>
                        </ButtonGroup>
                    </Box>
                </Paper>

                <Box sx={{ mt: 4, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <Typography
                        component="p"
                        variant="h6"
                        sx={{ mr: 2, fontWeight: 'bold' }}
                    >
                        Preparados, listos...
                    </Typography>
                    <Button
                        variant="contained"
                        size="large"
                        startIcon={<span role="img" aria-label="acción">🎬</span>}
                        sx={{
                            backgroundColor: '#ff8a65',
                            color: '#fff',
                            '&:hover': { backgroundColor: '#ff7043' },
                            transition: 'all 0.3s ease-in-out',
                            boxShadow: '0px 4px 10px rgba(0,0,0,0.3)',
                            borderRadius: 3,
                            px: 5,
                            py: 1.8,
                            fontWeight: 'bold',
                            textTransform: 'uppercase'
                        }}
                        onClick={async () => {
                            setMostrarPantalla(true);
                            await start();
                            setMostrarPantalla(false);
                            setStartGame(true);
                        }}
                    >
                        ¡Acción!
                    </Button>
                </Box>
            </Container>
        </ThemeProvider>
    );
}
