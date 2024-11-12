import React from 'react';
import { CookiesProvider } from 'react-cookie';
import { Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const Header = () => {
  const navigate = useNavigate();

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
          onClick={() => navigate('profile')}
          fullWidth
          color="info"
        >
          Profile
        </Button>
        <Button
          variant="contained"
          onClick={() => navigate('friends')}
          fullWidth
          color="info"
        >
          Friends
        </Button>
        <Button
          variant="contained"
          onClick={() => navigate('messages')}
          fullWidth
          color="info"
        >
          Messages
        </Button>
      </Stack>
    </CookiesProvider>
  );
};
