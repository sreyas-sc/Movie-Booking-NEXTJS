"use client";
import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  FormControl,
  IconButton,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
  InputAdornment,
  Snackbar,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import Link from "next/link";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import axios from "axios";
import { googleSignIn } from "@/app/api-helpers/api-helpers";
import { useDispatch } from "react-redux";
import { userActions } from "@/app/store";

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
  const [inputs, setInputs] = useState({
    email: "",
    phone: "",
    password: "",
    otp: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    phone: "",
    password: "",
    otp: "",
    general: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const dispatch = useDispatch();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    const credential = credentialResponse?.credential;
    if (credential) {
      const decoded: DecodedToken = jwtDecode<DecodedToken>(credential);
      const { email } = decoded;

      try {
        await axios.post("http://localhost:5000/user/send-otp", { email });
        const response = await googleSignIn(email);

        if (response) {
          setOtpDialogOpen(true);
          sessionStorage.setItem("googleEmail", email);
        } else {
          setErrors({ ...errors, email: "Error with Google Sign-In." });
        }
      } catch (error) {
        console.error("Error during Google Sign-In:", error);
        setErrors({ ...errors, email: "An error occurred while processing your request." });
      }
    }
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs((prevState) => ({
      ...prevState,
      otp: e.target.value,
    }));
  };

  const handleOtpSubmit = async () => {
    try {
      const email = sessionStorage.getItem("googleEmail");
      if (!email || !inputs.otp) {
        throw new Error("Email or OTP is missing.");
      }

      const response = await axios.post("http://localhost:5000/user/verify-otp", { email, otp: inputs.otp });

      if (response.data.success) {
        sessionStorage.removeItem("googleEmail");
        dispatch(userActions.login());
        setSuccessMessage("OTP Verified Successfully");
        setOtpDialogOpen(false);
        router.push("/");
        localStorage.setItem("userEmail", email);
      } else {
        setErrors({ ...errors, otp: "Invalid OTP. Please try again." });
      }
    } catch (error) {
      console.error("Error during OTP submission:", error);
      setErrors({ ...errors, otp: "An error occurred during OTP verification." });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let valid = true;

    // Validate email
    if (!validateEmail(inputs.email)) {
      setErrors((prev) => ({ ...prev, email: "Please enter a valid email address." }));
      valid = false;
    }

    // Validate phone number if signing up
    if (isSignup && !validatePhoneNumber(inputs.phone)) {
      setErrors((prev) => ({ ...prev, phone: "Please enter a valid 10-digit phone number." }));
      valid = false;
    }

    // Validate password
    if (!inputs.password) {
      setErrors((prev) => ({ ...prev, password: "Please enter your password." }));
      valid = false;
    }

    if (valid) {
      try {
        await onSubmit({
          email: inputs.email,
          phone: inputs.phone,
          password: inputs.password,
          signup: isAdmin ? false : isSignup,
        });

        if (isSignup) {
          setSuccessMessage("Signup Successful! Please sign in to continue.");
          setIsSignup(false); // Switch to sign-in page after signup
        } else {
          router.push("/components/movies");
        }
      } catch (err) {
        setErrors({ ...errors, general: "Something went wrong!" }); // Set general error
      }
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
              error={!!errors.email}
              helperText={errors.email}
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
                error={!!errors.phone}
                helperText={errors.phone}
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
                error={!!errors.password}
              />
              <Typography color="error">{errors.password}</Typography>
            </FormControl>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              sx={{ marginTop: 3, borderRadius: 20, width: "35ch" }}
            >
              {isSignup ? "Sign Up" : "Sign In"}
            </Button>
                 {!isAdmin && (
                
                  <Typography variant="body1" marginTop={2}>
                    {isSignup ? "Already have an account?" : "Don't have an account?"}
                    <Button onClick={() => setIsSignup((prev) => !prev)}>
                      {isSignup ? "Sign In" : "Sign Up"}
                    </Button>
   
                  </Typography>
                  
                
              )}
            

            {!isAdmin && (
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => console.log("Login Failed")}
              />
            )}

            <Snackbar
              open={!!successMessage}
              autoHideDuration={6000}
              onClose={() => setSuccessMessage("")}
              message={successMessage}
            />
          </Box>
        </form>
      </Dialog>

      <Dialog open={otpDialogOpen} onClose={() => setOtpDialogOpen(false)}>
        <Box padding={2}>
          <Typography variant="h6">Verify OTP</Typography>
          <TextField
            label="OTP"
            value={inputs.otp}
            onChange={handleOtpChange}
            error={!!errors.otp}
            helperText={errors.otp}
          />
          <Button onClick={handleOtpSubmit} variant="contained">
            Verify OTP
          </Button>
        </Box>
      </Dialog>
    </>
  );
};

export default AuthForm;
