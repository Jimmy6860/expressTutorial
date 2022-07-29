const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');
const courses = require('./routes/courses');
const home = require('./routes/home');
const Joi = require('joi');
const morgan = require('morgan');
const logger = require('./middleware/logger');
const authenticating = require('./authenticating');
const express = require('express');
const mongoose = require('mongoose');

const app = express();

console.log(`NODE_ENV: ${process.env.NODE_ENV}`);

//Middlewares
app.use(express.json());
app.use(logger);
app.use(authenticating);
app.use('/api/courses', courses);
app.use('/', home)

if(app.get('env') === 'development') {
    app.use(morgan('tiny'))
    startupDebugger('Morgan enabled...')
}

app.get('/api/posts/:year/:month', (req, res) => {
    res.send(req.params);
})

//Database
mongoose.connect('mongodb://localhost/playground')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.log(`Could not connect to MongoDb: ${err}`))

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