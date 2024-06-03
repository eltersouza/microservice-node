import {Kafka, logLevel} from 'kafkajs';

export const KAFKA_CONFIG = new Kafka({
    clientId: 'courses',
    brokers: ['localhost:9092'],
    logLevel: logLevel.INFO
});