import "./lib/utils/config.js";
import Koa from 'koa';
import { Log } from "./lib/utils/api_log.js";
const log = new Log("index");
import setCommon from  "./lib/middleware/setCommon.js";
import setRouter from "./lib/middleware/setRouter.js";
import { verifyToken } from "./lib/utils/api_token.js";

const app = new Koa();

await setCommon(app);
await setRouter(app, '/lib/router/v1/no_login/');

app.use(async (ctx, next) => {
    if(verifyToken(ctx)){
        await next();
    }
})

await setRouter(app, '/lib/router/v1/need_auth/');

const port = 8060;
log.info("");
log.info(`server started at ${port}`);
log.info("");
app.listen(port);