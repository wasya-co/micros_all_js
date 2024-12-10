
import React, { Fragment as F, useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import {
  appRouter,
  logg,
} from '$shared'
import {
  EmailCtx,
} from '$src/components/email'

/*
 * EmailHomePage
**/
const EmailHomePage = () => {

  const {
    emailFilterModalOpen, setEmailFilterModalOpen,
  } = useContext(EmailCtx)
  logg(useContext(EmailCtx), 'EmailCtx in EmailPage')

  return <F>
    <p>Email home.</p>
    <ul>
      <li><b>email contexts</b>&nbsp;
        <Link to={appRouter.emailContextsSummaryPath()} >[summary]</Link>
      </li>
      <li className='d-flex' >
        <Link to={appRouter.emailFiltersPath()}>Email Filters</Link>&nbsp;
        {/* <Link to={appRouter.newEmailFilterPath()} >[+]</Link> */}
        <div className='btn' onClick={() => setEmailFilterModalOpen(true)}>[+]</div>
      </li>
    </ul>
  </F>
}
export default EmailHomePage
