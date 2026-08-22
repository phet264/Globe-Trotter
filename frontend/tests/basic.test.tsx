import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Home from '../app/page';
import { EmptyState } from '../components/EmptyState';
import { Compass } from 'lucide-react';

// Mock the Next.js Font loaders
vi.mock('next/font/google', () => ({
  Inter: () => ({ variable: '--font-sans', className: 'font-sans' }),
  Playfair_Display: () => ({ variable: '--font-display', className: 'font-display' }),
}));

describe('Basic Rendering', () => {
  it('renders the Home page hero', () => {
    render(<Home />);
    expect(screen.getByText(/GlobeTrotter Phase 1 Foundation/i)).toBeTruthy();
  });

  it('renders the EmptyState component', () => {
    render(
      <EmptyState
        icon={Compass}
        title="Test Title"
        description="Test Description"
        actionLabel="Action"
        onAction={() => {}}
      />
    );
    expect(screen.getByText('Test Title')).toBeTruthy();
    expect(screen.getByText('Test Description')).toBeTruthy();
    expect(screen.getByText('Action')).toBeTruthy();
  });
});
