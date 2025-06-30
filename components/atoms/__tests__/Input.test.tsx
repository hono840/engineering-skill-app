import { render, screen } from '@testing-library/react'
import { Input } from '../Input'

describe('Input', () => {
  it('renders basic input', () => {
    render(<Input placeholder="Enter text" />)
    const input = screen.getByPlaceholderText('Enter text')
    expect(input).toBeInTheDocument()
  })

  it('renders with label', () => {
    render(<Input label="Username" />)
    const label = screen.getByText('Username')
    const input = screen.getByRole('textbox')
    expect(label).toBeInTheDocument()
    expect(input).toBeInTheDocument()
  })

  it('renders with error message', () => {
    render(<Input error="This field is required" />)
    const error = screen.getByText('This field is required')
    const input = screen.getByRole('textbox')
    expect(error).toBeInTheDocument()
    expect(input).toHaveClass('border-red-500')
  })

  it('renders with label and error', () => {
    render(<Input label="Email" error="Invalid email format" />)
    const label = screen.getByText('Email')
    const error = screen.getByText('Invalid email format')
    expect(label).toBeInTheDocument()
    expect(error).toBeInTheDocument()
  })
})
