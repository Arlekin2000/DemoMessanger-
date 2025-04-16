import React, {useContext, useEffect, useState} from 'react';
import { Button, Stack, TextField } from '@mui/material';

import { WebsocketContext } from "./utils";
import {useCookies} from "react-cookie";


export default function Messages() {
    const [cookies] = useCookies(['userid', 'auth'])
    const userid = cookies.userid + ''
    const [friends_list, setFriendsList] = useState<any[]>([])
    const [message_text, setMessageText] = useState('')
    const [selected_chat, setSelectedChat] = useState(null)
    const [messages, setMessages] = useState<any[]>([])
    const page_height = document.documentElement.getBoundingClientRect().bottom
    // @ts-ignore
    const [ready, val, send] = useContext(WebsocketContext)
    const messagesBox = document.getElementById('messages_box')

    async function get_friends() {
        const data = {
            method: 'GET',
            headers: {'Authorization': 'Bearer ' + cookies.auth, 'Content-Type': 'application/json'},
        };
        const res = await fetch(`http://localhost:8000/api/users/v1/friends/`, data)
        const json = await res.json()
        console.log('JSON', json)
        setFriendsList(json['data'])
    }
    useEffect(() => {get_friends()}, [])

    async function get_messages(chat_id: any) {
        const data = {
            method: 'GET',
            headers: {'Authorization': 'Bearer ' + cookies.auth, 'Content-Type': 'application/json'},
        };
        const res = await fetch(`http://localhost:8000/api/users/v1/messages/${chat_id}`, data)
        const json = await res.json()
        console.log('MESSAGES', json)
        setSelectedChat(chat_id)
        setMessages(json['messages'])
        if (json["messages"].length > 15) {
          if (messagesBox) { // @ts-ignore
              messagesBox.scrollTo(0, 4000)
          }
      }

    }

    async function send_message() {
        const data = {
            method: 'POST',
            headers: {'Authorization': 'Bearer ' + cookies.auth, 'Content-Type': 'application/json'},
            body: JSON.stringify({message: message_text})
        };
        const res = await fetch(`http://localhost:8000/api/users/v1/messages/${selected_chat}`, data)
        const json = await res.json()
        setMessages(messages.concat([json['message']]))
        setMessageText('')
    }

    async function load_more(chat_id: any, last_id: number) {
        const data = {
            method: 'GET',
            headers: {'Authorization': 'Bearer ' + cookies.auth, 'Content-Type': 'application/json'},
        };
        const res = await fetch(`http://localhost:8000/api/users/v1/messages/${chat_id}/load_more_from/${last_id}`, data)
        const json = await res.json()
        setMessages(json['messages'])
    }

    async function check_scroll(){
        if (messagesBox) {
            let scrollPos = messagesBox.scrollHeight - messagesBox.scrollTop - messagesBox.offsetHeight

            if (messages.length === 0) return

            let last_id = messages[messages.length - 1].message_id
            let first_id = messages[0].message_id

            if (scrollPos < 100) {
                await load_more(selected_chat, last_id)
            }
            if (scrollPos > messagesBox.scrollHeight - messagesBox.offsetHeight - 100){
                await load_more(selected_chat, first_id)
            }
        }
    }

    async function process_socket_message() {
        console.log("it's alive")
        if (ready) {
            let message = JSON.parse(val)
            if (message) {
                if (message['type'] === 'new_message') {
                    if (selected_chat) {
                        await get_messages(selected_chat)
                    }
                }
            }
        }
    }

    useEffect(() => {
        process_socket_message()
    }, [ready, send])

    return (
       <Stack alignItems="center" width="100%">
            <Stack direction="row" width="70%">
              <Stack spacing={2} alignItems="center" width="30%" style={{ background: "#ffffff", padding: 1, borderRadius: 10, border: "1px solid gray", margin: 10 }}>
                {
                  friends_list.map(
                    (item) => (
                        <Button
                            key={item.id}
                            variant="contained"
                            onClick={() => {
                                if (selected_chat !== item.id) get_messages(item.id)
                            }}
                        >{item.name}</Button>
                    )
                  )
                }
              </Stack>
              <Stack alignItems="center" width="70%">
                  <Stack
                      id="messages_box"
                      height={page_height}
                      width="100%"
                      onScroll={() => {
                          check_scroll()
                      }}
                      style={{
                          background: "#ffffff",
                          padding: 7,
                          borderRadius: 10,
                          border: "1px solid gray",
                          margin: 10,
                          overflowY: 'scroll' }}
                  >
                      {
                          messages.map(
                              (message) => (
                                  <Stack
                                      key={message.id}
                                      direction="row"
                                      width="100%"
                                      alignItems="right"
                                      justifyContent={message.user === userid ? "right" : "left"}
                                  >
                                      <Stack width={250}>
                                          <Stack
                                              style={{
                                                  background: message.user === userid ? "#dddddd" : "#eeeeff",
                                                  padding: 1,
                                                  margin: 5,
                                                  borderRadius: 10,
                                                  border: "1px solid gray"
                                          }}
                                          >
                                              <p>{message.created}</p>
                                              <p>{message.text}</p>
                                          </Stack>
                                      </Stack>

                                  </Stack>
                              )
                          )
                      }
                  </Stack>
                  <Stack spacing={2} width="100%" alignItems="center">
                      <TextField fullWidth
                         id="message_field"
                         value={message_text}
                         onChange={(e) => {setMessageText(e.target.value)}}
                      ></TextField>
                      <Button
                          variant="outlined"
                          style={{ width: 250 }}
                          onClick={() => send_message()}
                      >
                          Отправить сообщение
                      </Button>
                  </Stack>
              </Stack>

            </Stack>
        </Stack>

    )
}