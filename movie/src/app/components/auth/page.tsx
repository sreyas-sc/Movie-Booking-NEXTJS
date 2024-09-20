"use client"; // Ensure it's a Client Component
import React from 'react';
import AuthForm from './auth-form';
import { sendUserAuthRequest } from '@/app/api-helpers/api-helpers.js';
import { useDispatch } from 'react-redux';
import { userActions } from '@/app/store';

const Auth = () => {
  const dispatch =  useDispatch();

  const onResponseRecieved = (data: any) =>{
    if (data && data.userId) {
      dispatch(userActions.login());
      localStorage.setItem("userId", data.userId);
    } else {
      console.error("userId not found in response data");
    }
  }

  
  const getData = (data: any) => {
    sendUserAuthRequest(data, data.signup) // Pass data directly, not data.inputs
      .then(onResponseRecieved)
      .catch((err) => console.log(err));
  };
  

  return (
    <div>
      <AuthForm onSubmit={getData} isAdmin={false} />
    </div>
  );
};

export default Auth;
