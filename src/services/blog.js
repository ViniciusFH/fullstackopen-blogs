const Blog = require('../models/blog');
const UserService = require('../services/user');
const NewError = require('../utils/error');

function getAll() {
  return Blog.find({}).populate('user', { username: 1, name: 1 });
}

function getById(id) {
  return Blog.findById(id);
}

async function deleteById(id, userId) {
  const blog = await getById(id);

  if (blog.user.toString() !== userId) {
    NewError('InvalidUser');
  }

  await blog.deleteOne();
}

function getByName(name) {
  return Blog.find({ name });
}

async function createNew(blog) {
  if (!blog.user) {
    NewError('ValidationError', '`user` is required in blog creation');
  }

  const user = await UserService.getById(blog.user);

  if (!user) {
    NewError('ValidationError', `user ${blog.user} not found`);
  }

  const newBlog = new Blog(blog);
  user.blogs.push(newBlog._id);

  await Promise.all([newBlog.save(), user.save()]);

  return { ...newBlog.toJSON(), user };
}

async function updateById(id, data) {
  const updatedBlog = await Blog.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
    context: 'query',
  }).populate('user');

  return updatedBlog;
}

module.exports = {
  getAll,
  getById,
  deleteById,
  getByName,
  createNew,
  updateById,
};
