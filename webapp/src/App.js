<<<<<<< HEAD
import React, { useState, useContext } from 'react';
=======
import React, { useState, useEffect } from 'react';
>>>>>>> development
import AddUser from './components/AddUser';
import Login from './components/Login';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import NavMenu from './components/NavMenu';
import { LanguageContext } from "./LanguageContext";

function App() {
  const [showLogin, setShowLogin] = useState(true);
<<<<<<< HEAD
  const [user, setUser] = useState();
  const { translations } = useContext(LanguageContext);
=======
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const username = localStorage.getItem('username');
      if (username) {
        setUser(username);
      }
    }
  }, []);
>>>>>>> development

  const handleToggleView = () => {
    setShowLogin(!showLogin);
  };

  const userForHistory = (username) => {
    setUser(username);
    localStorage.setItem('username', username);
  };

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: "#faf5ea",
      boxSizing: 'border-box',
    }}>
      <NavMenu username={user}/>
      <Container component="main" maxWidth={false} sx={{ 
        width: "100vw", 
        height: "100vh", 
        display: "flex", 
        flexDirection: "column", 
        justifyContent: "center", 
        alignItems: "center",
        backgroundColor: "#faf5ea",
        border: "10px solid #c46331",
        boxSizing: "border-box"
      }}>
        <CssBaseline />
<<<<<<< HEAD
        {showLogin ? <Login userForHistory={userForHistory} /> : <AddUser />}
        <Typography component="div" align="center" sx={{ marginTop: 1}}>
          {showLogin ? (
            <Link name="gotoregister" component="button" variant="body2" onClick={handleToggleView}>
              {translations.app_register || "¿No tienes una cuenta? Regístrate aquí."}
            </Link>
          ) : (
            <Link component="button" variant="body2" onClick={handleToggleView}>
              {translations.app_login || "¿Ya tienes una cuenta? Inicia sesión aquí."}
            </Link>
          )}
        </Typography>
        
=======
        {!user ? (showLogin ? <Login userForHistory={userForHistory} /> : <AddUser />) : <Login userForHistory={userForHistory} />}

        {!user && (
          <Typography component="div" align="center" sx={{ marginTop: 1}}>
            {showLogin ? (
              <Link name="gotoregister" component="button" variant="body2" onClick={handleToggleView}>
                ¿No tienes una cuenta? Regístrate aquí.
              </Link>
            ) : (
              <Link component="button" variant="body2" onClick={handleToggleView}>
                ¿Ya tienes una cuenta? Inicia sesión aquí.
              </Link>
            )}
          </Typography>
        )}
>>>>>>> development
      </Container>
    </div>
  );
}

export default App;