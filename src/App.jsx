
/**
 *
 * From: https://www.keycloak.org/docs/latest/securing_apps/index.html#_javascript_adapter
 *  skip.
 * From: https://www.npmjs.com/package/@react-keycloak/web
 *   2024-02-05 :: Let's try again
 *
**/

import Keycloak from 'keycloak-js'
import React, { createContext,
  Fragment as F,
  useEffect, useLayoutEffect, useState,
} from 'react'
import { ReactKeycloakProvider, useKeycloak } from '@react-keycloak/web'

// import keycloak from './keycloak'

import {
  C,
  logg,
  useApiRouter,
} from '$shared'

import {
  EmailProvider,
} from '$src/components/email'

import LayoutMain from './LayoutMain'

import config from 'config'

const AppCtx = createContext({})

/**
 * AppProvider
**/
const AppProvider = ({ children, ...props }) => {

  const apiRouter = useApiRouter()

  const { keycloak, initialized } = useKeycloak()

  const [ actionName, setActionName ] = useState(null)
  const [ cuEmail, setCuEmail ] = useState( null )
  const [ drawerOpen, setDrawerOpen ] = useState(C.classes.sidebarIsOpen)
  const [ jwtToken, setJwtToken ] = useState(null)
  const [ pageTitle, setPageTitle ] = useState('default Page Title')
  const [ params, setParams ] = useState({})
  const [ sidebarContent, setSidebarContent ] = useState(null)
  const [ tagsList, setTagsList ] = useState([])

  const [ loading, _setLoading ] = useState(0)
  const setLoading = (which, prev) => {
    if (which) {
      _setLoading(prev => prev + 1)
    } else {
      _setLoading(prev => prev - 1)
    }
  }

  useEffect(() => {
    if (config.skip_keycloak) {
      setCuEmail('skipped-keycloak@example.com')
      return
    }
    if (initialized) {
      if (!keycloak.idTokenParsed) {
        keycloak.login()
      }
    }
    if (keycloak.idTokenParsed) {
      // logg(keycloak, 'parsed Keycloak')
      // logg(keycloak.idToken, 'parsed Keycloak idToken')

      setJwtToken(keycloak.idToken)
      setCuEmail(keycloak.idTokenParsed.email)
    }
  }, [ initialized ])

  useEffect(() => {
    if (jwtToken) {
      fetch(apiRouter.tagsPath({ jwtToken, })).then(r => r.json()).then(inns => {
        logg(inns, 'got tags')
        setTagsList(inns.tags)
      })
    }
  }, [ jwtToken ])

  return <AppCtx.Provider value={{
    actionName, setActionName,
    cuEmail, setCuEmail,
    drawerOpen, setDrawerOpen,
    jwtToken, setJwtToken,
    loading, setLoading,
    pageTitle, setPageTitle,
    params, setParams,
    sidebarContent, setSidebarContent,
    tagsList, setTagsList,
  }} >
    { children }
  </AppCtx.Provider>
}

/**
 * App
**/
function App() {
  // logg('App')

  let keycloak = new Keycloak({
    url:      config.keycloak_url,
    realm:    config.keycloak_realm,
    clientId: config.keycloak_client_id,
    onLoad:  'check-sso',
  })
  const [authenticated, setAuthenticated] = useState()

  return (<ReactKeycloakProvider authClient={keycloak} >
    <AppProvider >
      <EmailProvider >
        <div className="App">
          <LayoutMain />
        </div>
      </EmailProvider>
    </AppProvider>
  </ReactKeycloakProvider>);
}

export default App
export {
  AppCtx,
}

