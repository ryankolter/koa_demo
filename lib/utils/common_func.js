import { Log } from "./api_log.js";
const log = new Log("common_func");
import pkg from 'uuid';
const { v4: uuidv4} = pkg;

export const genUuid = () => {
    return uuidv4();
}

export const responseError = (ctx, code, name, message) => {
    log.warn(`== responseError: [code] ${code}, [name] ${name}, [message] ${message}`);
    ctx.status = code;
    ctx.body = {
        "error": {  
            "name": name, 
            "message": message
        }
    }
}