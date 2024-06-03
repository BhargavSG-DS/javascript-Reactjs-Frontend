import React, { useState } from 'react';
import Fab from '@mui/material/Fab';
import Box from '@mui/material/Box';
import SmartToyIcon from '@mui/icons-material/SmartToy'; // replace with your actual import
import IconButton from '@mui/material/IconButton';
import MicIcon from '@mui/icons-material/Mic'; // replace with your actual import
import CloseIcon from '@mui/icons-material/Close'; // replace with your actual import
import Paper from '@mui/material/Paper';

export default function QABotCom() {
  const [openChat, setOpenChat] = useState(false);

  const handleOpenChat = () => {
    setOpenChat(true);
  };

  const handleCloseChat = () => {
    setOpenChat(false);
  };

  return (
    <Box sx={{position: 'fixed', bottom: 20, right: 20 }}>
      {!openChat ? (
        <Fab color="secondary" aria-label="edit" sx={{backgroundColor:'#0C9D61'}} onClick={handleOpenChat} enterDelay>
          <SmartToyIcon />
        </Fab>
      ) : (
        <Paper elevation={3} sx={{ width: 300, height: 400, p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <IconButton onClick={handleCloseChat}>
              <CloseIcon />
            </IconButton>
          </Box>
          {/* Your chat messages go here */}
            <h2 style={{color:'red'}}>Undergoing Development</h2>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', height: 'calc(100% - 48px)' }}>
            <IconButton color="primary" aria-label="record">
              <MicIcon />
            </IconButton>
          </Box>
        </Paper>
      )}
    </Box>
  );
}
