import { test, expect } from '@playwright/test';

test.describe('Blog App', () => {
  test.beforeEach(async ({ request, page }) => {
    await request.post('http://localhost:3003/api/testing/reset');

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

    test.describe('When logged in', () => {
      test.beforeEach(async ({ page, request }) => {
        await page.getByRole('textbox').first().fill('PruebaJorge');
        await page.getByRole('textbox').last().fill('1234Pepo');
        await page.getByRole('button', { name: 'Login' }).click();
      });

      test('a new blog can be created', async ({ page, request }) => {
        await page.getByRole('button', { name: 'New blog' }).click();

        await page.getByLabel('title').fill('Prueba play');
        await page.getByLabel('author').fill('firulai');
        await page.getByLabel('url').fill('www.google.com');

        await page.getByRole('button', { name: 'Save' }).click();

        await expect(page.getByText('Prueba play')).toBeVisible();
      });

      test('the blog can be liked', async ({ page, request }) => {
        await page.getByRole('button', { name: 'New blog' }).click();

        await page.getByLabel('title').fill('Prueba play');
        await page.getByLabel('author').fill('firulai');
        await page.getByLabel('url').fill('www.google.com');

        await page.getByRole('button', { name: 'Save' }).click();
        await page.getByRole('button', { name: 'Show' }).click();

        await page.getByRole('button', { name: 'Like' }).click();

        await expect(page.getByText('1')).toBeVisible();
      });

      test('a blog can be deleted', async ({ page, request }) => {
        await page.getByRole('button', { name: 'New blog' }).click();

        await page.getByLabel('title').fill('Prueba play');
        await page.getByLabel('author').fill('firulai');
        await page.getByLabel('url').fill('www.google.com');

        await page.getByRole('button', { name: 'Save' }).click();
        await page.getByRole('button', { name: 'Show' }).click();
        await page.getByRole('button', { name: 'Delete' }).click();

        page.on('dialog', async (dialog) => {
          expect(dialog.message()).toContain('Pipoc');

          await dialog.accept();
        });
      });
    });
  });
});
