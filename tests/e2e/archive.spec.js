import { expect, test } from '@playwright/test'

test('archive navigation reaches the Yangjiatang vertical slice and returns', async ({
  page,
}) => {
  await page.goto('/')
  await expect(page.locator('h1')).toBeVisible()
  await page.getByRole('link').filter({ hasText: '进入章节' }).first().click()
  await expect(page.locator('h1')).toBeVisible()
  await page.getByRole('link').filter({ hasText: '开始观察' }).click()
  await expect(page.locator('h1')).toBeVisible()
  await page.getByRole('link').filter({ hasText: '杨家堂' }).click()
  await expect(page.locator('h1')).toBeVisible()
})

test('other two village chapters provide visible pending archive states', async ({
  page,
}) => {
  await page.goto('/#/village/songzhuang')
  await expect(page.getByText('尚待接入').first()).toBeVisible()
  await page.goto('/#/village/banqiao')
  await expect(page.getByText('尚待接入').first()).toBeVisible()
})

test('archive reading stations render source layers', async ({ page }) => {
  await page.goto('/#/station/songzhuang-sutuhu')
  await expect(page.locator('.reading-body')).toBeVisible()
  await page.goto('/#/station/banqiao-lan-teacher')
  await expect(page.locator('.source-fold')).toBeVisible()
  await expect(page.getByText(/Cronbach/)).toBeVisible()
})
