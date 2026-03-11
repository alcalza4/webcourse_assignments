import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import blogService from '../services/blogs'
import { useNotification } from '../context/NotificationContext'


const Blog = ({ blog, user }) => {
  const [visible, setVisibility] = useState(false)
  const showWhenVisible = { display: visible ? '' : 'none' }
  const toggleVisibility = () => {
    setVisibility(!visible)
  }

  const queryClient = useQueryClient()
  const [, sendNotification] = useNotification()

  const updateBlogMutation = useMutation({
    mutationFn: blogService.updateBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      sendNotification(`blog ${blog.title} has been liked`, 'success')
    },
    onError: (error) => {
      sendNotification(`error liking blog: ${error.message}`, 'error')
    }
  })

  const deleteBlogMutation = useMutation({
    mutationFn: blogService.deleteBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      sendNotification(`blog ${blog.title} been deleted`, 'success')
    },
    onError: (error) => {
      sendNotification(`error deleting blog: ${error.message}`, 'error')
    }
  })

  const showDeleteButton = user && blog.user?.username === user.username

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const handleDelete = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      deleteBlogMutation.mutate(blog)
    }
  }

  return (
    <div style={blogStyle} className="blog">
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>
      </div>
      <div style={showWhenVisible}>
        {blog.url} <br />
        likes {blog.likes} <button onClick={() => updateBlogMutation.mutate({...blog, likes: blog.likes + 1})}>like</button> <br />
        {blog.user.name}
        {showDeleteButton && <button onClick={handleDelete}>remove</button>}
      </div>
    </div>
  )
}

export default Blog
