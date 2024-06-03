import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';
import Link from '@mui/material/Link';

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="">
        Developed by Value Manthan
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}


function Footer(props) {

  return (
    <Box component="footer" sx={{ bgcolor: 'background.paper', py: 1 }}>
      <Container maxWidth="lg">
        <Copyright />
      </Container>
    </Box>
  );
}

export default Footer;