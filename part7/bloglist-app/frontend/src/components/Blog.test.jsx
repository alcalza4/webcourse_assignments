import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { expect, test, vi } from 'vitest'

test('renders content', () => {
  const blog = {
    'title': 'React patterns',
    'author': 'Michael Chan',
    'url': 'https://reactpatterns.com/',
    'likes': 7,
    'user': 'ac'
  }
  render(<Blog blog={blog} />)

  const title = screen.getByText('React Patterns', { exact: false })
  const author = screen.getByText('Michael Chan', { exact: false })
  const url = screen.queryByText('https://reactpatterns.com/')
  const likes = screen.queryByText('7')
  const user = screen.queryByText('ac')

  expect(title).toBeDefined()
  expect(author).toBeDefined()
  expect(url).toBeNull()
  expect(likes).toBeNull()
  expect(user).toBeNull()
})

test('after button press, show extended view', async () => {
  const blog = {
    'title': 'React patterns',
    'author': 'Michael Chan',
    'url': 'https://reactpatterns.com/',
    'likes': 7,
    'user': { name: 'ac' }
  }


  render(<Blog blog={blog} />)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const url = screen.getByText('https://reactpatterns.com/', { exact: false })
  const likes = screen.getByText('7', { exact: false })

  expect(url).toBeDefined()
  expect(likes).toBeDefined()
})

test('show update on like button twice', async () => {
  const blog = {
    'title': 'React patterns',
    'author': 'Michael Chan',
    'url': 'https://reactpatterns.com/',
    'likes': 7,
    'user': { name: 'ac' }
  }

  const mockHandler = vi.fn()

  render(<Blog blog={blog} updateLikes={mockHandler} />)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})