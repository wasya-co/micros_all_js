
import react, { Fragment as F, useEffect, useState } from 'react'

import {
  Bar, BarChart,
  CartesianGrid,
  Legend, LineChart, Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import {
  logg,
  useApiRouter,
} from '$shared'

const EmailContextsSummary = (props) => {
  logg(props, 'EmailContextsSummary')

  const apiRouter = useApiRouter()

  const [ datapoints, setDatapoints ] = useState([])

  useEffect(() => {
    apiRouter.getEmailContextsSummary().then(inns => {
      logg(inns, 'inns')
      setDatapoints(inns.datapoints)
    })
  }, [] )

  return <F>
    Email Contexts Summary.

    <LineChart width={900} height={600} data={datapoints}>
      <XAxis dataKey="date" />
      <YAxis/>
      <CartesianGrid stroke="#333" strokeDasharray="5 5"/>
      <Line type="monotone" dataKey="value" stroke="#8884d8" />
    </LineChart>

  </F>
}
export default EmailContextsSummary