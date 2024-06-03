import { IStudentRepository } from "../../../../application/repositories/student-repository";
import { Student } from "../../../../domain/student";
import { prisma } from "../prisma";

export class PrismaStudentRepository implements IStudentRepository {
    
    async create(student: Student): Promise<Student> {
        const prismaStudent = await prisma.student.create({
            data: {
                email: student.email,
                name: student.name
            }
        });

        return new Student({name: prismaStudent.name, email: prismaStudent.email}, prismaStudent.id);
    }

    async findStudentByEmail(email: string): Promise<Student | undefined> {
        const prismaStudent = await prisma.student.findUnique({where: { email: email }});

        if(!prismaStudent)
            return undefined;

        const student = new Student({email: prismaStudent!.email, name: prismaStudent!.name}, prismaStudent?.id);
        return student;
    }
    
    async findStudentById(id: number): Promise<Student | undefined> {
        const prismaStudent = await prisma.student.findUnique({where: { id }});

        if(!prismaStudent)
            return undefined;

        const student = new Student({email: prismaStudent!.email, name: prismaStudent!.name}, prismaStudent?.id);
        return student;
    }

    async getAll() : Promise<Student[] | undefined> {
        const students = await prisma.student.findMany();

        if(!students)
            return undefined;

        return students.map( stud => new Student({email: stud.email, name: stud.name}, stud.id));
    }
}