const slugify = require("./slugify");

function getUserByName(name, users) {
  const userName = slugify(name);
  return users.find((user) => {
    const slugifiedName = slugify(user.username);
    return slugifiedName === userName
  });
}

module.exports = getUserByName;