
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

/**
 * EmailProvider
**/
const EmailProvider = ({ children, ...props }) => {

  /* ctx */

  const apiRouter = useApiRouter()

  const { jwtToken } = useContext(AppCtx)

  /* state */

  const [ emailFilterModalOpen, setEmailFilterModalOpen ] = useState(false)
  const [ emailTemplatesList, setEmailTemplatesList ] = useState([])
  const [ emailActionsList, setEmailActionsList ] = useState([])

  /* effects */

  useEffect(() => {
    if (!jwtToken) return
    fetch(apiRouter.emailActionTemplatesPath()).then(r => r.json()).then(inns => {
      logg(inns, "I can has email actions?")
      setEmailActionsList(inns.email_action_templates)
    })
  }, [ jwtToken ] )

  useEffect(() => {
    if (!jwtToken) return
    fetch(apiRouter.emailTemplatesPath()).then(r => r.json()).then(inns => {
      logg(inns, "I can has email templates?")
      setEmailTemplatesList(inns.email_templates)
    })
  }, [ jwtToken ] )

  /* methods */



  return <EmailCtx.Provider value={{
    emailFilterModalOpen, setEmailFilterModalOpen,
    emailTemplatesList, setEmailTemplatesList,
    emailActionsList, setEmailActionsList,
  }} >
    { children }
  </EmailCtx.Provider>
}

export {
  EmailCtx,
  EmailHomePage,
  EmailProvider,

}

