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
    const [modoJuego, setModoJuego] = useState('NORMAL');
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
            <div>
                <Typography component="h1" variant="h2" sx={{ textAlign: 'center', marginTop: 4 }}>🎬¡Bienvenido a Wichat!</Typography>
                <Typography component="h2" variant="h5" sx={{ textAlign: 'center', marginTop: 4 }}>¿Preparado para poner a prueba tus conocimientos en el mundo del cine?</Typography>
                <Typography component="p" variant="body1" sx={{ textAlign: 'left', marginTop: 2}}>Escoge la longitud de la partida:</Typography>
                <Container maxWidth="md">
                    <Paper elevation={6} sx={{ backgroundColor: '#c46331', borderRadius: 3, p: 4, mb: 6 }}>
                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                            MODALIDAD DE JUEGO
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 1, mb: 2 }}>
                            Escoge el modo de juego:
                        </Typography>
                        <Box sx={{display: 'flex', justifyContent: 'space-between', mt: 2, mb: 2}}>
                            <ButtonGroup fullWidth>
                                <Button
                                    variant={modoJuego === 'normal' ? 'contained' : 'outlined'}
                                    color={modoJuego === 'normal' ? 'primary' : 'inherit'}
                                    onClick={() => setModoJuego('normal')}
                                    sx={{ borderRadius: 2, fontWeight: 'bold', textTransform: 'none' }}
                                >
                                    Normal
                                </Button>
                                <Button
                                    variant={modoJuego === 'bateriaSabios' ? 'contained' : 'outlined'}
                                    color={modoJuego === 'bateriaSabios' ? 'primary' : 'inherit'}
                                    onClick={() => setModoJuego('bateriaSabios')}
                                    sx={{ borderRadius: 2, fontWeight: 'bold', textTransform: 'none' }}
                                >
                                    Batería de sabios
                                </Button>
                            </ButtonGroup>
                        </Box>
                    </Paper>
                    <Paper elevation={6} sx={{ backgroundColor: '#c46331', borderRadius: 3, p: 4, mb: 6 }}>
                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                            DIFICULTAD DEL JUEGO
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 1, mb: 2 }}>
                            Escoge la longitud de la partida:
                        </Typography>
                        <Box sx={{display: 'flex', justifyContent: 'space-between', mt: 2, mb: 2}}>
                            <ButtonGroup fullWidth>
                                <Button
                                    variant={nQuestions === 6 ? 'contained' : 'outlined'}
                                    color={nQuestions === 6 ? 'primary' : 'inherit'}
                                    onClick={() => setNQuestions(6)}
                                    sx={{ borderRadius: 2, fontWeight: 'bold', textTransform: 'none' }}
                                >
                                    Corta
                                </Button>
                                <Button
                                    variant={nQuestions === 12 ? 'contained' : 'outlined'}
                                    color={nQuestions === 12 ? 'primary' : 'inherit'}
                                    onClick={() => setNQuestions(12)}
                                    sx={{ borderRadius: 2, fontWeight: 'bold', textTransform: 'none' }}
                                >
                                    Normal
                                </Button>
                                <Button
                                    variant={nQuestions === 18 ? 'contained' : 'outlined'}
                                    color={nQuestions === 18 ? 'primary' : 'inherit'}
                                    onClick={() => setNQuestions(18)}
                                    sx={{ borderRadius: 2, fontWeight: 'bold', textTransform: 'none' }}
                                >
                                    Larga
                                </Button>
                            </ButtonGroup>
                        </Box>
                    </Paper>
                    <Box sx={{ textAlign: 'center' }}>
                        <Button
                            variant="contained"
                            size="large"
                            sx={{
                                backgroundColor: '#4abcb0',
                                color: 'white',
                                '&:hover': { backgroundColor: '#3aa89e' },
                                boxShadow: 3,
                                borderRadius: 2,
                                mt: 2,
                                px: 4,
                                py: 1.5
                            }}
                            onClick={async () => {
                                setMostrarPantalla(true);
                                await start();
                                setMostrarPantalla(false);
                                setStartGame(true);
                            }}
                        >
                            INICIAR JUEGO
                        </Button>
                    </Box>
                </Container>
            </div>
        </ThemeProvider>
    );
}
