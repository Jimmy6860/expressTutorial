const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');
const Joi = require('joi');
const morgan = require('morgan');
const logger = require('./logger');
const authenticating = require('./authenticating');
const express = require('express');

const app = express();

console.log(`NODE_ENV: ${process.env.NODE_ENV}`);

//Middlewares
app.use(express.json());
app.use(logger);
app.use(authenticating);


if(app.get('env') === 'development') {
    app.use(morgan('tiny'))
    startupDebugger('Morgan enabled...')
}

const courses = [
    {id: 1, name: 'Node.js'},
    {id: 2, name: 'JavaScript'},
    {id: 3, name: 'Python'},
    {id: 4, name: '.Net'}
];

app.get('/', (req, res) => {
    res.send('Hello World');
})

app.get('/api/courses', (req, res) => {
    res.send(courses);
})

app.post('/api/courses', (req, res) => {
    const { error } = validateCourse(req.body);

    if(error) return res.status(400).send(error.details[0].message);

    const course = {
        id: courses.length + 1,
        name: req.body.name
    }

    courses.push(course);
    res.send(course);
})

app.put('/api/courses/:id', (req, res) => {
    // Loop up the courses
    // If not existing, return 404
    const searchedCourse = courses.find(e => e.id === parseInt(req.params.id));
    if(!searchedCourse) return res.status(404).send('Course not found');

    // Validate
    // If invalid, return 400 - Bad request
    const { error } = validateCourse(req.body)
    if(error) return res.status(400).send(error.details[0].message);

    // Update course
    // Return the update course
    searchedCourse.name = req.body.name;
    res.send(searchedCourse);

});

app.delete('/api/courses/:id', (req, res) => {
    const searchedCourse = courses.find(e => e.id === parseInt(req.params.id));
    if(!searchedCourse) return res.status(404).send('Course not found');
    

    // Delete part
    const index = courses.indexOf(searchedCourse);
    courses.splice(index, 1);

    res.send(searchedCourse);
})

app.get('/api/courses/:id', (req, res) => {
    const searchedCourse = courses.find(e => e.id === parseInt(req.params.id));
    if(!searchedCourse) return res.status(404).send('Course not found');
    
    res.send(searchedCourse);
})

app.get('/api/posts/:year/:month', (req, res) => {
    res.send(req.params);
})

//Enviroment variable
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listen to Port ${port}.....`))

const validateCourse = (course) => {
  const schema = Joi.object({
        name: Joi.string().min(3).required()
    })

    const result = schema.validate(course);

    return result;
}