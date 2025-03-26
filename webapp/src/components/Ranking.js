import axios from 'axios';
import { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";



const databaseServiceUrl = process.env.DATABASE_URL || 'http://localhost:8006';

const Ranking = () => {
    const [ranking, setRanking] = useState([]);
    const [show, setShow] = useState(false);


    const getRanking= async () =>{
        const res= await axios.get(databaseServiceUrl + "/ranking");
        setRanking(res.data);
    }

    useEffect(() => {
        console.log("aaaa");
        getRanking();
    }, []);

    const mostrarRanking = () =>{
        setShow(true);
    }

    return (
        <div >
            <Button sx={{"mt":2}} variant="contained" color="primary" onClick= {() => mostrarRanking()}>Ranking</Button>
            <Dialog open={show} onClose={()=> setShow(false)}>
                <DialogContent>
                    <DialogTitle>Ranking</DialogTitle>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Fecha</TableCell>
                                <TableCell>Puntuación</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {ranking.map((user,index)=>(
                            <TableRow key={index}>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>{user.correctAnswers}</TableCell>
                            </TableRow>
                        ))}

                        </TableBody>
                    </Table>
                    </DialogContent>
                <DialogActions>
                    <Button onClick={()=>{setShow(false)}} >Cerrar</Button>
                </DialogActions>

            </Dialog>
        </div>
    );
}

export default Ranking;