
import React, { createContext, Fragment as F, useContext, useEffect, useState } from 'react'

import {
  useApiRouter,
  appRouter,
  C,
  logg,
} from '$shared'
import { AppCtx } from "$src/App"
import EmailHomePage from './EmailHomePage'


const actionsList = [
  { label: 'Autorespond Template',     value: 'autorespond-template' },
  { label: 'Execute Ruby',             value: 'exe' },
  { label: 'Schedule Email Action',    value: 'autorespond-email-action' },
  { label: 'Remove Email Action',      value: 'remove-email-action' },
  { label: 'Add Tag',                  value: 'add-tag' },
  { label: 'Remove Tag',               value: 'remove-tag' },
]



const defaultEmailFilter = {
  actions: [],
  conditions: [],
  skip_conditions: [],
}

const EmailCtx = createContext({})

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

const fieldsList = [
  { label: 'body',    isDisabled: true, value: 'body',                },
  { label: 'exe',     isDisabled: true, value: 'exe', operator: 'textarea' },
  { label: 'from',    isDisabled: true, value: 'from' },
  { label: 'leadset',                   value: 'leadset' },
  { label: 'subject', isDisabled: true, value: 'subject' },
  { label: 'to',                        value: 'to', operator: 'text-input' },
]
const operatorsList = [
  { label: 'is',              value: 'equals',      },
  // { label: 'is',              value: 'leadset',      },
  { label: 'has tag',         value: 'has-tag',     },
  { label: 'doesnt have tag', value: 'not-has-tag', },
]

export {
  actionsList,

  defaultEmailFilter,

  EmailCtx,
  EmailHomePage,
  EmailProvider,

  fieldsList,
  operatorsList,
}

