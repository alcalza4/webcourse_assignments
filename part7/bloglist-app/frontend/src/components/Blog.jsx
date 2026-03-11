import { useState } from 'react'

const Blog = ({ blog, user, updateLikes, deleteBlog }) => {
  const [visible, setVisibility] = useState(false)

  //const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisibility(!visible)
  }

  const showDeleteButton = user && blog.user?.username === user.username

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const handleLike = () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
    }
    updateLikes(updatedBlog)
  }

  const handleDelete = () => {
    deleteBlog(blog)
  }

  return (
    <div style={blogStyle} className="blog">
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>
      </div>
      <div style={showWhenVisible}>
        {blog.url} <br />
        likes {blog.likes} <button onClick={handleLike}>like</button> <br />
        {blog.user.name}
        {showDeleteButton && <button onClick={handleDelete}>remove</button>}
      </div>
    </div>
  )
}

export default Blog