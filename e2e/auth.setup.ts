import { test as setup, expect } from '@playwright/test'
import path from 'path'

export const USER_STATE = path.join(__dirname, '../.playwright/user.json')
export const ADMIN_STATE = path.join(__dirname, '../.playwright/admin.json')

setup('autenticar usuario regular', async ({ page }) => {
  await page.goto('/login')
  await page.locator('input[name="email"]').fill('user@artentino.test')
  await page.locator('input[name="password"]').fill('User1234!')
  await page.getByRole('button', { name: 'Ingresar' }).click()
  await page.waitForURL('/')
  await page.context().storageState({ path: USER_STATE })
})

setup('autenticar administrador', async ({ page }) => {
  await page.goto('/login')
  await page.locator('input[name="email"]').fill('admin@artentino.test')
  await page.locator('input[name="password"]').fill('Admin1234!')
  await page.getByRole('button', { name: 'Ingresar' }).click()
  await page.waitForURL('/')
  await page.context().storageState({ path: ADMIN_STATE })
})
