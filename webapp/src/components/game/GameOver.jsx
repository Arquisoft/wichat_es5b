import axios from 'axios';
import { useEffect } from "react";
import { Table, TableHead, TableRow, TableCell, TableBody, Button } from "@mui/material";

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

export default function GameOver({ correct, wrong, username, questions, score }) {
  const saveHistorial = async () =>{
    const data = {username: username, date: new Date().toISOString(), correctAnswers: correct, wrongAnswers: wrong, totalScore:score, questions: questions};
    await axios.post(apiEndpoint + "/newHistory", data);
  }
  const saveRanking = async () =>{
    const data={username: username, correctAnswers: correct, wrongAnswers: wrong, totalScore:score, questions: questions}
    await axios.post(apiEndpoint + "/newRanking", data);
  }
  useEffect(()=>{
    saveHistorial();
    saveRanking();
  },[]);

    return (
      <div style={{display:"flex", alignItems:"center", alignItems:"center", flexDirection:"column"}}>
        <div style = {{display: "flex", alignItems:"center", width:"50%"}}>
          <img src="/The_end.png" alt="The End" />   
        </div>
        <div style={{display:"flex", justifyContent:'space-between', gap:"5em"}}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell style={{fontSize: "1.5em"}}>Puntuación</TableCell>
                <TableCell style={{fontSize: "1.5em"}}>{score}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{fontSize: "1.5em"}}>Preguntas Correctas</TableCell>
                <TableCell style={{fontSize: "1.5em"}}>{correct}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{fontSize: "1.5em"}}>Preguntas Incorrectas</TableCell>
                <TableCell style={{fontSize: "1.5em"}}>{wrong}</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <div>
          <form>
            <label>
              Dejanos tu opinion:
              <textarea style={{width:"150%", resize:"none"}}></textarea>
            </label>
            <Button variant="primary">Enviar</Button>
          </form>
          </div>
        </div>
      </div>
    );
  }