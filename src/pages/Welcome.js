// src/App.js
import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { alpha } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import logo from "../images/bitstacker-manual-white.png";
import { Box, Stack, Typography, Button, FormControl, Input, InputLabel, Divider, CircularProgress } from "@mui/material";
import { useUser } from "../context/UserContext";

import AppTheme from "../shared-theme/AppTheme";

function Welcome() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user, login, logout, isLoading, error } = useUser();
  const navigate = useNavigate(); // Hook for navigation

  //react query
  /*const { data, isLoading, error } = useQuery({
    queryKey: ["login", defaultEmail, password],
    queryFn: () => api.loginUser(defaultEmail, password),
    enabled: !!defaultEmail || !!password, //query doesn't run if userId is undefined
  });
  console.log(data);
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;*/

  

  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]); // Redirect when `user` is updated

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login( email, password );
      // handle success
    } catch (error) {
      // handle error
    }
  };

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

          <form onSubmit={handleSubmit}>
            <Stack>
              <FormControl>
                <InputLabel htmlFor="email-input">Email address</InputLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  id="email-input"
                  sx={{ marginBottom: 2 }}
                />
              </FormControl>
              <FormControl>
                <InputLabel htmlFor="pw-input">Password</InputLabel>
                <Input
                  id="pw-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormControl>
              <Divider sx={{ margin: 2 }} />
              {!isLoading && <Button type="submit" variant="contained" color="secondary">
                Login
              </Button>}
              {isLoading && <CircularProgress sx={{alignSelf:"center"}}/>}
              {error && <Typography sx={{color: "error.main"}}>{error}</Typography>}
            </Stack>
          </form>
        </Stack>
      </Box>
    </AppTheme>
  );
}

export default Welcome;
