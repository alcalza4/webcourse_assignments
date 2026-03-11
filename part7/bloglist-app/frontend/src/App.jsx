import { useEffect, useRef } from 'react'
import LoginForm from './components/LoginForm'
import BlogList from './components/BlogList'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import CreateBlogForm from './components/CreateBlogForm'
import './index.css'

import blogService from './services/blogs'
import { useUser } from './context/UserContext'

const App = () => {
  const createBlogFormRef = useRef()

  // Reducer Items
  const [user, userDispatch] = useUser()


  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      userDispatch({ type: 'SET_USER', payload: user})
    }
  }, [userDispatch])

  const handleLogout = () => {
    window.localStorage.getItem('loggedBlogappUser')
    userDispatch({ type: 'CLEAR_USER' })
  }

  if (user === null) {
    return (
      <LoginForm/>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification />

      {user && (
        <div>
          <span>{user.name} logged in</span>
          <button onClick={handleLogout}>logout</button>
        </div>
      )}

      <Togglable buttonLabel="create new note" ref={createBlogFormRef}>
        <CreateBlogForm closeForm={() => createBlogFormRef.current.toggleVisibility()} />
      </Togglable>

      <BlogList user={user} />
    </div>
  )
}

export default App
