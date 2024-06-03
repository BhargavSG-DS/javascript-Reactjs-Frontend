import React, { useRef, useState, useEffect } from 'react';
import Webcam from "react-webcam";
import {Box, Typography, Paper } from '@mui/material';
import * as faceapi from 'face-api.js';

// Load the model
const loadModel = async () => {
  await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
};

// Call the function to load the model
loadModel().then(() => {
  console.log('Model loaded');
});

const FaceDetectionWebcam = () => {
  const webcamRef = useRef(null);
  const [isFaceDetected, setIsFaceDetected] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);

  // This is a placeholder function. You should replace this with actual face detection logic.
  const detectFace = async (imageSrc) => {
    const img = await faceapi.fetchImage(imageSrc);
  
    // Detect the face
    const detections = await faceapi.detectAllFaces(img, new faceapi.TinyFaceDetectorOptions());
    // Check if a face is detected
    if (detections.length > 0) {
      return true;
    } else {
      return false;
    }
  };

  const capture = React.useCallback(async () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      const result = await detectFace(imageSrc);
      setIsFaceDetected(result);
      // Pause the webcam
      localStorage.setItem('visitorImage', imageSrc);
    }
  }, [webcamRef, setIsFaceDetected]);

  // Check for camera permissions when the component mounts
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(() => {
        setHasCameraPermission(true);
      })
      .catch(() => {
        setHasCameraPermission(false);
      });
  }, []);

  return (
    <>
    <Box sx={{ flexGrow: 1,borderRadius:'2vh'}}>
      <Typography variant="h5" component="h2" gutterBottom align="center">
        Please smile at the camera.
      </Typography>
      <Typography variant="subtitle1" gutterBottom align="center">
        Stand still in the marked area facing the camera. 
        Please press next after green light.
      </Typography>
      <Paper elevation={0} sx={{ p: 1, margin: 'auto', maxWidth: 500, flexGrow: 1 }}>
      <Box border={3} borderColor={isFaceDetected ? 'green' : 'red'}>
        {hasCameraPermission ? (
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            onUserMedia={() => setInterval(capture, 5000)} // Capture screenshot every 5 second
            width={'100%'}
            height={'100%'}
          />
        ) : (
          <p>Please allow camera access.</p>
        )}
      </Box>
    </Paper>
    </Box> 
    </>
  );
};

export default FaceDetectionWebcam;
