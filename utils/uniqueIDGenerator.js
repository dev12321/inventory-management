const generate = require("nanoid/async/generate");

const {
  INVENTORY_ALPHABET,
  INVENTORY_ID_LENGTH,
  USER_ALPHABET,
  USER_ID_LENGTH
} = require("./constants");

const getInventoryId = async () => {
  const id = await generate(INVENTORY_ALPHABET, INVENTORY_ID_LENGTH);
  return id;
};

const getUserId = async () => {
  const id = await generate(USER_ALPHABET, USER_ID_LENGTH);
  return id;
};

module.exports = {
  getInventoryId,
  getUserId
};
