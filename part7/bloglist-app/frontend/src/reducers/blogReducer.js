import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'
import { sendNotification } from './notificationReducer'

const blogSlice = createSlice({
  name: 'blog',
  initialState: [],
  reducers: {
    appendBlog(state, action) {
      state.push(action.payload)
    },
    likeBlog(state, action) {
      const id = action.payload
      const blogToUpdate = state.find(a => a.id === id)
      if (blogToUpdate) {
        blogToUpdate.likes += 1
      }
    },
    setBlogs(state, action) {
      return action.payload
    },
    removeBlog(state, action) {
      return state.filter(blog => blog.id !== action.payload)
    }
  }
})

const { appendBlog, likeBlog, setBlogs, removeBlog } = blogSlice.actions

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const createBlog = (blog) => {
  return async (dispatch, getState) => {
    try {
      const newBlog = await blogService.createBlog(blog)
      const currentUser = getState().user
      dispatch(appendBlog({ ...newBlog, user: currentUser }))
      dispatch(sendNotification(`a new blog post ${newBlog.title} by ${newBlog.author} added`, 'success'))
    } catch (error) {
      dispatch(sendNotification(`${error}`, 'error'))
    }
  }
}

export const incrementLikes = (blogToUpdate) => {
  return async (dispatch) => {
    try {
      const updatedBlog = await blogService.updateBlog({ ...blogToUpdate, likes: blogToUpdate.likes + 1 })
      dispatch(likeBlog(updatedBlog.id))
      dispatch(sendNotification(`you liked ${updatedBlog.title}`, 'success'))
    } catch (error) {
      dispatch(sendNotification(`${error}`, 'error'))
    }
  }
}

export const deleteBlog = (blogToDelete) => {
  return async (dispatch) => {
    try {
      await blogService.deleteBlog(blogToDelete)
      dispatch(removeBlog(blogToDelete.id))
      dispatch(sendNotification(`Blog ${blogToDelete.title} by ${blogToDelete.author} has been removed`, 'success'))
    } catch (error) {
      dispatch(sendNotification(`${error}`, 'error'))
    }
  }
}

export default blogSlice.reducer
