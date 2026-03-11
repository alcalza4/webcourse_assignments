import { useQuery } from '@tanstack/react-query'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import CreateBlogForm from './CreateBlogForm'
import Togglable from './Togglable'
import blogService from '../services/blogs'

const Blogs = () => {
  const createBlogFormRef = useRef()
  const [user] = useUser()

  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
    retry: false,
  })

  if (result.isLoading) {
    return <div>loading data...</div>
  }

  const blogs = result.data
  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  return (
    <div>
      <Togglable buttonLabel="create new note" ref={createBlogFormRef}>
        <CreateBlogForm
          closeForm={() => createBlogFormRef.current.toggleVisibility()}
        />
      </Togglable>

      <div>
        {sortedBlogs.map((blog) => (
          <li style={blogStyle} key={blog.id}>
            <Link to={`/blogs/${blog.id}`}>
              {blog.title} {blog.author}
            </Link>
          </li>
        ))}
      </div>
    </div>
  )
}

export default Blogs
