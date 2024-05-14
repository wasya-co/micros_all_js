
import config from 'config'
import apiRouter from './apiRouter'
import appRouter from './appRouter'

const C = {

  // like templates
  actions: {
    plot: 'plot',
    table: 'table',
  },

  charter_types: {
    commercial: 'Commercial bank',
    cooperative: 'Cooperative bank',
    industrial: 'Industrial bank',
    nondeposit: 'Nondeposit trust company',
    savings_loan: 'Savings & Loan',
    savings: 'Savings bank',
  },

  classes: {
    sidebarIsOpen:   'is-open',
    sidebarIsClosed: 'is-closed',
  },

  missing_image: '//d15g8hc4183yn4.cloudfront.net/wp-content/uploads/2023/11/22165732/250x250-fedfis-greyout-3.jpg',

  // operators
  op: {
    between: 'between',
    bool: 'yesno',
    match_i: 'match-i',
    multiselect_checkboxes: 'multiselect-checkboxes',
    multiselect_select2: 'multiselect-select2',
  },

  statesList: [
    { label: 'AK', value: 'AK' },
    { label: 'AR', value: 'AR' },
    { label: 'FL', value: 'FL' },
    { label: 'TX', value: 'TX' },
  ],

  trading_types: {
    none: '[NULL]',
    public_hc: 'Public with HC',
    private: 'Not Public',
    public_no_hc: 'Public with No HC',
  },


}


const logg = (a, b="", c=null) => {
  if ('undefined' === typeof window) { return }
  c = "string" === typeof c ? c : b.replace(/\W/g, "");
  if (c.length > 0) { window[c] = a; }
  console.log(`+++ ${b}:`, a); // eslint-disable-line no-console
};




/* From: https://stackoverflow.com/questions/54218351/changing-height-of-react-select-component */
const select2Styles = {
  control: (provided, state) => ({
    ...provided,
    background: '#fff',
    borderColor: '#9e9e9e',
    minHeight: '3.5em',
    height: '3.5em',
    boxShadow: state.isFocused ? null : null,
  }),

  valueContainer: (provided, state) => ({
    ...provided,
    height: '3.5em',
    padding: '0 6px'
  }),

  input: (provided, state) => ({
    ...provided,
    margin: '0px',
  }),
  indicatorSeparator: state => ({
    display: 'none',
  }),
  indicatorsContainer: (provided, state) => ({
    ...provided,
    height: '3.5em',
  }),
};




export {
  C,
  logg,
  apiRouter,
  appRouter,
  select2Styles,
}
