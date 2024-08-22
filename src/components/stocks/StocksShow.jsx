
import React, {
  Fragment as F,
  useContext, useEffect, useLayoutEffect, useState,
} from 'react'
import Select from 'react-select'
import { Link, useParams } from "react-router-dom"
import { useKeycloak } from '@react-keycloak/web'
import {
  Bar, BarChart,
  LineChart, Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

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
import {
  TradingCtx,
} from '$src/LayoutTrading'


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
  // logg(params, 'StocksShow params')

  const { setPageTitle } = useContext(AppCtx)
  // logg(useContext(AppContext), 'appCtx')

  const {
    stocksList,
  } = useContext(TradingCtx)
  logg(useContext(TradingCtx), 'useContext(TradingCtx) in StocksShow')

  const [ stock, setStock ] = useState({ datapoints: [] })
  const [ maxPain, setMaxPain ] = useState({})

  logg(stocksList, 'list')

  useEffect(() => {

    setPageTitle(<div className='d-flex' >
      Stock&nbsp;
      <Select className='select2'
        styles={C.select2Styles}
        options={stocksList}
        value={stocksList.filter(i=>i.value===params.ticker)}
      />
    </div>)

    apiRouter.getStockMaxPain(params).then(x => {
      // logg(x, 'maxPain')
      setMaxPain(x.max_pain)
    })

  }, [ stocksList ])

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

    <br /><br />

    <section>
      <div className='header'>
        <h2 className='center title'>Max Pain</h2>
      </div>
      { Object.keys(maxPain).map(date => <div key={date} className='row mb-5'>
        <div className='col-md-6'>
          <div className='Chart-v1 chart-max-pain'>

            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ maxPain[date].all } >
                <CartesianGrid />
                <XAxis dataKey="strike" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  type="monotone" dataKey="value" stroke="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
            <br /><br />
          </div>
        </div>
        <div className='col-md-6'>
          <h3>{ date }</h3>
          Max Pain: {maxPain[date].summary.max_pain}
        </div>
      </div> )}
    </section>



  </F>
}
export default StocksShow
