import clogo from './logo.png';
import TopAppBar from './components/Nav';
import Footer from './components/Footer';
import { Grid, Box } from '@mui/material';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import Paper from '@mui/material/Paper';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import '@fontsource/roboto/300.css';
import QABot from './components/Chatbot/QAbot';
import CheckIn from './components/Check-In/CheckIn';
import React, { useState, useEffect } from 'react';
import CheckOut from './components/Check-out/CheckOut' 
import SignInSide from './components/Admin/Login';

function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    function handleResize() {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  return (
    <>
      <Grid
        container
        spacing={2}
        direction="column"
        justifyContent="space-evenly"
        alignItems="stretch"
      >
        <Grid item xs>
          <TopAppBar NavigatePage="Settings" Com={clogo} />
        </Grid>
        <Grid item xs sx={{mt:isMobile? 0:5}}>
          {/* All pages displayed here */}
            <Paper elevation={4} sx={{borderRadius:4, py: isMobile? 10 : 5, width:!isMobile? (windowDimensions.width/2) : windowDimensions.width, maxHeight: windowDimensions.height, maxWidth : windowDimensions.width, margin : isMobile? 0:'auto'}}>
              <Router>
                <Routes>
                  <Route exact path="/" element={<HomePage display={isMobile} dimensions={windowDimensions}/>} />
                  <Route exact path="/register" element={<CheckIn display={isMobile}/>} dimensions={windowDimensions} />
                  <Route exact path="/checkout" element={<CheckOut display={isMobile}/>} dimensions={windowDimensions} />
                  <Route exact path="/login" element={<SignInSide display={isMobile}/>} dimensions={windowDimensions} />

                </Routes>
              </Router>
            </Paper>
        </Grid>
        <Grid item xs sx={{position:'fixed', bottom : 0}}>
          <Footer />
        </Grid>
        < QABot />
      </Grid>
    </>
  );
}

export default App;
