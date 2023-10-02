const blogsRouter = require('express').Router();
const BlogService = require('../services/blog');

blogsRouter.get('/', async (_req, res) => {
  const blogs = await BlogService.getAll();
  res.json(blogs);
});

blogsRouter.get('/:id', async (req, res) => {
  const { id } = req.params;

  const blog = await BlogService.getById(id);

  if (blog) res.json(blog);
  else res.sendStatus(404);
});

blogsRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;

  await BlogService.deleteById(id, req.user.id);

  res.sendStatus(204);
});

blogsRouter.post('/', async (req, res) => {
  const blog = req.body;
  const newBlog = await BlogService.createNew({ ...blog, user: req.user.id });
  res.status(201).json(newBlog);
});

blogsRouter.put('/:id', async (req, res) => {
  const blog = req.body;

  const updatedBlog = await BlogService.updateById(req.params.id, blog);
  if (!updatedBlog) {
    return res.status(404).json({ error: 'blog not found' });
  }
  res.status(200).json(updatedBlog);
});

module.exports = blogsRouter;
