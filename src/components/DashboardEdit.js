import React,{useState, useEffect,useContext} from 'react'
import { UserContext } from "../context/UserContext";
import axios from "axios";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import SaveIcon from '@mui/icons-material/Save';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import { createTheme, ThemeProvider} from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import KPIform from './KPIform';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Input = styled('input')({
    display: 'relative',
});

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const theme = createTheme({ palette: { mode: 'dark' } });
const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

export default function DashboardEdit(props) {
    const [open, setOpen] = useState(false);
    const [token, ] = useContext(UserContext);
    const [dashboardID,setDashboardID] = useState('');
    const [dashboardName,setDashboardName] = useState('');
    const [displayDesc,setDisplayDesc] = useState('');
    const [elementType,setElementType] = useState('');
    const [uiURL,setUIURL] = useState('');
    const [focusURL,setFocusURL] = useState('');
    const [dashboardImage,setDashboardImage] = useState('');
    const [newDashboardImage,setNewDashboardImage] = useState();
    const [portalID,setPortalID] = useState('');
    const [img, setImg] = useState();
    const [,setState] = useState();
    const baseURL = props.baseURL;
    
    const refresh = () => {
        setState({});
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setOpen(false);
        refresh();
    };
    const DashboardDataSet = async (data) => {
        setDashboardImage(data.DashboardImage);
        setDashboardID(data.DashboardID);
        setDashboardName(data.DashboardName);
        setDisplayDesc(data.DisplayDesc);
        setElementType(data.ElementType);
        setUIURL(data.UIURL);
        setFocusURL(data.FocusURL);
        setPortalID(data.PortalID);
    }
    useEffect(() =>{
        const fetchData = async () =>{
            axios.post(baseURL + 'dashboard/'+ props.DashboardID + '/details',{},{headers: {
                'Authorization' :"Bearer " + token
            }})
            .then((response)=>{
                DashboardDataSet(response.data.data);
            })
        }
        fetchData();
    },[baseURL,props,token]);

    function updateImage(){
        let formData = new FormData();
        formData.append('file', newDashboardImage);
        axios
        .post(baseURL+ 'dashboard/' + dashboardID +'/Image',
        formData,
        {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',
            'Authorization' :"Bearer " + token
        }, 
    }).then((response)=>{
        console.log(response);
    }).catch((response) =>{
        console.error(response);
    });
    }

    function sendUpdate(info){
        axios
        .put(baseURL+ "dashboard/" + props.DashboardID + "/update", info,{headers: {
            'Authorization' :"Bearer " + token
        }})
        .then((response) => {
            console.log(response.data.detail);
            setOpen(true);
        });
        if(newDashboardImage){
            updateImage();
        }
    }
    const handleAction = (val) => {
        let data;
        if(val === "submit"){
            data = {
                "DashboardName": dashboardName,
                "DisplayDesc": displayDesc,
                "UIURL": uiURL,
                "FocusURL": focusURL,
                "Status" : "submitted",
                "ElementType": elementType
            }
        }
        else if(val === "save"){
            data = {
                "DashboardName": dashboardName,
                "DisplayDesc": displayDesc,
                "UIURL": uiURL,
                "FocusURL": focusURL,
                "Status" : "saved",
                "ElementType": elementType
            }
        }
        sendUpdate(data);
    }

    const makeDashboardImage = (e) => {
		setNewDashboardImage(e.target.files[0]);
		setImg(URL.createObjectURL(e.target.files[0]));
	};
  return (
    <div>
        <AppBar sx={{ position: 'relative' ,backgroundColor:'#000'}}>
          <Toolbar style={{display: 'flex', justifyContent: 'center'}}>
            <Typography variant='h6'> Edit Dashboard Details</Typography>
            <div style={{position:'absolute',right:110}}>
                <label htmlFor="submit-button">
                    <Button id='submit-button' sx={{display:'flex',justifyContent:'center',padding:.89}} variant="outlined" color="primary" indicatorColor="primary" onClick={() => handleAction("save")} component="span">
                        <SaveIcon/> <Typography>Save</Typography>
                    </Button>
                </label>
            </div>
            <div style={{position:'absolute',right:0}}>
                <label htmlFor="submit-button">
                    <Button id='submit-button' sx={{display:'flex',justifyContent:'center',padding:.89}} variant="outlined" color="primary" indicatorColor="primary" onClick={() => handleAction("submit")} component="span">
                        <SaveIcon/> <Typography>Submit</Typography>
                    </Button>
                </label>
            </div>
          </Toolbar>
        </AppBar>
        <ThemeProvider theme={theme}>
            <Box sx={{ flexGrow: 1 ,margin:2}}>
                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <Stack spacing={2.4}>
                            <Item>
                                <label htmlFor="Dashboard-Image">
                                    <Button sx={{display:'flex',justifyContent:'center',padding:.89}} color="primary" aria-label="Dashboard-Image" variant='outlined' indicatorColor="primary" component="label">
                                        <Input hidden type="file" accept="image/*" name="Dashboard-Image" onChange={(e) => makeDashboardImage(e)}/> 
                                        <img src={dashboardImage && !img?require(`./static/dashboard/${dashboardImage}`):img} alt={dashboardName} height={250} style={{border:'solid white .1px'}}/>
                                        <EditIcon style={{color:'black',position:'absolute',bottom:10,right:10}}/>
                                    </Button>
                                </label>
                            </Item>
                            <Item>
                            <TextField
                            disabled
                            fullWidth
                            size='small'
                            id="read-only-input"
                            label="Dashboard ID"
                            value={dashboardID}
                            InputProps={{
                                readOnly: true,
                            }}
                            />
                            </Item>
                        </Stack>
                    </Grid>
                    <Grid item xs={3}>
                        <Stack spacing={2.5}>
                            <Item>
                                <TextField
                                required
                                fullWidth
                                size="small"
                                id="DashboardName"
                                label="Dashboard Name"
                                value={dashboardName}
                                color="primary"
                                onChange = {(e) => setDashboardName(e.target.value)}
                                
                                />
                            </Item>
                            <Item>
                            <TextField
                                size="small"
                                fullWidth
                                required
                                id="ElementType"
                                label="Element Type"
                                color="primary"
                                value={elementType}
                                onChange = {(e) => setElementType(e.target.value)}
                                
                            /> 
                            </Item>
                            <Item>
                                <TextField
                                required
                                fullWidth
                                size="small"
                                id="UIURL"
                                label="UI URL"
                                color="primary"
                                value={uiURL}
                                onChange = {(e) => setUIURL(e.target.value)}
                                
                                /> 
                            </Item>
                            <Item>
                                <TextField
                                fullWidth
                                required
                                size="small"
                                id="FocusURL"
                                label="Focus URL"
                                color="primary"
                                value={focusURL}
                                onChange = {(e) => setFocusURL(e.target.value)}
                                /> 
                            </Item>
                            <Item>
                                <TextField
                                disabled
                                fullWidth
                                size="small"
                                id="PortalID"
                                label="Portal ID"
                                InputProps={{
                                    readOnly: true,
                                  }}
                                color="primary"
                                value={portalID}
                                /> 
                            </Item>
                        </Stack>
                    </Grid>
                    <Grid item xs={5}>
                        <Stack spacing={2.5}>
                            <Item>
                                <TextField
                                    size='small'
                                    required
                                    id="DisplayDesc"
                                    label="Description"
                                    minRows={14.3}
                                    multiline
                                    fullWidth
                                    color="primary"
                                    value={displayDesc}
                                    onChange = {(e) => setDisplayDesc(e.target.value)}
                                    />
                            </Item>
                        </Stack>
                    </Grid>
                </Grid>
            </Box>
        </ThemeProvider>
        <KPIform DashboardID={props.DashboardID} baseURL={baseURL}/>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                Dashboard Details Updated SuccessFully.
            </Alert>
        </Snackbar>
    </div>
  )
}