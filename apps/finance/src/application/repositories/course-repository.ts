import { Course } from "../../domain/course";

export interface ICourseRepository {
    create(course: Course) : Promise<Course>;
    findCourseById(id?: number): Promise<Course | null>;
    getAll(): Promise<Course[] | null>;
}