import {Kafka, logLevel} from 'kafkajs';

export const KAFKA_CONFIG = new Kafka({
    clientId: 'finance',
    brokers: ['localhost:9092'],
    logLevel: logLevel.INFO
});