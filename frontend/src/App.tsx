import {Route, Routes} from 'react-router-dom';

import React from 'react';
import './App.css';
import Login from './Login';
import { Main } from './Main'
import {Stack} from '@mui/material';
import {CookiesProvider, useCookies} from 'react-cookie';

import {WebsocketProvider} from "./utils";
import {Profile} from "./Profile";


function App() {
    const [cookies] = useCookies(['auth']);
    const isLogged = cookies.auth;

    return (
    <div className="App">
      <CookiesProvider>
        {isLogged ? (
          <Stack width="100%" alignItems="center">
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/main" element={<WebsocketProvider><Main /></WebsocketProvider>} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </Stack>
        ) : (
          <Login />
        )}
      </CookiesProvider>
    </div>
    );
}

export default App;
