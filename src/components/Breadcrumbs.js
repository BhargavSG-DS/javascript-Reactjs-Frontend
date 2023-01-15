import * as React from 'react';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';

export default function Breadcrumb(props) {
  return (
    <div role="presentation" >
      <Breadcrumbs aria-label="breadcrumb">
        <Link  underline="hover" color="inherit" href="/home">
          <Typography style={{color:"rgb(155, 120, 255)"}}>Home</Typography>
        </Link>
          <Typography style={{color:"rgb(155, 120, 255)"}}>{props.CurrentPage}</Typography>
      </Breadcrumbs>
    </div>
  );
}
