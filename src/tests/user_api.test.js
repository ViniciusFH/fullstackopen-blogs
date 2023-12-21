const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const User = require('../models/user');
const helper = require('./test_helper');

const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});
  await helper.createTestUser();
});

describe('addition of a new user', () => {
  test('succeeds with valid data', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'johndoe',
      name: 'John Doe',
      password: '123456',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();

    const names = usersAtEnd.map((b) => b.name);

    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);
    expect(names).toContain(newUser.name);
  });

  test('fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: helper.testUser.username,
      name: helper.testUser.name,
      password: '123456',
    };

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(response.body.error).toContain('expected `username` to be unique');

    const usersAtEnd = await helper.usersInDb();

    expect(usersAtEnd).toEqual(usersAtStart);
  });
});

afterAll(async () => {
  await User.deleteMany({});
  await mongoose.connection.close();
});
