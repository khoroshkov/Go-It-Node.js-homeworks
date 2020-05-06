const Joi = require("@hapi/joi");
const contactModel = require("./contacts.model");
const {
  Types: { ObjectId },
} = require("mongoose");

const contactsInfoSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
});

async function getAllContacts(req, res) {
  try {
    const contacts = await contactModel.find();

    return res.status("200").json(contacts);
  } catch {
    return res
      .status(400)
      .send(
        "ooops! Can`t get contacts from data base right now! try again later..."
      );
  }
}

async function getContactById(req, res) {
  try {
    const contact = await contactModel.findById(req.params.id);
    if (!contact) return res.status(404).json({ message: "contact not found" });

    return res.status(200).send(contact);
  } catch (error) {
    res
      .status(400)
      .send(
        "ooops! Can`t get this contact from data base right now! try again later..."
      );
  }
}

async function newContactPost(req, res) {
  try {
    const newContact = await contactModel.create(req.body);

    return res.status(201).json(newContact);
  } catch (error) {
    res.status(400).send(error);
  }
}

async function updateContact(req, res) {
  try {
    const updatedContact = await contactModel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!updatedContact)
      return res.status(404).json({ message: "Contact not found" });

    return res.status(200).json(updatedContact);
  } catch (error) {
    res.status(400).send(error);
  }
}

async function removeContact(req, res) {
  try {
    const contactToDelete = await contactModel.findByIdAndRemove(req.params.id);

    if (!contactToDelete)
      return res
        .status(400)
        .json({ message: "Contact you want to delete not found" });

    return res.status(200).json({ message: "Contact deleted" });
  } catch (error) {
    res.status(400).send(error);
  }
}

function validateNewContact(req, res, next) {
  try {
    contactsInfoSchema.validate(req.body);

    next();
  } catch (error) {
    res.status(400).json({ " message": "Missing required fields" });
  }
}

module.exports = {
  getAllContacts,
  getContactById,
  newContactPost,
  removeContact,
  updateContact,
  validateNewContact,
};
