
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

const actionsList = [
  { label: 'Autorespond Template',     value: 'autorespond-template' },
  { label: 'Execute Ruby',             value: 'exe' },
  { label: 'Schedule Email Action',    value: 'autorespond-email-action' },
  { label: 'Remove Email Action',      value: 'remove-email-action' },
  { label: 'Add Tag',                  value: 'add-tag' },
  { label: 'Remove Tag',               value: 'remove-tag' },
]

const fieldsList = [
  { label: 'body',    value: 'body' },
  { label: 'exe',     value: 'exe', valueKind: 'exe' },
  { label: 'from',    value: 'from' },
  { label: 'leadset', value: 'leadset' },
  { label: 'subject', value: 'subject' },
  { label: 'to',      value: 'to' },
]

const operatorsList = [
  { label: 'is',              value: 'equals',      valueKind: 'leadset-id'  },
  { label: 'has tag',         value: 'has-tag',     valueKind: 'tag-id'  },
  { label: 'doesnt have tag', value: 'not-has-tag', valueKind: 'tag-id'  },
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
    logg(thisFilter, 'handleSave')

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

        {/* Conditions */}

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
          { logg(cond, 'this Cond') }
          <div className='d-flex'>
            <div className='btn' onClick={() => {
              if (window.confirm('Are you sure?')) {
                thisFilter.conditions.splice(idx, 1)
                setThisFilter({...thisFilter})
              }
            } }>[x]</div>
            <div>
              <label>If field&nbsp;</label>
              <Select className='select2'
                options={fieldsList}
                value={fieldsList.filter((j) => cond.field === j.value )}
                style={C.select2Styles}
                onChange={(ev) => {
                  // logg(ev, 'select Field')
                  const tmp = { ...cond, field: ev.value }
                  // if (ev.valueKind) {
                    tmp.valueKind = ev.valueKind
                  // }
                  thisFilter.conditions[idx] = tmp
                  setThisFilter({ ...thisFilter })
                } }
              />
            </div>

            { cond.field === 'leadset' && <div className='ml-2 '>
              <label>operator</label>
              <Select className='select2'
                options={operatorsList}
                value={operatorsList.filter((j) => cond.operator === j.value )}
                style={C.select2Styles}
                onChange={(ev) => {
                  const tmp = { ...cond, operator: ev.value }
                  if (ev.valueKind) {
                    tmp.valueKind = ev.valueKind
                  }
                  thisFilter.conditions[idx] = tmp
                  setThisFilter({ ...thisFilter })
                } }
              />
            </div> }

            { /* ValueKinds */ }

            { cond.valueKind === 'exe' && <div className='ml-2 d-flex flex-column'>
              <label>Ruby eval. Available: @lead , @company</label>
              <textarea value={cond.value} onChange={(ev) => {
                cond.value = ev.target.value
                thisFilter.conditions[idx] = cond
                setThisFilter({...thisFilter})
              } } ></textarea>
            </div> }
            { cond.valueKind === 'tag-id' && <div className='ml-2'>
              <label>Tag&nbsp;</label>
              <Select className='select2'
                options={tagsList}
                value={tagsList.filter((j) => cond.value === j.value )}
                style={C.select2Styles}
                onChange={(ev) => {
                  const tmp = { ...cond, value: ev.value }
                  thisFilter.conditions[idx] = tmp
                  setThisFilter({ ...thisFilter })
                } }
              />
            </div> }

          </div>
        </F>) }

        { /* Skip Conditions */ }

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

        { /* Actions */ }

        <div className='row'>
          <h3 className='header'>
            Actions
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
