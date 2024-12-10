
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
  EmailCtx,
} from '$src/components/email'

library.add( faFilter, faInfoCircle, faSearch, faTimes )

const fieldsList = [
  {label: 'subject',   value: 'subject'},
  {label: 'from',      value: 'from'},
  {label: 'to',        value: 'to'},
  {label: 'body',      value: 'body'},
  {label: 'match exe', value: 'match-exe'},
]

const actionsList = [
  { label: 'autorespond-template',     value: 'autorespond-template' },
  { label: 'autorespond-email-action', value: 'autorespond-email-action' },
  { label: 'add-tag',                  value: 'add-tag' },
  { label: 'remove-tag',               value: 'remove-tag' },
  { label: 'destroy-schs',             value: 'destroy-schs' },
]

/*
 * EmailFilter
**/
const EmailFilter = (props) => {
  // logg(props, 'EmailFilter')

  /* ctx */

  const apiRouter = useApiRouter()

  const {
    tagsList,
  } = useContext(AppCtx)

  const {
    emailActionsList,
    emailFilterModalOpen, setEmailFilterModalOpen,
    emailTemplatesList,
  } = useContext(EmailCtx)

  /* state */

  const defaultFilter = {
    actions: [],
    conditions: [],
    skip_conditions: [],
  }
  const defaultAction = {
    kind: false,
    value: '',
  }
  const defaultCondition = {
    field: false,
    matchtype: false,
    value: '',
  }
  const [ thisFilter, setThisFilter ] = useState(defaultFilter)

  /* methods */

  const handleSave = () => {

    const tmp = {...thisFilter}
    tmp.conditions_attributes = tmp.conditions
    delete tmp.conditions
    tmp.skip_conditions_attributes = tmp.skip_conditions
    delete tmp.skip_conditions
    tmp.actions_attributes = tmp.actions
    delete tmp.actions

    fetch(apiRouter.emailFiltersPath(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email_filter: tmp,
      }),
    }).then(outs => {
      logg(outs, 'saved an EmailFilter?')
    })
  }

  return <F>
    <Modal
      ariaHideApp={false}
      className="EmailFilterModal BaseModal"
      isOpen={emailFilterModalOpen}
      onRequestClose={ () => setEmailFilterModalOpen(false) }
      overlayClassName="ModalOverlay"
    >
      <div className='modal-header'>
        Email Filter
      </div>

      <div className='container'>
        <div className='row'>
          <h3 className='header'>
            Conditions
            <div className='btn' onClick={() => {
              const tmp = {...thisFilter}
              tmp.conditions.push(defaultCondition)
              setThisFilter(tmp)
            } }>[+]</div>
          </h3>
        </div>

        { thisFilter.conditions.map((cond, idx) => <F key={idx} >
          <div className='d-flex'>
            <div className='btn' onClick={() => {
              if (window.confirm('Are you sure?')) {
                thisFilter.conditions.splice(idx, 1)
                setThisFilter({...thisFilter})
              }
            } }>[x]</div>
            <label>If field &nbsp;</label>
            <Select className='select2'
              options={fieldsList}
              value={fieldsList.filter((j) => cond.field === j.value )}
              style={C.select2Styles}
              onChange={(ev) => {
                const tmp = { ...cond, field: ev.value }
                thisFilter.conditions[idx] = tmp
                setThisFilter({ ...thisFilter })
              } }
            />
            { cond.field === 'match-exe' && <div className='ml-2 d-flex flex-column'>
              <label>Ruby eval. Available: @lead , @company</label>
              <textarea value={cond.value} onChange={(ev) => {
                cond.value = ev.target.value
                thisFilter.conditions[idx] = cond
                setThisFilter({...thisFilter})
              } } ></textarea>
            </div> }
          </div>
        </F>) }

        <div className='row'>
          <h3 className='header'>
            Skip Conditions
            <div className='btn' onClick={() => {
              const tmp = {...thisFilter}
              tmp.skip_conditions.push(defaultCondition)
              setThisFilter(tmp)
            } }>[+]</div>
          </h3>
        </div>

        <div className='row'>
          <h3 className='header'>
            Action
            <div className='btn' onClick={() => {
              const tmp = {...thisFilter}
              tmp.actions.push(defaultAction)
              setThisFilter(tmp)
            } }>[+]</div>
          </h3>
        </div>
        { thisFilter.actions.map((act, idx) => <F key={idx} >
          <div className='d-flex'>
            <div className='btn' onClick={() => {
              if (window.confirm('Are you sure?')) {
                thisFilter.actions.splice(idx, 1)
                setThisFilter({...thisFilter})
              }
            } }>[x]</div>
            <label>Then &nbsp;</label>
            <Select className='select2'
              options={actionsList}
              value={actionsList.filter((j) => act.kind === j.value )}
              style={C.select2Styles}
              onChange={(ev) => {
                thisFilter.actions[idx].kind = ev.value
                setThisFilter({ ...thisFilter })
              } }
            />
            { ['add-tag', 'remove-tag'].indexOf(act.kind) != -1  && <div className='ml-2 d-flex flex-column'>
              {/* <label>which tag</label> */}
              <Select className='select2'
                options={tagsList}
                value={tagsList.filter((j) => act.value === j.value )}
                style={C.select2Styles}
                onChange={(ev) => {
                  thisFilter.actions[idx].value = ev.value
                  setThisFilter({...thisFilter})
                } }
              />
            </div> }
            { 'autorespond-template' === act.kind && <div className='ml-2 d-flex flex-column'>
              <label>which template</label>
              <Select className='select2'
                options={emailTemplatesList}
                value={emailTemplatesList.filter((j) => act.value === j.value )}
                style={C.select2Styles}
                onChange={(ev) => {
                  thisFilter.actions[idx].value = ev.value
                  setThisFilter({...thisFilter})
                } }
              />
            </div>}
            { 'autorespond-email-action' === act.kind && <div className='ml-2 d-flex flex-column'>
              {/* <label>which action</label> */}
              <Select className='select2'
                options={emailActionsList}
                value={emailActionsList.filter((j) => act.value === j.value )}
                style={C.select2Styles}
                onChange={(ev) => {
                  thisFilter.actions[idx].value = ev.value
                  setThisFilter({...thisFilter})
                } }
              />
            </div> }
          </div>
        </F>) }

      </div>{/* container */}

      <div className='actions'>
        <div className='left'></div>
        <div className='right'>
          <div className='Btn btn-primary' onClick={handleSave} >Save</div>
        </div>
      </div>
    </Modal>
  </F>
}
export default EmailFilter
