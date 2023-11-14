const mongoose = require('mongoose');

if (process.argv.length < 2) {
  console.log('password or data is missing');
  process.exit(1);
}
const password = process.argv[2];
const url = `mongodb+srv://mbashiribrahim7:${password}@cluster0.md0bxwm.mongodb.net/personApp?retryWrites=true&w=majority`;

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});
const Person = mongoose.model('Person', personSchema);
if (process.argv.length === 5) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  });

  person.save().then((result) => {
    console.log(`added ${person.name} ${person.number} to phonebook`);
    mongoose.connection.close();
  });
}

if (process.argv.length === 3) {
  mongoose.connect(url);
  console.log('Phonebook:');
  Person.find({}).then((result) => {
    result.map((person) => {
      console.log(person.name, person.number);
    });
    mongoose.connection.close();
  });
}
