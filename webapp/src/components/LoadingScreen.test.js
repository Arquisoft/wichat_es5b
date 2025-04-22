import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingScreen from './LoadingScreen';

//mockeo el componente PacmanLoader
jest.mock('react-spinners', () => ({
  PacmanLoader: () => <div data-testid="pacman-loader">Mocked PacmanLoader</div>
}));

describe('LoadingScreen Component', () => {
  test('renders without crashing', () => {
    render(<LoadingScreen />);
    expect(screen.getByText('Preparando las palomitas...')).toBeInTheDocument();
  });

  test('displays loading text', () => {
    render(<LoadingScreen />);
    const loadingText = screen.getByText('Preparando las palomitas...');
    expect(loadingText).toBeInTheDocument();
    expect(loadingText.tagName).toBe('H2');
  });

  test('includes PacmanLoader component', () => {
    render(<LoadingScreen />);
    const loader = screen.getByTestId('pacman-loader');
    expect(loader).toBeInTheDocument();
  });

  test('has proper styling for centered content', () => {
    render(<LoadingScreen />);
    const container = screen.getByText('Preparando las palomitas...').parentElement;
    
    expect(container).toHaveStyle({
      display: 'flex',
      justifyContent: 'center',
      alignContent: 'center',
      flexDirection: 'column'
    });
  });
});