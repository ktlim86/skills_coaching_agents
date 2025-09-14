import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import ChatInterface from '@/components/ChatInterface'

describe('ChatInterface', () => {
  test('renders chat header', () => {
    render(<ChatInterface />)
    expect(screen.getByText('Chat Assistant')).toBeInTheDocument()
    expect(screen.getByText('Your AI-powered conversation partner')).toBeInTheDocument()
  })

  test('renders initial bot message', () => {
    render(<ChatInterface />)
    expect(screen.getByText(/Hello! I'm your AI assistant/)).toBeInTheDocument()
  })

  test('renders message input field', () => {
    render(<ChatInterface />)
    expect(screen.getByPlaceholderText('Type your message here...')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Send message' })).toBeInTheDocument()
  })

  test('can type in message input', () => {
    render(<ChatInterface />)
    const input = screen.getByPlaceholderText('Type your message here...') as HTMLTextAreaElement
    fireEvent.change(input, { target: { value: 'Hello test message' } })
    expect(input.value).toBe('Hello test message')
  })

  test('send button is disabled when input is empty', () => {
    render(<ChatInterface />)
    const sendButton = screen.getByRole('button', { name: 'Send message' })
    expect(sendButton).toBeDisabled()
  })

  test('send button is enabled when input has text', () => {
    render(<ChatInterface />)
    const input = screen.getByPlaceholderText('Type your message here...')
    const sendButton = screen.getByRole('button', { name: 'Send message' })
    
    fireEvent.change(input, { target: { value: 'Test message' } })
    expect(sendButton).not.toBeDisabled()
  })

  test('can send a message', () => {
    render(<ChatInterface />)
    const input = screen.getByPlaceholderText('Type your message here...')
    const sendButton = screen.getByRole('button', { name: 'Send message' })
    
    fireEvent.change(input, { target: { value: 'Test message' } })
    fireEvent.click(sendButton)
    
    expect(screen.getByText('Test message')).toBeInTheDocument()
  })

  test('input is cleared after sending message', () => {
    render(<ChatInterface />)
    const input = screen.getByPlaceholderText('Type your message here...') as HTMLTextAreaElement
    const sendButton = screen.getByRole('button', { name: 'Send message' })
    
    fireEvent.change(input, { target: { value: 'Test message' } })
    fireEvent.click(sendButton)
    
    expect(input.value).toBe('')
  })

  test('supports keyboard accessibility', () => {
    render(<ChatInterface />)
    const input = screen.getByPlaceholderText('Type your message here...')
    
    fireEvent.change(input, { target: { value: 'Test message' } })
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter' })
    
    expect(screen.getByText('Test message')).toBeInTheDocument()
  })
})
