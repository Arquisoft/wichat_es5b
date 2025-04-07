import {Button, Container} from "@mui/material";
import React, {useState} from "react";
import axios from "axios";
import LoadingScreen from "./LoadingScreen";
import Game from "./game/GameQuestion";


export default function SelectionScreen ({username})  {
    const [startGame, setStartGame] = useState(false);
    const [keyReinicio, setKeyReinicio] = useState(0);
    const [mostrarPantalla, setMostrarPantalla] = useState(false);


    const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

    async function start() {
        const res= await axios.post(apiEndpoint + "/start");
        return res;
    }

    const reinicio = () => {
        setStartGame(false);
        setKeyReinicio(keyReinicio + 1);
        //start();
    }

    if(mostrarPantalla)
        return (<LoadingScreen />);


    if (startGame) {
        return (
                <div>
                    <Game username={username} key={keyReinicio}/>
                    <Button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700" onClick={() => reinicio()}>
                        Volver
                    </Button>
                </div>
        );
    }

    return (
        <div>
            <Button variant="contained" color="primary" onClick={async () => { setMostrarPantalla(true); await start(); setMostrarPantalla(false); setStartGame(true);}} sx={{ marginTop: 2 }}>
                Start Game
            </Button>
        </div>
    );
}