
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter, faInfoCircle, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons'

import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'

import React, { Fragment as F, useContext, useEffect, useRef, useState } from 'react'
import Modal from 'react-modal'
import Select from 'react-select'
import Reorder, { reorder } from 'react-reorder'
import {
  useNavigate,
} from 'react-router'
import {
  Link,
  useParams,
} from "react-router-dom"
import { toast } from 'react-toastify'

import {
  appRouter,
  C,
  logg,
  useApiRouter,
} from '$shared'
import {
  AppCtx,
} from '$src/App'
import {
  defaultEmailFilter,
  EmailCtx,
} from '$src/components/email'

library.add( faFilter, faInfoCircle, faSearch, faTimes )


/*
 * EmailFiltersIndex
**/
const EmailFiltersIndex = (props) => {
  // logg(props, 'EmailFiltersIndex')

  /* ctx */
  const apiRouter = useApiRouter()
  const {
    id,
  } = useParams()

  const {
    loading, setLoading,
  } = useContext(AppCtx)

  const {
    emailFilter, setEmailFilter,
    emailFilterModalOpen, setEmailFilterModalOpen,
    emailFiltersList, setEmailFiltersList,
  } = useContext(EmailCtx)

  /* effects */

  useEffect(() => {
    setLoading(true)
    fetch(apiRouter.emailFilterPath({ id })).then(r => r.json()).then((item) => {
      setEmailFilter(item)
      setEmailFilterModalOpen(true)
    }).finally(() => {
      setLoading(false)
    })
  }, [ id ])

  useEffect(() => {
    fetch(apiRouter.emailFiltersPath()).then(r => r.json()).then(({ items, }) => {
      setEmailFiltersList(items)
    })
  }, [] )

  /* methods */

  const handleDelete = (item) => {
    if (!window.confirm('Are you sure?')) { return; }
    fetch(apiRouter.emailFilterPath(item), {
      method: 'DELETE',
    }).then(r => r.json()).then(resp => {
    })
  }

  return <div className='EmailFiltersIndex' >
    <h5>
      Email Filters
      <span onClick={() => {
        setEmailFilter({...defaultEmailFilter})
        setEmailFilterModalOpen(true)
      } }> [+]</span>
    </h5>
    <ul className='items' >
      { emailFiltersList.map((item, idx) => <li key={idx} >
        <div className='d-inline' onClick={() => handleDelete(item)}>
          [x]
        </div>
        <Link to={appRouter.emailFilterPath(item)} onClick={() => setEmailFilterModalOpen(true) } >
          [~] { item.name }
        </Link>
      </li> ) }
    </ul>
  </div>
}
export default EmailFiltersIndex
