
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBuildingColumns, faCreditCard, faMoon } from '@fortawesome/free-solid-svg-icons'

import React, {
  createContext,
  Fragment as F,
  useContext, useEffect, useLayoutEffect, useState,
} from 'react'
import { useKeycloak } from '@react-keycloak/web'
import {
  Link,
  Outlet,
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom"
import _AppBar from '@mui/material/AppBar'
import AccountIcon from '@mui/icons-material/Person'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import Switch from '@mui/material/Switch'

import config from 'config'

import LayoutEmail   from './LayoutEmail'
import LayoutTrading from './LayoutTrading'
import {
  AppCtx,
} from './App'
import {
  appRouter,
  C,
  logg,
} from './shared'

/* components */
import {
  ConversationsIndex,
} from './components/conversations'
import {
  EmailContextsSummary,
} from './components/email_contexts'

import {
  StocksIndex,
  StocksShow,
} from './components/stocks'

import {
  AnalyticsPage,
  HomePage,
  EmailPage,
  TradingPage,
} from './pages'

library.add( faBuildingColumns, faCreditCard, faMoon )

/**
 * LayoutMain
**/
const LayoutMain = (props) => {
  logg(props, 'LayoutMain')

  const {
    cuEmail,
    pageTitle,
    sidebarContent,
  } = useContext(AppCtx)

  const [ drawerOpen, setDrawerOpen ] = useState(C.classes.sidebarIsOpen)

  const [ showUserAcctModal, setShowUserAcctModal ] = useState(false)


  if (!cuEmail) { return <div>.^.</div> }
  return <Router>

    <div className="MainW">
      <div className={`Sidebar ${drawerOpen}`} >
        <header>
          <Link to="/">
            <div className="LogoW">
              <img className='Logo' src="/assets/images/200x200-fedfis-logo-dark.png" />
            </div>
          </Link>
        </header>

        { sidebarContent }
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
                <div className='jwt-token'>
                  <div>[jwt_token:{localStorage.getItem('jwt_token')}]</div>
                </div>
                <div className='Btn'>Logout</div>

              </div>
            </div>

          </div>
        </header>

        <div className="MainC">
          <Routes>
            <Route path="/" exact element={<HomePage />} />
            <Route path="/email" element={<LayoutEmail />} >
              <Route path="" exact element={<EmailPage />} />
              <Route path="tags/:tagname" exact element={<ConversationsIndex />} />
              <Route path="contexts/summary" exact element={<EmailContextsSummary />} />
            </Route>
            <Route path="/trading" element={<LayoutTrading />} >
              <Route path="" exact element={<TradingPage />} />
              <Route path={appRouter.stocksIndexRoute} exact element={<StocksIndex />} />
              <Route path="stocks/:ticker" exact element={<StocksShow />} />
            </Route>

            {/* @TODO */}
            <Route path="/analytics" exact element={<AnalyticsPage />} />
            <Route path={appRouter.emailInboxRoute} exact element={<EmailPage />} />

          </Routes>
        </div>

      </div>{/* end MainC */}
    </div>{/* end MainW */}
  </Router>
}
export default LayoutMain
