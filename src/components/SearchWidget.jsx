
import react, { useState } from 'react'

import './Widget.scss'

import {
  logg,
} from '$shared'

/**
 * SearchWidget
**/
const SearchWidget = ({ children, ...props }) => {
  logg(props, 'SearchWidget')
  const {
    name,
    url,
  } = props

  const [ q, setQ ] = useState('')

  return <div className='SearchWidget WidgetW'>
    <label>Search {name}</label><br />
    <input type='text' value={q} onChange={(ev) => setQ(ev.target.value) } />
    <div className='Btn btn-primary' onClick={() =>
      window.location = url(q)
    } >Search</div>
  </div>
}

export default SearchWidget
