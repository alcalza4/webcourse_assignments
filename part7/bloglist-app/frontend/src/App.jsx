import { useEffect, useRef } from 'react'
import LoginForm from './components/LoginForm'
import BlogList from './components/BlogList'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import CreateBlogForm from './components/CreateBlogForm'
import './index.css'

import { useDispatch, useSelector } from 'react-redux'
import { initializeBlogs } from './reducers/blogReducer'
import { initUser, logoutUser } from './reducers/userReducer'

const App = () => {
  const createBlogFormRef = useRef()

  // Reducer Items
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  useEffect(() => {
    dispatch(initUser())
  }, [dispatch])

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
          <button onClick={() => dispatch(logoutUser())}>logout</button>
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
