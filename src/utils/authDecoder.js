const jwt = require('jsonwebtoken');

function authDecoder(req) {
  const authorization = req.get('authorization');
  if (authorization && authorization.startsWith('Bearer ')) {
    const token = authorization.replace('Bearer ', '');
    const user = jwt.verify(token, process.env.SECRET);
    if (user.id) {
      return user;
    }
  }
  return null;
}

module.exports = authDecoder;
