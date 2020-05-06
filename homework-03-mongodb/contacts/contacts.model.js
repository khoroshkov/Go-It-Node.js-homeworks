const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contactSchema = new Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    validate: (value) => value.includes("@"),
  },
  phone: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /((\(\d{3}\) ?)|(\d{3}-))?\d{3}-\d{4}/.test(v);
      },
    },
  },
});

const contactModel = mongoose.model("Contact", contactSchema);

module.exports = contactModel;
