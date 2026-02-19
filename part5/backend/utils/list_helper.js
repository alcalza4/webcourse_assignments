// utils/list_helper.js

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  return blogs.reduce((mostLikes, blog) => {
    return mostLikes.likes > blog.likes ? mostLikes : blog
  })
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const authorCounts = {}

  blogs.forEach(blog => {
    const author = blog.author
    authorCounts[author] = (authorCounts[author] || 0) + 1
  })

  return Object.entries(authorCounts).reduce((max, [author, count]) => {
    return count > max.blogs ? { author: author, blogs: count} : max
  }, {blogs: -1})
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const authorLikeCounts = {}

  blogs.forEach(blog => {
    const author = blog.author
    authorLikeCounts[author] = (authorLikeCounts[author] || 0) + blog.likes
  })

  return Object.entries(authorLikeCounts).reduce((max, [author, likeCount]) => {
    return likeCount > max.likes ? { author: author, likes: likeCount} : max
  }, {likes: -1})
}

module.exports = {
  totalLikes, favoriteBlog, mostBlogs, mostLikes
}