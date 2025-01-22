
import {
  BrowserRouter as Router,
} from "react-router-dom"
// import { ReactKeycloakProvider, useKeycloak } from '@react-keycloak/web'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

// import config from 'config'

import {
  C,
  logg,
  useApiRouter,
} from '$shared'
import {
  AppCtx,
} from '$src/App'
import {
  EmailCtx,
} from '$src/components/email'
import {
  EmailFiltersIndex,
} from '$src/components/email_filters'

let fetchSpy

beforeEach(() => {
  fetchSpy = jest.spyOn(global, 'fetch').mockImplementation(async (url, params) => {
    logg([url, params], 'mockFetch')
    return Promise.resolve({ json: () => [] })
  })
})

afterEach(() => {
  jest.restoreAllMocks()
})


describe('EmailFiltersIndex', () => {

  test('renders - tag1', async () => {
    render(<Router>
      <AppCtx.Provider value={{
        loading: false, setLoading: () => {},
      }} >
        <EmailCtx.Provider value={{
          emailFilter: {},            setEmailFilter: () => {},
          emailFilterModalOpen: true, setEmailFilterModalOpen: () => {},
          emailFiltersList: [],       setEmailFiltersList: () => {},
        }} >
          <EmailFiltersIndex />
        </EmailCtx.Provider>
      </AppCtx.Provider>
    </Router>)

    // const btn = screen.getByText("EmailFiltersIndex")
    // fireEvent.click(btn)
    await new Promise(process.nextTick)
    // expect(fetchSpy).toHaveBeenCalledTimes(1)
  })

})

