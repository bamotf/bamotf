import {expect, test} from '@playwright/test'

test('test', async ({page}) => {
  await page.goto('/login')
  await page.getByLabel('Username').click()
  await page.getByLabel('Username').fill('satoshi')
  await page.getByLabel('Username').press('Tab')
  await page.getByLabel('Password').fill('satoshi')
  await page.getByRole('button', {name: 'Log in'}).click()
  // hover the user avatar
  await page.getByLabel('user-nav').click()
  await page.getByText('Log out').click()
})
