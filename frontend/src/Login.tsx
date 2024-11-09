import React, { useState } from 'react';
import Alert from '@mui/material/Alert';
import { CookiesProvider, useCookies } from 'react-cookie';
import { Button, Stack, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const [cookies, setCookie] = useCookies(['auth']);

  const login = async () => {
    const data = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({email: email, password: password})
    };
    const res = fetch('http://localhost:8000/api/users/v1/login', data)
        .then(res => res.json())
        .then(
            (result) => {
              if (result['success'] === true) {
                setCookie('auth', result['token'], {'path': '/'})
                navigate('/profile')
              } else {
                setShowAlert(true)
              }
            },
            (error) => {
              setShowAlert(true)
            }
        );
    return res
  }
  const register = async () => {
    const data = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({email: email, password: password})
    };
    const res = fetch('http://localhost:8000/api/users/v1/register', data)
        .then(res => res.json())
        .then(
            (result) => {
              if (result['success'] === true) {
                setCookie('auth', result['token'], {'path': '/'})
                navigate('/profile')
              } else {
                setShowAlert(true)
              }
            },
            (error) => {
              setShowAlert(true)
            }
        );
    return res
  }

  const handleButtonClick = async (action_type: string) => {
    if (action_type == 'login') {
      await login()
    } else if (action_type == 'register') {
      await register();
    }

    if (cookies.auth) navigate('/profile');
  }

  return (
    <CookiesProvider>
      <Stack spacing={2} pt={3} mb={5} alignItems="center" width="100%">
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
        { showAlert &&
          <Stack width={300}>
            <Alert
                severity="warning"
                action={
                  <Button color="inherit" size="small" onClick={() => setShowAlert(false)}>
                    CLOSE
                  </Button>
                }
            >
              Something went wrong.
            </Alert>
          </Stack>
        }
      </Stack>
    </CookiesProvider>
  )
}