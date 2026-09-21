function getHealth(request, response) {
  response.json({ status: 'ok', service: 'express-api' })
}

module.exports = { getHealth }
