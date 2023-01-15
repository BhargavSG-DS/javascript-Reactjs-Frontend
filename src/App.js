import * as React from 'react';
import Grow from '@mui/material/Grow';

import {
  Routes,
  Route,
} from "react-router-dom";
import Dashboardform from './components/Dashboardform';
import LandingPage from './components/LandingPage';
import Company from './components/Company';
import DashboardList from './components/DashboardList';
import SignIn from './components/SignIn';

function App(props) {
  return (
    <>
      <Company>
        <div style={{backgroundColor:'rgba(230, 255, 255, 2)',border:'solid rgba(17, 104, 167, 1)',paddingBottom:100,paddingTop:100}}>
            <Routes>
              <Route exact path='/' element = {
                <Grow>
                  <SignIn baseURL={props.baseURL} />
                </Grow>
              }/>
              <Route exact path='/home' element = {
                <LandingPage />
              }/>
              <Route exact path="/dashboard/edit" element = {
                <Grow>
                  <Dashboardform PortalID={props.PortalID} baseURL={props.baseURL} CurrentPage="Edit"/>
                </Grow>
              }/>
              <Route exact path="/dashboard/view" element = {
                <Grow>
                  <DashboardList PortalID={props.PortalID} baseURL={props.baseURL} CurrentPage="View"/>
                </Grow>
              }/>
            </Routes>
        </div>
      </Company>
    </>
  );
}

export default App;
