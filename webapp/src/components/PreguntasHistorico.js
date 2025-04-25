import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";


const PreguntasHistorico = ({user}) => {
    const [show, setShow] = useState(false);

    const mostrarPreguntas = () =>{
        setShow(true);
    }

    return(
        <div>
            <Button onClick= {() => mostrarPreguntas()}>Mostrar Preguntas</Button>
            <Dialog open={show} onClose={()=> setShow(false)}>
                <DialogTitle>
                    Historial de Preguntas
                </DialogTitle>
                <DialogContent>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Pregunta</TableCell>
                                <TableCell>Imagen</TableCell>
                                <TableCell>Opciones</TableCell>
                                <TableCell>Opción correcta</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {user.questions.map((question,index)=>(
                            <TableRow key={index}>
                                <TableCell>{question.question.es}</TableCell>
                                <TableCell>
                                    <img src={question.image} alt="Imagen de la pregunta" style={{ maxWidth: '100%', maxHeight: '100%' }} />
                                </TableCell>
                                <TableCell>
                                <ul>
                                    <li>{question.option1}</li>
                                    <li>{question.option2}</li>
                                    <li>{question.option3}</li>
                                    <li>{question.option4}</li>
                                </ul>
                                </TableCell>
                                <TableCell>
                                    {question.correctOption}
                                </TableCell>
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

export default PreguntasHistorico;