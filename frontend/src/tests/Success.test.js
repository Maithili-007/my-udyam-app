import React from 'react';
import { render, screen } from '@testing-library/react';
import Success from '../components/Success'

test('shows success message with registration ID', () => {
  render(<Success id={42} />);
  expect(screen.getByText(/registration successful/i)).toBeInTheDocument();
  expect(screen.getByText(/your registration id/i)).toBeInTheDocument();
  expect(screen.getByText(/42/)).toBeInTheDocument();
});
