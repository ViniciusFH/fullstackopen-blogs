const NewError = (name, message = '') => {
  const newError = new Error(message);
  newError.name = name;

  throw newError;
};

module.exports = NewError;
