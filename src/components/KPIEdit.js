import React,{useState, useEffect, useContext} from 'react';
import { UserContext } from "../context/UserContext";
import axios from "axios";
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import { TextField } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { createTheme, ThemeProvider} from '@mui/material/styles';
import Button from '@mui/material/Button';
import SaveIcon from '@mui/icons-material/Save';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

const theme = createTheme({ palette: { mode: 'dark' } });

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

export default function KPIEdit(props) {
    const [open, setOpen] = useState(false);
    const [token, ] = useContext(UserContext);
    const [kpiID,setKPIID] = useState('');
    const [kpiName,setKPIName] = useState('');
    const [dfd,setDfd] = useState('');
    const [dataSteward,setDataSteward] = useState('');
    const [baseDataset,setBaseDataset] = useState('');
    const [sources,setSources] = useState('');
    const [definition,setDefinition] = useState('');
    const [message, setMessage] = useState('');

    const [,setState] = useState();
    const baseURL = props.baseURL;
    
    const refresh = () => {
        setState({});
    };

    const KPIdataSet = (data) =>{
        setKPIName(data.KPIName);
        setDefinition(data.Definition);
        setSources(data.Sources);
        setDataSteward(data.DataSteward);
        setDfd(data.DetailsforDefinition);
        setKPIID(data.KPIID);
        setBaseDataset(data.BaseDataset);
    }

    function sendUpdate(info){
        axios
        .put(baseURL+ "/KPIs/" + kpiID + "/update", info,{headers:{
            "Content-Type" : "application/json",
            'Authorization' :"Bearer " + token,
        }})
        .then((response) => {
            setMessage(response.data.detail);
            setOpen(true);
        });
    }

    const handleSave = () => {
        const data = {
            "KPIName": kpiName,
            "Definition": definition,
            "DetailsforDefinition": dfd,
            "BaseDataset": baseDataset,
            "Sources": sources
        }
        sendUpdate(data);
    }

    useEffect(() =>{
        const fetchData = async () =>{
          axios.post(baseURL+"/KPIs/" + props.KPIID + "/info",{},{headers:{
            "Content-Type" : "application/json",
            'Authorization' :"Bearer " + token,
        }}).then((response) => {
            KPIdataSet(response.data.data);
            console.log(response.status)
          });
        }
        fetchData();
      },[baseURL,props,token]);

      const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setOpen(false);
        refresh();
    };

  return (
    <Item>
    
    <AppBar sx={{ position: 'relative' ,backgroundColor:'#000'}}>
        <Toolbar style={{display: 'flex', justifyContent: 'center'}}>
        <Typography variant='h6'> Edit KPI Details</Typography>
        <div style={{position:'absolute',right:20}}>
            
        </div>
        </Toolbar>
    </AppBar>
    <ThemeProvider theme={theme}>
    <Box sx={{ flexGrow: 1 ,margin:5}}>
    <Stack container spacing={3}>
    <Item>
        <Grid container spacing={2}>
            <Grid item xs={5}>
                <Stack spacing={2.4}>
                    <Item>
                        <TextField
                        disabled
                        fullWidth
                        size='small'
                        id="read-only-input"
                        label="KPI ID"
                        value={kpiID}
                        InputProps={{
                            readOnly: true,
                        }}
                        />
                    </Item>
                    <Item>
                        <TextField
                        required
                        fullWidth
                        size="small"
                        id="kpiName"
                        label="KPI Name"
                        value={kpiName}
                        color="primary"
                        onChange = {(e) => setKPIName(e.target.value)}
                        
                        />
                    </Item>
                    
                    <Item>
                        <TextField
                        required
                        fullWidth
                        size="small"
                        id="BaseDataset"
                        label="Base Dataset"
                        color="primary"
                        value={baseDataset}
                        onChange = {(e) => setBaseDataset(e.target.value)}
                        
                        /> 
                    </Item>
                    <Item>
                        <TextField
                        fullWidth
                        required
                        size="small"
                        id="Sources"
                        label="Sources"
                        color="primary"
                        value={sources}
                        onChange = {(e) => setSources(e.target.value)}
                        /> 
                    </Item>
                </Stack>
            </Grid>
            <Grid item xs={7}>
                <Stack spacing={2.5}>
                    <Item>
                        <TextField
                            size='small'
                            required
                            id="Dfd"
                            label="DetailsforDefinition"
                            minRows={7.5}
                            multiline
                            fullWidth
                            color="primary"
                            value={dfd}
                            onChange = {(e) => setDfd(e.target.value)}
                            />
                    </Item>
                    <Item>
                    <TextField
                        size="small"
                        fullWidth
                        disabled
                        required
                        id="DataSteward"
                        label="Data Steward"
                        color="primary"
                        value={dataSteward}
                        onChange = {(e) => setDataSteward(e.target.value)}
                        
                    /> 
                    </Item>
                </Stack>
            </Grid>
        </Grid>
    </Item>
    <Item>
        <label htmlFor="submit-button">
            <Button id='submit-button' sx={{display:'flex',justifyContent:'center',padding:.89}} variant="outlined" color="primary" indicatorColor="primary" onClick={() => handleSave()} component="span">
                <SaveIcon/><Typography>Save Changes</Typography>
            </Button>
        </label>
    </Item>
    

    </Stack>
</Box>
    <Snackbar open={open} autoHideDuration={3000} onClose={(e) => handleClose()}>
      <Alert onClose={(e) => handleClose()} severity="success" sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
</ThemeProvider>
</Item>
  )
}
