import React, { useState, useEffect } from 'react';
import { Button, Stack, TextField, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useCookies } from "react-cookie";

export default function Users() {
  const navigate = useNavigate();
  const [cookies, setCookies] = useCookies(['auth'])
  const [users_list, setUsersList] = useState<any[]>([])

  async function get_users(){
    const data = {
      method: 'GET',
      headers: {'Authorization': 'Bearer ' + cookies.auth, 'Content-Type': 'application/json'}
    };
    const res = await fetch('http://localhost:8000/api/users/v1/all', data)
    const json = await res.json()
    setUsersList(json["data"])
  }

  useEffect(() => {get_users()}, [])

  async function add_friend(user_id: any){
    const data = {
      method: 'POST',
      headers: {'Authorization': 'Bearer ' + cookies.auth, 'Content-Type': 'application/json'},
      body: JSON.stringify({})
    };
    await fetch(`http://localhost:8000/api/users/v1/friends/${user_id}`, data)
    navigate('/friends');
  }

  async function del_friend(user_id: any){
    const data = {
      method: 'DELETE',
      headers: {'Authorization': 'Bearer ' + cookies.auth, 'Content-Type': 'application/json'}
    };
    await fetch(`http://localhost:8000/api/users/v1/friends/${user_id}`, data)
    navigate('/users');
  }

  return (
      <Stack spacing={2} pt={3} alignItems="center" width="100%">
        <Typography fontWeight="bold" fontSize={32}>
          Users
        </Typography>
        <Stack
            spacing={3}
            pt={1}
            alignItems="center"
            width="70%"
            height="90%"
            style={{ background: "#ffffff", padding: 7, borderRadius: 10, border: "1px solid gray" }}
        >
            {
                users_list.map(
                    (item) => (
                        <Stack
                            key={item.id}
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            width="80%"
                            onClick={() => navigate(`/profile?profile_id=${item.id}`)}
                            style={{ background: "#dddddd", padding: 7, borderRadius: 20 }}
                        >
                            <Stack width="40%" alignItems="center">
                                <Box
                                  component="img"
                                  sx={{
                                      height: 150,
                                      width: 150,
                                      maxHeight: { xs: 150, md: 150 },
                                      maxWidth: { xs: 150, md: 150 },
                                      borderRadius: 20
                                  }}
                                  alt="User icon"
                                  src='https://media.istockphoto.com/id/1300845620/ru/векторная/пользователь-icon-flat-изолирован-на-белом-фоне-символ-пользователя-иллюстрация-вектора.jpg?s=612x612&w=0&k=20&c=Po5TTi0yw6lM7qz6yay5vUbUBy3kAEWrpQmDaUMWnek='
                                />
                            </Stack>
                            <Stack spacing={2} width="60%" alignItems="flex-start">
                                <h2>{ item.name }</h2> <h3>{ item.age }</h3>
                            </Stack>
                            <Stack>
                              { (item.friend) ?
                                  <Button
                                      onClick={() => del_friend(item.id)}
                                      style={{ background: "#cc6644", padding: 7, borderRadius: 5, border: "1px solid gray" }}
                                  >Del friend</Button> :
                              <Button
                                  onClick={() => add_friend(item.id)}
                                  style={{ background: "#33cc66", padding: 7, borderRadius: 5, border: "1px solid gray" }}
                              >Add friend</Button>
                              }
                            </Stack>
                        </Stack>
                    )
                )
            }
        </Stack>
      </Stack>
  )
}
