import Koa from 'koa';
import setCommon from  "./lib/middleware/setCommon.js";
import setRouter from "./lib/middleware/setRouter.js";
import {log} from "./lib/utils/api_log.js";

import dotenv from "dotenv";
dotenv.config();
let api_token = await import("./lib/utils/api_token.js");
//要用上面的异步，在里面import config from "config";才不会报错
//错误做法: import {verifyToken} from "./lib/utils/api_token.js"; 

const app = new Koa();

await setCommon(app);

await setRouter(app, '/lib/router/client_no_login/');

app.use(async (ctx, next) => {
    if(api_token.verifyToken(ctx)){
        await next();
    }
})

await setRouter(app, '/lib/router/client_need_login/');

const port = 8060;
log.info("---------------------")
log.info(`server started at ${port}`)
log.info("---------------------")
app.listen(port);