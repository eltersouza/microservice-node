import express from 'express';
import { PrismaStudentRepository } from '../../infrastructure/database/prisma/repositories/student-repository';
import { Student } from '../../domain/student';


const router = express.Router();
const studentRepository = new PrismaStudentRepository();

router.get('/', async (req, res) => {
    const students = await studentRepository.getAll();

    res.json(students);
});

router.get('/:id', async (req, res) =>{
    const student = await studentRepository.findStudentById(parseInt(req.params.id));

    res.json(student);
});

router.get('byemail/:email', async (req, res) =>{
    const student = await studentRepository.findStudentByEmail(req.params.email);

    res.json(student);
});

router.post('/', async (req, res) => {
    const {name, email} = req.body;

    const newStudent = await studentRepository.create(new Student({name, email}));

    console.log("Created new user: ", newStudent);
    res.json(newStudent);
});

module.exports = router;