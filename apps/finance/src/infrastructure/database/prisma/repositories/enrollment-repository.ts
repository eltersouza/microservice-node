
import { IEnrollmentRepository } from "../../../../application/repositories/enrollment-repository";
import { Enrollment } from "../../../../domain/enrollment";
import { prisma } from "../prisma";

export class PrismaEnrollmentRepository implements IEnrollmentRepository {
    async create(enrollment: Enrollment): Promise<Enrollment> {
        const prismaEnrollment = await prisma.enrollment.create({
            data: {
                courseId: enrollment.courseId!,
                customerId: enrollment.customerId!
            }
        });

        return new Enrollment({enrolledAt: prismaEnrollment.enrollmentDate, customerId: prismaEnrollment.customerId, courseId: prismaEnrollment.courseId}, prismaEnrollment.id);
    }

    async findEnrollmentsByStudentEmail(email?: string): Promise<Enrollment[] | null> {
        if(!email)
            return null;

        const student = await prisma.customer.findUnique({ where: { email: email } });

        if (!student)
            return null;

        const enrollments = await prisma.enrollment.findMany({
            where: { customerId: student!.id },
            include: { course: true, customer: true }
        });

        let enrollmentsArray: Enrollment[] = [];
        console.log('Enrollments with courses and Students.', enrollments);
        enrollments.map((enrollment) => enrollmentsArray.push(new Enrollment({
            courseId: enrollment.courseId, 
            customerId: enrollment.customerId, 
            enrolledAt: enrollment.enrollmentDate
        }, enrollment.id)));

        return enrollmentsArray;
    }


}