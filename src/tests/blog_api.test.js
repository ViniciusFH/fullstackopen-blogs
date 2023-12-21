const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');
const helper = require('./test_helper');

const api = supertest(app);

const authToken = helper.getUserToken(helper.testUser);

beforeAll(async () => await helper.createTestUser());

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.bulkSave(helper.initialBlogs.map((blog) => new Blog(blog)));
});

describe('when there is initially some blogs saved', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('all blogs are returned', async () => {
    const response = await api
      .get('/api/blogs')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });

  test('blogs have property id', async () => {
    const response = await api
      .get('/api/blogs')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.body[0].id).toBeDefined();
  });
});

describe('addition of a new blog', () => {
  test('succeeds with valid data', async () => {
    const newBlog = {
      title: 'New blog for testing',
      author: 'John Doe',
      url: 'https://newblog.com/',
      likes: 4,
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();

    const titles = blogsAtEnd.map((b) => b.title);

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);
    expect(titles).toContain('New blog for testing');
  });

  test('defaults likes property to 0', async () => {
    const newBlog = {
      title: 'New blog for testing',
      author: 'John Doe',
      url: 'https://newblog.com/',
    };

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.body.likes).toBe(0);
  });

  test('fails with status code 400 if data invalid', async () => {
    const newBlog = {
      author: 'John Doe',
      url: 'https://newblog.com/',
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(400);
  });

  test('fails with status code 401 if no auth is provided', async () => {
    const newBlog = {
      author: 'John Doe',
      url: 'https://newblog.com/',
    };

    const response = await api.post('/api/blogs').send(newBlog).expect(401);

    expect(response.body.error).toBe('invalid token');
  });
});

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(204);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);

    const titles = blogsAtEnd.map((b) => b.title);

    expect(titles).not.toContain(blogToDelete.title);
  });

  test('fails with status code 403 if user was not the creator', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    const diffAuthToken = helper.getUserToken(helper.differentUser);

    const response = await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${diffAuthToken}`)
      .expect(403);

    expect(response.body.error).toBe('action forbidden for this user');

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  });
});

describe('update of a blog', () => {
  test('succeeds with status code 200 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send({ likes: blogToUpdate.likes + 9 })
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    const blogsAtEnd = await helper.blogsInDb();
    const updatedBlog = blogsAtEnd.find((b) => b.id === blogToUpdate.id);

    expect(updatedBlog.likes).toBe(blogToUpdate.likes + 9);
  });
});

afterAll(async () => {
  await Blog.deleteMany({});
  await mongoose.connection.close();
});
