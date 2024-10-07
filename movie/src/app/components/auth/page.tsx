"use client"; // Ensure it's a Client Component
import React from 'react';
import AuthForm from './auth-form';
import { sendUserAuthRequest } from '@/app/api-helpers/api-helpers.js';
import { useDispatch } from 'react-redux';
import { userActions } from '@/app/store';

// Define interfaces for the input and response data types
interface AuthData {
  email: string;
  password: string;
  signup: boolean;
}

interface AuthResponse {
  userId: string;
}

const Auth = () => {
  const dispatch = useDispatch();

  // Modify function to use the AuthResponse type instead of any
  const onResponseReceived = (data: AuthResponse | null) => {
    if (data && data.userId) {
      dispatch(userActions.login());
      localStorage.setItem("userId", data.userId);
    } else {
      console.error("userId not found in response data");
    }
  };

  // Modify function to use the AuthData type instead of any
  const getData = (data: AuthData) => {
    sendUserAuthRequest(data, data.signup)
      .then(onResponseReceived)
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <AuthForm onSubmit={getData} isAdmin={false} />
    </div>
  );
};

export default Auth;
