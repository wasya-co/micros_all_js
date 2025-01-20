
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
  { label: 'body',    isDisabled: true, value: 'body',                },
  { label: 'exe',     isDisabled: true, value: 'exe', operator: 'exe' },
  { label: 'from',    isDisabled: true, value: 'from' },
  { label: 'leadset',                   value: 'leadset' },
  { label: 'subject', isDisabled: true, value: 'subject' },
  { label: 'to',      isDisabled: true, value: 'to' },
]

const operatorsList = [
  { label: 'is',              value: 'equals',      },
  // { label: 'is',              value: 'leadset',      },
  { label: 'has tag',         value: 'has-tag',     },
  { label: 'doesnt have tag', value: 'not-has-tag', },
]


/*
 * EmailFilterModal
**/
const EmailFilterModal = (props) => {
  // logg(props, 'EmailFilter')

  /* ctx */

  const apiRouter = useApiRouter()

  const {
    loading, setLoading,
    tagsList,
  } = useContext(AppCtx)
  logg(useContext(AppCtx), 'AppCtx in EmailFilterModal')

  const {
    emailActionsList,
    emailFilter, setEmailFilter,
    emailFilterModalOpen, setEmailFilterModalOpen,
    emailTemplatesList,
  } = useContext(EmailCtx)
  logg(useContext(EmailCtx), 'EmailCtx in EmailFilterModal')

  /* state */

  const defaultAction = {
    // kind: false,
    value: '',
  }
  const defaultCondition = {
    // field: false,
    // operator: false,
    value: '',
  }

  /* methods */

  const handleSave = () => {
    const tmp = {...emailFilter}
    tmp.conditions_attributes = tmp.conditions
    delete tmp.conditions
    tmp.skip_conditions_attributes = tmp.skip_conditions
    delete tmp.skip_conditions
    tmp.actions_attributes = tmp.actions
    delete tmp.actions
    logg(tmp, 'handleSave email_filter')

    setLoading(true)
    fetch(tmp.id ? apiRouter.emailFilterPath(tmp) : apiRouter.emailFiltersPath(), {
      method: tmp.id ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email_filter: tmp,
      }),
    }).then(r => {
      if (!r.ok) {
        throw new Error("We're sorry, something went wrong. Please try again later.")
      }
      return r.json()
    }).then(outs => {
      logg(outs, 'saved an EmailFilter?')
    }).catch(err => {
      toast('could not save the EmailFilter')
      logg(err, 'could not save the EmailFilter')
    }).finally(() => {
      setLoading(false)
    })
  }

  logg(emailFilter, 'emailFilter')

  return <F>
    <Modal
      ariaHideApp={false}
      className="EmailFilterModal BaseModal"
      isOpen={emailFilterModalOpen}
      onRequestClose={ () => setEmailFilterModalOpen(false) }
      overlayClassName="ModalOverlay"
    >
      <div className='modal-header'>
        Email Filter &nbsp; &nbsp;
        <span className='gray'>{emailFilter.id}</span>
      </div>

      <div className='container'>

        {/* Conditions */}

        <div className='row'>
          <h3 className='header'>
            Conditions
            <div className='btn' onClick={() => {
              const tmp = {...emailFilter}
              tmp.conditions.push(defaultCondition)
              setEmailFilter(tmp)
            } }>[+]</div>
          </h3>
        </div>
        { emailFilter.conditions.map((cond, idx) => <F key={idx} >
          { '1' === cond._destroy && <div>Deleted</div> || <div className='d-flex'>
            <div className='btn' onClick={() => {
              emailFilter.conditions[idx]._destroy = '1'
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
                emailFilter.conditions[idx] = tmp
                setEmailFilter({ ...emailFilter })
              } }
            />

            { /* Operator */ }
            { cond.field === 'leadset' && <div className='ml-2 '>
              <Select className='select2'
                options={operatorsList}
                value={operatorsList.filter((j) => cond.operator === j.value )}
                style={C.select2Styles}
                onChange={(ev) => {
                  const tmp = { ...cond, operator: ev.value }
                  emailFilter.conditions[idx] = tmp
                  setEmailFilter({ ...emailFilter })
                } }
              />
            </div> }

            { /* ValueKinds */ }

            { cond.operator === 'exe' && <div className='ml-2 d-flex flex-column'>
              <label>Ruby eval. Available: @lead , @company</label>
              <textarea value={cond.value} onChange={(ev) => {
                cond.value = ev.target.value
                emailFilter.conditions[idx] = cond
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
                  emailFilter.conditions[idx] = tmp
                  setEmailFilter({ ...emailFilter })
                } }
              />
            </div> }

          </div> }
        </F>) }

        { /* Skip Conditions */ }

        <div className='row'>
          <h3 className='header'>
            Skip Conditions
            <div className='btn' onClick={() => {
              const tmp = {...emailFilter}
              tmp.skip_conditions.push(defaultCondition)
              setEmailFilter(tmp)
            } }>[+]</div>
          </h3>
        </div>

        { /* Actions */ }

        <div className='row'>
          <h3 className='header'>
            Actions
            <div className='btn' onClick={() => {
              const tmp = {...emailFilter}
              tmp.actions.push(defaultAction)
              setEmailFilter(tmp)
            } }>[+]</div>
          </h3>
        </div>
        { emailFilter.actions.map((act, idx) => <F key={idx} >
          { '1' === act._destroy && <div>Deleted</div> || <div className='d-flex'>
            <div className='btn' onClick={() => {
              emailFilter.actions[idx]._destroy = '1'
              setEmailFilter({...emailFilter})
            } }>[x]</div>
            {/* <label>Then &nbsp;</label> */}
            <Select className='select2'
              options={actionsList}
              value={actionsList.filter((j) => act.kind === j.value )}
              style={C.select2Styles}
              onChange={(ev) => {
                emailFilter.actions[idx].kind = ev.value
                setEmailFilter({ ...emailFilter })
              } }
            />
            { ['add-tag', 'remove-tag'].indexOf(act.kind) != -1  && <div className='ml-2 d-flex flex-column'>
              {/* <label>which tag</label> */}
              <Select className='select2'
                options={tagsList}
                value={tagsList.filter((j) => act.value === j.value )}
                style={C.select2Styles}
                onChange={(ev) => {
                  emailFilter.actions[idx].value = ev.value
                  setEmailFilter({...emailFilter})
                } }
              />
            </div> }
            { 'autorespond-template' === act.kind && <div className='ml-2 d-flex flex-column'>
              {/* <label>which template</label> */}
              <Select className='select2'
                options={emailTemplatesList}
                value={emailTemplatesList.filter((j) => act.value === j.value )}
                style={C.select2Styles}
                onChange={(ev) => {
                  logg(ev, 'which template')
                  const tmp = {...emailFilter}
                  tmp.actions[idx].value = ev.value
                  logg(tmp, 'tmp')
                  setEmailFilter(tmp)
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
                  emailFilter.actions[idx].value = ev.value
                  setEmailFilter({...emailFilter})
                } }
              />
            </div> }
          </div> }
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
export default EmailFilterModal
