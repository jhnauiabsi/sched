import express from 'express';
import dotenv from 'dotenv/config'
import {sendMessage, receiveMessages, deleteMessage, updateMessage} from './controllers.mjs'
import init from './init.mjs'
//import { getBearerToken } from './services/authentication.mjs';

const app = express();
app.use(express.json());

// Handle CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "*")
 next();
});

app.get('/messages', receiveMessages);
app.post('/', sendMessage);
app.delete('/', deleteMessage);
app.put('/', updateMessage);

const func = async () => {

  // There's no authorization token yet so a default token needs to be set
  await init(process.env.DEFAULT_TOKEN);

  app.listen(process.env.API_PORT, () => {
    console.log(`Server ready on port ${process.env.API_PORT}`);
  });
}

console.log('Starting server...');
const delay = parseInt(process.env.SQS_VISIBILITY_TIMEOUT, 10) * 1000;
setTimeout(func, delay);



