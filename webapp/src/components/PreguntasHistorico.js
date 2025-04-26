import { useState, useContext } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { LanguageContext } from "../LanguageContext";


const PreguntasHistorico = ({user}) => {
    const [show, setShow] = useState(false);
    const { translations, currentLang } = useContext(LanguageContext);

    const mostrarPreguntas = () =>{
        setShow(true);
    }


    return(
        <div>
            <Button onClick= {() => mostrarPreguntas()}>{translations.history_question_button || "Mostrar Preguntas"}</Button>
            <Dialog open={show} onClose={()=> setShow(false)}>
                <DialogTitle>
                    {translations.history_question_title || "Historial de Preguntas"}
                </DialogTitle>
                <DialogContent>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>{translations.history_question_question || "Pregunta"}</TableCell>
                                <TableCell>{translations.history_question_image || "Imagen"}</TableCell>
                                <TableCell>{translations.history_question_options || "Opciones"}</TableCell>
                                <TableCell>{translations.history_question_correct_answer || "Respuesta correcta"}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {user.questions.map((question,index)=>(
                            <TableRow key={index}>
                                <TableCell>{question.question[currentLang]}</TableCell>
                                <TableCell>
                                    <img src={question.image} alt={translations.history_question_image_alt || "Imagen de la pregunta"} style={{ maxWidth: '100%', maxHeight: '100%' }} />
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
                    <Button onClick={() => setShow(false)}>Cerrar</Button>
                </DialogActions>

            </Dialog>
        </div>
    );

}

export default PreguntasHistorico;