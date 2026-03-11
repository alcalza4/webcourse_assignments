import { useQuery } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router-dom'
import { useLikeBlog, useDeleteBlog, useCommentBlog } from '../hooks/useBlogs'
import { useUser } from '../context/UserContext'
import blogService from '../services/blogs'
import { useState } from 'react'

import { Card, Button, Form, ListGroup, InputGroup } from 'react-bootstrap'

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
    <div className="mt-4">
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Card.Title className="display-6">{blog.title}</Card.Title>
          <Card.Subtitle className="mb-3 text-muted">
            by {blog.author}
          </Card.Subtitle>
          <Card.Text>
            <a href={blog.url} target="_blank" rel="noreferrer">
              {blog.url}
            </a>
            <br />
            <span className="me-3">{blog.likes} likes</span>
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() =>
                likeMutation.mutate({ ...blog, likes: blog.likes + 1 })
              }
            >
              Like
            </Button>
            <br />
            <small className="text-muted">Added by {blog.user?.name}</small>
          </Card.Text>
          {showDeleteButton && (
            <Button variant="danger" size="sm" onClick={handleDelete}>
              Remove Blog
            </Button>
          )}
        </Card.Body>
      </Card>

      <h4>Comments</h4>
      <Form onSubmit={addComment} className="mb-3">
        <InputGroup>
          <Form.Control
            type="text"
            value={comment}
            placeholder="Write a comment..."
            onChange={({ target }) => setComment(target.value)}
          />
          <Button variant="primary" type="submit">
            Add Comment
          </Button>
        </InputGroup>
      </Form>

      <ListGroup variant="flush">
        {(blog.comments || []).map((comment, index) => (
          <ListGroup.Item key={index}>{comment}</ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  )
}

export default Blog
