import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import axios from 'axios';
import PreguntasHistorico from "./PreguntasHistorico";

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';


const History = ({username}) => {
    const [show, setShow] = useState(false);
    const [historial, setHistorial] = useState([])


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



    return(
        <div>
            <Button variant="primary" sx={{color:"#fecd24",fontSize: "1.1rem"}} onClick= {() => mostrarHistorial()}>HISTORIAL</Button>
            <Dialog open={show} onClose={()=> setShow(false)}>
                <DialogTitle>
                    Historial
                </DialogTitle>
                <DialogContent>
                    {username ? (<Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Fecha</TableCell>
                                <TableCell>Preguntas correctas</TableCell>
                                <TableCell>Preguntas incorrectas</TableCell>
                                <TableCell>Preguntas</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {historial.map((user,index)=>(
                            <TableRow key={index}>
                                <TableCell>{user.date}</TableCell>
                                <TableCell>{user.correctAnswers}</TableCell>
                                <TableCell>{user.wrongAnswers}</TableCell>
                                <PreguntasHistorico user={user}/>
                            </TableRow>
                        ))}

                        </TableBody>
                    </Table>):(
                        <p>Debe iniciar sesión para ver su historial</p>
                )}
                    
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShow(false)}>Cerrar</Button>
                </DialogActions>

            </Dialog>
        </div>
    );
}

export default History;