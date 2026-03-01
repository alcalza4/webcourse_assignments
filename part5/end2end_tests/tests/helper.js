const loginWith = async (page, username, password)  => {
  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const uploadBlog = async (page, request, blog) => {
  const token = await page.evaluate(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    return JSON.parse(loggedUserJSON).token
  })

  // 2. Make the API request using that token
  await request.post('http://localhost:3003/api/blogs', {
    data: blog,
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
}

export { loginWith, uploadBlog }