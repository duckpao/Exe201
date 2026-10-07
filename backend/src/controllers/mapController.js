const mapService = require('../services/mapService')

async function autocomplete(request, response) {
  const text = String(request.query.text || '').trim()
  if (text.length < 2) return response.json({ data: [] })
  const data = await mapService.autocomplete(text, request.query.focus)
  response.json({ data })
}

async function getPlace(request, response) {
  const data = await mapService.getPlace(request.query.refId)
  response.json(data)
}

module.exports = { autocomplete, getPlace }