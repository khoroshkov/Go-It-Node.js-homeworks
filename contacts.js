const fs = require("fs");
const path = require("path");

const contactsPath = path.join(__dirname, "./db/contacts.json");

module.exports = {
  listContacts: () => {
    fs.readFile(contactsPath, (err, data) => {
      if (err) {
        console.log(err);
      }

      console.table(JSON.parse(data));
    });
  },

  getContactById: (contactId) => {
    fs.readFile(contactsPath, (err, data) => {
      if (err) {
        console.log(err);
      }
      const foundContact = JSON.parse(data).find(({ id }) => id === contactId);
      console.log(foundContact);
    });
  },

  removeContact: (contactId) => {
    fs.readFile(contactsPath, (err, data) => {
      if (err) {
        console.log(err);
      }
      const filteredArray = JSON.parse(data).filter(
        ({ id }) => id !== contactId
      );
      const updatedContacts = JSON.stringify(filteredArray);
      fs.writeFile(contactsPath, updatedContacts, (err) => {
        if (err) {
          console.log(err);
        }
      });
      console.log("Contact removed");
    });
  },

  addContact: (name, email, phone) => {
    const newContact = {
      name,
      email,
      phone,
    };

    fs.readFile(contactsPath, (err, data) => {
      if (err) {
        console.log(err);
      }
      const existedContacts = JSON.parse(data);
      existedContacts.push(newContact);
      const updatedContacts = JSON.stringify(existedContacts);
      fs.writeFile(contactsPath, updatedContacts, (err) => {
        if (err) {
          console.log(err);
        }
        console.log("Contact has been added:", newContact);
      });
    });
  },
};
