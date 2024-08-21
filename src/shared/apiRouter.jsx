
import axios from 'axios'

import config from 'config'


const logg = (a, b="", c=null) => {
  if ('undefined' === typeof window) { return }
  c = "string" === typeof c ? c : b.replace(/\W/g, "");
  if (c.length > 0) { window[c] = a; }
  console.log(`+++ ${b}:`, a); // eslint-disable-line no-console
};


const useApiRouter = (props) => {
  const jwt_token = localStorage.getItem('jwt_token')
  const apiOrigin = config.apiOrigin

  const out = {

    /*
     * email
    **/
    getEmailContextsSummary: () => {
      return axios.get(`${apiOrigin}/email/api/contexts/summary.json?jwt_token=${jwt_token}`
        ).then(r => {
          logg(r, 'api getEmailContextsSummary')
          return r.data
        })
    },

    /*
     * hosting
    **/

    /*
     * trading
    **/

    /* singular */
    getStock: ({ ticker }) => {
      return axios.get(`${apiOrigin}/trading/api/stocks/${ticker}.json?jwt_token=${jwt_token}`
        ).then(r => {
          // logg(r, 'api getStock')
          return r.data
        })
    },
    getStockMaxPain: ({ ticker }) => {
      return axios.get(`${apiOrigin}/trading/api/stocks/${ticker}/max-pain.json?jwt_token=${jwt_token}`
        ).then(r => {
          // logg(r, 'api getStock')
          return r.data
        })
    },

    /* plural */
    getStocks: () => {
      return axios.get(`${apiOrigin}/trading/api/stocks.json?jwt_token=${jwt_token}`).then(r => {
        // logg(r, 'r')
        return r.data.stocks
      })
    },

    leadsIndexHashPath: (hash) => `${apiOrigin}/wco/api/leads/index_hash.json?${hash.toString()}`,
  }
  return out
}
export default useApiRouter
