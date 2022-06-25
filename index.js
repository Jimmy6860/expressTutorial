const Joi = require('joi');
const express = require('express');

const app = express();

app.use(express.json());

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
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    })

    const result = schema.validate(req.body);
    if(result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    };

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

    // Validate
    // If invalid, return 400 - Bad request

    // Update course
    // Return the update course
});

app.get('/api/courses/:id', (req, res) => {
    const searchedCourse = courses.find(e => e.id === parseInt(req.params.id));
    if(!searchedCourse) res.status(404).send('Course not found');
    
    res.send(searchedCourse);
})

app.get('/api/posts/:year/:month', (req, res) => {
    res.send(req.params);
})

//Enviroment variable
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listen to Port ${port}.....`))