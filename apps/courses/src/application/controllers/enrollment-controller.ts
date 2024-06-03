import express from 'express';
import { PrismaCourseRepository } from '../../infrastructure/database/prisma/repositories/courses-repository';
import { PrismaEnrollmentRepository } from '../../infrastructure/database/prisma/repositories/enrollment-repository';
import { EnrollStudentToCourse, EnrollStudentToCourseRequest } from '../usecases/enroll-student-to-courses';
import { PrismaStudentRepository } from '../../infrastructure/database/prisma/repositories/student-repository';
import { prisma } from '../../infrastructure/database/prisma/prisma';
import { EnrollmentPublisher } from '../../infrastructure/messaging/enrollment-publisher';


const router = express.Router();

const enrollmentsRepository = new PrismaEnrollmentRepository();
const studentsRepository = new PrismaStudentRepository();
const coursesRepository = new PrismaCourseRepository();
const enrollToCourse = new EnrollStudentToCourse(studentsRepository, coursesRepository, enrollmentsRepository);

router.get('/', async (req, res) => {
    const enrollments = await enrollmentsRepository.getAll();
    res.json(enrollments);
});

router.get('/:email', async (req, res) => {
    const courses = await enrollmentsRepository.findEnrollmentsByStudentEmail(req.params.email);
    res.json(courses);
});

router.post('/', async (req, res) => {
    const enrollmentRequest = req.body as EnrollStudentToCourseRequest;

    const enrollment = await enrollToCourse.execute(enrollmentRequest);

    console.log("New Enrollment ", enrollment);
    res.json(enrollment);
});

router.post('/kafka', async (req, res) => {
    const enrollment = await prisma.enrollment.findFirst();
    const publisher = await new EnrollmentPublisher();

    const course = await prisma.course.findFirst();
    const student = await prisma.student.findFirst();

    const enrollReq: EnrollStudentToCourseRequest = {
        course: { id: course?.id, title: course?.title, description: course?.description },
        student: { id: student?.id, email: student?.email, name: student?.name }
    } as EnrollStudentToCourseRequest;

    publisher.publish(enrollReq);
    res.status(200).send('OK');
});

module.exports = router;