
import { useKeycloak } from '@react-keycloak/web'
import React, { Fragment as F, useEffect, useState } from 'react'
import {
  Button,
  TextField,
} from '@mui/material';

import config from 'config'
import {
  logg,
} from '$shared'

const ApiRouter = {
  leadsIndexHashPath: (hash) => `${config.apiOrigin}/wco/api/leads/index_hash.json?${hash.toString()}`,
}

const Analytics = (props) => {
  // logg(props, 'Analytics')

  const [ cuEmail, setCuEmail ] = useState()
  const [ beginOn, setBeginOn ] = useState('2024-03-07')
  const [ endOn, setEndOn ] = useState('2024-03-07')
  const [ analyticsToken, setAnalyticsToken ] = useState()
  const [ jwtToken, setJwtToken ] = useState()
  const [ data, setData ] = useState([])

  const { keycloak, initialized } = useKeycloak()
  logg(keycloak, 'keycloak')

  useEffect(() => {
    if (initialized) {
      if (!keycloak.idTokenParsed) {
        keycloak.login()
      }
    }
    if (keycloak.idTokenParsed) {
      setCuEmail(keycloak.idTokenParsed.email)
      setAnalyticsToken(keycloak.idTokenParsed.analytics_token)
      setJwtToken(keycloak.token)
    }
  }, [ initialized, keycloak ])

  const doLoad = () => {
    if (!analyticsToken) return

    let hash = new URLSearchParams({
      idSite:   6,
      expanded: 1,
      token_auth: analyticsToken,
      module: 'API',
      format: 'JSON',
      period: 'range',
      date:   `${beginOn},${endOn}`,
      method: 'Live.getLastVisitsDetails',
      filter_limit: '-1',
    })

    const _data = {}
    const _userIds = []
    fetch(`https://analytics.wasya.co/index.php?${hash.toString()}`).then(r => r.json()).then(data => {
      // logg(data, 'data')

      data.map((action) => {
        const userId = action.userId
        if (userId) {
          _userIds.push(userId)
        }
        action.actionDetails.map((d) => {
          const date = new Date(d.timestamp*1000).toISOString().substr(0,10)
          if (!_data[date])              _data[date] = {}
          if (!_data[date][userId])      _data[date][userId] = []

          _data[date][userId].push({
            dateTime: new Date(d.timestamp*1000),
            url: d.url,
          })
        })
      })
      // logg(_data, '_data')

      const hash2 = new URLSearchParams({
        jwt_token: jwtToken,
        lead_ids: _userIds.join(','),
      })
      fetch(ApiRouter.leadsIndexHashPath(hash2)).then(r => r.json()).then(users => {
        // logg(users, 'users')

        const days = []
        for (let [date, _day] of Object.entries(_data)) {
          const day = { date: date, users: [] }
          for (let [userId, _user] of Object.entries(_day)) {
            // logg(userId, 'userId')

            const user = { userId: userId, visits: _user }
            if (userId && userId !== 'null') {
              user.email = users[userId].email
            }
            day.users.push(user)
          }
          days.push(day)
        }
        // logg(days, 'days')

        setData(days)
      })
    })
  }

  return <F>

    <TextField label="Begin" value={beginOn} onChange={(ev) => setBeginOn(ev.target.value)} />
    <TextField label="End"   value={endOn}   onChange={(ev) => setEndOn(ev.target.value)} />
    <Button variant="outlined" onClick={doLoad} >Go</Button>

    <ul>
      {data.map((day) => <F>
        <li>
          <b>{day.date.toString()}</b>
          <ul>
            {day.users.map((user) => <F>
              <li>
                <b>{user.userId} - {user.email}</b>
                <ul>
                  {user.visits.map((visit) => <F>
                    <li>
                      {/* <b>{`${visit.dateTime}`}</b><br /> */}
                      {visit.url}
                    </li>
                  </F>)}
                </ul>
              </li>
            </F>)}
          </ul>
        </li>
      </F>)}
    </ul>

  </F>
}
export default Analytics
