import { Course } from "../../domain/course";
import { Enrollment } from "../../domain/enrollment";
import { Student } from "../../domain/student";
import { ICourseRepository } from "../repositories/course-repository";
import { IEnrollmentRepository } from "../repositories/enrollment-repository";
import { IStudentRepository } from "../repositories/student-repository";
import { EnrollmentPublisher } from "../../infrastructure/messaging/enrollment-publisher";

export interface EnrollStudentToCourseRequest {
    student: {
        id?: number;
        name: string;
        email: string;
    }

    course: {
        id?: number;
        title: string;
        description: string | null;
    }
}

export class EnrollStudentToCourse {
    constructor(
        private studentsRepository: IStudentRepository,
        private coursesRepository: ICourseRepository,
        private enrollmentsRepository: IEnrollmentRepository
    ){}

    async execute(request: EnrollStudentToCourseRequest): Promise<Enrollment> {
        console.info('EnrollStudentToCourse', request);

        let course: Course | null = null;
        
        if(request.course.id)
            course = await this.coursesRepository.findCourseById(request.course.id!);

        if(!course){
            course = new Course({
                title: request.course.title,
                description: request.course.description
            });

            course = await this.coursesRepository.create(course);
        }

        let student: Student | undefined = undefined;

        if(request.student.id)
            student = await this.studentsRepository.findStudentById(request.student.id!);

        if(!student) {
            student = new Student({
                email: request.student.email,
                name: request.student.name
            });

           student = await this.studentsRepository.create(student);
        }

        const enrollment = new Enrollment({
            courseId: course.id,
            studentId: student.id,
            enrolledAt: new Date()
        });

        const prismaEnrollment = await this.enrollmentsRepository.create(enrollment);

        const enrollmentPublisher = new EnrollmentPublisher();

        const enrollReq = {
            course: { id: 1, title: course?.title, description: course?.description },
            student: { id: 1, email: student?.email, name: student?.name }
        } as EnrollStudentToCourseRequest;

        enrollmentPublisher.publish(enrollReq);

        return new Enrollment({studentId: prismaEnrollment.studentId, courseId: prismaEnrollment.courseId, enrolledAt: prismaEnrollment.enrolledAt}, prismaEnrollment.id);
    }
}