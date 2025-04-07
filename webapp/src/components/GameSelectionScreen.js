import {Button} from "@mui/material";
import React, {useState} from "react";
import { ThemeProvider } from '@mui/material/styles';
import axios from "axios";
import LoadingScreen from "./LoadingScreen";
import Game from "./game/GameQuestion";
import theme from './estilos/temas';

export default function SelectionScreen ({username})  {
    const [startGame, setStartGame] = useState(false);
    const [mostrarPantalla, setMostrarPantalla] = useState(false);
    const [modoJuego, setModoJuego] = useState('NORMAL');
    const [dificultad, setDificultad] = useState('FÁCIL');


    const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

    async function start() {
        return await axios.post(apiEndpoint + "/start");
    }

    const reinicio = () => {
        setStartGame(false);
    }

    if(mostrarPantalla)
        return (<LoadingScreen />);

    if (startGame) {
        return (
            <div>
                <Game username={username}/>
                <Button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700" onClick={() => reinicio()}>
                    Volver
                </Button>
            </div>
        );
    }

    return (
        <ThemeProvider theme={theme}>
            <div className="bg-white min-h-screen px-4 py-3">
                <div className="bg-orange-dark shadow-lg rounded-lg my-6 px-9 py-2">
                    <h2 className="text-2xl font-bold border-b border-gray-200 pb-2 text-left">
                        MODALIDAD DE JUEGO
                    </h2>
                    <p className="mt-4 text-left">Selecciona el modo de juego al que quieras jugar:</p>
                    <div className="flex justify-center gap-4 mt-4">
                        {['NORMAL'].map((modo) => (
                            <div
                                key={modo}
                                onClick={() => setModoJuego(modo)}
                                className={`option-card ${modoJuego === modo ? 'selected' : ''}`}
                            >
                                {modo}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-orange-dark shadow-lg rounded-lg my-6 px-9 py-2">
                    <h2 className="text-2xl font-bold border-b border-gray-200 pb-2 text-left">
                        DIFICULTAD DEL JUEGO
                    </h2>
                    <p className="mt-4 text-left">Selecciona la dificultad de la partida:</p>
                    <div className="flex justify-center gap-4 mt-4">
                        {['FÁCIL', 'INTERMEDIO', 'DIFÍCIL'].map((nivel) => (
                            <div
                                key={nivel}
                                onClick={() => setDificultad(nivel)}
                                className={`option-card ${dificultad === nivel ? 'selected' : ''}`}
                            >
                                {nivel}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-center mt-4">
                    <Button
                        variant="contained"
                        className="text-black font-bold"
                        sx={{
                            backgroundColor: '#cc5c24',
                            '&:hover': { backgroundColor: '#b34f1f' },
                            minWidth: '200px',
                            fontWeight: 'bold',
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
                </div>
            </div>
        </ThemeProvider>


    );
}