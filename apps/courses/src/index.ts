import express from 'express';

const app = express();

app.use(express.json());

const studentController = require('./application/controllers/student-controller');
app.use('/students', studentController);

const courseController = require('./application/controllers/course-controller');
app.use('/courses', courseController);

const enrollmentController = require('./application/controllers/enrollment-controller');
app.use('/enrollments', enrollmentController);

app.listen(3000, () => {
    console.log('REST API server ready at: http://localhost:3000');
});