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

export default function UpdatePassword() {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
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
            await axios.post(`${apiEndpoint}/updatepassword`, {
                userId: userId,
                oldPassword: oldPassword,
                newPassword: newPassword,
                confirmPassword: confirmPassword
            });
            setOpenSnackbar(true);
        } catch (error) {
            setError(error.response.data.error);
        }
    };

    const [show, setShow] = useState(false);

    const mostrarUpdatePassword = () =>{
        setShow(true);
    }

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <div>
                <MenuItem 
                    data-testid="open-password-dialog"
                    variant="primary" 
                    sx={{
                        backgroundColor:"#c46331",
                        color:"#fecd24",
                        fontSize: "1.1rem"
                    }} 
                    onClick= {() => mostrarUpdatePassword()}
                >
                    Editar contraseña
                </MenuItem>
                <Dialog 
                    open={show} 
                    onClose={()=> setShow(false)}
                    PaperProps={{
                        sx: {
                          backgroundColor: "#fbdd9a", // fondo suave del modal
                          padding: 2,
                          borderRadius: 3,
                        },
                      }}
                >
                    <DialogTitle
                        sx={{ 
                            color: "#c46331", 
                            fontWeight: "bold", 
                            fontSize: "1.3rem" 
                        }}
                    >
                        Edite su contraseña
                    </DialogTitle>
                    <DialogContent>
                    <TextField
                        name="password"
                        margin="normal"
                        fullWidth
                        label="Contraseña actual"
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        sx={{
                            backgroundColor: "#fff",
                            borderRadius: 1,
                            '& label.Mui-focused': {
                              color: "#c46331",
                            },
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': {
                                borderColor: "#a9c8c4",
                              },
                              '&:hover fieldset': {
                                borderColor: "#c46331",
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: "#c46331",
                              },
                            },
                          }}
                    />
                    <TextField
                        name="newpassword"
                        margin="normal"
                        fullWidth
                        label="Nueva contraseña"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        sx={{
                            backgroundColor: "#fff",
                            borderRadius: 1,
                            '& label.Mui-focused': {
                              color: "#c46331",
                            },
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': {
                                borderColor: "#a9c8c4",
                              },
                              '&:hover fieldset': {
                                borderColor: "#c46331",
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: "#c46331",
                              },
                            },
                          }}
                    />
                    <TextField
                        name="confirmpassword"
                        margin="normal"
                        fullWidth
                        label="Confirmar contraseña"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        sx={{
                            '& label.Mui-focused': {
                              color: "#c46331",
                            },
                            backgroundColor: "#fff",
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': {
                                borderColor: "#a9c8c4",
                              },
                              '&:hover fieldset': {
                                borderColor: "#c46331",
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: "#c46331",
                              },
                            borderRadius: 1,
                            },
                          }}
                    />
                    <Button 
                        fullWidth 
                        id="update-user-btn" 
                        variant="contained" 
                        color="primary" 
                        onClick={handleUpdate}
                        sx={{
                            mt: 2,
                            backgroundColor: "#c46331",
                            color: "#fbdd9a",
                            fontWeight: "bold",
                            '&:hover': {
                              backgroundColor: "#a84f22",
                            }
                          }}
                    >
                        Actualizar contraseña
                    </Button>
                    </DialogContent>
                    <DialogActions>
                        <Button 
                            onClick={() => setShow(false)}
                            sx={{ 
                                color: "#c46331", 
                                fontWeight: "bold" 
                            }}
                        >
                            Cerrar
                        </Button>
                    </DialogActions>

                    {/* Mensaje de éxito */}
                        <Snackbar
                            open={openSnackbar}
                            autoHideDuration={6000}
                            onClose={handleCloseSnackbar}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                        >
                            <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                            Contraseña actualizada correctamente
                            </Alert>
                        </Snackbar>
                    
                        {/* Mensaje de error en rojo con Alert */}
                        {error && (
                            <Snackbar
                            autoHideDuration={6000}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                            open={!!error}
                            onClose={() => setError('')}
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
