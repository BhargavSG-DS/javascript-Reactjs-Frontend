import React from 'react';
import App from './App';
import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
} from "react-router-dom";
import { UserProvider } from './context/UserContext';


const baseURL = "http://192.168.1.147:8000/"
const portal = "PORTAL00001"
const root = ReactDOM.createRoot(
  document.getElementById("root")
);

root.render(
    <BrowserRouter>
      <UserProvider baseURL={baseURL}>
        <App PortalID = {portal} baseURL={baseURL}/>
      </UserProvider>
    </BrowserRouter>
);