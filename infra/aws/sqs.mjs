import { SQSClient 
    ,SendMessageCommand 
    ,ReceiveMessageCommand 
    ,DeleteMessageCommand} 
from "@aws-sdk/client-sqs";


let client = undefined;
const getClient = () => {

    if(client === undefined){
        client = new SQSClient({
            region: process.env.REGION
            ,credentials: {
                accessKeyId: process.env.ACCESS_KEY_ID
                ,secretAccessKey: process.env.SECRET_ACCESS_KEY
            }
        });
    }

    return client;

}

export async function sendMessage(msg){
    const input = {
        QueueUrl: process.env.SQS_QUEUE_URL
        ,MessageBody: msg
    };
    const command = new SendMessageCommand(input);
    return await getClient().send(command);
}

export async function receiveMessages(visibilityTimeout){

    const input = {
        QueueUrl: process.env.SQS_QUEUE_URL
        ,MaxNumberOfMessages: process.env.SQS_MAX_NUMBER_OF_MESSAGES
        ,VisibilityTimeout : process.env.SQS_VISIBILITY_TIMEOUT
    };

    if(visibilityTimeout != null){
        input.VisibilityTimeout = visibilityTimeout;
    }

    const command = new ReceiveMessageCommand(input);
    let hasMessage = (res) => res.Messages && res.Messages.length > 0;

    let messages = new Map();
    let res;
    do{
        res = await getClient().send(command);
        if(hasMessage(res)){
            res.Messages.forEach(msg => {
                messages.set(msg.MessageId, msg);
            });
        }
    }while(hasMessage(res));
    return messages;
}

export async function deleteMessage(messageId){

    const messages = await receiveMessages();
    if(messages.has(messageId)){
        const input = {
            QueueUrl: process.env.SQS_QUEUE_URL
            ,ReceiptHandle: messages.get(messageId).ReceiptHandle
        };
    
        const command = new DeleteMessageCommand(input);
        return await getClient().send(command);
    } else {
        throw new Error('Message not found');
    }

}

export async function updateMessage(msg){
    let ret = await deleteMessage(msg.messageId);
    if(ret.$metadata.httpStatusCode === 200){
        const sqsMessage = {message: msg.message
            ,schedule: msg.schedule
            ,filter: msg.filter}
        return await sendMessage(JSON.stringify(sqsMessage));
    } else {
        throw new Error('Error updating message. Please do a manual delete and send the message again');
    }

}
