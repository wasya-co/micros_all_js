
import { useContext } from 'react'

import config from 'config'

import {
  AppCtx,
} from '$src/App'
import {
  logg,
} from './'

// const logg = (a, b="", c=null) => {
//   if ('undefined' === typeof window) { return }
//   c = "string" === typeof c ? c : b.replace(/\W/g, "");
//   if (c.length > 0) { window[c] = a; }
//   console.log(`+++ ${b}:`, a); // eslint-disable-line no-console
// };


const useApiRouter = (props) => {

  // const jwtToken = localStorage.getItem('jwt_token')
  const {
    jwtToken,
  } = useContext(AppCtx)

  const origin = config.apiOrigin

  const out = {

    /*
     * email
    **/
    emailActionTemplatesPath: () => `${origin}/email/api/email_action_templates.json?jwt_token=${jwtToken}`,
    emailFilterPath: ({ id }) => `${origin}/email/api/email_filters/${id}.json?jwt_token=${jwtToken}`,
    emailFiltersPath: () => `${origin}/email/api/email_filters.json?jwt_token=${jwtToken}`,
    emailTemplatesPath: () => `${origin}/email/api/email_templates.json?jwt_token=${jwtToken}`,
    getEmailContextsSummary: () => {
      return fetch.get(`${origin}/email/api/contexts/summary.json?jwt_token=${jwtToken}`
        ).then(r => {
          logg(r, 'api getEmailContextsSummary')
          return r.data
        })
    },
    tagPath: ({ slug, }) => `${origin}/email/api/tags/${slug}.json?jwt_token=${jwtToken}`,
    tagConversations: ({ slug, }) => {
      return fetch(`${origin}/email/api/tags/${slug}/conversations.json?jwt_token=${jwtToken}`
        ).then(r => {
          // logg(r, 'apiRouter.tagConversations')
          return r.json()
        })
    },
    tagsPath: ({ jwtToken, }) => `${origin}/wco/api/tags.json?jwt_token=${jwtToken}`,

    /*
     * hosting
    **/

    /*
     * trading
    **/

    /* singular */
    getStock: ({ ticker }) => {
      return fetch.get(`${origin}/trading/api/stocks/${ticker}.json?jwt_token=${jwtToken}`
        ).then(r => {
          // logg(r, 'api getStock')
          return r.data
        })
    },
    getStockMaxPain: ({ ticker }) => {
      return fetch.get(`${origin}/trading/api/stocks/${ticker}/max-pain.json?jwt_token=${jwtToken}`
        ).then(r => {
          // logg(r, 'api getStock')
          return r.data
        })
    },

    /* plural */
    getStocks: () => {
      return fetch.get(`${origin}/trading/api/stocks.json?jwt_token=${jwtToken}`).then(r => {
        // logg(r, 'r')
        return r.data.stocks
      })
    },

    leadsIndexHashPath: (hash) => `${origin}/wco/api/leads/index_hash.json?${hash.toString()}`,
  }
  return out
}
export default useApiRouter
