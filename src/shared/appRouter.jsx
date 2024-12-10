
const appRouter = {
  emailRootPath: () => '/email',
  emailContextsSummaryPath: () => '/email/contexts/summary',
  emailFiltersPath: () => '/email/email_filters',
  newEmailFilterPath: () => '/email/email_filters/new',
  emailInboxPath: () => '/email/inbox',
  emailInboxRoute:      '/email/inbox',

  hostingRootPath: () => '/hosting',

  tradingRootPath: () => '/trading',

  stocksIndex: () => '/trading/stocks',
  stocksIndexRoute:  '/trading/stocks',
  stocksShow: (stock) => `/trading/stocks/${stock.ticker}`,
  stocksShowRoute:           `/trading/stocks/:ticker`,

}

export default appRouter
