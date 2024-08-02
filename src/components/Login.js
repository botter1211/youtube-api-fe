import React from "react";
import GoogleIcon from "@mui/icons-material/Google";
import { Button, Stack } from "@mui/material";
import Logo from "./Logo";

function Login() {
  const handleLogin = () => {
    window.location.href = "http://localhost:4000/auth/google";
  };

  return (
    <div>
      <Stack minHeight="90vh" justifyContent="center" alignItems="center">
        <h2>Welcome, please sign in!</h2>
        <Logo sx={{ width: 120, height: 120, mb: 2 }} />
        <Button variant="outlined" onClick={handleLogin}>
          <GoogleIcon sx={{ fontSize: 30, mr: 1 }} /> Login with Google
        </Button>
      </Stack>
    </div>
  );
}

export default Login;
