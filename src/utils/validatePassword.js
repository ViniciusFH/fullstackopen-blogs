function validatePassword(password) {
  if (password.length < 3) return false;

  return true;
}

module.exports = validatePassword;
