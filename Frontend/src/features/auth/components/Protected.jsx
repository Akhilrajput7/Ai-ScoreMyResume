import React from 'react'
import { useAuth } from '../hooks/useAuth';
import {Navigate} from "react-router";
import { useContext } from 'react';
import { AuthContext } from '../services/auth.context';


const Protected = ({children}) => {

 const {user,loading} = useAuth();
 
  if(loading){
    return(<main>Loading</main>)
  }


    if(!user){
       return <Navigate to="/login" />
    }


  return children;
}

export default Protected