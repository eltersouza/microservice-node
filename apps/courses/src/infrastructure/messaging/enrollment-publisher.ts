import { KAFKA_CONFIG as kafkaConfig } from "./Kafka/kafka-config";
import {EnrollStudentToCourseRequest} from '../../application/usecases/enroll-student-to-courses';
import { CompressionTypes, Partitioners } from "kafkajs";

export class EnrollmentPublisher {
    async publish(enrollment: EnrollStudentToCourseRequest): Promise<void> {
        const topic = "Enrollment";
        const producer = kafkaConfig.producer({createPartitioner: Partitioners.DefaultPartitioner});

        await producer.connect();

        const getRandomNumber = () => Math.round(Math.random() * 1000);
        const createMessage = (num: number) => ({
            key: `key-${num}`,
            value: JSON.stringify(enrollment)
        });

        return producer.send({
            topic,
            compression: CompressionTypes.GZIP,
            messages: [createMessage(getRandomNumber())]
        })
        .then((val) => console.log('[EnrollmentPublisher Info]', val))
        .catch(e => console.error(`[EnrollmentPublisher Error] ${e.message}`, e))
        .finally(() => {console.log(`[EnrollmentPublisher Finally]`); producer.disconnect()});
    }
}