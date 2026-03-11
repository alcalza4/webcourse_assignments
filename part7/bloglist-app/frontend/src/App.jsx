import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import CreateBlogForm from './components/CreateBlogForm'
import blogService from './services/blogs'
import loginService from './services/login'
import './index.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)

  const createBlogFormRef = useRef()

  useEffect(() => {
    blogService
      .getAll()
      .then((blogs) => setBlogs(blogs.sort((a, b) => b.likes - a.likes)))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const showNotification = (message, type) => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch {
      showNotification('wrong username or password', 'error')
    }
    console.log('loggin in with', username, password)
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    setUser(null)
    window.localStorage.removeItem('loggedBlogappUser')
    console.log('logout success')
  }

  const addBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.createBlog(blogObject)
      const updatedBlogs = blogs.concat(returnedBlog)
      setBlogs(updatedBlogs.sort((a, b) => b.likes - a.likes))
      createBlogFormRef.current.toggleVisibility()
      showNotification(
        `a new blog post ${blogObject.title} by ${blogObject.author} added`,
        'success',
      )
    } catch {
      showNotification('error creating new blog post', 'error')
    }
  }

  const updateLikes = async (blogObject) => {
    try {
      const returnedBlog = await blogService.updateLikes(blogObject)

      const blogWithUser = {
        ...returnedBlog,
        user: blogObject.user,
      }
      const updatedBlogs = blogs.map((blog) =>
        blog.id !== returnedBlog.id ? blog : blogWithUser,
      )
      setBlogs(updatedBlogs.sort((a, b) => b.likes - a.likes))
    } catch {
      showNotification('error updating likes', 'error')
    }
  }

  const deleteBlog = async (blogToDelete) => {
    if (
      window.confirm(
        `Delete Blog ${blogToDelete.title} by ${blogToDelete.author}?`,
      )
    ) {
      try {
        await blogService.deleteBlog(blogToDelete)
        setBlogs(blogs.filter((blog) => blog.id !== blogToDelete.id))

        showNotification(
          `Blog ${blogToDelete.title} by ${blogToDelete.author} has been removed`,
          'success',
        )
      } catch (error) {
        showNotification({ error }, 'error')
      }
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification
          message={notification?.message}
          type={notification?.type}
        />
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

  return (
    <div>
      <h2>blogs</h2>

      <Notification message={notification?.message} type={notification?.type} />

      {user && (
        <div>
          <span>{user.name} logged in</span>
          <button onClick={handleLogout}>logout</button>
        </div>
      )}

      <Togglable buttonLabel="create new note" ref={createBlogFormRef}>
        <CreateBlogForm createBlog={addBlog} />
      </Togglable>

      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          user={user}
          blog={blog}
          updateLikes={updateLikes}
          deleteBlog={deleteBlog}
        />
      ))}
    </div>
  )
}

export default App
