function parsePagination(query, defaultLimit = 9) {
  const page = Math.max(1, Number(query.page) || 1)
  const limit = Math.max(1, Number(query.limit) || defaultLimit)
  const offset = (page - 1) * limit
  return { page, limit, offset }
}

function buildPagination({ page, limit, total }) {
  return { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) }
}

module.exports = { parsePagination, buildPagination }
