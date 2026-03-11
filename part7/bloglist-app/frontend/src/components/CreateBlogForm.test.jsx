import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CreateBlogForm from './CreateBlogForm'
import { expect, test, vi } from 'vitest'

test('CreateBlogForm updates parent state and calls onSubmit', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(<CreateBlogForm createBlog={createBlog} />)

  const inputs = screen.getAllByRole('textbox')
  const sendButton = screen.getByText('create')

  await user.type(inputs[0], 'title')
  await user.type(inputs[1], 'author')
  await user.type(inputs[2], 'title.author.com')
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('title')
  expect(createBlog.mock.calls[0][0].author).toBe('author')
  expect(createBlog.mock.calls[0][0].url).toBe('title.author.com')
})
