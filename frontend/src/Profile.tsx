import React, { useEffect, useState } from 'react';
import { CookiesProvider, useCookies } from 'react-cookie';
import { Button, Stack, TextField, Typography } from '@mui/material';
import { ReactComponent as Logo } from './logo.svg';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const Profile = () => {
  const [ searchParams ] = useSearchParams();
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(['auth', 'c_email']);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [is_my_friend, setIsMyFriend] = useState(false);

  async function load_profile(profile_id:any){
    const data = {
      method: "GET",
      headers: {"Authorization": 'Bearer ' + cookies.auth},
    }

    const url_end = profile_id ? `?profile_id=${profile_id}` : '/me'

    const res = await fetch(`http://localhost:8000/api/users/v1/profile${url_end}`, data);
    const json = await res.json();
    setName(json["data"]["name"]);
    setEmail(json["data"]["email"]);
    setAge(json["data"]["age"]);
    setIsMyFriend(json["data"]["friend"]);
  }

  const profile_id = searchParams.get("profile_id")
  useEffect(() => {
    load_profile(profile_id)
  }, [profile_id])

  async function save_profile(){
    const data = {
      method: 'POST',
      headers: {'Authorization': 'Bearer ' + cookies.auth, 'Content-Type': 'application/json'},
      body: JSON.stringify({name: name, email: email, age: age})
    };
    await fetch('http://localhost:8000/api/users/v1/profile/me', data)
    return
  }

  async function add_friend(){
    const data = {
      method: 'POST',
      headers: {'Authorization': 'Bearer ' + cookies.auth, 'Content-Type': 'application/json'},
      body: JSON.stringify({})
    };
    await fetch(`http://localhost:8000/api/users/v1/friends/${profile_id}`, data)
    navigate('/friends');
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
              { (cookies["c_email"] === email) ?
                  "Your Photo": "Photo"
              }
            </Typography>
            <Logo />
          </Stack>
          <Stack spacing={2} pt={3} width="75%">
            <Typography fontWeight="bold" fontSize={28}>
              { (cookies["c_email"] === email) ?
                  "Your Profile": "Profile"
              }
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <Stack spacing={2} alignItems="center" width="20%">
                <Typography fontSize={18}>Name: </Typography>
              </Stack>
              <Stack spacing={2} alignItems="center" width="80%">
                { (cookies["c_email"] === email) ?
                    <TextField
                    label={name}
                    fullWidth
                    onChange={(e) => {setName(e.target.value)}}
                ></TextField> : <Typography fontSize={18}> { name } </Typography>
                }
              </Stack>
            </Stack>
            <Stack direction="row" spacing={2} alignItems="center">
              <Stack spacing={2} alignItems="center" width="20%">
                <Typography fontSize={18}>Email: </Typography>
              </Stack>
              <Stack spacing={2} alignItems="center" width="80%">
                { (cookies["c_email"] === email) ?
                    <TextField label={email} fullWidth></TextField> :
                    <Typography fontSize={18}> { email } </Typography>
                }
              </Stack>
            </Stack>
            <Stack direction="row" spacing={2} alignItems="center">
              <Stack spacing={2} alignItems="center" width="20%">
                <Typography fontSize={18}>Age: </Typography>
              </Stack>
              <Stack spacing={2} alignItems="center" width="80%">
                { (cookies["c_email"] === email) ?
                    <TextField
                    label={age}
                    fullWidth
                    onChange={(e) => {setAge(e.target.value)}}
                ></TextField> : <Typography fontSize={18}> { age } </Typography>
                }
              </Stack>
            </Stack>
            <Stack alignItems="center">
              <Stack width="20%" alignItems="center">
                { (cookies["c_email"] === email) &&
                  <Button onClick={save_profile}>Save</Button>
                }
                { (cookies["c_email"] !== email && !is_my_friend) &&
                  <Button onClick={add_friend}>Add friend</Button>
                }
                { (cookies["c_email"] !== email && is_my_friend) &&
                  <Typography fontSize={18}>You are friends</Typography>
                }
                <Button onClick={Exit}>Exit from profile</Button>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </CookiesProvider>
  );
};
