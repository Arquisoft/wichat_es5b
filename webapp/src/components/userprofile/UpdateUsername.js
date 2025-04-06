import { useState } from "react";
import { 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    Button, 
    MenuItem,
    Snackbar,
    Alert,
    TextField
} from "@mui/material";
import axios from 'axios';
import {jwtDecode} from "jwt-decode";

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

export default function UpdateUsername() {
    const [newUsername, setNewUsername] = useState("");
    const [error, setError] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const token = localStorage.getItem("token");

    let userId = "";
    if (token) {
    const decoded = jwtDecode(token);
    userId = decoded.userId; // O la propiedad que hayas definido en el payload
    }

    const handleUpdate = async () => {
        try {
            await axios.post(`${apiEndpoint}/updateusername`, {
                userId: userId,
                newUsername: newUsername 
            });
            setOpenSnackbar(true);
        } catch (error) {
            setError(error.response.data.error);
        }
    };

    const [show, setShow] = useState(false);

    const mostrarUpdateUser = () =>{
        setShow(true);
    }

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <div>
                <MenuItem 
                    variant="primary" 
                    sx={{
                        backgroundColor:"#c46331",
                        color:"#fecd24",
                        fontSize: "1.1rem"
                    }} 
                    onClick= {() => mostrarUpdateUser()}
                >
                    Editar nombre de usuario
                </MenuItem>
                <Dialog open={show} onClose={()=> setShow(false)}>
                    <DialogTitle>
                        Editar nombre de usuario
                    </DialogTitle>
                    <DialogContent>
                    <TextField
                        name="username"
                        margin="normal"
                        fullWidth
                        label="Nombre de usuario"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                    />
                    <Button 
                        fullWidth 
                        id="update-user-btn" 
                        variant="contained" 
                        color="primary" 
                        onClick={handleUpdate}
                    >
                        Actualizar nombre de usuario
                    </Button>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setShow(false)}>Cerrar</Button>
                    </DialogActions>

                    {/* Mensaje de éxito */}
                        <Snackbar
                            open={openSnackbar}
                            autoHideDuration={6000}
                            onClose={handleCloseSnackbar}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                        >
                            <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                            Nombre de usuario modificado correctamente
                            </Alert>
                        </Snackbar>
                    
                        {/* Mensaje de error en rojo con Alert */}
                        {error && (
                            <Snackbar
                            open={!!error}
                            autoHideDuration={6000}
                            onClose={() => setError('')}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                            >
                            <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
                                {error}
                            </Alert>
                            </Snackbar>
                        )}

                </Dialog>
            </div>
    );
}
