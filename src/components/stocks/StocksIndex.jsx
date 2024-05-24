
import React, {
  Fragment as F,
  useContext, useEffect, useLayoutEffect, useState,
} from 'react'
import { Link } from "react-router-dom"
import { useKeycloak } from '@react-keycloak/web'

import {
  AppContext,
  apiRouter,
  appRouter,
  logg,
} from '$shared'

/**
 * StocksIndex
**/
const StocksIndex = (props) => {
  logg(props, 'StocksIndex')

  const { setPageTitle } = useContext(AppContext)
  // logg(useContext(AppContext), 'appCtx')

  const [ stocksList, setStocksList ] = useState([])

  useEffect(() => {
    // logg('useLayoutEffect in StocksIndex')

    setPageTitle('Stocks')

    apiRouter.getStocks().then(inns => {
      // logg(inns, 'got stocks')
      setStocksList(inns)
    })
  }, [])



  // const { keycloak, initialized } = useKeycloak()
  // logg(useKeycloak(), 'useKeycloak')

  return <F>
    <header>
      <ul>
        { stocksList.map((stock) => <F>
          <Link to={appRouter.stockPath(stock)}><li>{ stock.ticker }</li></Link>
        </F> )}
      </ul>
    </header>

  </F>
}
export default StocksIndex
