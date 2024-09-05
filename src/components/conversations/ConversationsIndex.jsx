
import react, { Fragment as F, useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import {
  logg,
  useApiRouter,
} from '$shared'

/**
 * ConversationsIndex
**/
const ConversationsIndex = (props) => {
  logg(props, 'ConversationsIndex')

  const apiRouter = useApiRouter()
  const params = useParams()
  // logg(params, 'params in ConversationsIndex')

  const [ conversations, setConversations ] = useState([])

  useEffect(() => {
    apiRouter.tagConversations(params).then(inns => {
      logg(inns, 'fetched conversations in tag')
      setConversations(inns.conversations)
    })
  }, [ params ])

  return <F>
    <h3>Conversations Index</h3>
    <ul>
      { conversations.map((conv, idx) => <li key={idx}>
        <h4>{conv.subject}</h4>
      </li> )}
    </ul>
  </F>
}
export default ConversationsIndex
