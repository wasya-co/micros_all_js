
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBuildingColumns, faCreditCard, faMoon } from '@fortawesome/free-solid-svg-icons'

import Modal from 'react-bootstrap/Modal'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'

import styled from '@emotion/styled'
import React, {
  createContext,
  Fragment as F,
  useContext, useEffect, useLayoutEffect, useState,
} from 'react'
import { useKeycloak } from '@react-keycloak/web'
import {
  Link,
  BrowserRouter as Router,
  Route,
  Routes,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"
import _AppBar from '@mui/material/AppBar'
import AccountIcon from '@mui/icons-material/Person'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import InboxIcon from '@mui/icons-material/MoveToInbox'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import MailIcon from '@mui/icons-material/Mail'
import MenuIcon from '@mui/icons-material/Menu'
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'

import config from 'config'

import {
  AppCtx,
} from './App'
import {
  appRouter,
  C,
  logg,
} from './shared'

import {
  StocksIndex,
  StocksShow,
} from './components/stocks'

import {
  Analytics,
  Home,
  Email,
  Trading,
} from './pages'

library.add( faBuildingColumns, faCreditCard, faMoon )


const LayoutMain = (props) => {
  // logg(props, 'MainSidedrawer')

  const [ cuEmail, setCuEmail ] = useState('replace-me@TODO')
  const [ drawerOpen, setDrawerOpen ] = useState(C.classes.sidebarIsOpen)
  const [ pageTitle, setPageTitle ] = useState('micros_all_js')

  const { keycloak, initialized } = useKeycloak()
  // logg(useKeycloak(), 'useKeycloak')

  useLayoutEffect(() => {
    if (!config.skip_keycloak) {
      if (initialized) {
        if (!keycloak.idTokenParsed) {
          keycloak.login()
        }
      }
      if (keycloak.idTokenParsed) {
        localStorage.setItem('jwt_token', keycloak.idToken)
        setCuEmail(keycloak.idTokenParsed.email)
      }
    }
  }, [ initialized ])

  const [ showUserAcctModal, setShowUserAcctModal ] = useState(false)

  const loginSchwab = () => {
    window.location = `https://api.schwabapi.com/v1/oauth/authorize?client_id=${config.schwab_key}&redirect_uri=${config.schwab_redirect_url}`
  }

  if (!cuEmail) { return <div>.^.</div> }
  return <Router>
    <AppCtx.Provider value={{ pageTitle, setPageTitle, }} >
    <div className="MainW">
      <div className={`Sidebar ${drawerOpen}`} >
        <header>
          <Link to="/">
            <div className="LogoW">
              <img className='Logo' src="/assets/images/200x200-fedfis-logo-dark.png" />
            </div>
          </Link>

        </header>

        <ul>
          <li>
            <b className='label'>Trading</b>
            <ul>
              <Link to={appRouter.stocksPath()} ><li>Stocks</li></Link>
              <Link to="@TODO" ><li>Alerts</li></Link>
              <Link to="@TODO" ><li>Strategies</li></Link>
              <Link to="@TODO" ><li>Purses</li></Link>
            </ul>
          </li>
          <li>
            <b className='label'>Analytics</b>
            <ul>
              <Link to="@TODO" ><li>Custom Report</li></Link>
            </ul>
          </li>
          <li>
            <b className='label'>Email</b>
            <ul>
              <Link to="@TODO" ><li>Inbox</li></Link>
              <Link to="@TODO" ><li>Not Inbox</li></Link>
              <Link to="@TODO" ><li>Trash</li></Link>
              <Link to="@TODO" ><li>Spam</li></Link>
              <Link to="@TODO" ><li>Sent</li></Link>
              <Link to="@TODO" ><li>Summary</li></Link>
            </ul>
          </li>
          <li>
            <b className='label'>CRM</b>
            <ul>
              <Link to="@TODO" ><li>Leadsets</li></Link>
              <Link to="@TODO" ><li>Leads</li></Link>
              <Link to="@TODO" ><li>Office Actions</li></Link>
              <Link to="@TODO" ><li>Office Action Templates</li></Link>
              <Link to="@TODO" ><li>Email Actions</li></Link>
              <Link to="@TODO" ><li>Email Action Templates</li></Link>
            </ul>
          </li>
        </ul>

      </div>{/* end Sidebar */}
      <div className="Main">

        <header className="MainHeader">
          <div className="left">
            <MenuIcon onClick={() => setDrawerOpen(drawerOpen === C.classes.sidebarIsOpen ? C.classes.sidebarIsClosed : C.classes.sidebarIsOpen) } />
            { pageTitle }
          </div>
          <div className="right relative">
            <Switch inputProps={{ 'aria-label': 'Change Theme' }} />
            <FontAwesomeIcon
              icon="fa-solid fa-moon"
              style={{ fontSize: '1.5em', }}
            />
            &nbsp; &nbsp; &nbsp;
            <IconButton onClick={() => setShowUserAcctModal(!showUserAcctModal)} ><AccountIcon sx={{ fontSize: '1.5em' }} /></IconButton>
            <div className={`userAccountMini ${showUserAcctModal ? 'show' : 'hide' }`}>
              <div className='d-flex flex-column'>
                { cuEmail }
                <div>[jwt]</div>
                <div className='Btn'>Logout</div>
                <div className='' onClick={loginSchwab} >Login to Schwab</div>
              </div>
            </div>

          </div>
        </header>

        <div className="MainC">
          <Routes>
            <Route path="/" exact element={<Home />} />
            <Route path="/analytics" exact element={<Analytics />} />
            <Route path={appRouter.emailInboxRoute} exact element={<Email />} />
            <Route path="/trading" exact element={<Trading />} />
            <Route path={appRouter.stocksRoute} exact element={<StocksIndex />} />
            <Route path={appRouter.stockRoute} exact element={<StocksShow />} />
          </Routes>
        </div>

      </div>{/* end MainC */}
    </div>{/* end MainW */}
    </AppCtx.Provider>
  </Router>
}
export default LayoutMain
