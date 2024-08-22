
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
} from "react-router-dom"
import _AppBar from '@mui/material/AppBar'

import config from 'config'

import {
  AppCtx,
} from './App'
import {
  appRouter,
  C,
  logg,
  useApiRouter,
} from './shared'

import {
  StocksIndex,
  StocksShow,
} from './components/stocks'

import {
  TradingPage,
} from './pages'

library.add( faBuildingColumns, faCreditCard, faMoon )

const TradingCtx = createContext({})

/*
 * LayoutTrading
**/
const LayoutTrading = (props) => {
  logg(props, 'LayoutTrading')

  const apiRouter = useApiRouter()

  const {
    cuEmail,
    setSidebarContent,
  } = useContext(AppCtx)
  logg(useContext(AppCtx), 'useContext(AppCtx) in LayoutTrading')

  const [ stocksList, setStocksList ] = useState([])
  useEffect(() => {
    apiRouter.getStocks().then(inns => {
      // logg(inns, 'got stocks')
      setStocksList(inns)
    })
  }, [])

  const loginSchwab = () => {
    window.location = `https://api.schwabapi.com/v1/oauth/authorize?client_id=${config.schwab_key}&redirect_uri=${config.schwab_redirect_url}`
  }

  /* infinite loop?! */
  // const sidebarContent = <F>
  //   <div className='' onClick={loginSchwab} >Login to Schwab</div>
  // </F>
  // setSidebarContent(sidebarContent)

  if (!cuEmail) { return <div>.^.</div> }
  return <div className="Layout LayoutTrading">
    <TradingCtx.Provider value={{
      stocksList, setStocksList,
    }} >
      <Outlet />
    </TradingCtx.Provider>
  </div>
}
export default LayoutTrading
export {
  TradingCtx,
}
