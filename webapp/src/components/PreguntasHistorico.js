import { useState, useEffect, useContext } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { LanguageContext } from "../LanguageContext";


const PreguntasHistorico = ({user}) => {
    const [show, setShow] = useState(false);
    const { translations } = useContext(LanguageContext);

    const mostrarPreguntas = () =>{
        setShow(true);
    }

    return(
        <div>
            <Button onClick= {() => mostrarPreguntas()}>{translations.historic_show || "Mostrar Preguntas"}</Button>
            <Dialog open={show} onClose={()=> setShow(false)}>
                <DialogTitle>
                    {translations.historic_title || "Historial de Preguntas"}
                </DialogTitle>
                <DialogContent>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>{translations.historic_question || "Pregunta"}</TableCell>
                                <TableCell>{translations.historic_img || "Imagen"}</TableCell>
                                <TableCell>{translations.historic_options || "Opciones"}</TableCell>
                                <TableCell>{translations.historic_correct_option || "Opción correcta"}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {user.questions.map((question,index)=>(
                            <TableRow key={index}>
                                <TableCell>{question.text}</TableCell>
                                <TableCell>
                                    <img src={question.image} alt="Imagen de la pregunta" style={{ maxWidth: '100%', maxHeight: '100%' }} />
                                </TableCell>
                                <TableCell>
                                <ul>
                                    {question.options.map((option, index) => (
                                        <li>{option}</li>
                                    ))
                                    }
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
                    <Button onClick={() => setShow(false)}>{translations.close || "Cerrar"}</Button>
                </DialogActions>

            </Dialog>
        </div>
    );

}

export default PreguntasHistorico;