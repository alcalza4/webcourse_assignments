import { useState } from 'react'
import Notification from './Notification'
import { useUser } from '../context/UserContext'
import { useNotification } from '../context/NotificationContext'
import blogService from '../services/blogs'
import loginService from '../services/login'

import { Form, Button } from 'react-bootstrap'

const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [, userDispatch] = useUser()
  const [, sendNotification] = useNotification()

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)

      userDispatch({ type: 'SET_USER', payload: user })
      sendNotification(`Welcome back ${user.name}`, 'success')

      setUsername('')
      setPassword('')
    } catch (error) {
      sendNotification('Wrong username or password', 'error')
    }
  }

  return (
    <div className="mt-5">
      <h2 className="mb-4">Log in to application</h2>
      <Notification />

      <Form onSubmit={handleLogin}>
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Login
        </Button>
      </Form>
    </div>
  )
}

export default LoginForm
