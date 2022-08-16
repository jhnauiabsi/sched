import { 
    sendMessage as sendSQSMessage
    ,receiveMessages as receiveSQSMessages
    ,deleteMessage as deleteSQSMessage
    ,updateMessage as updateSQSMessage} from './infra/aws/sqs.mjs'

import {setSchedule, removeSchedule} from './services/scheduler.mjs' 
import {getBearerToken} from './services/authentication.mjs'  
import {validateSendMessageRequest} from './requestValidations.mjs'

export async function sendMessage(req, res, next){
    try {

        validateSendMessageRequest(req);

        const sqsResult = await sendSQSMessage(JSON.stringify(req.body));
        if(sqsResult.$metadata.httpStatusCode === 200){
            const token = getBearerToken(req);
            setSchedule(token, req.body.schedule, req.body.filter, req.body.message, sqsResult.MessageId);
        }

        res.send(sqsResult);

    } catch(error) {
        console.log(error);
        return next(error);
    }
}

export async function receiveMessages(req, res, next){
    try {
        //await setTimeout(process.env.SQS_VISIBILITY_TIMEOUT);

        const messages = await receiveSQSMessages(0);
        let ret = [];
        messages.forEach((value, key) => {
            ret.push({
                messageId: key
                ,message: value.Body
            });
        });
        res.send(ret);
    } catch(error) {
        console.log(error);
        return next(error);
    }
}

export async function deleteMessage(req, res, next){
    try {
        if(req.body == null || req.body.messageId == null){
            throw new Error('Missing body');
        }

        //await setTimeout(process.env.SQS_VISIBILITY_TIMEOUT);
        removeSchedule(req.body.messageId);

        res.send(await deleteSQSMessage(req.body.messageId));
    } catch(error) {
        console.log(error);
        return next(error);
    }
}

export async function updateMessage(req, res, next){

    try {
        const token = getBearerToken(req);
        if(req.body == null 
            || req.body.messageId == null 
            || req.body.message == null 
            || req.body.schedule == null
            || req.body.filter == null){

            throw new Error('Incomplete body');
        }
        //await setTimeout(process.env.SQS_VISIBILITY_TIMEOUT);
        setSchedule(token, req.body.schedule, req.body.filter, req.body.message, req.body.messageId);
        res.send(await updateSQSMessage(req.body));

    } catch(error) {
        console.log(error);
        return next(error);
    }
}