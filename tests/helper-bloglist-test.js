const createBlog = async (page, title, author, url) => {
  await page.getByRole('button', { name: 'New blog' }).click();

  await page.getByLabel('title').fill(title);
  await page.getByLabel('author').fill(author);
  await page.getByLabel('url').fill(url);

  await page.getByRole('button', { name: 'Save' }).click();
};

export default { createBlog };
