

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
import MailIcon from '@mui/icons-material/Mail';

import React, { Fragment as F, useEffect, useState } from 'react'
import { useKeycloak } from '@react-keycloak/web'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


import {
  logg,
} from './shared'

const Home = () => {
  logg('home')
  return <h1>Home</h1>
}
const Inbox = () => {
  return <h1>Inbox</h1>
}

const Main = (props) => {
  logg(props, 'Main')

  const [ cuEmail, setCuEmail ] = useState()
  const [ drawerOpen, setDrawerOpen ] = useState(false)

  const [ inns, setInns ] = useState([])
  const [ analyticsToken, setAnalyticsToken ] = useState()

  const { keycloak, initialized } = useKeycloak()


  logg(keycloak, 'keycloak')
  logg(initialized, 'initialized')

  useEffect(() => {
    if (initialized) {
      if (!keycloak.idTokenParsed) {
        keycloak.login()
      }
    }
    if (keycloak.idTokenParsed) {
      logg(keycloak.idTokenParsed.email, 'hm?')
      setCuEmail(keycloak.idTokenParsed.email)
      setAnalyticsToken(keycloak.idTokenParsed.analytics_token)
    }
  }, [ initialized, keycloak ])

  useEffect(() => {
    if (!analyticsToken) return

    fetch(`https://analytics-fedfis.wasya.co/index.php?module=API&format=JSON&idSite=1&period=year&method=Live.getLastVisitsDetails&filter_limit=-1&expanded=1&token_auth=${analyticsToken}`).then(r => r.json()).then(data => {
      logg(data, 'data')
      setInns(data)
    })
  }, [ analyticsToken ])

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

        </List>
        <Divider />
        <List>
          {['All mail', 'Trash', 'Spam'].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
    <h1>
      Main for {cuEmail}
    </h1>
    <Button onClick={() => setDrawerOpen(true)}>Open drawer</Button>
    <Router>
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/inbox" exact element={<Inbox />} />
      </Routes>
    </Router>
  </F>)
}
export default Main