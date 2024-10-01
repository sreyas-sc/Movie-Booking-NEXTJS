

"use client";
import React, { useState } from "react";
import {  Box,  Button,  Dialog,  FormControl,  IconButton,  InputLabel,  OutlinedInput,  TextField,  Typography,  InputAdornment,} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import Link from "next/link";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import axios from "axios";
import { googleSignIn } from "@/app/api-helpers/api-helpers";
import { useDispatch } from 'react-redux';
import { userActions } from '@/app/store';


interface CredentialResponse {
  credential?: string;
}

interface DecodedToken {
  email: string;
}

interface AuthFormProps {
  onSubmit: (inputs: { email: string; phone: string; password: string; signup: boolean }) => void;
  isAdmin: boolean;
}

const AuthForm: React.FC<AuthFormProps> = ({ onSubmit, isAdmin }) => {
  const router = useRouter();
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [otpDialogOpen, setOtpDialogOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [inputs, setInputs] = useState({
    email: "",
    phone: "",
    password: "",
  });
  const dispatch =  useDispatch();



  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  
  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    const credential = credentialResponse?.credential;
    if (credential) {
      const decoded: DecodedToken = jwtDecode<DecodedToken>(credential);
      const { email } = decoded;
  
      try {
        await axios.post("https://movie-booking-nextjs.onrender.com/user/send-otp", { email });

        const response = await googleSignIn(email);  
        console.log("Google Sign-In response:", response);  // Add this line to inspect the response

        if (response) {
          setOtpDialogOpen(true);
          // sessionStorage.setItem("userId", response.data.userId);
          sessionStorage.setItem("googleEmail", email);
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong with the response.",
          });
        }
      } catch (error) {
        console.error("Error during Google Sign-In:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An error occurred while processing your request.",
        });
      }
    } 
  };


  // handle the otp submit
  const handleOtpSubmit = async () => {
    try {
      const email = sessionStorage.getItem("googleEmail");
      if (!email || !otp) {
        throw new Error("Email or OTP is missing.");
      }
  
      // Log email and OTP for debugging
      console.log("Sending payload:", { email, otp });
  
      const response = await axios.post("https://movie-booking-nextjs.onrender.com/user/verify-otp", { email, otp });
  
      if (response.data.success) {
        sessionStorage.removeItem("googleEmail");
        dispatch(userActions.login());
  
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "OTP Verified Successfully",
          showConfirmButton: false,
          timer: 1500,
        });
        router.push("/");
        localStorage.setItem('userEmail', email) // for fetcching the user id of the user who is logged in via  google

      } else {
        Swal.fire({
          icon: "error",
          title: "Invalid OTP",
          text: "Please try again.",
        });
      }
    } catch (error) {
      console.error("Error during OTP submission:", error); // Log error
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred during OTP verification.",
      });
    }
  };
  
  
  
 
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!inputs.email || !inputs.password || (isSignup && !inputs.phone)) {
      alert("Please fill in all the required fields.");
      return;
    }

    try {
      await onSubmit({
        email: inputs.email,
        phone: inputs.phone,
        password: inputs.password,
        signup: isAdmin ? false : isSignup,
      });

      router.push("/components/movies");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
    }
  };

  return (
    <>
    <Dialog PaperProps={{ style: { borderRadius: 20 } }} open={true}>
      <Box sx={{ ml: "auto", padding: 1 }}>
        <Link href="/" passHref>
          <IconButton>
            <CloseRoundedIcon />
          </IconButton>
        </Link>
      </Box>

      <Typography variant="h4" textAlign={"center"} marginTop={2}>
        {isSignup ? "Sign Up" : "Sign In"}
      </Typography>

      <form onSubmit={handleSubmit}>
        <Box
          display={"flex"}
          justifyContent={"center"}
          flexDirection="column"
          width={500}
          height={"auto"}
          margin={"auto"}
          padding={5}
          alignItems="center"
        >
          <TextField
            sx={{ m: 1, marginTop: 3, width: "35ch" }}
            value={inputs.email}
            onChange={handleChange}
            id="outlined-required"
            label="Email"
            placeholder="johndoe@gmail.com"
            name="email"
          />

          {isSignup && (
            <TextField
              sx={{ m: 1, marginTop: 3, width: "35ch" }}
              value={inputs.phone}
              onChange={handleChange}
              id="outlined-basic"
              label="Phone Number"
              variant="outlined"
              type="number"
              name="phone"
              InputProps={{
                startAdornment: <InputAdornment position="start">+91</InputAdornment>,
              }}
            />
          )}

          <FormControl sx={{ m: 1, marginTop: 3, width: "35ch" }} variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={showPassword ? "text" : "password"}
              value={inputs.password}
              onChange={handleChange}
              name="password"
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
          </FormControl>

          <Button type="submit" variant="contained" sx={{ marginTop: 2, width: 110 }}>
            {isSignup ? "Sign Up" : "Sign In"}
          </Button>

          {!isAdmin && (
            <>
              <Typography sx={{ mt: 5 }}>
                {isSignup ? "Already have an account?" : "Don't have an account?"}
              </Typography>

              <Button onClick={() => setIsSignup(!isSignup)} variant="text" sx={{ mt: 0 }}>
                {isSignup ? "Sign In" : "Sign Up"}
              </Button>

              <Typography fontSize={15} fontWeight={100} sx={{ mt: 2 }}>
                OR
              </Typography>

              <Typography fontSize={15} fontWeight={600} sx={{ mt: 2 }}>
                Sign In with
              </Typography>

              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => {
                  console.log("Google Sign-In Failed");
                }}
              />
            </>
          )}
        </Box>
      </form>
    </Dialog>

<Dialog PaperProps={{ style: { borderRadius: 20 } }} open={otpDialogOpen} onClose={() => setOtpDialogOpen(false)}>
<Box sx={{ padding: 3, width: 300, margin: "auto" }}>
  <Typography variant="h6" textAlign={"center"} marginBottom={2}>
    Enter OTP
  </Typography>

  <TextField
    fullWidth
    value={otp}
    onChange={(e) => setOtp(e.target.value)}
    label="OTP"
    variant="outlined"
    margin="normal"
  />

  <Button variant="contained" fullWidth onClick={handleOtpSubmit}>
    Verify OTP
  </Button>
</Box>
</Dialog>
</>
  );
};

export default AuthForm;
