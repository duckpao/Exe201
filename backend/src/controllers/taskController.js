const taskModel = require('../models/taskModel')

function getTasks(request, response) {
  response.json(taskModel.findAll())
}

module.exports = { getTasks }
