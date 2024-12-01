import React, { useEffect, useState } from 'react';
import { CookiesProvider, useCookies } from 'react-cookie';
import { Button, Stack, TextField, Typography } from '@mui/material';
import { ReactComponent as Logo } from './logo.svg';
import { useNavigate } from 'react-router-dom';

export const Profile = () => {
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(['auth']);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");

  const load_profile = async () => {
    const data = {
      method: "GET",
      headers: {"Authorization": 'Bearer ' + cookies.auth},
    }

    const res = await fetch('http://localhost:8000/api/users/v1/profile/me', data);
    const json = await res.json();
    setName(json["data"]["name"]);
    setEmail(json["data"]["email"]);
    setAge(json["data"]["age"]);
  }

  useEffect(() => {
    load_profile()
  }, [])

  const save_profile = async () => {
    const data = {
      method: 'POST',
      headers: {'Authorization': 'Bearer ' + cookies.auth, 'Content-Type': 'application/json'},
      body: JSON.stringify({name: name, age: age})
    };
    await fetch('http://localhost:8000/api/users/v1/profile/me', data)
    return
  }

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
                <TextField
                    label={name}
                    fullWidth
                    onChange={(e) => {setName(e.target.value)}}
                ></TextField>
              </Stack>
            </Stack>
            <Stack direction="row" spacing={2} alignItems="center">
              <Stack spacing={2} alignItems="center" width="20%">
                <Typography fontSize={18}>Email: </Typography>
              </Stack>
              <Stack spacing={2} alignItems="center" width="80%">
                <TextField label={email} fullWidth></TextField>
              </Stack>
            </Stack>
            <Stack direction="row" spacing={2} alignItems="center">
              <Stack spacing={2} alignItems="center" width="20%">
                <Typography fontSize={18}>Age: </Typography>
              </Stack>
              <Stack spacing={2} alignItems="center" width="80%">
                <TextField
                    label={age}
                    fullWidth
                    onChange={(e) => {setAge(e.target.value)}}
                ></TextField>
              </Stack>
            </Stack>
            <Stack alignItems="center">
              <Stack width="20%" alignItems="center">
                <Button onClick={save_profile}>Save</Button>
                <Button onClick={Exit}>Exit from profile</Button>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </CookiesProvider>
  );
};
