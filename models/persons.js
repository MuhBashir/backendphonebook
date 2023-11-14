const mongoose = require('mongoose');

const url = process.env.MONGODB_URI;

console.log('connecting', url);

mongoose
  .connect(url)
  .then((result) => {
    console.log(`connected to mongodb`);
  })
  .catch((err) => {
    console.log('Error in connecting to Mongodb', err.message);
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true,
  },
  number: {
    type: String,
    validate: {
      validator: function (value) {
        const parts = value.split('-');

        if (parts.length !== 2) {
          return false;
        }

        const [firstPart, secondPart] = parts;

        if (
          !(firstPart.length === 2 || firstPart.length === 3) ||
          !/^\d+$/.test(firstPart) ||
          !/^\d+$/.test(secondPart)
        ) {
          return false;
        }

        return true;
      },
      message: 'the number should be of two parts separated - ',
    },
  },
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Person', personSchema);
