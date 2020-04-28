const express = require("express");

const contactRouter = express.Router();
const contactsControllers = require("../controllers/contactsControllers");

contactRouter.get("/contacts", contactsControllers.listContacts);
contactRouter.get("/contacts/:id", contactsControllers.getContactById);
contactRouter.post("/contacts", contactsControllers.newContactPost);
contactRouter.delete("/contacts/:id", contactsControllers.removeContact);
contactRouter.patch("/contacts/:id", contactsControllers.updateContact);

module.exports = contactRouter;
