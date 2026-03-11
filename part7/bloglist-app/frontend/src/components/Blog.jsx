import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { incrementLikes, deleteBlog } from '../reducers/blogReducer'


const Blog = ({ blog, user }) => {
  const [visible, setVisibility] = useState(false)

  //const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisibility(!visible)
  }

  const dispatch = useDispatch()

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
      dispatch(deleteBlog(blog))
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
        likes {blog.likes} <button onClick={() => dispatch(incrementLikes(blog))}>like</button> <br />
        {blog.user.name}
        {showDeleteButton && <button onClick={handleDelete}>remove</button>}
      </div>
    </div>
  )
}

export default Blog
