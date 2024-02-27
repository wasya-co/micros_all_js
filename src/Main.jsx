
import { useKeycloak } from '@react-keycloak/web'
import React, { Fragment as F, useEffect, useState } from 'react'

import {
  logg,
} from './shared'

const Main = (props) => {
  logg(props, 'Main')

  const [ cuEmail, setCuEmail ] = useState()

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
        //


  }, [ initialized, keycloak ])

  useEffect(() => {
    if (!analyticsToken) return

    fetch(`https://analytics-fedfis.wasya.co/index.php?module=API&format=JSON&idSite=1&period=year&method=Live.getLastVisitsDetails&filter_limit=-1&expanded=1&token_auth=${analyticsToken}`).then(r => r.json()).then(data => {
      logg(data, 'data')
      setInns(data)
    })
  }, [ analyticsToken ])

  return (<F>
    <h1>
      Main for {cuEmail}
    </h1>
    { inns.map(visit => <div>
        <h5>{visit.userId} visited on {visit.serverDate}</h5>
        { visit.actionDetails.map(action =>
            action.eventAction && <div>
              {action.eventCategory}/{action.eventAction} ::&nbsp;
              {action.eventName}
          </div>) }
      </div>)}
  </F>)
}
export default Main