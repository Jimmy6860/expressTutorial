const express = require('express');
const router = express.Router();

const courses = [
    {id: 1, name: 'Node.js'},
    {id: 2, name: 'JavaScript'},
    {id: 3, name: 'Python'},
    {id: 4, name: '.Net'}
];

router.get('/', (req, res) => {
    res.send(courses);
})

router.post('/', (req, res) => {
    const { error } = validateCourse(req.body);

    if(error) return res.status(400).send(error.details[0].message);

    const course = {
        id: courses.length + 1,
        name: req.body.name
    }

    courses.push(course);
    res.send(course);
})

router.put('/:id', (req, res) => {
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

router.delete('/:id', (req, res) => {
    const searchedCourse = courses.find(e => e.id === parseInt(req.params.id));
    if(!searchedCourse) return res.status(404).send('Course not found');
    

    // Delete part
    const index = courses.indexOf(searchedCourse);
    courses.splice(index, 1);

    res.send(searchedCourse);
})

router.get('/:id', (req, res) => {
    const searchedCourse = courses.find(e => e.id === parseInt(req.params.id));
    if(!searchedCourse) return res.status(404).send('Course not found');
    
    res.send(searchedCourse);
})

module.exports = router