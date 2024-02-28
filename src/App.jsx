
/**
 *
 * From: https://www.keycloak.org/docs/latest/securing_apps/index.html#_javascript_adapter
 *  skip.
 * From: https://www.npmjs.com/package/@react-keycloak/web
 *   2024-02-05 :: Let's try again
 *
**/

import Keycloak from 'keycloak-js'
import React, { Fragment as F, useEffect, useState } from 'react'
import { ReactKeycloakProvider } from '@react-keycloak/web'

// import keycloak from './keycloak'
import {
  logg,
} from '$shared'

import './App.css'
import Main from './Main'

import C from 'config'

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


  useEffect(() => {
    const cb = async () => {
      try {
        const authenticated = await keycloak.init({
            url: 'https://auth.wasya.co',
            realm: 'wco',
            clientId: 'wco',
            // onLoad: 'login-required',
            onLoad: 'check-sso',
          });
        console.log(`User is ${authenticated ? 'authenticated' : 'not authenticated'}`);
        setAuthenticated(authenticated)
      } catch (error) {
        console.error('Failed to initialize adapter:', error);
      }
    }
    cb()
  }, [ keycloak ])

  return (<ReactKeycloakProvider
    authClient={keycloak}
  >
    <div className="App">
      <Main />
    </div>
  </ReactKeycloakProvider>);
}

export default App;
