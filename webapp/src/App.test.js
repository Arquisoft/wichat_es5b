import { render, screen } from './test-utils';
import App from './App';

test('renders welcome message', () => {
  render(<App />);
  //const welcomeMessage = screen.getByText(/Welcome to the 2025 edition of the Software Architecture course/i);
  //expect(welcomeMessage).toBeInTheDocument();
});


