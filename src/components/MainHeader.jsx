
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBuildingColumns, faCreditCard, faMoon } from '@fortawesome/free-solid-svg-icons'


import React, { Fragment as F, useContext } from 'react'

import {
  AppCtx,
} from '$shared'

library.add( faBuildingColumns, faCreditCard, faMoon )


/**
 * MainHeader
**/
const MainHeader = (props) => {

  const { pageTitle, setPageTitle } = useContext(AppCtx)

  return <F>
    <header className="MainHeader">
      <div className="left">
        { pageTitle }
      </div>
      <div className="right relative">

        <FontAwesomeIcon
          icon="fa-solid fa-moon"
          style={{ fontSize: '1.5em', }}
        />
        &nbsp; &nbsp; &nbsp;
        {/* <IconButton onClick={() => setShowUserAcctModal(!showUserAcctModal)} ><AccountIcon sx={{ fontSize: '1.5em' }} /></IconButton> */}
        {/* <div className={`userAccountMini ${showUserAcctModal ? 'show' : 'hide' }`}>
          <div className='d-flex'>
            { cuEmail }
            <div className='Btn'>Logout</div>
          </div>
        </div> */}

      </div>
    </header>
  </F>
}
export default MainHeader
