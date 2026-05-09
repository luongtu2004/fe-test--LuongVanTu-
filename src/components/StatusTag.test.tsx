import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import StatusTag from './StatusTag';

describe('StatusTag Component', () => {
  it('renders correct text for TODO status', () => {
    render(<StatusTag status="todo" />);
    expect(screen.getByText('TODO')).toBeDefined();
  });

  it('renders correct text for DONE status', () => {
    render(<StatusTag status="done" />);
    expect(screen.getByText('DONE')).toBeDefined();
  });
});
