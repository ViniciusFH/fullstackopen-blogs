const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const UserService = require('../services/user');
const validatePassword = require('../utils/validatePassword');
const NewError = require('../utils/error');

usersRouter.post('/', async (req, res) => {
  const { username, name, password } = req.body;

  const validPassword = validatePassword(password);

  if (!validPassword) NewError('ValidationError', 'invalid password');

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = {
    username,
    name,
    passwordHash,
  };

  const savedUser = await UserService.createNew(user);

  res.status(201).json(savedUser);
});

usersRouter.get('/', async (_req, res) => {
  const users = await UserService.getAll();

  res.status(200).json(users);
});

usersRouter.get('/:id', async (req, res) => {
  const user = await UserService.getById(req.params.id);

  res.status(200).json(user);
});

module.exports = usersRouter;
