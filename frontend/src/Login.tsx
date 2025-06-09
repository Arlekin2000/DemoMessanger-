import React, {useEffect, useState} from 'react';
import { CookiesProvider, useCookies } from 'react-cookie';
import Select from "react-select";
import { Button, Stack, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Alert from "@mui/material/Alert";

export default function Login() {
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(['auth', 'c_email', 'userid']);

  const [showAlert, setShowAlert] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show_register, switchLoginRegister] = useState(false);
  const [cities, setCities] = useState([])
  const [find_city, setFindCity] = useState("")
  const [selected_city, setCity] = useState({value: null, label: null})

  async function get_cities(){
    const data = {
      method: 'GET',
    };
    let url = "http://localhost:8000/api/users/v1/cities"
    if (find_city)
        url += "?where="+find_city
    const res = await fetch(url, data)
    const json = await res.json()
    const result: any = []
    json.forEach(
        (city: any) => result.push({"value": city["id"], "label": city["name"]})
    )
    setCities(result)
    setCity(result[0])
  }

  const login = async () => {
    const data = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({email: email, password: password})
    };
    const res = fetch('http://localhost:8000/api/users/v1/login', data)
        .then(res => res.json())
        .then(
            (result) => {
              if (result['success'] === true) {
                setCookie('auth', result['token'], {'path': '/'})
                setCookie('userid', result['id'], {'path': '/'})
                setCookie('c_email', email, {'path': '/'})
                navigate('/main')
              } else {
                setShowAlert(true)
              }
            },
            (error) => {
              setShowAlert(true)
            }
        );
    return res
  }

  const register = async () => {
    const data = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({email: email, password: password, city: selected_city.value})
    };
    const res = fetch('http://localhost:8000/api/users/v1/register', data)
        .then(res => res.json())
        .then(
            (result) => {
              if (result['success'] === true) {
                setCookie('auth', result['token'], {'path': '/'})
                setCookie('userid', result['id'], {'path': '/'})
                setCookie('c_email', email, {'path': '/'})
                navigate('/main')
              } else {
                setShowAlert(true)
              }
            },
            (error) => {
              setShowAlert(true)
            }
        );
    return res
  }

  const handleButtonClick = async (action_type: string) => {
    if (action_type === 'login') {
      await login()
    } else if (action_type == 'register') {
      await register();
    }

    if (cookies.auth) navigate('/main');
  }

  useEffect(() => {
    get_cities()
  }, [find_city])

  return (
    <CookiesProvider>
      <Stack spacing={2} pt={3} alignItems="center" width="100%">
        <Typography fontWeight="bold" fontSize={28}>
          Login MATHERFUCKER!
        </Typography>
        <Stack spacing={3} pt={1} alignItems="center">
          <Stack width={400}>
            <TextField
              label="Input your email."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Stack>
          <Stack width={400}>
            <TextField
              type="password"
              label="and password."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Stack>
          {
            show_register &&
            <Stack width={400}>
              <Select
                  id="selected_city"
                  options={cities}
                  value={selected_city}
                  onInputChange={(e) => setFindCity(e)}
                  onChange={(e) => {
                    if (e) setCity(e)
                  }} />
            </Stack>
          }
          <Stack spacing={2} alignItems="center">
            <Button
              variant="contained"
              color="primary"
              component="span"
              onClick={() => handleButtonClick(show_register && 'register' || "login")}
            >
              {show_register && "Register" || "Login"}
            </Button>
            <Button
              variant="text"
              onClick={() => switchLoginRegister(!show_register)}
            >
              {show_register && "Switch to Login" || "Switch to Register"}
            </Button>
          </Stack>
        </Stack>
        { showAlert &&
          <Stack width={300}>
            <Alert
                severity="warning"
                action={
                  <Button color="inherit" size="small" onClick={() => setShowAlert(false)}>
                    CLOSE
                  </Button>
                }
            >
              Something went wrong.
            </Alert>
          </Stack>
        }
      </Stack>
    </CookiesProvider>
  )
}
