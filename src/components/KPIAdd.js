import React,{useState,useContext} from 'react';
import { UserContext } from "../context/UserContext";
import axios from "axios";
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import TextField from '@mui/material/TextField';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import ButtonGroup from '@mui/material/ButtonGroup';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

export default function KPIAdd(props) {
    const [token, ] = useContext(UserContext);
    const [kpiID,setKPIID] = useState('');
    const [kpiName,setKPIName] = useState('');
    const [definition,setDefinition] = useState('');
    const [dfd,setDetails] = useState('');
    const [baseDataset,setBaseDataset] = useState('');
    const [dataSteward,setDataSteward] = useState('');
    const [sources,setSources] = useState('');
    const [,setState] = useState();
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');

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


  const baseURL = props.baseURL + `dashboard/${props.DashboardID}`;

    function AddKPI(info) {
      axios
      .post(baseURL+"/KPIs/" + props.DashboardID + "/upload", info,{headers:{
        "Content-Type" : "application/json",
        'Authorization' :"Bearer " + token,
      }})
      .then((response) => {
        setMessage(response)
        refresh();
      });
    }
    

    const handleAction = (action) =>{
      let info;
      if(action === "save"){

        info = {
          "KPIName": kpiName,
          "Definition": definition,
          "DetailsforDefinition": dfd,
          "BaseDataset": baseDataset,
          "DataSteward": dataSteward,
          "Status" : "saved",
          "KPIID": kpiID,
          "Sources": sources
        }
      }
      else if (action === "submit"){
        info = {
          "KPIName": kpiName,
          "Definition": definition,
          "DetailsforDefinition": dfd,
          "BaseDataset": baseDataset,
          "DataSteward": dataSteward,
          "Status" : "submitted",
          "KPIID": kpiID,
          "Sources": sources
        }
      }
      AddKPI(info);
    }


  return (
    <>
    <TableRow>
              <TableCell align="left">
              <TextField
                required
                size="small"
                id="KPIID"
                label="KPIID"
                color="primary"
                onChange = {(e) => setKPIID(e.target.value)}
              />
              </TableCell>
              <TableCell align="left">
              <TextField
                required
                fullWidth
                size="small"
                id="KPIName"
                label="KPIName"
                color="primary"
                onChange = {(e) => setKPIName(e.target.value)}
              />
              </TableCell>
              <TableCell align="left">
              <TextField
                size="small"
                required
                fullWidth
                id="Definition"
                label="Definition"
                color="primary"
                onChange = {(e) => setDefinition(e.target.value)}
              />

              <TextField
                fullWidth
                required
                size="small"
                id="Details"
                label="Details for Definition"
                color="primary"
                onChange = {(e) => setDetails(e.target.value)}
                sx={{marginTop:2}}
              />
              </TableCell>

              
              <TableCell>
              <TextField
              required
              fullWidth
              size="small"
              id="BaseDataset"
              label="BaseDataset"
              color="primary"
              onChange = {(e) => setBaseDataset(e.target.value)}
              /> 
              </TableCell>
              <TableCell>
              <TextField
              required
              fullWidth
              size="small"
              id="DataSteward"
              label="DataSteward"
              color="primary"
              onChange = {(e) => setDataSteward(e.target.value)}
              /> 
              </TableCell>
              <TableCell>
              <TextField
              required
              fullWidth
              size="small"
              id="Sources"
              label="Sources"
              color="primary"
              onChange = {(e) => setSources(e.target.value)}
              /> 
              </TableCell>
              <TableCell align="center">
                NAN
              </TableCell>
              <TableCell align="left">
              <ButtonGroup variant="text" aria-label="text button group">
                
                <label htmlFor="submit-button">
                  <IconButton id="submit-button" indicatorColor="secondary" variant="oulined" onClick={(e) => handleAction("submit")} component="span">
                    <AddIcon />
                  </IconButton>
                </label>

                
                <label htmlFor="submit-button">
                  <IconButton color="primary" id="submit-button" indicatorColor="secondary" variant="oulined" onClick={(e) => handleAction("save")} component="span">
                    <SaveIcon />
                  </IconButton>
                </label>

              </ButtonGroup>
              </TableCell>
    </TableRow>
    <Snackbar open={open} autoHideDuration={6000} onClose={(e) => handleClose()}>
    <Alert onClose={(e) => handleClose()} severity="success" sx={{ width: '100%' }}>
      {message}
    </Alert>
  </Snackbar>
  </>
  )
}
