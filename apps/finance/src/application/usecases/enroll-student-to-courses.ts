import { Course } from "../../domain/course";
import { Enrollment } from "../../domain/enrollment";
import { Customer } from "../../domain/customer";
import { ICourseRepository } from "../repositories/course-repository";
import { IEnrollmentRepository } from "../repositories/enrollment-repository";
import { ICustomerRepository } from "../repositories/customer-repository";

export interface EnrollStudentToCourseRequest {
    student: {
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
        private customersRepository: ICustomerRepository,
        private coursesRepository: ICourseRepository,
        private enrollmentsRepository: IEnrollmentRepository
    ){}

    async execute(request: EnrollStudentToCourseRequest): Promise<Enrollment> {
        let course = await this.coursesRepository.findCourseById(request.course.id);

        if(!course){
            course = new Course({
                title: request.course.title,
                description: request.course.description
            });

            course = await this.coursesRepository.create(course);
        }

        let customer = await this.customersRepository.findCustomerByEmail(request.student.email);

        if(!customer) {
            customer = new Customer({
                email: request.student.email,
                name: request.student.name
            });

            customer = await this.customersRepository.create(customer);
        }

        const enrollment = new Enrollment({
            courseId: course.id,
            customerId: customer.id,
            enrolledAt: new Date()
        });

        const prismaEnrollment = await this.enrollmentsRepository.create(enrollment);

        return new Enrollment({customerId: prismaEnrollment.customerId, courseId: prismaEnrollment.courseId, enrolledAt: prismaEnrollment.enrolledAt}, prismaEnrollment.id);
    }
}