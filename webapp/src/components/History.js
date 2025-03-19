import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";

const historial =[
    {username:"username", date:"2024-03-19", correctAnswers: 4, wrongAnswers: 2},
    {username:"username", date:"2024-03-18", correctAnswers: 5, wrongAnswers: 1},
    {username:"username", date:"2024-03-16", correctAnswers: 4, wrongAnswers: 2},
    {username:"username", date:"2024-03-02", correctAnswers: 1, wrongAnswers: 5},
    {username:"username", date:"2024-03-16", correctAnswers: 4, wrongAnswers: 2},
    {username:"username", date:"2024-03-02", correctAnswers: 1, wrongAnswers: 5},
    {username:"username", date:"2024-03-16", correctAnswers: 4, wrongAnswers: 2},
    {username:"username", date:"2024-03-02", correctAnswers: 1, wrongAnswers: 5},
    {username:"username", date:"2024-03-16", correctAnswers: 4, wrongAnswers: 2},
    {username:"username", date:"2024-03-02", correctAnswers: 1, wrongAnswers: 5},
    {username:"username", date:"2024-03-16", correctAnswers: 4, wrongAnswers: 2},
    {username:"username", date:"2024-03-02", correctAnswers: 1, wrongAnswers: 5}
];



const History = () => {
    const [show, setShow] = useState(false);

    const mostrarHistorial = () =>{
        setShow(true);
    }


    return(
        <div>
            <Button onClick= {() => mostrarHistorial()}>Historial</Button>
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
                        {historial.map((user)=>(
                            <TableRow key={user}>
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