import "./lib/utils/config.js";
import Koa from 'koa';
import {log} from "./lib/utils/api_log.js";
import setCommon from  "./lib/middleware/setCommon.js";
import setRouter from "./lib/middleware/setRouter.js";
import bodyParser from "koa-bodyparser";
import { verifyToken } from "./lib/utils/api_token.js";

const app = new Koa();

await setCommon(app);
await setRouter(app, '/lib/router/client_no_login/');

app.use(async (ctx, next) => {
    if(verifyToken(ctx)){
        await next();
    }
})

await setRouter(app, '/lib/router/client_need_login/');

const port = 8060;
log.info("---------------------")
log.info(`server started at ${port}`)
log.info("---------------------")
app.listen(port);