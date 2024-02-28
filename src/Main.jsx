

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import LinkIcon from '@mui/icons-material/Link'
import MailIcon from '@mui/icons-material/Mail'
import MenuIcon from '@mui/icons-material/Menu'

import React, { Fragment as F, useEffect, useState } from 'react'
import { useKeycloak } from '@react-keycloak/web'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


import Inbox from './pages/Inbox'
import Trading from './pages/Trading'
import {
  logg,
} from '$shared'

const Home = () => {
  // logg('home')
  return <h1>Home</h1>
}

const Main = (props) => {
  // logg(props, 'Main')

  const [ cuEmail, setCuEmail ] = useState()
  const [ drawerOpen, setDrawerOpen ] = useState(false)

  const [ inns, setInns ] = useState([])
  const [ analyticsToken, setAnalyticsToken ] = useState()

  const { keycloak, initialized } = useKeycloak()

  // logg(keycloak, 'keycloak')
  /* keycloak.token */

  useEffect(() => {
    if (initialized) {
      if (!keycloak.idTokenParsed) {
        keycloak.login()
      }
    }
    if (keycloak.idTokenParsed) {
      setCuEmail(keycloak.idTokenParsed.email)
      setAnalyticsToken(keycloak.idTokenParsed.analytics_token)
    }
  }, [ initialized, keycloak ])

  return (<F>
    <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} >
      <Box sx={{ width: 250 }} role="presentation">
        <List>

          <ListItem key='Inbox' disablePadding>
            <ListItemButton href="/inbox" >
              <ListItemIcon>
                <MailIcon />
              </ListItemIcon>
              <ListItemText primary='Inbox' />
            </ListItemButton>
          </ListItem>
          <ListItem key='Trading' disablePadding>
            <ListItemButton href="/trading" >
              <ListItemIcon>
                <LinkIcon />
              </ListItemIcon>
              <ListItemText primary='Trading' />
            </ListItemButton>
          </ListItem>

        </List>
        <Divider />
        <List>
          <ListItem key='cu' >
            {cuEmail || '<no user>'}
          </ListItem>
        </List>
      </Box>
    </Drawer>

    <Button onClick={() => setDrawerOpen(true)}><MenuIcon /></Button>
    <Router>
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/inbox" exact element={<Inbox />} />
        <Route path="/trading" exact element={<Trading />} />
      </Routes>
    </Router>
  </F>)
}
export default Main