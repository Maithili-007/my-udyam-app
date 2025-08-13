import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FormStep2 from '../components/FormStep2';

describe('FormStep2', () => {
  it('shows error if no organisation type', () => {
    render(<FormStep2 onSubmit={jest.fn()} />);
    fireEvent.click(screen.getByText('Validate PAN'));
    expect(screen.getByText('Organisation type required')).toBeInTheDocument();
  });

  it('shows error for invalid PAN number', () => {
  render(<FormStep2 onSubmit={jest.fn()} />);
  // ← Add this to bypass the organisation-type check
  fireEvent.change(
    screen.getByLabelText('Select Organisation Type'),
    { target: { value: 'Proprietorship' } }
  );

  fireEvent.change(
    screen.getByPlaceholderText('Enter PAN Number'),
    { target: { value: 'BADPAN' } }
  );
  fireEvent.click(screen.getByText('Validate PAN'));
  expect(screen.getByText('Invalid PAN Number')).toBeInTheDocument();
});

  it('shows error for missing PAN holder name', () => {
    render(<FormStep2 onSubmit={jest.fn()} />);
    fireEvent.change(screen.getByLabelText('Select Organisation Type'), { target: { value: 'Proprietorship' } });
    fireEvent.change(screen.getByPlaceholderText('Enter PAN Number'), { target: { value: 'ABCDE1234F' } });
    fireEvent.click(screen.getByText('Validate PAN'));
    expect(screen.getByText('PAN holder name required')).toBeInTheDocument();
  });

  it('shows error if date is missing', () => {
    render(<FormStep2 onSubmit={jest.fn()} />);
    fireEvent.change(screen.getByLabelText('Select Organisation Type'), { target: { value: 'Proprietorship' } });
    fireEvent.change(screen.getByPlaceholderText('Enter PAN Number'), { target: { value: 'ABCDE1234F' } });
    fireEvent.change(screen.getByPlaceholderText('Name as per PAN'), { target: { value: 'Maithili' } });
    fireEvent.click(screen.getByText('Validate PAN'));
    expect(screen.getByText('Date required')).toBeInTheDocument();
  });

  it('shows error if consent not checked', () => {
    render(<FormStep2 onSubmit={jest.fn()} />);
    fireEvent.change(screen.getByLabelText('Select Organisation Type'), { target: { value: 'Proprietorship' } });
    fireEvent.change(screen.getByPlaceholderText('Enter PAN Number'), { target: { value: 'ABCDE1234F' } });
    fireEvent.change(screen.getByPlaceholderText('Name as per PAN'), { target: { value: 'Maithili' } });
    fireEvent.change(screen.getByLabelText('DOB or DOI'), { target: { value: '1995-01-01' } });
    fireEvent.click(screen.getByText('Validate PAN'));
    expect(screen.getByText('Consent required')).toBeInTheDocument();
  });

  it('calls onSubmit when all fields valid', () => {
    const onSubmitMock = jest.fn();
    render(<FormStep2 onSubmit={onSubmitMock} />);
    fireEvent.change(screen.getByLabelText('Select Organisation Type'), { target: { value: 'Proprietorship' } });
    fireEvent.change(screen.getByPlaceholderText('Enter PAN Number'), { target: { value: 'ABCDE1234F' } });
    fireEvent.change(screen.getByPlaceholderText('Name as per PAN'), { target: { value: 'Maithili' } });
    fireEvent.change(screen.getByLabelText('DOB or DOI'), { target: { value: '1995-01-01' } });
    fireEvent.click(screen.getByLabelText('I consent to the terms'));
    fireEvent.click(screen.getByText('Validate PAN'));
    expect(onSubmitMock).toHaveBeenCalledWith({
      orgType: 'Proprietorship',
      panNumber: 'ABCDE1234F',
      panHolderName: 'Maithili',
      dobOrDoi: '1995-01-01',
      consent: true
    });
  });
});
