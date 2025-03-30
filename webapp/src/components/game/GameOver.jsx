import axios from 'axios';
import { useEffect } from "react";


const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

export default function GameOver({ correct, wrong, username }) {
  const saveHistorial = async () =>{
    const data = {username: username, date: new Date().toISOString(), correctAnswers: correct, wrongAnswers: wrong};
    console.log(data);
    await axios.post(apiEndpoint + "/newHistory", data);
  }
  const saveRanking = async () =>{
    const data={username: username, correctAnswers: correct, wrongAnswers: wrong}
    await axios.post(apiEndpoint + "/newRanking", data);
  }
  useEffect(()=>{
    saveHistorial();
    saveRanking();
  },[]);

    return (
      <div className="max-w-lg mx-auto p-5 bg-white shadow-lg rounded-lg text-center">
        <h2 className="text-2xl font-bold">Fin de la partida</h2>
        <p className="mt-4 text-lg font-semibold">Respuestas correctas: {correct}</p>
        <p className="mt-2 text-lg font-semibold">Respuestas incorrectas: {wrong}</p>
      </div>
    );
  }