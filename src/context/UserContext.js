import {createContext, useEffect, useState} from 'react'
import axios from "axios";

export const UserContext = createContext();

export const UserProvider = (props) => {
    const [token,setToken] = useState(localStorage.getItem("AuthenToken"));

    useEffect(() => {
        const fetchUser = async () =>{
            axios
                .post(props.baseURL + "login",{},{headers:{
                    "Content-Type" : "application/json",
                    'Authorization' :"Bearer " + token
                }})
                .then((response) => {
                    localStorage.setItem("AuthenToken",token);
                })
                .catch((response) => {
                    setToken(null);
                });
            }
        fetchUser();
    },[token,props]);

    return (
        <UserContext.Provider value={[token, setToken]}>
            {props.children}
        </UserContext.Provider>
    )
}