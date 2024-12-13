// src/App.js
import React from "react";
import { Link } from "react-router-dom";

import { alpha } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import logo from "../images/bitstacker-manual-white.png";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import AppTheme from "../shared-theme/AppTheme";

import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

function Welcome(userId = 1) {
  const { data, isLoading, error } = useQuery({ queryKey:['helloWorld'], queryFn:api.helloWorld });
  console.log(data)
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <AppTheme>
      <Box
        sx={{
          justifyContent: "center",
          alignItems: "center",
          mt: 10,
          p: 4,
        }}
      >
        <Stack
          spacing={2}
          sx={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img src={logo} alt="#" />
          <Typography variant="h1" gutterBottom>
            Crypto Portfolio Tracker
          </Typography>
          <Typography variant="h5" gutterBottom>
            Track your crypto holdings in real-time!
          </Typography>

          <Link to="/dashboard">
            <Button variant="contained" color="secondary">Get Started</Button>
          </Link>
        </Stack>
      </Box>
    </AppTheme>
  );
}

export default Welcome;
