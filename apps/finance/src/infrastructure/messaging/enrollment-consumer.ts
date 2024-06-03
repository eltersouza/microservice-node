import { EnrollStudentToCourse, EnrollStudentToCourseRequest } from "../../application/usecases/enroll-student-to-courses";
import { PrismaCourseRepository } from "../database/prisma/repositories/courses-repository";
import { PrismaCustomerRepository } from "../database/prisma/repositories/customer-repository";
import { PrismaEnrollmentRepository } from "../database/prisma/repositories/enrollment-repository";
import { KAFKA_CONFIG as kafkaConfig } from "./kafka/kafka-config";
import { CompressionTypes } from "kafkajs";

export class EnrollmentConsumer {
    async consume(enrollment: any): Promise<void> {
        const topic = "Enrollment";

        const consumer = kafkaConfig.consumer({groupId: 'classroom-group', allowAutoTopicCreation: true});

        await consumer.connect();
        await consumer.subscribe({topic: "Enrollment"});

        await consumer.run({
            eachMessage: async ({message}) => {
                const enrollmentJSON = message.value?.toString();

                if(!enrollmentJSON)
                    return;


                const customerRepository = new PrismaCustomerRepository();
                const courseRepository = new PrismaCourseRepository();
                const enrollRepository = new PrismaEnrollmentRepository();

                const enrollment: EnrollStudentToCourseRequest = JSON.parse(enrollmentJSON);

                const enrollmentStudentToCourse = new EnrollStudentToCourse(
                    customerRepository,
                    courseRepository,
                    enrollRepository
                );

                await enrollmentStudentToCourse.execute({
                    student: {
                        email: enrollment.student.email,
                        name: enrollment.student.name
                    },
                    course: {
                        title: enrollment.course.title,
                        description: enrollment.course.description
                    }
                });
            }
        });

    }
}