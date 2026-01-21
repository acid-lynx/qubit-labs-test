import { test, expect } from '@playwright/test'

test.describe('App', () => {
  test('has title', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Qubit Labs Test/)
  })

  test('displays welcome message', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h1')).toContainText('Welcome to Vue 3')
  })

  test('increments counter when button clicked', async ({ page }) => {
    await page.goto('/')

    const countText = page.locator('text=Count:')
    await expect(countText).toContainText('Count: 0')

    await page.click('button:has-text("Increment")')
    await expect(countText).toContainText('Count: 1')

    await page.click('button:has-text("Increment")')
    await expect(countText).toContainText('Count: 2')
  })
})
