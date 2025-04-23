import { AppBar, Toolbar, Button, Menu, MenuItem} from "@mui/material";
  import { useEffect, useState } from "react";
  import "./game/GameQuestion.css";
  import History from "./History";
  import Ranking from "./Ranking";
  import UpdateUsername from "./userprofile/UpdateUsername";
  import UpdatePassword from "./userprofile/UpdatePassword";
  import {jwtDecode} from "jwt-decode";
  import axios from "axios";

  const grafanaUrl = process.env.GRAFANA_URI || 'http://localhost:9091';
  const prometheusUrl = process.env.PROMETHEUS_URI || 'http://localhost:9090';

  const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

  const NavMenu = ({ username }) => {
    const [anchorElPerfil, setAnchorElPerfil] = useState(null);
    const openPerfil = Boolean(anchorElPerfil);

    const [anchorElAdmin, setAnchorElAdmin] = useState(null);
    const openAdmin = Boolean(anchorElAdmin);

    const [role, setRole] = useState(null);

    const token = localStorage.getItem("token");
    
    const getRole = async (userId) => {
      try {
        console.log("userId", userId);
        const response = await axios.post(`${apiEndpoint}/getUserRole`, { userId });
        console.log("response", response.data);
        setRole(response.data.role);
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };

    useEffect(() => {
      if (token) {
        getRole(jwtDecode(token).userId);
        console.log("role", role);
      }
    }, [token]);

  
    const handleMenuOpen = (event) => {
      setAnchorElPerfil(event.currentTarget);
    };
    const handleMenuClose = () => {
      setAnchorElPerfil(null);
    };

    const handleAdminMenuOpen = (event) => {
      setAnchorElAdmin(event.currentTarget);
    };
    const handleAdminMenuClose = () => {
      setAnchorElAdmin(null);
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
  
        <div style={{display:"flex", justifyContent:"center"}}>
            <History username={username} />
        </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "-5em",
            }}
          >
            <img src="/logo512.png" alt="WICHAT" style={{ width: "12em" }} />
          </div>

            <div style={{display:"flex", justifyContent:"center"}}>
              <Ranking />
            </div>
            <div>
            {username ? (
              <div style={{display:"flex", justifyContent:"space-around"}}>
              <div style={{display:"flex", justifyContent:"center"}}>
                <Button
                  onClick={handleMenuOpen}
                  sx={{ color: "#fecd24", fontSize: "1.1rem" }}
                  >
                  Mi perfil
                  </Button>
                <Menu
                  anchorEl={anchorElPerfil}
                  open={openPerfil}
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
                {role==="admin" ?(<div style={{display:"flex", justifyContent:"center"}}>
                <Button
                  onClick={handleAdminMenuOpen}
                  sx={{ color: "#fecd24", fontSize: "1.1rem" }}
                  >
                  Admin
                  </Button>
                  <Menu
                  anchorEl={anchorElAdmin}
                  open={openAdmin}
                  onClose={handleAdminMenuClose}
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
                  <MenuItem
                      onClick={()=>{window.open(grafanaUrl)}}
                  >
                    Grafana
                  </MenuItem>
                  <MenuItem
                      onClick={()=>{window.open(prometheusUrl)}}
                  >
                    Prometheus
                  </MenuItem>
                </Menu>
                
                </div>) : null}
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
          </div>
        </Toolbar>
      </AppBar>
    );
  };
  
  export default NavMenu;
  