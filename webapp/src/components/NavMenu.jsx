import {
    AppBar,
    Toolbar,
    Button,
    Menu,
    MenuItem,
  } from "@mui/material";
  import { useState } from "react";
  import "./game/GameQuestion.css";
  import History from "./History";
  import Ranking from "./Ranking";
  import UpdateUsername from "./userprofile/UpdateUsername";
  import UpdatePassword from "./userprofile/UpdatePassword";
  
  const NavMenu = ({ username }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
  
    const handleMenuOpen = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
      setAnchorEl(null);
    };
  
    const handleLogout = () => {
      localStorage.removeItem("token");
      window.location.href = "/";
    };
  
    return (
      <AppBar className="corporative-orange" position="static">
        <Toolbar
          variant="dense"
          className="corporative-orange"
          sx={{
            display: "grid",
            justifyContent: "center",
            gridTemplateColumns: "repeat(5, 1fr)",
          }}
        >
          <Button variant="primary" sx={{ color: "#fecd24", fontSize: "1.1rem" }}>
            IDIOMA - ES
          </Button>
  
          <History username={username} />
  
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "-5em",
            }}
          >
            <img src="/logo512.png" alt="WICHAT" style={{ width: "12em" }} />
          </div>
  
          <Ranking />
  
          {username ? (
            <div>
              <Button
                onClick={handleMenuOpen}
                sx={{ color: "#fecd24", fontSize: "1.1rem" }}
                >
                Mi perfil
                </Button>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                slotProps={{
                    paper: {
                      sx: {
                        backgroundColor: "#c46331",
                        color: "#fecd24",
                        boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.2)",
                        width: "20%",
                        padding: 0,
                      },
                    },
                  }}
              >
                <UpdateUsername/> 
                <UpdatePassword/>
                <MenuItem 
                    onClick={handleLogout}
                    sx={{ 
                        backgroundColor:"#c46331",
                        color: "#fecd24", 
                        fontSize: "1.1rem" 
                    }}
                >
                    Cerrar sesión
                </MenuItem>
              </Menu>
              </div>
          ) : (
            <Button 
            href="/login" 
            sx={{ 
                color: "#fecd24", 
                fontSize: "1.1rem" 
            }}
            >
              IDENTIFICATE
            </Button>
          )}
        </Toolbar>
      </AppBar>
    );
  };
  
  export default NavMenu;
  