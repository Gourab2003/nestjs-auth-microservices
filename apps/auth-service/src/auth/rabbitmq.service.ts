import * as amqp from 'amqplib';

export class RabbitMQService {
    channel: any;

    async connect() {
        const connection = await amqp.connect('amqp://localhost:5672');

        this.channel = await connection.createChannel();

        await this.channel.assertQueue('user_registered');

        console.log('RabbitMQ connected');
    }

    async publish(message: any) {
        this.channel.sendToQueue(
            'user_registered',
            Buffer.from(JSON.stringify(message)),
        );
        console.log('Message sent to queue');
    }
}
