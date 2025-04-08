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

    // Internacionalización:
    const [langAnchorEl, setLangAnchorEl] = useState(null);
    const langMenuOpen = Boolean(langAnchorEl);
    const handleLangMenuOpen = (event) => {
      setLangAnchorEl(event.currentTarget);
    };
  
    const handleLangMenuClose = () => {
      setLangAnchorEl(null);
    };
  
    const changeLanguage = (lang) => {
      console.log("Cambiar idioma a:", lang); // Más adelante se integra con i18n
      setLangAnchorEl(null);
    };
  
  
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
          <div>
            <Button
              onClick={handleLangMenuOpen}
              sx={{ color: "#fecd24", fontSize: "1.1rem" }}
            >
              IDIOMA - ES
            </Button>
            <Menu
              anchorEl={langAnchorEl}
              open={langMenuOpen}
              onClose={handleLangMenuClose}
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
                    backgroundColor: "#faf5ea",
                    color: "#fecd24",
                    boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.2)",
                    width: "10em",
                    border: "4px solid #c46331",
                  },
                },
              }}
            >
              <MenuItem
                onClick={() => changeLanguage("es")}
                sx={{ backgroundColor: "#faf5ea", color: "#c46331", fontSize: "1.1rem" }}
              >
                Español
              </MenuItem>
              <MenuItem
                onClick={() => changeLanguage("en")}
                sx={{ backgroundColor: "#faf5ea", color: "#c46331", fontSize: "1.1rem" }}
              >
                Inglés
              </MenuItem>
            </Menu>
          </div>

  
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
  