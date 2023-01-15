import React,{useState, useEffect, useContext} from 'react';
import { UserContext } from "../context/UserContext";
import axios from "axios";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import { createTheme, ThemeProvider} from '@mui/material/styles';
import KPIList from './KPIList';

const theme = createTheme({ palette: { mode: 'dark' } });
const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

export default function DashboardView(props) {
    const [dashboardID,setDashboardID] = useState('');
    const [token, ] = useContext(UserContext);
    const [dashboardName,setDashboardName] = useState('');
    const [displayDesc,setDisplayDesc] = useState('');
    const [elementType,setElementType] = useState('');
    const [uiURL,setUIURL] = useState('');
    const [focusURL,setFocusURL] = useState('');
    const [dashboardImage,setDashboardImage] = useState('');
    const [portalID,setPortalID] = useState('');
    const baseURL = props.baseURL;

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
            axios.post(baseURL + 'dashboard/'+ props.DashboardID + '/details',{},{headers:{
                "Content-Type" : "application/json",
                'Authorization' :"Bearer " + token,
            }})
            .then((response)=>{
                DashboardDataSet(response.data.data);
            })
        }
        fetchData();
    },[baseURL,props,token]);

  return (
    <div>
        <AppBar sx={{ position: 'relative' ,backgroundColor:'#000'}}>
          <Toolbar style={{display: 'flex', justifyContent: 'center'}}>
            <Typography variant='h6'> View Dashboard Details</Typography>
          </Toolbar>
        </AppBar>
        <ThemeProvider theme={theme}>
            <Box sx={{ flexGrow: 1 ,margin:2}}>
                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <Stack spacing={2.4}>
                            <Item>
                                <img src={dashboardImage?require(`./static/dashboard/${dashboardImage}`):''} alt={dashboardName} height={250} style={{border:'solid lightblue .1px',padding:5}}/>
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
                                
                                fullWidth
                                size="small"
                                id="DashboardName"
                                label="Dashboard Name"
                                value={dashboardName}
                                color="primary"
                                
                                InputProps={{
                                    readOnly: true,
                                }}
                                />
                            </Item>
                            <Item>
                            <TextField
                                size="small"
                                fullWidth
                                
                                id="ElementType"
                                label="Element Type"
                                color="primary"
                                value={elementType}
                                
                                InputProps={{
                                    readOnly: true,
                                }}
                            /> 
                            </Item>
                            <Item>
                                <TextField
                                
                                fullWidth
                                size="small"
                                id="UIURL"
                                label="UI URL"
                                color="primary"
                                value={uiURL}
                                
                                InputProps={{
                                    readOnly: true,
                                }}
                                /> 
                            </Item>
                            <Item>
                                <TextField
                                fullWidth
                                
                                size="small"
                                id="FocusURL"
                                label="Focus URL"
                                color="primary"
                                value={focusURL}
                                
                                InputProps={{
                                    readOnly: true,
                                }}
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
                                    
                                    id="DisplayDesc"
                                    label="Description"
                                    minRows={14.3}
                                    multiline
                                    fullWidth
                                    color="primary"
                                    value={displayDesc}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    />
                            </Item>
                        </Stack>
                    </Grid>
                </Grid>
            </Box>
        </ThemeProvider>
        <KPIList DashboardID={props.DashboardID} baseURL={baseURL}/>
    </div>
  )
}
