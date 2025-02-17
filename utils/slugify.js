function slugify(str) {
  if(!str) {
    throw new Error("string is empty");
  }
  return str.toLowerCase().replace(/\s+/g, "-");
}

module.exports = slugify;