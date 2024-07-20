import { test, expect } from '@playwright/test';

test.describe('Blog App', () => {
  test.beforeEach(async ({ request, page }) => {
    await request.post('http://localhost:3003/api/testing/rest');

    await request.post('http://localhost:3003/api/users', {
      data: {
        userName: 'PruebaJorge',
        name: 'Jorge',
        password: '1234Pepo',
      },
    });

    await page.goto('http://localhost:5173');
  });

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
  });

  test.describe('Users Login', () => {
    test('succeeds with correct credentials', async ({ page, request }) => {
      await page.getByRole('textbox').first().fill('PruebaJorge');
      await page.getByRole('textbox').last().fill('1234Pepo');
      await page.getByRole('button', { name: 'Login' }).click();
      await expect(page.getByText('Jorge')).toBeVisible();
    });

    test('fails with wrong credentials', async ({ page, request }) => {
      await page.getByRole('textbox').first().fill('PruebaJorge');
      await page.getByRole('textbox').last().fill('1234Pepo56');
      await page.getByRole('button', { name: 'Login' }).click();
      await expect(page.getByText('wrong')).toBeVisible();
    });
  });
});
