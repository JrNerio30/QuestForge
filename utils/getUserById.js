function getUserById(id, users) {
  const userId = parseInt(id);
  const user = users.find((user) => user.id === userId);

  return user;
}

module.exports = getUserById;