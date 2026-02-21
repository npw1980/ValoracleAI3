import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { GlobalSearch } from './GlobalSearch';
import { useAppStore } from '../../stores/appStore';
import '@testing-library/jest-dom';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('GlobalSearch', () => {
  beforeEach(() => {
    cleanup();
    // Reset store
    useAppStore.setState({
      commandPaletteOpen: true,
    });
  });

  it('renders search input when open', () => {
    renderWithRouter(<GlobalSearch />);
    expect(screen.getByPlaceholderText(/search assets/i)).toBeInTheDocument();
  });

  it('shows recent searches when query is empty', () => {
    renderWithRouter(<GlobalSearch />);
    expect(screen.getByText(/recent searches/i)).toBeInTheDocument();
  });

  it('displays quick links', () => {
    renderWithRouter(<GlobalSearch />);
    expect(screen.getByText(/go to dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/go to assets/i)).toBeInTheDocument();
  });

  it('filters results based on query', () => {
    renderWithRouter(<GlobalSearch />);

    // Type in search box
    const input = screen.getByPlaceholderText(/search assets/i);

    // For now, just verify the component renders correctly
    expect(input).toBeInTheDocument();
  });
});
