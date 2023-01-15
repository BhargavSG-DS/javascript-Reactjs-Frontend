import React, {useContext, useState} from 'react';
import { UserContext } from '../context/UserContext';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import axios from "axios";
import Avatar from '@mui/material/Avatar';
import Container from '@mui/material/Container';
import { useNavigate } from 'react-router-dom';

const Alert = React.forwardRef(function Alert(props, ref) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function SignIn(props) {
  const [user, setUsername] = useState('');
  const [pass, setPassword] = useState('');
  const [open, setOpen] = useState(false);
	const [message, setMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [,setToken] = useContext(UserContext);

  const navigate = useNavigate();

  const handleClose = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}
		setOpen(false);
    navigate('/home');
	};

    const submitLogin = async () =>{
    const data = new URLSearchParams();
    data.append('grant_type', '');
    data.append('username', user);
    data.append('password', pass);
    data.append('scope', '');
    data.append('client_id', '');
    data.append('client_secret', '');

    const config = {
      headers:{
        "Content-Type" : "application/x-www-form-urlencoded",
      }
    }
    axios
      .post(props.baseURL + "token",data,config)
      .then((response) => {
            setToken(response.data.access_token);
            setMessage('Login Successful.');
            setAlertType('success');
            setOpen(true);
      })
      .catch((response) => {
        setMessage('Login Unsuccessful.');
        setAlertType('error');
        setOpen(true);
      });
  };

    const handleSubmit = (e) =>{
      submitLogin();
    }

    return (
      <Container maxWidth="sm" sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <div style={{border:'solid rgba(17, 104, 167, 1)',margin:40}}>
      <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '30ch'},
        margin:15
      }}
      noValidate
      autoComplete="on"
      >
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center',marginbottom:20}}>
        <Avatar>U</Avatar>
      </div>
      <FormControl variant="standard">
        <TextField
          required
          id="username"
          label="User Name"
          variant="standard"
          color="primary"
          onChange = {(e) => setUsername(e.target.value)}
          />
        <TextField
          required
          id="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          variant="standard"
          color="primary"
          onChange = {(e) => setPassword(e.target.value)}
          />
        <Button color="primary" indicatorColor="primary" variant="outlined" onClick={() => handleSubmit()}>Login</Button>
      </FormControl>
      <Snackbar open={open} autoHideDuration={6000} onClose={(e) => handleClose()}>
				<Alert
					onClose={(e) => handleClose()}
					severity={alertType}
					sx={{ width: "100%" }}
          >
					{message}
				</Alert>
			</Snackbar>
    </Box>
    </div>
    </Container>

    )
}