
import React, {
  Fragment as F,
  useContext, useEffect, useLayoutEffect, useState,
} from 'react'
import Select from 'react-select'
import { Link, useParams } from "react-router-dom"
import { useKeycloak } from '@react-keycloak/web'
import {
  LineChart, Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

import {
  AppCtx,
} from '$src/App'
import {
  useApiRouter,
  appRouter,
  C,
  logg,
  select2Styles,
} from '$shared'


const stocksOptions = [
  { label: '', value: null },
  { label: 'GME',  value: 'GME' },
  { label: 'NVDA', value: 'NVDA' },
]

/**
 * StocksShow
**/
const StocksShow = (props) => {
  logg(props, 'StocksShow')

  const apiRouter = useApiRouter()

  const params = useParams()
  logg(params, 'StocksShow params')

  const { setPageTitle } = useContext(AppCtx)
  // logg(useContext(AppContext), 'appCtx')

  const [ stock, setStock ] = useState({ datapoints: [] })

  useEffect(() => {
    setPageTitle(<div className='d-flex' >
      Stock&nbsp;
      <Select className='select2'
        styles={C.select2Styles}
        options={stocksOptions}
        value={stocksOptions.filter(i=>i.value===params.ticker)}
      />
    </div>)

    apiRouter.getStock(params).then(x => {
      logg(x, 'got stock')
      setStock(x)
    })

  }, [])

  return <F>

    <div className='Chart-v1' >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={stock.datapoints} >
          <CartesianGrid />
          <XAxis dataKey="quote_at" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            dot={false}
            type="monotone" dataKey="value" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>

      <div className='d-flex' >
        <div>1d</div>
        <div>5d</div>
        <div>1mo</div>
        <div>3mo</div>
        <div>6mo</div>
        <div>1yr</div>
        <div>5yr</div>
        <div>all</div>
      </div>

    </div>


  </F>
}
export default StocksShow
