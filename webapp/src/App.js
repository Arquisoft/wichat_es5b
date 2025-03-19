import React, { useState } from 'react';
import AddUser from './components/AddUser';
import Login from './components/Login';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

function App() {
  const [showLogin, setShowLogin] = useState(true);

  const handleToggleView = () => {
    setShowLogin(!showLogin);
  };

  return (
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
      <Typography component="h1" variant="h5" align="center" sx={{ marginTop: 2, backgroundColor: "#faf5ea", color: "#c46331" }}>
        Welcome to the 2025 edition of the Software Architecture course
      </Typography>
      {showLogin ? <Login /> : <AddUser />}
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
  );
}

export default App;