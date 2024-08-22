
import React, {
  Fragment as F,
  useContext, useEffect, useLayoutEffect, useState,
} from 'react'
import { Link } from "react-router-dom"
import { useKeycloak } from '@react-keycloak/web'

import {
  AppCtx,
} from '$src/App'
import {
  TradingCtx,
} from '$src/LayoutTrading'
import {
  useApiRouter,
  appRouter,
  logg,
} from '$shared'

/**
 * StocksIndex
**/
const StocksIndex = (props) => {
  logg(props, 'StocksIndex')

  const apiRouter = useApiRouter()

  const { setPageTitle } = useContext(AppCtx)
  // logg(useContext(AppContext), 'appCtx')

  const {
    stocksList,
  } = useContext(TradingCtx)

  useEffect(() => {
    setPageTitle('Stocks')
  }, [])

  return <F>
    <header>
      <ul>
        { stocksList.map((stock, idx) => <F key={idx} >
          <Link to={appRouter.stocksShow(stock)}><li>{ stock.ticker }</li></Link>
        </F> )}
      </ul>
    </header>

  </F>
}
export default StocksIndex
