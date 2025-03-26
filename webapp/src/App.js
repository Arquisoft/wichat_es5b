import React, { useState } from 'react';
import AddUser from './components/AddUser';
import Login from './components/Login';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import NavMenu from './components/NavMenu';

function App() {
  const [showLogin, setShowLogin] = useState(true);
  const [user, setUser] = useState();

  const handleToggleView = () => {
    setShowLogin(!showLogin);
  };

  const userForHistory = (username) =>{
    setUser(username)
  }

  return (
    <div>
      <NavMenu username={user}/>
      <Container component="main" maxWidth={false}   sx={{ 
                                                          width: "100vw", 
                                                          height: "100vh", 
                                                          display: "flex", 
                                                          flexDirection: "column", 
                                                          justifyContent: "center", 
                                                          alignItems: "center",
                                                          backgroundColor: "#faf5ea",
                                                          border: "6px solid #c46331",
                                                          boxSizing: "border-box"
                                                        }}>
        <CssBaseline />
        {showLogin ? <Login userForHistory={userForHistory} /> : <AddUser />}
        <Typography component="div" align="center" sx={{ marginTop: 1}}>
          {showLogin ? (
            <Link name="gotoregister" component="button" variant="body2" onClick={handleToggleView}>
              Don't have an account? Register here.
            </Link>
          ) : (
            <Link component="button" variant="body2" onClick={handleToggleView}>
              Already have an account? Login here.
            </Link>
          )}
        </Typography>
        
      </Container>
    </div>
  );
}

export default App;