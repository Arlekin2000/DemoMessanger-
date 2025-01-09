import {Box, Button, Icon, Stack, TextField} from '@mui/material';
import {useNavigate} from "react-router-dom";
import {useCookies} from "react-cookie";
import React, {useEffect, useState} from "react";

export default function Messages() {
  const messages: any[] = [];

  const navigate = useNavigate();
  const [cookies, setCookies] = useCookies(['auth'])
  const [friends_list, setFriendsList] = useState<any[]>([])

  async function get_friends(){
    const data = {
      method: 'GET',
      headers: {'Authorization': 'Bearer ' + cookies.auth, 'Content-Type': 'application/json'}
    };
    const res = await fetch('http://localhost:8000/api/users/v1/friends', data)
    const json = await res.json()
    console.log("FRIENDS", json)
    setFriendsList(json["data"])
  }

  useEffect(() => {get_friends()}, [])

  return (
    <Stack alignItems="center" width="100%">
        <Stack direction="row" width="70%">
          <Stack spacing={2} alignItems="center" width="30%" style={{ background: "#ffffff", padding: 1, borderRadius: 10, border: "1px solid gray", margin: 10 }}>
            { friends_list.map(
                (item) => (
                    <Stack
                        width="95%"
                        direction="row"
                        style={{ background: "#dddddd", padding: 5, borderRadius: 10, border: "1px solid blue", margin: 5, height: "40px" }}>
                        <Box
                          component="img"
                          sx={{
                              height: 30,
                              width: 30,
                              maxHeight: { xs: 30, md: 30 },
                              maxWidth: { xs: 30, md: 30 },
                              borderRadius: 5
                          }}
                          alt="User icon"
                          src='https://media.istockphoto.com/id/1300845620/ru/векторная/пользователь-icon-flat-изолирован-на-белом-фоне-символ-пользователя-иллюстрация-вектора.jpg?s=612x612&w=0&k=20&c=Po5TTi0yw6lM7qz6yay5vUbUBy3kAEWrpQmDaUMWnek='
                        />
                        <Button>
                            {item.name}
                        </Button>
                    </Stack>
                )
            )
            }
          </Stack>
          <Stack alignItems="center" width="70%">
              <Stack height={700} width="100%" style={{ background: "#ffffff", padding: 7, borderRadius: 10, border: "1px solid gray", margin: 10 }}>
                  {
                      messages.map(
                          (message) => (
                              <Stack direction="row" width="100%" height={125} alignItems="right" justifyContent={message.main ? "right" : "left"}>
                                  <Stack width={250}>
                                      <Stack style={{ background: "#eeeeee", padding: 1, borderRadius: 10, border: "1px solid gray" }}>
                                          <p>{message.timestamp}</p>
                                          <p>{message.text}</p>
                                      </Stack>
                                  </Stack>

                              </Stack>
                          )
                      )
                  }
              </Stack>
              <Stack spacing={2} width="100%" alignItems="center">
                  <TextField fullWidth></TextField>
                  <Button variant="outlined" style={{ width: 250 }}>Отправить сообщение</Button>
              </Stack>
          </Stack>

        </Stack>
    </Stack>
  )
}