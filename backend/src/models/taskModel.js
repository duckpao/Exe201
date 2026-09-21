const tasks = [
  { id: 1, title: 'Kết nối frontend với API', done: true },
  { id: 2, title: 'Thiết kế database', done: false },
  { id: 3, title: 'Thêm xác thực người dùng', done: false },
]

function findAll() {
  return tasks
}

module.exports = { findAll }
