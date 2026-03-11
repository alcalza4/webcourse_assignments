import { useUser } from '../context/UserContext'
import { Link } from 'react-router-dom'

const Menu = () => {
  const padding = {
    paddingRight: 5
  }

  const [user, userDispatch] = useUser()

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    userDispatch({ type: 'CLEAR_USER' })
  }

  return (
    <div>
      <Link style={padding} to="/">blogs</Link>
      <Link style={padding} to="/users">users</Link>
      <span>{user.name} logged in</span>
      <button onClick={handleLogout}>logout</button>
    </div>
  )
}

export default Menu