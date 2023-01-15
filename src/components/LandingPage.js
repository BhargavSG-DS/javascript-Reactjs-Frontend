import * as React from 'react';
import { Link } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Dash from './static/dashboard-icon.png'
import Report from './static/report.jpg'
import Tooltip from '@mui/material/Tooltip';

export default function LandingPage() {

  const height = 200;
  const value = {display:'flex',justifyContent:'center'} 

  return (
      <Grid container columns={12} spacing={40} direction="row" justifyContent="center" alignItems="center">

        <Grid sx={value} item xs={4} md={2}>

          <Tooltip title="Edit">
            <Link to='/dashboard/edit'>
              <img src={Dash} alt="Dashboard Edit" height={height}/>
            </Link>
          </Tooltip>

        </Grid>
        
        

        <Grid sx={value} item xs={4} md={2}>

          <Tooltip title="View">
            <Link to='/dashboard/view'>
              <img src={Report} alt="Dashboard View" height={height}/>
            </Link>
          </Tooltip>

        </Grid>

      </Grid>
  );
}
