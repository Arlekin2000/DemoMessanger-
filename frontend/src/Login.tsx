import React, { useState } from 'react';
import { CookiesProvider, useCookies } from 'react-cookie';
import { Button, Stack, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [cookies, setCookie] = useCookies(['auth']);

  const handleButtonClick = async (action_type: string) => {
    if (action_type == 'login') {
      setCookie('auth', "DEMO_TOKEN", { 'path': '/' });
      navigate('/profile');
    }

    if (cookies.auth) navigate('/profile');
  }

  return (
    <CookiesProvider>
      <Stack spacing={2} pt={3} alignItems="center" width="100%">
        <Typography fontWeight="bold" fontSize={28}>
          Login MATHERFUCKER!
        </Typography>
        <Stack spacing={3} pt={1} alignItems="center">
          <Stack width={400}>
            <TextField
              label="Input your email."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Stack>
          <Stack width={400}>
            <TextField
              type="password"
              label="and password."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center">
            <Button
              variant="contained"
              color="primary"
              component="span"
              onClick={() => handleButtonClick('login')}
            >
              Login
            </Button>
            <Button
              variant="text"
              onClick={() => handleButtonClick('register')}
            >
              Register
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </CookiesProvider>
  )
}
