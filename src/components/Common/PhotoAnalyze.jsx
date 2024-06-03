import React from 'react';
import { Box, Typography, Paper, CardMedia } from '@mui/material';

const PhotoAnalyze = () => {
  const webcamImage = localStorage.getItem('visitorImage');
  console.log(webcamImage);

  return (
    <>
      <Box sx={{ flexGrow: 1, borderRadius: '2vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h5" component="h2" gutterBottom align="center">
          Thank you, you have an engaging smile. 
        </Typography>
        <Typography variant="subtitle1" gutterBottom align="center">
          Please continue.
        </Typography>
        <Paper elevation={0} sx={{ p: 1, margin: 'auto', maxWidth: 500, flexGrow: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CardMedia
            component="img"
            image={webcamImage}
            alt="Webcam captured image."
            sx={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '2vh' }}
            />
          </Box>
        </Paper>
      </Box>
    </>
  );
};

export default PhotoAnalyze;
