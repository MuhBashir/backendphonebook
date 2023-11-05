const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

// Define a custom token for logging request body
morgan.token('req-body', (req) => {
  return JSON.stringify(req.body);
});

app.use(express.json());
app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :req-body'
  )
);
app.use(cors());
app.use(express.static('dist'));

// gettin info about the number of persons i have
app.get('/info', (req, res) => {
  res.send(`<p>phonebook has ${persons.length} people</p>
  <p>${new Date()}</p>
  `);
});

//getting all persons
app.get('/api/persons', (req, res) => {
  res.json(persons);
});

// getting single person
app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

//deleting a single person functionality
app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);
  res.status(204).end();
});

// generating of id functionality
const generatedId = () => {
  const maxId =
    persons.length > 0
      ? Math.max(...persons.map((n) => n.id))
      : Math.random() * 10000000000;
  return maxId + 1;
};

// posting a new resource or data
app.post('/api/persons', (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'name or number is missing',
    });
  } else if (persons.find((person) => person.name === body.name)) {
    return res.status(400).json({ error: 'name must be unique' }).status(400);
  }
  const person = {
    name: body.name,
    number: body.number,
    id: generatedId(),
  };

  persons = persons.concat(person);

  res.json(person);
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`server is connected on port ${PORT}`);
});