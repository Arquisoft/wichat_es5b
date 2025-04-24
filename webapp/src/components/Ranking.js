import axios from 'axios';
import { useState, useEffect, useContext } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { LanguageContext } from "../LanguageContext";



const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

const Ranking = () => {
    const [ranking, setRanking] = useState([]);
    const [show, setShow] = useState(false);
    const { translations } = useContext(LanguageContext);

    const getRanking= async () =>{
        const res= await axios.get(apiEndpoint + "/ranking");
        setRanking(res.data);
    }

    useEffect(() => {
        getRanking();
    }, []);

    const mostrarRanking = () =>{
        getRanking();
        setShow(true);
    }

    return (
        <div >
            <Button variant="primary" sx={{color:"#fecd24",fontSize: "1.1rem"}} onClick= {() => mostrarRanking()}>{translations.nav_ranking || "RANKING"}</Button>
            <Dialog open={show} onClose={()=> setShow(false)}>
                <DialogContent>
                    <DialogTitle>{translations.nav_ranking_title || "Ranking"}</DialogTitle>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>{translations.nav_ranking_date || "Fecha"}</TableCell>
                                <TableCell>{translations.nav_ranking_correct_answers || "Preguntas correctas"}</TableCell>
                                <TableCell>{translations.nav_ranking_wrong_answers || "Preguntas Incorrectas"}</TableCell>
                                <TableCell>{translations.nav_ranking_score || "Puntuación"}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {ranking.map((user,index)=>(
                            <TableRow key={index}>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>{user.correctAnswers}</TableCell>
                                <TableCell>{user.wrongAnswers}</TableCell>
                                <TableCell>{user.totalScore}</TableCell>
                            </TableRow>
                        ))}

                        </TableBody>
                    </Table>
                    </DialogContent>
                <DialogActions>
                    <Button onClick={()=>{setShow(false)}} >{translations.close || "Cerrar"}</Button>
                </DialogActions>

            </Dialog>
        </div>
    );
}

export default Ranking;