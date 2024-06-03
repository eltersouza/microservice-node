import express from 'express';
import { PrismaCourseRepository } from '../../infrastructure/database/prisma/repositories/courses-repository';
import { Course } from '../../domain/course';


const router = express.Router();
const courseRepository = new PrismaCourseRepository();

router.get('/', async (req, res) => {
    const courses = await courseRepository.getAll();
    res.json(courses);
});

router.get('/:id', async (req, res) =>{
    const student = await courseRepository.findCourseById(parseInt(req.params.id));

    res.json(student);
});

router.post('/', async (req, res) => {
    const {title, description} = req.body;
    console.log(title, description)

    const newCourse = await courseRepository.create(new Course({title, description}));

    console.log("Created new course: ", newCourse);
    res.json(newCourse);
});

module.exports = router;