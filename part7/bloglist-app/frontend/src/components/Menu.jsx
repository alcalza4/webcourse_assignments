import { Navbar, Nav, Button, Container } from 'react-bootstrap'
import { useUser } from '../context/UserContext'
import { Link } from 'react-router-dom'

const Menu = () => {
  const padding = {
    paddingRight: 5,
  }

  const [user, userDispatch] = useUser()

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    userDispatch({ type: 'CLEAR_USER' })
  }

  return (
    <Navbar bg="dark" variant="dark" className="mb-4 p-2 rounded-bottom">
      <Container
        fluid
        className="d-flex justify-content-between align-items-center"
      >
        <Nav className="align-items-center gap-3">
          <Nav.Link as={Link} to="/">
            Blogs
          </Nav.Link>
          <Nav.Link as={Link} to="/users">
            Users
          </Nav.Link>
        </Nav>
        <Nav className="align-items-center gap-3">
          <Navbar.Text className="m-0">{user.name} logged in</Navbar.Text>
          <Button variant="outline-light" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </Nav>
      </Container>
    </Navbar>
  )
}

export default Menu
