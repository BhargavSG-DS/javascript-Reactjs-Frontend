import React,{useState, useEffect,useContext} from 'react';
import { UserContext } from "../context/UserContext";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { createTheme, ThemeProvider} from '@mui/material/styles';
import ButtonGroup from '@mui/material/ButtonGroup';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import axios from "axios";
import { Typography } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import KPIEdit from './KPIEdit';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PublishedWithChangesOutlinedIcon from '@mui/icons-material/PublishedWithChangesOutlined';
import UnpublishedOutlinedIcon from '@mui/icons-material/UnpublishedOutlined';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';

const theme = createTheme({ palette: { mode: 'dark' } });

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function KPIform(props) {
  const [itemList,setItemList] = useState(null);
  const [token, ] = useContext(UserContext);
  const [kpi,setKPI] = useState('');
  const [backdropOpen, setBackdropOpen] = useState('');
  const [message, setMessage] = useState('');
  const [,setState] = useState();
  const [filteredList, setFilteredList] = useState(itemList);
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);

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

const handleBackdropClose = () => {
  setBackdropOpen(false);
};

const baseURL = props.baseURL + `dashboard/${props.DashboardID}`;

  useEffect(() =>{
    const fetchData = async () =>{
      axios.post(baseURL+"/KPIs/all?page=1&size=50",{},{headers:{
        "Content-Type" : "application/json",
        'Authorization' :"Bearer " + token,
      }}).then((response) => {
        setItemList(response.data.items);
        console.log(response)
      });
    }
    fetchData();
  },[baseURL,token]);

  function deleteKPI(id) {
    axios
    .delete(baseURL+"/KPIs/" + {id} + "/delete",{},{headers:{
      "Content-Type" : "application/json",
      'Authorization' :"Bearer " + token,
    }})
    .then((response) => {
      setMessage(response);
      refresh();
    })
    .catch((error) =>{
      console.error(error);
    });
  }

    const handleEdit = (id) =>{
      setKPI(id);
      setBackdropOpen(!backdropOpen);
    }

    const handleDelete = (k) =>{
      deleteKPI(k);
    }

    const handleSearch = (event,column) => {
      const query = event.target.value;
      setSearchQuery(query);
     
      const searchList = itemList.filter((item) => {
        return item.KPIName.toLowerCase().indexOf(query.toLowerCase()) !== -1;
      });
      setFilteredList(searchList);
    }

  return (
    <div style-={{margin:30}}>
    <ThemeProvider theme={theme}>
    <Box style={{margin :10, border : 'solid black 1px'}}>

    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 65 }} aria-label="KPIs table">
        <TableHead>
          <TableRow >
            <TableCell sx={{fontSize:16}} align="left">
              KPI ID
            </TableCell>
            <TableCell sx={{fontSize:16}} align="left">
              KPI Name
            </TableCell>
            <TableCell sx={{fontSize:16}} align="left">
              Definition
            </TableCell>
            <TableCell sx={{fontSize:16}} align="left">
              Base Dataset&nbsp;</TableCell>
            <TableCell sx={{fontSize:16}} align="left">
              Data Steward
            </TableCell>
            <TableCell sx={{fontSize:16}} align="left">
              Sources
            </TableCell>
            <TableCell sx={{fontSize:16}} align="left">
              Status
            </TableCell>
            <TableCell sx={{fontSize:16}} align="center">
              Action
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
            {itemList?itemList.map((item) => (
              <TableRow key={item.KPIID}>
                <TableCell align="left">{item.KPIID}</TableCell>
                <TableCell align="left">{item.KPIName}</TableCell>
                <TableCell align="left">

                <Accordion style={{width:500}}>
                    <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    >
                    <Typography>{item.Definition}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                    <Typography>
                        {item.DetailsforDefinition}
                    </Typography>
                    </AccordionDetails>
                </Accordion>
                
                </TableCell>
                <TableCell align="left">{item.BaseDataset}</TableCell>
                <TableCell align="left">{item.DataSteward}</TableCell>
                <TableCell align="center">{item.Sources}</TableCell>
                <TableCell align="center">{item.Status==="submitted"?<PublishedWithChangesOutlinedIcon/>:<UnpublishedOutlinedIcon/>}</TableCell>
                <TableCell align="center">
                  <ButtonGroup disableElevation varient="contained">
                      <IconButton aria-label="upload picture" component="span" onClick={()=>handleEdit(item.KPIID)}>
                          <EditRoundedIcon />
                      </IconButton>
                      <IconButton color="error" aria-label="upload picture" component="span" onClick={()=>handleDelete(item.KPIID)}>
                          <DeleteRoundedIcon />
                      </IconButton>
                  </ButtonGroup>
                </TableCell>
              </TableRow>
              )):''}
        </TableBody>
      </Table>
    </TableContainer>
    </Box>
    </ThemeProvider>
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
    {kpi?<Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={backdropOpen}
    >
        <IconButton onClick={() => handleBackdropClose()} sx={{position:'absolute',top:"10%",right:"27.5%"}}>
                <CloseIcon sx={{color:'white'}}/>
        </IconButton>
        <KPIEdit KPIID={kpi} baseURL={baseURL}/>
    </Backdrop>:''}
    </div>
  );
{/* <Item style={{marginBottom:2}}>
      <TextField
          id="Search-textfield"
          label="Search"
          fullWidth
          size="small"
          value={searchQuery}
          onChange ={(e) => handleSearch(e)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

      </Item> */}}