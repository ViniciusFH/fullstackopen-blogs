const mongoose = require('mongoose');
const User = require('../models/user');
const Blog = require('../models/blog');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userId = new mongoose.Types.ObjectId().toString();
const userPass = 'sekret';
const differentUserId = new mongoose.Types.ObjectId().toString();

const testUser = {
  id: userId,
  username: 'testUser',
  name: 'TestUser',
};

const differentUser = {
  id: differentUserId,
  username: 'differentUser',
  name: 'DifferentUser',
};

const initialBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    user: userId,
    __v: 0,
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    user: userId,
    __v: 0,
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    user: userId,
    __v: 0,
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    user: userId,
    __v: 0,
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    user: userId,
    __v: 0,
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    user: userId,
    __v: 0,
  },
];

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const getUserToken = (user) => {
  const token = jwt.sign(user, process.env.SECRET, {
    expiresIn: 60 * 60,
  });

  return token;
};

const createTestUser = async () => {
  await User.deleteMany({});

  const passwordHash = await bcrypt.hash(userPass, 10);

  await User.create({ ...testUser, passwordHash });
};

const usersInDb = async () => {
  const users = await User.find({});

  return users.map((user) => user.toJSON());
};

module.exports = {
  initialBlogs,
  blogsInDb,
  getUserToken,
  usersInDb,
  userId,
  createTestUser,
  testUser,
  userPass,
  differentUser,
};
