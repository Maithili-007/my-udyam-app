import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FormStep1 from '../components/FormStep1';

describe('FormStep1', () => {
  it('shows error for invalid Aadhaar number', () => {
    render(<FormStep1 onNext={jest.fn()} />);
    fireEvent.change(screen.getByPlaceholderText('Your Aadhaar No'), { target: { value: '123' } });
    fireEvent.change(screen.getByPlaceholderText('Name as per Aadhaar'), { target: { value: 'Maithili' } });
    fireEvent.click(screen.getByText('Validate & Continue'));
    expect(screen.getByText('Invalid Aadhaar Number')).toBeInTheDocument();
  });

  it('shows error when name is missing', () => {
    render(<FormStep1 onNext={jest.fn()} />);
    fireEvent.change(screen.getByPlaceholderText('Your Aadhaar No'), { target: { value: '123412341234' } });
    fireEvent.click(screen.getByText('Validate & Continue'));
    expect(screen.getByText('Name is required')).toBeInTheDocument();
  });

  it('shows error when consent is not checked', () => {
    render(<FormStep1 onNext={jest.fn()} />);
    fireEvent.change(screen.getByPlaceholderText('Your Aadhaar No'), { target: { value: '123412341234' } });
    fireEvent.change(screen.getByPlaceholderText('Name as per Aadhaar'), { target: { value: 'Maithili' } });
    fireEvent.click(screen.getByText('Validate & Continue'));
    expect(screen.getByText('Consent required')).toBeInTheDocument();
  });

  it('calls onNext with correct data when all valid', () => {
    const onNextMock = jest.fn();
    render(<FormStep1 onNext={onNextMock} />);
    fireEvent.change(screen.getByPlaceholderText('Your Aadhaar No'), { target: { value: '123412341234' } });
    fireEvent.change(screen.getByPlaceholderText('Name as per Aadhaar'), { target: { value: 'Maithili' } });
    fireEvent.click(screen.getByLabelText('I consent to the terms'));
    fireEvent.click(screen.getByText('Validate & Continue'));
    expect(onNextMock).toHaveBeenCalledWith({
      aadhaarNumber: '123412341234',
      entrepreneurName: 'Maithili',
      consent: true
    });
  });
});
