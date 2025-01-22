
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
  C,
  logg,
  useApiRouter,
} from '$shared'
import {
  AppCtx,
} from '$src/App'
import {
  actionsList,
  EmailCtx,
  fieldsList,
  operatorsList,
} from '$src/components/email'

library.add( faFilter, faInfoCircle, faSearch, faTimes )

/*
 * EmailFilterCondition
**/
const EmailFilterCondition = (props) => {
  // logg(props, 'EmailFilterCondition')
  const {
    cond,
    idx,
    resource = 'conditions', // or 'skip_conditions'
  } = props

  /* ctx */

  const {
    loading, setLoading,
    tagsList,
  } = useContext(AppCtx)
  // logg(useContext(AppCtx), 'AppCtx in EmailFilterCondition')

  const {
    emailActionsList,
    emailFilter, setEmailFilter,
    emailFilterModalOpen, setEmailFilterModalOpen,
    emailTemplatesList,
  } = useContext(EmailCtx)
  // logg(useContext(EmailCtx), 'EmailCtx in EmailFilterCondition')

  return <F key={idx} >
    { '1' === cond._destroy && <div>Deleted</div> || <div className='d-flex'>
      <div className='btn' onClick={() => {
        emailFilter[resource][idx]._destroy = '1'
        setEmailFilter({...emailFilter})
      } }>[x]</div>


      { /* Field */ }
      <Select className='select2'
        options={fieldsList}
        value={fieldsList.filter((j) => cond.field === j.value )}
        style={C.select2Styles}
        onChange={(ev) => {
          const tmp = { ...cond, field: ev.value }
          if (ev.operator) { tmp.operator = ev.operator }
          emailFilter[resource][idx] = tmp
          setEmailFilter({ ...emailFilter })
        } }
      />

      { /* Operator */ }

      { 'leadset' === cond.field && <div className='ml-2 '>
        <Select className='select2'
          options={operatorsList}
          value={operatorsList.filter((j) => cond.operator === j.value )}
          style={C.select2Styles}
          onChange={(ev) => {
            const tmp = { ...cond, operator: ev.value }
            emailFilter[resource][idx] = tmp
            setEmailFilter({ ...emailFilter })
          } }
        />
      </div> }

      { /* Value */ }

      { 'textarea' === cond.operator && <div className='ml-2 d-flex flex-column'>
        <label>Ruby eval. Available: @lead , @company</label>
        <textarea value={cond.value} onChange={(ev) => {
          cond.value = ev.target.value
          emailFilter[resource][idx] = cond
          setEmailFilter({...emailFilter})
        } } ></textarea>
      </div> }
      { ['has-tag', 'not-has-tag'].indexOf(cond.operator) != -1 && <div className='ml-2'>
        {/* <label>Tag&nbsp;</label> */}
        <Select className='select2'
          options={tagsList}
          value={tagsList.filter((j) => cond.value === j.value )}
          style={C.select2Styles}
          onChange={(ev) => {
            const tmp = { ...cond, value: ev.value }
            emailFilter[resource][idx] = tmp
            setEmailFilter({ ...emailFilter })
          } }
        />
      </div> }
      { 'text-input' === cond.operator && <div className='ml-2'>
        <input value={cond.value} onChange={(ev) => {
          cond.value = ev.target.value
          emailFilter[resource][idx] = cond
          setEmailFilter({...emailFilter})
        } } />
      </div> }

    </div> }

  </F>
}
export default EmailFilterCondition
