import schedule from 'node-schedule'
import {sendRealtimeNotification} from "./notificationService.mjs"
import { deleteMessage } from '../infra/aws/sqs.mjs';

const jobs = new Map();

export async function setSchedule(token, sched, filter, message, messageId){
    if(sched == null){
        throw new Error('Missing schedule.');
    }

    if(jobs.has(messageId)){
        await removeSchedule(messageId);
    }

    const dte = new Date(sched);
    
    if(new Date() >= dte){

        await removeSchedule(messageId);
    
    } else {
      
        const job = schedule.scheduleJob(dte, async function(){
            sendRealtimeNotification(token, filter, message);
            removeSchedule(messageId);
            await deleteMessage(messageId);
        });

        jobs.set(messageId, job);
    }

}

export async function removeSchedule(messageId){
    if(jobs.has(messageId)){
        jobs.get(messageId).cancel();
        jobs.delete(messageId);
    }
}