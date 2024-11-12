import React from 'react';
import { CookiesProvider, useCookies } from 'react-cookie';
import { Button, Stack, TextField, Typography } from '@mui/material';
import { ReactComponent as Logo } from './logo.svg';
import { useNavigate } from 'react-router-dom';

export const Profile = () => {
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(['auth']);

  let data = {
    name: '',
    email: '',
    age: '',
  };

  const response = data;

  function Exit() {
    if (cookies.auth) setCookie('auth', '', { 'path': '/' });
    navigate('/');
  }

  return (
    <CookiesProvider>
      <Stack alignItems="center" width="100%">
        <Stack
          direction="row"
          spacing={2}
          pt={3}
          margin={0.3}
          padding={1}
          borderRadius={2}
          width="70%"
          bgcolor="lightgray"
        >
          <Stack spacing={2} pt={3} width="25%">
            <Typography fontWeight="bold" fontSize={28}>
              Your Photo
            </Typography>
            <Logo />
          </Stack>
          <Stack spacing={2} pt={3} width="75%">
            <Typography fontWeight="bold" fontSize={28}>
              Your profile
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <Stack spacing={2} alignItems="center" width="20%">
                <Typography fontSize={18}>Name: </Typography>
              </Stack>
              <Stack spacing={2} alignItems="center" width="80%">
                <TextField label={data.name} fullWidth></TextField>
              </Stack>
            </Stack>
            <Stack direction="row" spacing={2} alignItems="center">
              <Stack spacing={2} alignItems="center" width="20%">
                <Typography fontSize={18}>Email: </Typography>
              </Stack>
              <Stack spacing={2} alignItems="center" width="80%">
                <TextField label={data.email} fullWidth></TextField>
              </Stack>
            </Stack>
            <Stack direction="row" spacing={2} alignItems="center">
              <Stack spacing={2} alignItems="center" width="20%">
                <Typography fontSize={18}>Age: </Typography>
              </Stack>
              <Stack spacing={2} alignItems="center" width="80%">
                <TextField label={data.age} fullWidth></TextField>
              </Stack>
            </Stack>
            <Stack alignItems="center">
              <Stack width="20%" alignItems="center">
                <Button>Save</Button>
                <Button onClick={Exit}>Exit from profile</Button>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </CookiesProvider>
  );
};
