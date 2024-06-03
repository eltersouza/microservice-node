import { EnrollStudentToCourse, EnrollStudentToCourseRequest } from "./application/usecases/enroll-student-to-courses";
import { PrismaCourseRepository } from "./infrastructure/database/prisma/repositories/courses-repository";
import { PrismaCustomerRepository } from "./infrastructure/database/prisma/repositories/customer-repository";
import { PrismaEnrollmentRepository } from "./infrastructure/database/prisma/repositories/enrollment-repository";
import { KAFKA_CONFIG as KafkaConfig } from "./infrastructure/messaging/kafka/kafka-config";

async function main() {
    console.log('[Finance Service started...]')
    const topic = "Enrollment";

    const consumer = KafkaConfig.consumer({ groupId: 'Finance', allowAutoTopicCreation: true });

    await consumer.connect();
    await consumer.subscribe({ topics: ['Enrollment'], fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ message, topic }) => {
            console.info(`[Finance Service - ${topic} Topic Message]`, message);
            const enrollmentJSON = message.value?.toString();

            if (!enrollmentJSON)
                return;

            const customerRepository = new PrismaCustomerRepository();
            const courseRepository = new PrismaCourseRepository();
            const enrollRepository = new PrismaEnrollmentRepository();

            const enrollment: EnrollStudentToCourseRequest = JSON.parse(enrollmentJSON);

            console.info(`[Finance Service] JSON`, enrollment);

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

main();