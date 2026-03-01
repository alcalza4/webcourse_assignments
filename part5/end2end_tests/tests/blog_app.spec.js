const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, uploadBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Lonny Fairfield',
        username: 'lfairfield',
        password: 'kentsucks123'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('Log in to application')).toBeVisible()
    await expect(page.getByText('username')).toBeVisible()
    await expect(page.getByText('password')).toBeVisible()
    
    const textboxes = await page.getByRole('textbox').all()
    await expect(textboxes).toHaveLength(2)
  })

  describe('Login', () => {
    beforeEach(async ({ page }) => {
      await page.goto('http://localhost:5173')
    })

    test('succeeds with correct credentials', async ({ page }) => {

      await page.getByLabel('username').fill('lfairfield')
      await page.getByLabel('password').fill('kentsucks123')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('Lonny Fairfield logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByLabel('username').fill('wrongusername')
      await page.getByLabel('password').fill('wrongpassword')
      await page.getByRole('button', { name: 'login' }).click()
      
      const errorDiv = page.locator('.error')
      await expect(errorDiv).toContainText('wrong username or password')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.goto('http://localhost:5173')
      await loginWith(page, 'lfairfield', 'kentsucks123')
      await expect(page.getByText('logged in')).toBeVisible()
    })

    test('a new blog can be created', async ({ page }) => {
      // ensure form shows
      await page.getByRole('button', { name: 'create new note' }).click()
      
      await expect(page.getByRole('heading', { name: 'create new' })).toBeVisible()
      await expect(page.getByText('title:')).toBeVisible()
      await expect(page.getByText('author:')).toBeVisible()
      await expect(page.getByText('url:')).toBeVisible()
      
      const textboxes = await page.getByRole('textbox').all()
      await expect(textboxes).toHaveLength(3)
      
      // fill form
      await page.getByPlaceholder('title').fill('blog title')
      await page.getByPlaceholder('author').fill('blog author')
      await page.getByPlaceholder('url').fill('blogurl.com')
      await page.getByRole('button', { name: 'create' }).click()

      // check if it update
      await expect(page.getByRole('button', { name: 'create new note' })).toBeVisible()
      const blogElement = page.locator('.blog').filter({ hasText: 'blog title' })
      await expect(blogElement).toBeVisible()
      await expect(blogElement.getByRole('button', { name: 'view' })).toBeVisible()
    })

    test('ensure a blog can be liked', async ({ page, request }) => {
      await uploadBlog(page, request, {
        title: 'Dinger Derby',
        author: 'Kent Murphy',
        url: 'dingerderby.com'
      })
      await page.reload()

      await page.getByRole('button', { name: 'view' }).click()

      const blogElement = page.locator('.blog').filter({ hasText: 'dingerderby.com' })
      await expect(blogElement).toBeVisible()
      await expect(blogElement.getByRole('button', { name: 'hide' })).toBeVisible()
      
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('1')).toBeVisible()
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('2')).toBeVisible()
    })

    test('ensure a blog can be deleted', async ({ page, request }) => {
      await uploadBlog(page, request, {
        title: 'Dinger Derby',
        author: 'Kent Murphy',
        url: 'dingerderby.com'
      })
      await page.reload()

      await page.getByRole('button', { name: 'view' }).click()
      
      const blogElement = page.locator('.blog').filter({ hasText: 'dingerderby.com' })
      await expect(blogElement).toBeVisible()
      await expect(blogElement.getByRole('button', { name: 'hide' })).toBeVisible()
      
      page.on('dialog', dialog => dialog.accept())
      await page.getByRole('button', { name: 'remove' }).click()

      const errorDiv = page.locator('.success') 
      await expect(errorDiv).toContainText('Dinger Derby')
      await expect(errorDiv).toHaveCSS('color', 'rgb(0, 128, 0)')
    })

    test('ensures only the user who added the blog sees delete button', async ({ page, request }) => {
      await uploadBlog(page, request, {
        title: 'Dinger Derby',
        author: 'Kent Murphy',
        url: 'dingerderby.com'
      })

      await page.reload()
      await page.getByRole('button', { name: 'logout' }).click()
      await expect(page.getByText('Log in to application')).toBeVisible()
      
      await request.post('http://localhost:3003/api/users', {
        data: {
          name: 'Chucky',
          username: 'chuckyhomerun',
          password: 'jail2time'
        }
      })

      await loginWith(page, 'chuckyhomerun', 'jail2time')
      await expect(page.getByText('logged in')).toBeVisible()

      const blogElement = page.locator('.blog').filter({ hasText: 'dingerderby.com' })
      await expect(blogElement).toBeVisible()
      
      await page.getByRole('button', { name: 'view' }).click()
      await expect(blogElement.getByRole('button', { name: 'remove' })).not.toBeVisible()
    })

    test('ensure the blogs are in the correct ordering according to likes', async ({ page, request }) => {
      await uploadBlog(page, request, { title: 'Blog 1', author: 'A', url: 'a.com', likes: 3 })
      await uploadBlog(page, request, { title: 'Blog 2', author: 'B', url: 'b.com', likes: 8 })
      await uploadBlog(page, request, { title: 'Blog 3', author: 'C', url: 'c.com', likes: 6 })

      await page.reload()

      const blogs = page.locator('.blog')
      await expect(blogs.nth(0)).toContainText('Blog 2')
      await expect(blogs.nth(1)).toContainText('Blog 3')
      await expect(blogs.nth(2)).toContainText('Blog 1')

      const blogToUpdate = page.locator('.blog').filter({ hasText: 'Blog 3'})
      await blogToUpdate.getByRole('button', { name: 'view'}).click()

      const likeButton = blogToUpdate.getByRole('button', { name: 'like'})

      await likeButton.click()
      await expect(blogToUpdate.getByText('likes 7')).toBeVisible()
      await likeButton.click()
      await expect(blogToUpdate.getByText('likes 8')).toBeVisible()
      await likeButton.click()
      await expect(blogToUpdate.getByText('likes 9')).toBeVisible()

      await expect(blogs.nth(0)).toContainText('Blog 3')
      await expect(blogs.nth(1)).toContainText('Blog 2')
      await expect(blogs.nth(2)).toContainText('Blog 1')
    })
  })
})