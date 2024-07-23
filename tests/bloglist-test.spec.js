import { test, expect } from '@playwright/test';
import helper from './helper-bloglist-test.js';

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
        await helper.createBlog(page, 'Prueba play', 'firulai', 'www.google.com');

        await expect(page.getByText('Prueba play')).toBeVisible();
      });

      test('the blog can be liked', async ({ page, request }) => {
        await helper.createBlog(page, 'Prueba play', 'firulai', 'www.google.com');
        await page.getByRole('button', { name: 'Show' }).click();

        await page.getByRole('button', { name: 'Like' }).click();

        await expect(page.getByText('1')).toBeVisible();
      });

      test('a blog can be deleted only by the user who created', async ({ page, request }) => {
        await helper.createBlog(page, 'Prueba play', 'firulai', 'www.google.com');
        await page.getByRole('button', { name: 'Show' }).click();

        page.on('dialog', async (dialog) => {
          expect(dialog.message()).toContain('Remove Prueba play by firulai ?');

          await dialog.accept();
        });

        await page.getByRole('button', { name: 'Delete' }).click();
      });

      test('the blogs are arranged in order', async ({ page }) => {
        await helper.createBlog(page, 'Prueba play', 'firulai', 'www.google.com');
        await page.getByText('Cancel').click();
        await helper.createBlog(page, 'Prueba 2', 'firulai', 'www.google.com');
        await page.getByText('Cancel').click();
        await helper.createBlog(page, 'Prueba super', 'con mas blogs', 'www.google.com');
        await page.getByText('Cancel').click();

        const blog1 = await page.getByText('Prueba play'),
          blog3 = await page.getByText('Prueba super');

        await blog3.getByRole('button', { name: 'Show' }).click();
        await blog3.getByRole('button', { name: 'Like' }).click();
        await blog3.getByRole('button', { name: 'Like' }).click();
        await blog3.getByRole('button', { name: 'Like' }).click();

        await blog1.getByRole('button', { name: 'Show' }).click();
        await blog1.getByRole('button', { name: 'Like' }).click();

        await page.reload();

        await page.getByRole('button', { name: 'Show' }).first().click();
        await expect(page.getByText('3')).toBeVisible();
      });
    });
  });
});
