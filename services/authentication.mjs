import fetch from "node-fetch";
import {Headers} from 'node-fetch';

export function getBearerToken(req){
    if(req.headers.authorization == null || req.headers.authorization === '') return '';
    const authorizationArr = req.headers.authorization.split(" ");
    return authorizationArr.length > 1 ? authorizationArr[1] : authorizationArr[0];
}

export async function isValid(token){

    const url = `${process.env.PUBLIC_BASE_URL}${process.env.VALIDATE_TOKEN_URL}`;
    const headers = new Headers({
        'Authorization': `Bearer ${token}`
    });

    try{
        await fetch(url, {
            method: 'GET'
            ,headers: headers
        })
        .then(res => {
            if(res.status !== 200){
                console.log(`Authentication status: ${res.status}\nStatus message: ${res.statusText}`);
                return false;
            } else {
                return true;
            }});
    }
    catch(e){
        console.log(e);
    }

    return false;
}