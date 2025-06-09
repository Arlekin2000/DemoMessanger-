import React, { useEffect, useState } from 'react';
import { CookiesProvider, useCookies } from 'react-cookie';
import Select from "react-select";
import { Button, Stack, TextField, Typography } from '@mui/material';
import { ReactComponent as Logo } from './logo.svg';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const Profile = () => {
  const [ searchParams ] = useSearchParams();
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(['auth', 'c_email']);

  const [profile, setProfile] = useState({
      name: "",
      email: "",
      age: "",
      friend: false,
      city: {value: null, label: null}
  });

  const [cities, setCities] = useState([])
  const [find_city, setFindCity] = useState("")

  async function get_cities(){
    const data = {
      method: 'GET',
    };
    let url = "http://localhost:8000/api/users/v1/cities"
    if (find_city)
        url += "?where="+find_city
    const res = await fetch(url, data)
    const json = await res.json()
    const result: any = []
    json.forEach(
        (city: any) => result.push({"value": city["id"], "label": city["name"]})
    )
    setCities(result)
  }

  async function load_profile(profile_id:any){
    const data = {
      method: "GET",
      headers: {"Authorization": 'Bearer ' + cookies.auth},
    }
    const url_end = profile_id ? `?profile_id=${profile_id}` : '/me'
    const res = await fetch(`http://localhost:8000/api/users/v1/profile${url_end}`, data)
    const json = await res.json()
    setProfile({
        ...json["data"],
        ...{city: {"value": json["data"]["city"]["id"], "label": json["data"]["city"]["name"]}}
    })
  }

  const profile_id = searchParams.get("profile_id")
  useEffect(() => {
      load_profile(profile_id)
  }, [profile_id])

  useEffect(() => {
      get_cities()
  }, [find_city])


  async function save_profile(){
    const body = {
        name: profile.name,
        email: profile.email,
        age: profile.age,
        city: profile.city["value"] || null
    }
    const data = {
      method: 'POST',
      headers: {'Authorization': 'Bearer ' + cookies.auth, 'Content-Type': 'application/json'},
      body: JSON.stringify(body)
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

  function updateProfile(data: {}){
      const prof = {...profile, ...data}
      setProfile(prof)
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
              { (cookies["c_email"] === profile.email) ?
                  "Your Photo": "Photo"
              }
            </Typography>
            <Logo />
          </Stack>
          <Stack spacing={2} pt={3} width="75%">
            <Typography fontWeight="bold" fontSize={28}>
              { (cookies["c_email"] === profile.email) ?
                  "Your Profile": "Profile"
              }
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <Stack spacing={2} alignItems="center" width="20%">
                <Typography fontSize={18}>Name: </Typography>
              </Stack>
              <Stack spacing={2} alignItems="center" width="80%">
                { (cookies["c_email"] === profile.email) ?
                    <TextField
                    label={profile.name}
                    fullWidth
                    onChange={(e) => {updateProfile({name: e.target.value})}}
                ></TextField> : <Typography fontSize={18}> { profile.name } </Typography>
                }
              </Stack>
            </Stack>
            <Stack direction="row" spacing={2} alignItems="center">
              <Stack spacing={2} alignItems="center" width="20%">
                <Typography fontSize={18}>Email: </Typography>
              </Stack>
              <Stack spacing={2} alignItems="center" width="80%">
                { (cookies["c_email"] === profile.email) ?
                    <TextField label={profile.email} fullWidth></TextField> :
                    <Typography fontSize={18}> { profile.email } </Typography>
                }
              </Stack>
            </Stack>
            <Stack direction="row" spacing={2} alignItems="center">
              <Stack spacing={2} alignItems="center" width="20%">
                <Typography fontSize={18}>Age: </Typography>
              </Stack>
              <Stack spacing={2} alignItems="center" width="80%">
                { (cookies["c_email"] === profile.email) ?
                    <TextField
                    label={profile.age}
                    fullWidth
                    onChange={(e) => {updateProfile({age: e.target.value})}}
                ></TextField> : <Typography fontSize={18}> { profile.age } </Typography>
                }
              </Stack>
            </Stack>
            <Stack direction="row" spacing={2} alignItems="center">
              <Stack spacing={2} alignItems="center" width="20%">
                <Typography fontSize={18}>City: </Typography>
              </Stack>
              <Select
                  value={profile.city}
                  options={cities}
                  onInputChange={(e) => setFindCity(e)}
                  onChange={(e) => {
                      if (e) updateProfile({city: {value: e.value, label: e.label}})
                  }} />
            </Stack>
            <Stack alignItems="center">
              <Stack width="20%" alignItems="center">
                { (cookies["c_email"] === profile.email) &&
                  <Button onClick={save_profile}>Save</Button>
                }
                { (cookies["c_email"] !== profile.email && !profile.friend) &&
                  <Button onClick={add_friend}>Add friend</Button>
                }
                { (cookies["c_email"] !== profile.email && profile.friend) &&
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
