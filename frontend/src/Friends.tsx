import React, { useState } from 'react';
import { Button, Stack, TextField, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Friends() {
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

  return (
      <Stack spacing={2} pt={3} alignItems="center" width="100%">
        <Typography fontWeight="bold" fontSize={32}>
          My friends
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
                friends_list.map(
                    (item) => (
                        <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            width="80%"
                            onClick={() => navigate('/profile')}
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
                                  src={ item.avatar }
                                />
                            </Stack>
                            <Stack spacing={2} width="60%" alignItems="flex-start">
                                <h2>{ item.firstname } { item.lastname }</h2> <h3>({ item.nickname })</h3>
                            </Stack>
                        </Stack>
                    )
                )
            }
        </Stack>
      </Stack>
  )
}
