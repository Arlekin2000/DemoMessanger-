import React, { useState } from 'react';
import { Button, Stack, TextField, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Messages() {
    const navigate = useNavigate();

    const friends_list = [
      {
        nickname: "givisisia",
        firstname: "Гиви",
        lastname: "Мавесисян",
        age: 21,
        sex: "male",
        avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5YcXYAUmu5asP_70zHZHg92s1CVXGteaqpQ&s"
      },
      {
        nickname: "chtoto_pokoleno",
        firstname: "Пиколини",
        lastname: "Поколено",
        age: 22,
        sex: "male",
        avatar: "https://sun1-23.userapi.com/s/v1/ig2/7-_j2rc_5v4dJs4Bb6u9Ah85FxcctjGrIpOwKfLzZ-TJfxzFg_4OkdVcmF8V2wFq1a0Ge6fjWTP4ELGuYdC0OsQ2.jpg?quality=95&crop=796,125,509,509&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480&ava=1&u=lvfUeQhhU5vhMBofc6oFPtmY5na3yWM1u1KJEU_SMeU&cs=200x200"
      },
      {
        nickname: "ein_schtein",
        firstname: "Альберт",
        lastname: "Однокамнев",
        age: 23,
        sex: "male",
        avatar: "https://big-i.ru/upload/iblock/426/1xrtnl61ku66l9xuywnfk6dyy04u5c0v.jpg"
      }
    ]

    const messages = [
        {
            id: 101,
            main: true,
            timestamp: "21:00",
            text: "Hey, Leonid",
            username: "me"
        },
        {
            id: 102,
            main: true,
            timestamp: "21:00",
            text: "What is it?",
            username: "me"
        },
        {
            id: 103,
            main: false,
            timestamp: "21:01",
            text: "THIS! IS! MESSAGE!!!",
            username: "Leonid"
        }
    ]

    return (
        <Stack alignItems="center" width="100%">
            <Stack direction="row" width="70%">
              <Stack spacing={2} alignItems="center" width="30%" style={{ background: "#ffffff", padding: 1, borderRadius: 10, border: "1px solid gray", margin: 10 }}>
                { friends_list.map(
                    (item) => (
                    <Button>{item.firstname} {item.lastname}</Button>
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


        // <Stack alignItems="center" width="100%">
        //     <Stack direction="row" spacing={2} pt={3} alignItems="center" width="70%">
        //       <Stack spacing={2} alignItems="center">
        //           { friends_list.map(
        //               (item) => (
        //               <Button>{item.firstname} {item.lastname}</Button>
        //               )
        //           )
        //           }
        //       </Stack>
        //       <Stack spacing={2} width="100%">
        //         <Typography fontSize={20}>Hello!</Typography>
        //       </Stack>
        //     </Stack>
        //     <Stack>
        //         <TextField></TextField>
        //         <Button>Отправить сообщение</Button>
        //     </Stack>
        // </Stack>
    )
}