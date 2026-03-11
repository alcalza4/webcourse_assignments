import { useState } from 'react'
import Notification from './Notification'
import { useUser } from '../context/UserContext'
import { useNotification } from '../context/NotificationContext'
import blogService from '../services/blogs'
import loginService from '../services/login'

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
    <div>
      <h2>Log in to application</h2>
      <Notification />
      
      <form onSubmit={handleLogin}>
        <div>
          <label>
            username
            <input
              type="text"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            password
            <input
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </label>
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm