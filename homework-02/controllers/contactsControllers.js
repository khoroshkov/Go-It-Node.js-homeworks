const fs = require("fs");
const path = require("path");

const contactsDB = path.join(__dirname, "../db/contacts.json");

// const contacts = fs.readFileSync(contactsDB, "utf-8");
// const contactsArr = JSON.parse(contacts);

function listContacts(req, res) {
  const contacts = fs.readFileSync(contactsDB, "utf-8");
  const contactsArr = JSON.parse(contacts);

  res.status(200).send(contactsArr);
}

function getContactById(req, res) {
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

  if (!name || !email || !phone) {
    return res.status(400).send(errorMessage);
  } else {
    let newContact = {
      id: Date.now(),
      name,
      email,
      phone,
    };

    const contacts = fs.readFileSync(contactsDB, "utf-8");
    const contactsArr = JSON.parse(contacts);

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

  const contactsArr = JSON.parse(fs.readFileSync(contactsDB, "utf-8"));

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

function updateContact(req, res) {
  const { name, email, phone } = req.body;
  const errorMessage = { message: "missing required fields" };

  if (!name || !email || !phone) {
    return res.status(400).send(errorMessage);
  } else {
    const contactsArr = JSON.parse(fs.readFileSync(contactsDB, "utf-8"));
    const contact = contactsArr.find(
      (contact) => contact.id === Number(req.params.id)
    );
    contact.id;
    contact.name = name;
    contact.email = email;
    contact.phone = phone;

    const updatedContacts = JSON.stringify([...contactsArr, contact]);

    fs.writeFile(contactsDB, updatedContacts, function (err) {
      if (err) return res.send(err);
      res.status(200).send(contact);
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
