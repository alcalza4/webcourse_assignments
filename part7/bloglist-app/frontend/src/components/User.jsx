import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import userService from '../services/users'

const User = () => {
  const id = useParams().id

  const result = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll,
    retry: false
  })

  if (result.isLoading) {
    return <div>loading user blogs...</div>
  }

  const users = result.data || []
  const user = users.find(user => user.id === id)

  if (!user) {
    return null
  }

  return (
    <div>
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      <ul>
        {user.blogs.map(blog => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default User