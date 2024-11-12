import { Routes, Route } from 'react-router-dom';

import React from 'react';
import './App.css';
import Login from './Login';
import Friends from './Friends';
import Messages from "./Messages";
import { Profile } from './Profile';
import { Header } from './Header';
import { Stack } from '@mui/material';
import { CookiesProvider, useCookies } from 'react-cookie';

function App() {
  const [cookies] = useCookies(['auth']);
  const isLogged = cookies.auth;

  return (
    <div className="App">
      <CookiesProvider>
        {isLogged ? (
          <Stack width="100%" alignItems="center">
            <Header />
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/friends" element={<Friends />} />
              <Route path="/messages" element={<Messages />} />
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
