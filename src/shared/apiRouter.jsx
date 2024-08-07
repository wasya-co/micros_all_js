
import axios from 'axios'

import config from 'config'


const logg = (a, b="", c=null) => {
  if ('undefined' === typeof window) { return }
  c = "string" === typeof c ? c : b.replace(/\W/g, "");
  if (c.length > 0) { window[c] = a; }
  console.log(`+++ ${b}:`, a); // eslint-disable-line no-console
};


const apiRouter = {
  wrap: function(what) {
    return `${what}?jwt_token=${localStorage.getItem('jwt_token')}`
  },

  getStock: function(props) {
    return axios.get(this.wrap(this.stocksShowPath(props))).then(r => {
      // logg(r, 'api getStock')
      return r.data
    })
  },
  getStocks: function() {
    return axios.get(this.wrap(this.stocksIndexPath())).then(r => {
      // logg(r, 'r')
      return r.data.stocks
    })
  },
  stocksIndexPath: () => `${config.apiOrigin}/trading/api/stocks.json`,
  stocksShowPath:  ({ ticker }) => `${config.apiOrigin}/trading/api/stocks/${ticker}.json`,

  leadsIndexHashPath: (hash) => `${config.apiOrigin}/wco/api/leads/index_hash.json?${hash.toString()}`,


}
export default apiRouter
