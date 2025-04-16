import React, { useState, createContext, useRef , useEffect } from 'react';
import { useCookies } from 'react-cookie';

export const WebsocketContext = createContext(null)

// @ts-ignore
export const WebsocketProvider = ({ children }) => {
  const [isReady, setIsReady] = useState(false)
  const [val, setVal] = useState(null)
  const [cookies] = useCookies(['userid']);
  const userid = cookies.userid;

  const ws = useRef(null)
  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:8000/dms/${userid}`)

    socket.onopen = () => setIsReady(true)
    socket.onclose = () => setIsReady(false)
    socket.onmessage = (event) => setVal(event.data)

    // @ts-ignore
    ws.current = socket

    return () => {
      socket.close()
    }
  }, [])

  // @ts-ignore
  const ret: any = [isReady, val, ws.current?.send.bind(ws.current)]

  return (
    // @ts-ignore
    <WebsocketContext.Provider value={ret}>
      {children}
    </WebsocketContext.Provider>
  )
}
