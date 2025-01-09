import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', async () => {
  render(<App />)
  // screen.debug()

  const linkElement = screen.getAllByText(/Welcome home/i)[0]
  await new Promise(process.nextTick)

  expect(linkElement).toBeInTheDocument()
});
