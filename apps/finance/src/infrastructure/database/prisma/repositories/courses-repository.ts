import { ICourseRepository } from "../../../../application/repositories/course-repository";
import { Course } from "../../../../domain/course";
import { prisma } from "../prisma";

export class PrismaCourseRepository implements ICourseRepository {
    async create(course: Course): Promise<Course> {
        const prismaCourse = await prisma.course.create({
            data: {
                title: course.title
            }
        });

        return new Course({title: prismaCourse.title, description: prismaCourse.description}, prismaCourse.id);
    }
    async findCourseById(id?: number): Promise<Course | null> {
        if(!id)
            return null;
        
        const course = await prisma.course.findUnique({ where: {id}});
        
        if(!course)
            return null;
        
        return new Course({
            title: course.title,
            description: course.description
        }, course.id);
    }

    async getAll(): Promise<Course[] | null> {
        const courses = await prisma.course.findMany();

        if(!courses)
            return null;

        return courses.map(course => new Course({title: course.title, description: course.description}, course.id));
    }
}