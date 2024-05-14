
import styled from '@emotion/styled'
import React, { Fragment as F, useEffect, useState } from 'react'
import {
  Link,
} from "react-router-dom"
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import _CardContent from '@mui/material/CardContent'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBuildingColumns, faCreditCard } from '@fortawesome/free-solid-svg-icons'

import {
  logg,
  appRouter,
} from "$shared"


library.add( faBuildingColumns, faCreditCard )

const W0 = styled.div`
  display: flex;
  justify-content: center;

  > * {
    margin: 3em 1em;
  }
`;

const CardContent = styled(_CardContent)`
  display: flex;
  flex-direction: column;
  align-items: center;

`;

const Home = (props) => {
  return <F>
    <div className="LayoutScreen">
    <div className="d-flex">

    <Link className='card-link' to={appRouter.stocksPath()} >
      <div className='Card Glassmorphism' >
          <FontAwesomeIcon
            icon="fa-solid fa-building-columns"
            style={{ fontSize: '100px', }}
          />
          <h2>Stocks</h2>
      </div>
    </Link>

    <Link className='card-link' to="@TODO" >
      <div className='Card Glassmorphism_' >
        <FontAwesomeIcon
          icon="fa-solid fa-credit-card"
          style={{ fontSize: '100px', }}
        />
        <h2>Inbox</h2>
      </div>
    </Link>

    <Link className='card-link' to="@TODO" >
      <div className='Card Glassmorphism_' >
        <FontAwesomeIcon
          icon="fa-solid fa-credit-card"
          style={{ fontSize: '100px', }}
        />
        <h2>Analytics</h2>
      </div>
    </Link>

    </div>
    {/* <div className="d-flex">

    <Link className='card-link' to="@TODO" >
      <div className='Card Glassmorphism' >
          <FontAwesomeIcon
            icon="fa-solid fa-building-columns"
            style={{ fontSize: '100px', }}
          />
          <h2>Banks</h2>
      </div>
    </Link>

    <Link className='card-link' to="@TODO" >
      <div className='Card Glassmorphism_ inactive' >
        <FontAwesomeIcon
          icon="fa-solid fa-credit-card"
          style={{ fontSize: '100px', }}
        />
        <h2>Fintechs</h2>
      </div>
    </Link>

    </div> */}
    </div>
  </F>
}
export default Home
