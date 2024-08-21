
import React, { Fragment as F, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import {
  appRouter,
  logg,
} from '$shared'

const EmailPage = () => {
  return <F>
    <p>Email home.</p>
    <ul>
      <li><Link to={appRouter.emailContextsSummaryPath()} >email contexts summary</Link></li>
    </ul>
  </F>
}
export default EmailPage
