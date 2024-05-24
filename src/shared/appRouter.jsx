
const appRouter = {
  emailInboxPath: () => '/email/inbox',
  emailInboxRoute:      '/email/inbox',

  stocksPath: () => '/trading/stocks',
  stocksRoute:      '/trading/stocks',

  stockPath: (stock) => `/trading/stocks/${stock.ticker}`,
  stockRoute:           `/trading/stocks/:ticker`,
}

export default appRouter
