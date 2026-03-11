import { useQuery } from '@tanstack/react-query'
import userService from '../services/users'
import { Link } from 'react-router-dom'

const Users = () => {
  const result = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll,
    retry: false
  })

  if (result.isLoading) {
    return <div>loading blog...</div>
  }

  const usersData = result.data || []
  
  return (
    <div>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>blogs created</th>
          </tr>
        </thead>
        <tbody>
          {usersData.map(user => (
            <tr key={user.id}>
              <td>
                <Link to={`/users/${user.id}`}>{user.name}</Link>
              </td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Users