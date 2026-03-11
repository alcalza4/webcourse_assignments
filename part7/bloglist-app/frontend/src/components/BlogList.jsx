import { useQuery } from '@tanstack/react-query'
import blogService from '../services/blogs'
import Blog from './Blog'

const BlogList = ({ user }) => {
  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
    retry: false
  })

  if (result.isLoading) {
    return <div>loading data...</div>
  }

  const blogs = result.data
  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

  return (
    <div className="bloglist">
      {sortedBlogs.map(blog => (
        <Blog
          key={blog.id}
          blog={blog}
          user={user}
        />
      ))}
    </div>
  )
}

export default BlogList