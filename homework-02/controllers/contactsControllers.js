const fs = require("fs");
const path = require("path");
const Joi = require("@hapi/joi");

const contactsDB = path.join(__dirname, "../db/contacts.json");

const getContactsArr = () => JSON.parse(fs.readFileSync(contactsDB, "utf-8"));

const contactsInfoSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
});

function listContacts(req, res) {
  const contactsArr = getContactsArr();

  res.status(200).send(contactsArr);
}

function getContactById(req, res) {
  const contactsArr = getContactsArr();

  let contactFound = contactsArr.find(
    (contact) => contact.id === Number(req.params.id)
  );
  if (contactFound) {
    res.status(200).send(contactFound);
  } else {
    res.status(404).json({ message: "contact not found" });
  }
}

function newContactPost(req, res) {
  const { name, email, phone } = req.body;
  const errorMessage = { message: "missing required fields" };

  const validationResult = contactsInfoSchema.validate(req.body);

  if (validationResult.error) {
    return res.status(400).send(errorMessage);
  } else {
    let newContact = {
      id: Date.now(),
      name,
      email,
      phone,
    };

    const contactsArr = getContactsArr();

    const updatedContacts = JSON.stringify([...contactsArr, newContact]);

    fs.writeFile(contactsDB, updatedContacts, function (err) {
      if (err) return res.send(err);
      res.status(201).send(newContact);
    });
  }
}

function removeContact(req, res) {
  const deletedMessage = { message: "contact deleted" };
  const notFoundMessage = { message: "Contact not found" };

  const contactsArr = getContactsArr();

  const matchContact = contactsArr.find(
    (contact) => contact.id === Number(req.params.id)
  );

  if (matchContact) {
    const contacts = contactsArr.filter(
      (contact) => contact.id !== Number(req.params.id)
    );
    fs.writeFile(contactsDB, JSON.stringify(contacts), function (err) {
      if (err) return res.send(err);
      res.status(200).send(deletedMessage);
    });
  } else {
    res.status(404).send(notFoundMessage);
  }
}

async function updateContact(req, res) {
  const errorMessage = { message: "missing required fields" };

  const result = contactsInfoSchema.validate(req.body);

  if (result.error) {
    return res.status(400).send(errorMessage);
  } else {
    const contactsArr = await JSON.parse(fs.readFileSync(contactsDB, "utf-8"));
    const contacts = contactsArr.filter(
      (contact) => contact.id !== Number(req.params.id)
    );

    const updatedContact = {
      id: +req.params.id,
      ...req.body,
    };

    const updatedContacts = JSON.stringify([...contacts, updatedContact]);

    fs.writeFile(contactsDB, updatedContacts, function (err) {
      if (err) return res.send(err);
      res.status(200).send(updatedContact);
    });
  }
}

module.exports = {
  listContacts,
  getContactById,
  newContactPost,
  removeContact,
  updateContact,
};
