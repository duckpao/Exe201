const bcrypt = require('bcryptjs')

function hashPassword(plainPassword) {
  return bcrypt.hash(plainPassword, 10)
}

function comparePassword(plainPassword, passwordHash) {
  return bcrypt.compare(plainPassword, passwordHash)
}

module.exports = { hashPassword, comparePassword }
