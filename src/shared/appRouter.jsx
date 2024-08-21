
const appRouter = {
  emailRootPath: () => '/email',
  emailContextsSummaryPath: () => '/email/contexts/summary',
  emailInboxPath: () => '/email/inbox',
  emailInboxRoute:      '/email/inbox',

  hostingRootPath: () => '/hosting',

  tradingRootPath: () => '/trading',

  stocksIndex: () => '/trading/stocks',
  stocksIndexRoute:      '/trading/stocks',

  stocksShow: (stock) => `/trading/stocks/${stock.ticker}`,
  stocksShowRoute:           `/trading/stocks/:ticker`,

}

export default appRouter
