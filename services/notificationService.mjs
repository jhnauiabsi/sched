import fetch from "node-fetch";
import {Headers} from 'node-fetch';

export async function sendRealtimeNotification(token, filter, message){
    try{
        const url = process.env.NOTIFICATION_SERVICE_URL;
        const headers = new Headers({
            'Authorization': `Bearer ${token}`
            ,'Content-Type': 'application/json'
            ,'Accept': 'application/json'
        });

        const body = JSON.stringify({
            filter: filter
            ,message: message
        });

        await fetch(url, {
            method: 'POST'
            ,headers: headers
            ,body: body
        })
    } catch(error){
        console.log(error);
    }
}