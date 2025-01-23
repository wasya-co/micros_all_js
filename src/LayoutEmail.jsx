
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBuildingColumns, faCreditCard, faMoon } from '@fortawesome/free-solid-svg-icons'

import Modal from 'react-bootstrap/Modal'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'

import Select from 'react-select'

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
  Outlet,
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
  EmailPage,
} from './pages'

library.add( faBuildingColumns, faCreditCard, faMoon )

/*
 * LayoutEmail
**/
const LayoutEmail = (props) => {
  logg(props, 'LayoutEmail')

  const [ cuEmail, setCuEmail ] = useState('replace-me@TODO')
  const [ drawerOpen, setDrawerOpen ] = useState(C.classes.sidebarIsOpen)
  const [ pageTitle, setPageTitle ] = useState('micros_all_js')


  if (!cuEmail) { return <div>.^.</div> }
  return <div className="Layout LayoutEmail">
    <h5>Email Layout</h5>
    <Outlet />
  </div>
}
export default LayoutEmail
