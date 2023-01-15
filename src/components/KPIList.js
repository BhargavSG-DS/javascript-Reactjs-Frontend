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
import axios from "axios";
import { Typography } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const theme = createTheme({ palette: { mode: 'dark' } });

export default function KPIList(props) {
  const [itemList,setItemList] = useState(null);
  const [token, ] = useContext(UserContext);
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

  return (
    <div style-={{margin:30}}>
    <ThemeProvider theme={theme}>
    <Box style={{margin :10, border : 'solid black 1px'}}>
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 65 }} aria-label="KPIs table">
        <TableHead>
          <TableRow >
            <TableCell sx={{fontSize:16}} align="left">KPI ID</TableCell>
            <TableCell sx={{fontSize:16}} align="left">KPI Name</TableCell>
            <TableCell sx={{fontSize:16}} align="left">Definition&nbsp;</TableCell>
            <TableCell sx={{fontSize:16}} align="left">Base Dataset&nbsp;</TableCell>
            <TableCell sx={{fontSize:16}} align="left">Data Steward&nbsp;</TableCell>
            <TableCell sx={{fontSize:16}} align="center">Sources&nbsp;</TableCell>
            
          </TableRow>
        </TableHead>
        <TableBody>
          {itemList?itemList.map((item) => (

            <TableRow
              key={item.KPIID}
            >
              <TableCell align="left">{item.KPIID}</TableCell>
              <TableCell align="left">{item.KPIName}</TableCell>
              <TableCell align="left">

                <Accordion >
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
            </TableRow>
          )):''}
        </TableBody>
      </Table>
    </TableContainer>
    </Box>
    </ThemeProvider>
    </div>
  );
}
