
import axios from 'axios'

import config from 'config'

const apiRouter = {
  wrap: function(what) {
    return `${what}?jwt_token=${localStorage.getItem('jwt_token')}`
  },
  getStocks: function() {
    return axios.get(this.wrap(this.stocksIndexPath())).then(r => r.json())
  },

  leadsIndexHashPath: (hash) => `${config.apiOrigin}/wco/api/leads/index_hash.json?${hash.toString()}`,

  stocksIndex: () => {
    const jwt_token = localStorage.getItem('jwt_token')
    const out = `${config.apiOrigin}/trading/stocks.json?jwt_token=${jwt_token}`
    return out
  },
  stocksIndexPath: () => `${config.apiOrigin}/trading/stocks.json`,

}
export default apiRouter
