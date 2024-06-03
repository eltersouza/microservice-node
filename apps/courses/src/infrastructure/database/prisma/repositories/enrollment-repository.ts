
import { IEnrollmentRepository } from "../../../../application/repositories/enrollment-repository";
import { Enrollment } from "../../../../domain/enrollment";
import { prisma } from "../prisma";

export class PrismaEnrollmentRepository implements IEnrollmentRepository {
    async create(enrollment: Enrollment): Promise<Enrollment> {
        const prismaEnrollment = await prisma.enrollment.create({
            data: {
                courseId: enrollment.courseId!,
                studentId: enrollment.studentId!
            }
        });

        return new Enrollment({enrolledAt: prismaEnrollment.enrollmentDate, studentId: prismaEnrollment.studentId, courseId: prismaEnrollment.courseId}, prismaEnrollment.id);
    }

    async findEnrollmentsByStudentEmail(email: string): Promise<Enrollment[] | undefined> {
        const student = await prisma.student.findUnique({ where: { email: email } });

        if (!student)
            return undefined;

        const enrollments = await prisma.enrollment.findMany({
            where: { studentId: student!.id },
            include: { course: true, student: true }
        });

        let enrollmentsArray: Enrollment[] = [];
        console.log('Enrollments with courses and Students.', enrollments);
        enrollments.map((enrollment) => enrollmentsArray.push(new Enrollment({
            courseId: enrollment.courseId, 
            studentId: enrollment.studentId, 
            enrolledAt: enrollment.enrollmentDate
        }, enrollment.id)));

        return enrollmentsArray;
    }

    async getAll(): Promise<Enrollment[] | undefined> {
        const enrollments = await prisma.enrollment.findMany();

        return enrollments.map(enroll => new Enrollment({enrolledAt: enroll.enrollmentDate, courseId: enroll.courseId, studentId: enroll.studentId}, enroll.id));
    }

    async get(email: string): Promise<Enrollment[] | undefined> {
        const student = await prisma.student.findUnique({ where: { email: email } });

        if (!student)
            return undefined;

        const enrollments = await prisma.enrollment.findMany({
            where: { studentId: student!.id },
            include: { course: true, student: true }
        });

        let enrollmentsArray: Enrollment[] = [];
        console.log('Enrollments with courses and Students.', enrollments);
        enrollments.map((enrollment) => enrollmentsArray.push(new Enrollment({
            courseId: enrollment.courseId, 
            studentId: enrollment.studentId, 
            enrolledAt: enrollment.enrollmentDate
        }, enrollment.id)));

        return enrollmentsArray;
    }


}