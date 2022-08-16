import { getBearerToken } from "./services/authentication.mjs";


export function validateSendMessageRequest(req){
    let errors = [];
    const token = getBearerToken(req);
    
    if(token === ''){
        errors.push("Missing authorization header token.");
    }

    if(req.body == null){
        errors.push('Missing body');
    }

    if(req.body.schedule == null){
        errors.push('Mising schedule value.');
    } else {
        const sched = new Date(req.body.schedule);
        if(sched <= new Date()){
            errors.push('Schedule date already passed.');
        }
    }

    if(req.body.message == null){
        errors.push('Missing notification message.');
    }

    if(errors.length > 0){
        throw new Error(errors.toString());
    }

}