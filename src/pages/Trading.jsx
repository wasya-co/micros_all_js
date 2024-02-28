
import axios from 'axios'
import {
  CartesianGrid,
  Legend, LineChart, Line,
  XAxis,
  YAxis,
  Tooltip, ResponsiveContainer,
} from 'recharts'
import React, { Fragment as F, useEffect, useState } from 'react'
import { useKeycloak } from '@react-keycloak/web'
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import {
  logg,
} from '$shared'

const Trading = (props) => {
  // logg(props, 'Trading')

  const [ ticker, setTicker ] = useState('')
  const [ data, setData ] = useState([])
  const [ period, setPeriod ] = useState()

  const { keycloak, initialized } = useKeycloak()
  // logg(keycloak, 'keycloak')

  const handleClick = (props) => {
    logg(props, 'handleClick')
    const tickerUrl = `http://email.local:3004/trading/api/stocks/GME/period/${period}.json?jwt_token=${keycloak.token}`
    axios.get(tickerUrl).then(out => {
      logg(out, 'data')
      setData(out.data)
    })
  }

  return <F>
    <header>
      Ticker
      <input value={ticker} onChange={(e) => setTicker(e.target.value) } />
      Period
      <Select value={period} onChange={(e) => setPeriod(e.target.value)} >
        <MenuItem value="1-mo">1-mo</MenuItem>
        <MenuItem value="3-mo">3-mo</MenuItem>
        <MenuItem value="1-yr">1-yr</MenuItem>
      </Select>
      <button onClick={handleClick} >&gt;</button>
    </header>

    <LineChart width={900} height={600} data={data}>
      <XAxis dataKey="date" />
      <YAxis/>
      <CartesianGrid stroke="#eee" strokeDasharray="5 5"/>
      <Line type="monotone" dataKey="close" stroke="#8884d8" />
    </LineChart>

  </F>
}
export default Trading
