
import React, { createContext, Fragment as F, useContext, useEffect, useState } from 'react'

import {
  useApiRouter,
  appRouter,
  C,
  logg,
} from '$shared'
import { AppCtx } from "$src/App"
import EmailHomePage from './EmailHomePage'

const EmailCtx = createContext({})

const defaultEmailFilter = {
  actions: [],
  conditions: [],
  skip_conditions: [],
}

/**
 * EmailProvider
**/
const EmailProvider = ({ children, ...props }) => {

  /* ctx */

  const apiRouter = useApiRouter()

  const { jwtToken } = useContext(AppCtx)

  /* state */

  const [ emailFilter, setEmailFilter ] = useState(defaultEmailFilter)
  const [ emailFilterModalOpen, setEmailFilterModalOpen ] = useState(false)
  const [ emailFiltersList, setEmailFiltersList ] = useState([])


  const [ emailTemplatesList, setEmailTemplatesList ] = useState([])
  const [ emailActionsList, setEmailActionsList ] = useState([])

  /* effects */

  useEffect(() => {
    if (!jwtToken) return
    fetch(apiRouter.emailActionTemplatesPath()).then(r => r.json()).then(inns => {
      setEmailActionsList(inns.email_action_templates)
    })
  }, [ jwtToken ] )

  useEffect(() => {
    if (!jwtToken) return
    fetch(apiRouter.emailFiltersPath()).then(r => r.json()).then(({ items, }) => {
      setEmailFiltersList(items)
    })
  }, [ jwtToken ] )

  useEffect(() => {
    if (!jwtToken) return
    fetch(apiRouter.emailTemplatesPath()).then(r => r.json()).then(inns => {
      setEmailTemplatesList(inns.items)
    })
  }, [ jwtToken ] )

  /* methods */



  return <EmailCtx.Provider value={{
    emailActionsList, setEmailActionsList,
    emailFilter, setEmailFilter,
    emailFilterModalOpen, setEmailFilterModalOpen,
    emailFiltersList, setEmailFiltersList,
    emailTemplatesList, setEmailTemplatesList,

  }} >
    { children }
  </EmailCtx.Provider>
}

export {
  defaultEmailFilter,

  EmailCtx,
  EmailHomePage,
  EmailProvider,

}

