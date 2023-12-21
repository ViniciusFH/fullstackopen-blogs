const User = require('../models/user');

function getAll() {
  return User.find({}).populate('blogs');
}

function getById(id) {
  return User.findById(id);
}

function deleteById(id) {
  return User.findByIdAndDelete(id);
}

function getByName(name) {
  return User.find({ name });
}

function getByUsername(username) {
  return User.findOne({ username });
}

async function createNew(user) {
  const newUser = new User(user);

  await newUser.save();

  return newUser;
}

async function updateById(id, data) {
  const updatedUser = await User.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
    context: 'query',
  });

  return updatedUser;
}

module.exports = {
  getAll,
  getById,
  deleteById,
  getByName,
  createNew,
  updateById,
  getByUsername,
};
