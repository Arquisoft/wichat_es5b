import { AppBar, Toolbar, Button, IconButton, Typography } from "@mui/material"
import "./game/GameQuestion.css"
import History from "./History";
import Ranking from "./Ranking";

const NavMenu = ({username}) =>{

    
    return(

        <AppBar className="corporative-orange" position="static">
            <Toolbar variant="dense" className="corporative-orange" sx={{display:"grid",justifyContent: "center", gridTemplateColumns: "repeat(5, 1fr)"}}>
                <Button variant="primary" sx={{color:"#fecd24",fontSize: "1.1rem"}}>
                IDENTIFICATE
                </Button>
                <Button variant="primary" sx={{color:"#fecd24",fontSize: "1.1rem"}}>
                IDIOMA - ES
                </Button>
                <div style={{display:"flex", justifyContent:"center",marginBottom:"-5em"}}>
                    <img src="/logo512.png" alt="WICHAT" style={{width:"12em"}}/>
                </div>

                <History username={username}/>

                <Ranking />
            </Toolbar>
        </AppBar>
    );

}

export default NavMenu;