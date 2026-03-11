import { useQuery } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router-dom'
import { useLikeBlog, useDeleteBlog, useCommentBlog } from '../hooks/useBlogs'
import { useUser } from '../context/UserContext'
import blogService from '../services/blogs'
import { useState } from 'react'

const Blog = () => {
  const [comment, setComment] = useState('')

  const id = useParams().id
  const [user] = useUser()
  const navigate = useNavigate()

  const likeMutation = useLikeBlog()
  const deleteMutation = useDeleteBlog()
  const commentMutation = useCommentBlog()

  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
    retry: false,
  })

  if (result.isLoading) {
    return <div>loading blog...</div>
  }

  const blogs = result.data || []
  const blog = blogs.find((blog) => blog.id === id)

  if (!blog) {
    return <div>Blog not found!</div>
  }

  const showDeleteButton = user && blog.user?.username === user.username

  const handleDelete = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      deleteMutation.mutate(blog)
      navigate('/')
    }
  }

  const addComment = (event) => {
    event.preventDefault()
    commentMutation.mutate({ id: blog.id, comment })
    setComment('')
  }

  return (
    <div>
      <h2>{blog.title}</h2>
      {blog.url} <br />
      likes {blog.likes}{' '}
      <button
        onClick={() => likeMutation.mutate({ ...blog, likes: blog.likes + 1 })}
      >
        like
      </button>{' '}
      <br />
      {blog.user.name}
      {showDeleteButton && <button onClick={handleDelete}>remove</button>}
      <h3>comments</h3>
      <form onSubmit={addComment}>
        <input
          type="text"
          value={comment}
          placeholder="comment"
          onChange={({ target }) => setComment(target.value)}
        />
        <button type="submit">add comment</button>
      </form>
      <ul>
        {blog.comments.map((comment, index) => (
          <li key={index}>{comment}</li>
        ))}
      </ul>
    </div>
  )
}

export default Blog
