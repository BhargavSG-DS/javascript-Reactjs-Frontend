import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import { Paper } from '@mui/material';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import Avatar from '@mui/material/Avatar';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import TuneIcon from '@mui/icons-material/Tune';



export default function TopAppBar(props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  var vtextColor = '#ffffff';

  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const DrawerList = (
    <Box sx={{ width: 550 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {['Language', 'Screen Magnifier', 'Security Assistance Required'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ?  <TuneIcon /> : <ZoomInIcon /> }
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Paper sx={{ flexGrow: 1}} elevation={10}>
      <AppBar position="static" sx={{ 
        backgroundColor: '#0C9D61', // semi-transparent white
        backdropFilter: 'blur(10px)', // blur effect
      }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color='inherit'
            aria-label="menu"
            sx={{ mr: 2,color: vtextColor }}
            href='/'
          >
            <Avatar alt="OmniActives" src={props.Com} />
          </IconButton>
          <Typography variant={isMobile ? "subtitle1" : "h6"} component="div" sx={{ flexGrow: 1 , color: 'FrostWhite'}}>
            Welcome to OmniActives
          </Typography>
          <Button href='/login' variant='text' color="inherit" sx={{color : vtextColor, marginTop:0.5}} startIcon={<LoginIcon />} >
            {!isMobile && <Typography variant="p" component="div" sx={{ flexGrow: 1 , color: vtextColor}}>
              Login
            </Typography>}
          </Button>
          <Button onClick={toggleDrawer(true)} variant= 'text' color="inherit" sx={{color : vtextColor, marginTop:0.5}} startIcon={props.NavigatePage === "Settings" ? <SettingsIcon /> : <HomeIcon />} >
            {!isMobile && <Typography variant="p" component="div" sx={{ flexGrow: 1 , color: vtextColor}}>
              {props.NavigatePage}
            </Typography>}
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </Paper>
  );
}
