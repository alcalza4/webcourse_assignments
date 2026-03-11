import { useEffect, useRef } from 'react'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Blog from './components/Blog'
import Blogs from './components/Blogs'
import User from './components/User'
import Users from './components/Users'
import Menu from './components/Menu'
import './index.css'

import blogService from './services/blogs'
import { useUser } from './context/UserContext'

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'

const App = () => {
  // Reducer Items
  const [user, userDispatch] = useUser()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      userDispatch({ type: 'SET_USER', payload: user })
    }
  }, [userDispatch])

  if (user === null) {
    return <LoginForm />
  }

  return (
    <Router>
      <Menu />
      <h2>blogs</h2>
      <Notification />
      <Routes>
        <Route path="/" element={<Blogs />} />
        <Route path="/blogs/:id" element={<Blog />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:id" element={<User />} />
      </Routes>
    </Router>
  )
}

export default App
