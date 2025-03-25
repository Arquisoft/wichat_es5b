import { AppBar, Toolbar, Button, IconButton, Typography } from "@mui/material"
import "./game/GameQuestion.css"

const NavMenu = () =>{
    return(

        <AppBar className="corporative-orange" position="static">
            <Toolbar variant="dense" className="corporative-orange" sx={{display:"flex",justifyContent: "space-around"}}>
                <Button variant="primary" color="inherit" component="div">
                IDENTIFICATE
                </Button>
                <Button variant="primary" color="inherit" component="div">
                IDIOMA ES
                </Button>
                <div style={{display:"flex",marginBottom:"-5em"}}>
                    <img src="/prueba.png" alt="WICHAT" style={{width:"10em"}}/>
                    <h1>WiChat</h1>
                </div>
                <Button variant="primary" color="inherit" component="div">
                HISTORIAL
                </Button>
                <Button variant="primary" color="inherit" component="div">
                RANKING
                </Button>
            </Toolbar>
        </AppBar>
    );

}

export default NavMenu;