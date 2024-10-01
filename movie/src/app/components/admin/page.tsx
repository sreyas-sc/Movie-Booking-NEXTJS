'use client'
import React from 'react'
import AuthForm from '../auth/auth-form'
import { sendAdminAuthRequest } from '@/app/api-helpers/api-helpers.js';
import { useDispatch } from 'react-redux';
import { adminActions } from '@/app/store';

type AuthResponseData = {
  id: string;
  token: string;
};

const Admin = () => {
  const dispatch =  useDispatch();
  const onResponseRecieved = (data: AuthResponseData) => {
    console.log("admin data is");
    console.log(data);
  
    if (data && data.id) {
      dispatch(adminActions.login());
      localStorage.setItem("adminId", data.id);
      localStorage.setItem("token", data.token)
    } else {
      console.error("User ID not found in response data");
    }
  };
  

  const getData = (data: { email: string; password: string }) =>{
    console.log("Auth from admin", data)
    sendAdminAuthRequest(data)
    .then(onResponseRecieved)
    .catch((err) => console.log(err));
  };

  
  return (
    <div>
      <AuthForm onSubmit={getData} isAdmin={true} />
    </div>
  )
}

export default Admin