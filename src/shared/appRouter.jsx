
const appRouter = {
  emailInboxPath: () => '/email/inbox',
  emailInboxRoute:      '/email/inbox',

  stocksIndex: () => '/trading/stocks',
  stocksIndexRoute:      '/trading/stocks',

  stocksShow: (stock) => `/trading/stocks/${stock.ticker}`,
  stocksShowRoute:           `/trading/stocks/:ticker`,
}

export default appRouter
