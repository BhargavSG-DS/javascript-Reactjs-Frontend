import React, { useState } from 'react';
import {Box, Typography, Button, Grid, Paper } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router-dom';

export default function HomePage(Props) {
  const [selectedOption, setSelectedOption] = useState(null);
  const navigate = useNavigate();

  const handleSelect = (option) => {
    setSelectedOption(option);
    navigate('/'.concat(option));
  };

  var iconSize = Props.display ? '5vh' : '10vh';
  var btnHeight = Props.display ? '10.5vh' : '14vh';
  const deviceDimensions = Props.dimensions;

  return (
    <Box sx={{ flexGrow: 1,borderRadius:'2vh'}}>
      <Typography variant={Props.display? "h6":"h4"} component="h2" gutterBottom align="center" sx={{ px: Props.display? 2:0}}>
        Good Morning! It's nice to have you visit us.
      </Typography>
      <Typography variant="subtitle1" gutterBottom align="center">
        Select the best option that describes your purpose
      </Typography>
      <Paper elevation={0} sx={{ p: 1, margin: 'auto', maxWidth: 600, flexGrow: 1 }}>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={4}>
          <Stack spacing={2} justifyContent="center" alignItems="center">
          <Button 
              variant="outlined"
              sx={{backgroundColor: selectedOption === 'register' ? "#0C9D61" : "#FFFFFF", borderColor : '#0C9D61',borderRadius:'100vh', height:btnHeight, color: selectedOption === 'register' ? '#ffffff' : '#0C9D61'}} 
              onClick={() => handleSelect('register')}
            >
          
              <ArrowForwardIosIcon sx={{paddingLeft : 1,fontSize:iconSize}}/>

          </Button>
              <Typography>Register Visitor</Typography>
          </Stack>
          </Grid>
          <Grid item xs={4}>
          <Stack spacing={2} justifyContent="center" alignItems="center">
            <Button 
              variant="outlined" 
              sx={{backgroundColor: selectedOption === 'scanQR' ? "#0C9D61" : "#FFFFFF", borderColor : '#0C9D61',borderRadius:'100vh', height:btnHeight, color: selectedOption === 'scanQR' ? '#ffffff' : '#0C9D61'}}
              onClick={() => handleSelect('scanQR')}
            >
            
                <QrCode2Icon sx={{p:.5,fontSize:iconSize}}/>

            </Button>
                <Typography>Identify Visitor</Typography>
            </Stack>
          </Grid>
          <Grid item xs={4}>
          <Stack spacing={2} justifyContent="center" alignItems="center">
          <Button 
              variant="outlined"
              sx={{backgroundColor: selectedOption === 'checkOut' ? "#0C9D61" : "#FFFFFF", borderColor : '#0C9D61',borderRadius:'100vh', height:btnHeight, color: selectedOption === 'checkOut' ? '#ffffff' : '#0C9D61'}}
              onClick={() => handleSelect('checkOut')}
            >
          
              <ExitToAppIcon sx={{paddingRight : 0, fontSize:iconSize}}/>

          </Button>
              <Typography>Check Out</Typography>
          </Stack>
          </Grid>
        </Grid>
      </Paper>
    </Box> 
  )
}
