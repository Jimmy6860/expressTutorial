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

const courseSchema = new mongoose.Schema({
    name: String,
    author: String,
    tags: [ String ],
    data: { type: Date, default: Date.now},
    isPublished: Boolean,
})

//Compiled the schema in a model
const Course = mongoose.model('Course', courseSchema);

const createCourse = async () =>  {
    const course = new Course({
        name: 'Angular Course',
        author: 'Jimmy',
        tags: ['angular', 'frontend'],
        isPublished: true
    });
    
    const result = await course.save();
    console.log(result)
};

const getCourses = async () => {
    //------------> Comparison operator <--------------
    // eq (equal)
    // ne (not equal)
    // gt (greater than)
    // gte (greater than or equal to)
    // lt (less than)
    // lte (less than or equal to)
    // in
    // nin (non in)

    //------------> Logical operator <--------------
    // or
    // and

    const courses = await Course
    //.find({ author: 'Jimmy', isPublished: true})
    //.find({ price: { $gte: 10, $lte: 20}})
    //.find({ price: {$in: [10, 15, 20]} })
    //.or([ { author: 'Jimmy' }, { isPublished: true} ])

    // Starts with Jimmy
    //.find({ author: /^Jimmy/ })

    // Ends with Lam
    //.find({ author: /Lam$/i})

    // Contains Jimmy
    //.find({ author: /.*Mosh.*/i })
    .find()
    .limit(10)
    .sort({ name: 1 })
    .select({ name: 1, tags: 1});
    console.log(courses);
};

// Updating a Document-Query First
// const updateCourse = async (id) => {
//     const course = await Course.findById(id);
//     if(!course) return;

//     course.set({
//         isPublished: true,
//         author: 'Another Author'
//     });

//     const result = await course.save();
//     console.log(result)
// }

// Updating a Document- Update First
const updateCourse = async (id) => {
    const result = await Course.findByIdAndUpdate( id, {
        $set: {
            author: 'Johnny',
            isPublished: false
        }
    }, { new: true});
    
    console.log(result)
}

const removeCourse = async (id) => {
    const result = await Course.deleteOne({ _id: id})
    console.log(result);
} 

removeCourse('62e3d9819d32f2bc240dec57');
 

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