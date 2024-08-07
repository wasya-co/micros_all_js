
import moment from 'moment'
import React, { Fragment as F, useEffect, useState } from 'react'
import {Collapse} from 'react-collapse'
import { useKeycloak } from '@react-keycloak/web'
import {
  Button,
  TextField,
} from '@mui/material'
import Select from 'react-select'
import {
  Link,
  useParams,
} from "react-router-dom"

import config from 'config'
import {
  useApiRouter,
  logg,
} from '$shared'

const sitesOpts = [
  { value: 7, label: 'DemmiTV' },

  { value: 3, label: 'piousbox.com Wordpress' },
  { value: 8, label: 'piousbox.com Drupal' },

  { value: 5, label: 'Infinite Shelter' },

  { value: 2, label: 'wasya.co Wordpress' },
  { value: 6, label: 'wasya.co Drupal' },
]

/**
 * Analytics
**/
const Analytics = (props) => {
  // logg(props, 'Analytics')

  const apiRouter = useApiRouter()

  const [ isOpened, setIsOpened ] = useState({})
  const [ cuEmail, setCuEmail ] = useState()

  const [ selectedSiteIds, setSelectedSiteIds ]   = useState([])
  const [ beginOn, setBeginOn ] = useState(moment().format('YYYY-MM-DD'))
  const [ endOn, setEndOn ]     = useState(moment().format('YYYY-MM-DD'))

  const [ analyticsToken, setAnalyticsToken ] = useState()
  const [ jwtToken, setJwtToken ] = useState()
  const [ data, setData ] = useState([])

  const { keycloak, initialized } = useKeycloak()
  logg(keycloak, 'keycloak')

  /* keycloak */
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

  const loadLeadsReport = () => {
    if (!analyticsToken) return

    let hash = {
      idSite:   selectedSiteIds.join(','),
      expanded: 1,
      token_auth: analyticsToken,
      module: 'API',
      format: 'JSON',
      period: 'range',
      date:   `${beginOn},${endOn}`,
      method: 'Live.getLastVisitsDetails',
      filter_limit: '-1',
    }
    logg(hash, 'hash')

    const days = {}
    const userIds = []
    fetch(`https://analytics.wasya.co/index.php?${new URLSearchParams(hash).toString()}`).then(r => r.json()).then(_data => {
      logg(_data, 'data')

      _data.map((action) => {
        if (action.referrerName == "") {
          action.referrerName = null
        }
        const referrerName = action.referrerName
        const userId = action.userId
        if (userId) {
          userIds.push(userId)
        }

        action.actionDetails.map((d) => {
          const date = new Date(d.timestamp*1000).toISOString().substr(0,10)
          if (!days[date]) {
            days[date] = {
              campaigns: {},
              users: {},
            }
          }
          if (!days[date].users[userId]) {
            days[date].users[userId] = []
          }
          if (!days[date].campaigns[referrerName]) {
            days[date].campaigns[referrerName] = { users: {} }
          }
          if (!days[date].campaigns[referrerName].users[userId]) {
            days[date].campaigns[referrerName].users[userId] = []
          }

          /* by-user */
          days[date].users[userId].push({
            dateTime: new Date(d.timestamp*1000),
            url: d.url,
          })

          /* by-referrer */
          days[date].campaigns[referrerName].users[userId].push({
            dateTime: new Date(d.timestamp*1000),
            url: d.url,
          })

        })
      })
      // logg(days, 'days')

      const hash2 = new URLSearchParams({
        jwt_token: jwtToken,
        lead_ids: userIds.join(','),
      })
      fetch(apiRouter.leadsIndexHashPath(hash2)).then(r => r.json()).then(users => {
        // logg(users, 'users')

        const days_ = []
        for (let [date, _day] of Object.entries(days)) {
          const day = { date: date, campaigns: [], users: [] }

          for (let [referrerName, _campaign] of Object.entries(_day.campaigns)) {
            const campaign = { referrerName: referrerName, users: [] }
            logg(_campaign, '_campaign')

            if (_campaign.users) {
              for (let [userId, _user] of Object.entries(_campaign.users)) {
                const user = { userId: userId, visits: _user }
                if (userId && userId !== 'null') {
                  user.email = users[userId].email
                }
                campaign.users.push(user)
              }
            }

            day.campaigns.push(campaign)
          }

          for (let [userId, _user] of Object.entries(_day.users)) {
            const user = { userId: userId, visits: _user }
            if (userId && userId !== 'null') {
              user.email = users[userId].email
            }
            day.users.push(user)
          }

          days_.push(day)
        }
        logg(days_, 'days_')

        setData(days_)
      })
    })
  }

  return <F>
    <div className='d-flex'>
      <Select
        className="w-500"
        isMulti
        options={sitesOpts}
      />
      <TextField label="Begin" value={beginOn} onChange={(ev) => setBeginOn(ev.target.value)} />
      <TextField label="End"   value={endOn}   onChange={(ev) => setEndOn(ev.target.value)} />
      <Button variant="outlined" onClick={loadLeadsReport} >Leads</Button>
    </div>
    {/* <Button variant="outlined" onClick={loadCampaignsReport} >Campaigns</Button> */}

    <ul>
      {data.map((day) => <F>
        <li>
          <b onClick={() => {
            isOpened[`d-${day.date.toString()}`] = !isOpened[`d-${day.date.toString()}`]
            setIsOpened({ ...isOpened })
          } } >{day.date.toString()}</b>
          <Collapse isOpened={isOpened[`d-${day.date.toString()}`]} >
            <h4>Campaigns</h4>
            <ul>
              {day.campaigns.map((campaign) => <F>
                <li>
                  <b onClick={() => {
                    isOpened[`c-${campaign.referrerName}`] = !isOpened[`c-${campaign.referrerName}`]
                    setIsOpened({ ...isOpened })
                  } } >{campaign.referrerName} ({campaign.users.length})</b>
                  <Collapse isOpened={isOpened[`c-${campaign.referrerName}`]} ><ul>
                    {campaign.users.map((user) => <F>
                      <li>
                        <b onClick={() => {
                          isOpened[`c-u-${user.userId}`] = !isOpened[`c-u-${user.userId}`]
                          setIsOpened({ ...isOpened })
                        } }>{user.userId} - {user.email} ({user.visits.length})</b>
                        <Collapse isOpened={isOpened[`c-u-${user.userId}`]} ><ul>
                          {user.visits.map((visit) => <F>
                            <li>
                              {visit.url}
                            </li>
                          </F>)}
                          </ul></Collapse>
                      </li>
                    </F>)}
                  </ul></Collapse>
                </li>
              </F>)}
            </ul>

            <h4>Users</h4>
            <ul>
              {day.users.map((user) => <F>
                <li>
                  <b onClick={() => {
                    isOpened[`u-${user.userId}`] = !isOpened[`u-${user.userId}`]
                    setIsOpened({ ...isOpened })
                  } }>{user.userId} - {user.email} ({user.visits.length})</b>
                  <Collapse isOpened={isOpened[`u-${user.userId}`]} ><ul>
                    {user.visits.map((visit) => <F>
                      <li>
                        {visit.url}
                      </li>
                    </F>)}
                  </ul></Collapse>
                </li>
              </F>)}
            </ul>
          </Collapse>
        </li>
      </F>)}
    </ul>

  </F>
}
export default Analytics
