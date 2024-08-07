
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
import { ReactKeycloakProvider } from '@react-keycloak/web'

// import keycloak from './keycloak'

import {
  logg,
} from '$shared'

import LayoutSide from './LayoutSide'

import C from 'config'

const AppCtx = createContext({})

/**
 * App
**/
function App() {
  // logg('App')

  let keycloak = new Keycloak({
    url: C.keycloak_url,
    realm: C.keycloak_realm,
    clientId: C.keycloak_client_id,
    onLoad: 'check-sso',
  })
  const [authenticated, setAuthenticated] = useState()

  return (<ReactKeycloakProvider authClient={keycloak} >
    <div className="App">
      <LayoutSide />
    </div>
  </ReactKeycloakProvider>);
}

export default App
export {
  AppCtx
}

