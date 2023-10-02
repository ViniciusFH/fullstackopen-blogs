const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const User = require('../models/user');
const helper = require('./test_helper');

const api = supertest(app);

beforeAll(async () => {
  await User.deleteMany({});
  await helper.createTestUser();
});

describe('login user', () => {
  test('succeeds with valid data', async () => {
    const userLogin = {
      username: helper.testUser.username,
      password: helper.userPass,
    };

    const response = await api
      .post('/api/login')
      .send(userLogin)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body.token).toBeDefined();
  });

  test('fails with invalid password', async () => {
    const userLogin = {
      username: helper.testUser.username,
      password: 'invalidpassword',
    };

    const response = await api.post('/api/login').send(userLogin).expect(401);

    expect(response.body.error).toBe('invalid username or password');
  });
});

afterAll(async () => {
  await User.deleteMany({});
  await mongoose.connection.close();
});
