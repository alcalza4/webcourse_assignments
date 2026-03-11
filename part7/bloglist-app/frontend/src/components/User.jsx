import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import userService from '../services/users'
import { ListGroup } from 'react-bootstrap'

const User = () => {
  const id = useParams().id

  const result = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll,
    retry: false,
  })

  if (result.isLoading) {
    return <div>loading user blogs...</div>
  }

  const users = result.data || []
  const user = users.find((user) => user.id === id)

  if (!user) {
    return null
  }

  return (
    <div className="mt-4">
      <h2 className="mb-3">{user.name}</h2>
      <h4 className="text-muted mb-3">Added Blogs</h4>
      {user.blogs.length > 0 ? (
        <ListGroup>
          {user.blogs.map((blog) => (
            <ListGroup.Item key={blog.id}>{blog.title}</ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <p>This user hasn't added any blogs yet.</p>
      )}
    </div>
  )
}

export default User
