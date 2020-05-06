const express = require("express");
const contactRouters = express.Router();

const {
  getAllContacts,
  getContactById,
  newContactPost,
  removeContact,
  updateContact,
  validateNewContact,
} = require("./contacts.controllers");

contactRouters.get("/", getAllContacts);
contactRouters.get("/:id", getContactById);
contactRouters.post("/", validateNewContact, newContactPost);
contactRouters.delete("/:id", removeContact);
contactRouters.patch("/:id", validateNewContact, updateContact);

module.exports = contactRouters;
