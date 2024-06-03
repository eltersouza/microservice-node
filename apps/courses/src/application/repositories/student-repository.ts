import { Student } from "../../domain/student";

export interface IStudentRepository {
    create(student: Student) : Promise<Student>;
    findStudentByEmail(email: string): Promise<Student | undefined>;
    findStudentById(id: number): Promise<Student | undefined>;
    getAll() : Promise<Student[] | undefined>;
}