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

  const onResponseReceived = (data: AuthResponse | null) => {
    if (data && data.userId) {
      dispatch(userActions.login());
      localStorage.setItem("userId", data.userId);
    } else {
      console.error("userId not found in response data");
    }
  };


  const getData = async (data: AuthData) => {
    try {
      const response = await sendUserAuthRequest(data, data.signup);
      
      // Ensure the response has the expected structure
      if (!response || typeof response !== 'object') {
        throw new Error("Invalid response from authentication service.");
      }
      
      onResponseReceived(response);
    } catch (err) {
      // Check if the error is an instance of Error and has a message
      const errorMessage = (err instanceof Error) ? err.message : "An error occurred during authentication.";
      throw new Error(errorMessage);
    }
  };
  
  

  return (
    <div>
      <AuthForm onSubmit={getData} isAdmin={false} />
    </div>
  );
};

export default Auth;
