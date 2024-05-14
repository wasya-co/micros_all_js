
import React, { Fragment as F, useEffect, useLayoutEffect, useState } from 'react'

import {
  apiRouter,
  appRouter,
  logg,
} from '$shared'

/**
 * StocksIndex
**/
const StocksIndex = (props) => {
  logg(props, 'StocksIndex')

  const [ stocksList, setStocksList ] = useState([])

  useLayoutEffect(() => {
    logg(null, 'useLayoutEffect in StocksIndex')

    apiRouter.getStocks().then(inns => {
      setStocksList(inns)
    })
  }, [])

  return <F>
    <header>
      <div className='title'>Stocks</div>
    </header>

  </F>
}
export default StocksIndex
