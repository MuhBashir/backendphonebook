require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/persons');

// Do not save your password to GITHUB

app.use(cors());
app.use(express.static('dist'));
app.use(express.json());
// posting a new resource or data
app.post('/api/persons', (req, res, next) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'name or number is missing',
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });
  person
    .save()
    .then((personSaved) => {
      res.json(personSaved);
    })
    .catch((error) => next(error));
});

// Define a custom token for logging request body
morgan.token('req-body', (req) => {
  return JSON.stringify(req.body);
});
app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :req-body'
  )
);

// gettin info about the number of persons i have
app.get('/info', (req, res) => {
  Person.find({}).then((persons) => {
    res.send(`<p>phonebook has ${persons.length} people</p>
      <p>${new Date()}</p>
      `);
  });
});

//getting all persons
app.get('/api/persons', (req, res) => {
  Person.find({}).then((person) => {
    res.json(person);
  });
});

// getting single person
app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id;
  Person.findById(id)
    .then((person) => {
      if (person) {
        res.json(person);
      }

      res.status(404).end();
    })
    .catch((error) => next(error));
});

//deleting a single person functionality
app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id;
  Person.findByIdAndDelete(id)
    .then((person) => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

// updating a resource

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body;
  const person = {
    name: body.name,
    number: body.number,
  };
  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then((updatedPerson) => {
      res.json(updatedPerson);
    })
    .catch((error) => next(error));
});

const errorHandler = (error, req, res, next) => {
  const body = req.body;
  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformmatted id' });
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  }
  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`server is connected on port ${PORT}`);
});
