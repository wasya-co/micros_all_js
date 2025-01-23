
const appRouter = {
  emailRootPath: () => '/email',
  emailContextsSummaryPath: () => '/email/contexts/summary',
  emailFilterPath: ({ id }) => `/email/email_filters/${id}`,
  emailFiltersPath: () => '/email/email_filters',
  newEmailFilterPath: () => '/email/email_filters/new',
  emailInboxPath: () => '/email/tags/inbox',
  emailInboxRoute:      '/email/tags/inbox',
  emailTagPath: (slug) => `/email/tags/${slug}`,

  hostingRootPath: () => '/hosting',

  tradingRootPath: () => '/trading',

  stocksIndex: () => '/trading/stocks',
  stocksIndexRoute:  '/trading/stocks',
  stocksShow: (stock) => `/trading/stocks/${stock.ticker}`,
  stocksShowRoute:           `/trading/stocks/:ticker`,

}

export default appRouter
