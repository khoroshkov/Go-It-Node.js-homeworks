const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

const options = {
  page: 1,
  limit: 20,
};

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

contactSchema.plugin(mongoosePaginate);

const contactModel = mongoose.model("Contact", contactSchema);
contactModel.paginate({}, options, function (err, result) {
  result.docs, (result.limit = 20), (result.page = 1);
});

module.exports = contactModel;
