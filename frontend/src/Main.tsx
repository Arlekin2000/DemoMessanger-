import React, {useContext, useEffect, useState} from 'react';
import { CookiesProvider } from 'react-cookie';
import { Button, Stack } from '@mui/material';

import Friends from "./Friends";
import Users from "./Users";
import Messages from './Messages';
import { Profile } from "./Profile";

import {WebsocketContext} from "./utils";


export const Main = () => {
  const [selected_page, setPage] = useState("profile")
  const [new_message, setNewMessage] = useState(false)
  const page_height = document.documentElement.clientHeight-300

  // @ts-ignore
  const [ready, val, send] = useContext(WebsocketContext);
  useEffect(() => {
      if (ready) {
          let message = JSON.parse(val)
          if (message){
              if (message["type"] === "new_message"){
                  setNewMessage(true)
              }
          }
      }
  }, [ready, send]);

  return (
      <CookiesProvider>
        <Stack
          direction="row"
          spacing={2}
          padding={1}
          borderRadius={2}
          alignItems="center"
          width="70%"
          bgcolor="lightgrey"
        >
          <Button
            variant="contained"
            onClick={() => setPage("profile")}
            fullWidth
            color="info"
          >
            Profile
          </Button>
          <Button
            variant="contained"
            onClick={() => setPage("friends")}
            fullWidth
            color="info"
          >
            Friends
          </Button>
          <Button
            // @ts-ignore
            variant={
                // @ts-ignore
                (new_message && "outlined") || "contained"}
            onClick={
              () => {
                  setNewMessage(false);
                  setPage("messages");
              }
            }
            fullWidth
            color="info"
          >
            Messages
          </Button>
          <Button
            variant="contained"
            onClick={() => setPage("users")}
            fullWidth
            color="info"
          >
            Users
          </Button>
        </Stack>
        <Stack width="100%" height={page_height}>
          {
            (selected_page === "profile" && <Profile/>) ||
            (selected_page === "friends" && <Friends/>) ||
            (selected_page === "messages" && <Messages/>) ||
            (selected_page === "users" && <Users/>)
          }
        </Stack>
      </CookiesProvider>
  );
};
