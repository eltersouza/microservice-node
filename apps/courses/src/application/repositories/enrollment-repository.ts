import { Enrollment } from "../../domain/enrollment";

export interface IEnrollmentRepository {
    create(enrollment: Enrollment) : Promise<Enrollment>;
    findEnrollmentsByStudentEmail(email: string): Promise<Enrollment[] | undefined>;
    getAll(): Promise<Enrollment[] | undefined>;
}