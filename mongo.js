const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('give password as argument');
  process.exit(1);
}

const mongoPassword = process.argv[2];

const url = `mongodb+srv://viniciusheleno:${mongoPassword}@fullstackopen.pirzsls.mongodb.net/phonebookApp?retryWrites=true&w=majority`;

mongoose.set('strictQuery', false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

const entryName = process.argv[3];
const entryNumber = process.argv[4];

if (entryName && entryNumber) addPerson(entryName, entryNumber);
else getAllPersons();

function addPerson(name, number) {
  const person = new Person({
    name,
    number,
  });

  person.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  });
}

function getAllPersons() {
  Person.find({}).then((result) => {
    result.forEach((person) => console.log(person));
    mongoose.connection.close();
  });
}
