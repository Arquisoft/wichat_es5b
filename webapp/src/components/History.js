import { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import axios from 'axios';

const databaseServiceUrl = process.env.DATABASE_URL || 'http://localhost:8006';


const History = ({username}) => {
    const [show, setShow] = useState(false);
    const [historial, setHistorial] = useState([])


    const mostrarHistorial = () =>{
        setShow(true);
    }

    const getHistorial = async () =>{
        const res= await axios.post(databaseServiceUrl + "/history", {username: username});
        setHistorial(res.data);
    }

    useEffect(() => {
        getHistorial();
    }, []);


    return(
        <div>
            <Button sx={{"mt":2}} variant="contained" color="primary" onClick= {() => mostrarHistorial()}>Historial</Button>
            <Dialog open={show} onClose={()=> setShow(false)}>
                <DialogTitle>
                    <h2>Historial</h2>
                </DialogTitle>
                <DialogContent>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Fecha</TableCell>
                                <TableCell>Preguntas correctas</TableCell>
                                <TableCell>Preguntas incorrectas</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {historial.map((user,index)=>(
                            <TableRow key={index}>
                                <TableCell>{user.date}</TableCell>
                                <TableCell>{user.correctAnswers}</TableCell>
                                <TableCell>{user.wrongAnswers}</TableCell>
                            </TableRow>
                        ))}

                        </TableBody>
                    </Table>
                    
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShow(false)}>Cerrar</Button>
                </DialogActions>

            </Dialog>
        </div>
    );
}

export default History;