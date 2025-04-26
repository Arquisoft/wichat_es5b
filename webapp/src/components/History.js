import { useState, useEffect, useContext } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import axios from 'axios';
import PreguntasHistorico from "./PreguntasHistorico";
import { LanguageContext } from "../LanguageContext";

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';


const History = ({username}) => {
    const [show, setShow] = useState(false);
    const [historial, setHistorial] = useState([])
    const { translations } = useContext(LanguageContext);

    const mostrarHistorial = () =>{
        if (username) {
            getHistorial();
        }
        setShow(true);
    }

    const getHistorial = async () =>{
        const res= await axios.post(apiEndpoint + "/history", {username: username});
        setHistorial(res.data);
    }

    const formatoFecha = (fechaHistorial) => {
        let fecha = new Date(fechaHistorial);
        console.log(fecha);
        fecha = new Intl.DateTimeFormat(translations.current_language).format(fecha);
        console.log(fecha);
        return fecha;
    }


    return(
        <div>
            <Button variant="primary" sx={{color:"#fecd24",fontSize: "1.1rem"}} onClick= {() => mostrarHistorial()}>{translations.nav_history || "HISTORIAL"}</Button>
            <Dialog open={show} onClose={()=> setShow(false)}>
                <DialogTitle>
                    {translations.nav_history || "Historial"}
                </DialogTitle>
                <DialogContent>
                    {username ? (<Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>{translations.nav_history_date || "Fecha"}</TableCell>
                                <TableCell>{translations.nav_history_correct_answers || "Preguntas correctas"}</TableCell>
                                <TableCell>{translations.nav_history_wrong_answers || "Preguntas incorrectas"}</TableCell>
                                <TableCell>{translations.nav_history_questions || "Preguntas"}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {historial.map((user,index)=>(
                            <TableRow key={index}>
                                <TableCell>{formatoFecha(user.date)}</TableCell>
                                <TableCell>{user.correctAnswers}</TableCell>
                                <TableCell>{user.wrongAnswers}</TableCell>
                                <PreguntasHistorico user={user}/>
                            </TableRow>
                        ))}

                        </TableBody>
                    </Table>):(
                        <p>{translations.nav_history_session_error || "Debe iniciar sesión para ver su historial"}</p>
                )}
                    
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShow(false)}>{translations.close || "Cerrar"}</Button>
                </DialogActions>

            </Dialog>
        </div>
    );
}

export default History;