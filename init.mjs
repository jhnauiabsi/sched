import { receiveMessages as receiveSQSMessages} from './infra/aws/sqs.mjs'
import {setSchedule} from './services/scheduler.mjs'

export default async function(token){

    console.log('Getting all scheduled messages from SQS...');
    const messages = await receiveSQSMessages(5);
    let body;
    messages.forEach((value, key) => {
        body = JSON.parse(value.Body);
        setSchedule(token, body.schedule, body.filter, body.message, key);
    });   
    console.log(`${messages.size} messages scheduled.`); 
}