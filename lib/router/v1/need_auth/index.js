import config from "config";
import { Log } from "../../../utils/api_log.js";
const log = new Log("index");
import CSRF from "koa-csrf";
import {MountDBSession} from "../../../db/db_core.js";
import DBUser from "../../../db/db_user.js";

import KoaRouter from "koa-router";
const router = new KoaRouter({
    prefix: config.get("routerPrefix") + "/v1"
});

router.get("/find_user", async (ctx) => {
    let user = await DBUser.getUserByMobile("1")
    log.info(user)
    ctx.status = 200;
    ctx.body = user;
})

// router.get("/session_example", MountDBSession, async (ctx) => {
//     let user = await DBUser.sessionExample("123123123", ctx.defaultDBSession)
//     ctx.status = 200;
//     ctx.body = user;
// })

router.get('/hello', new CSRF({
    invalidTokenMessage: 'Invalid CSRF token',
    invalidTokenStatusCode: 403,
    excludedMethods: [ 'GET', 'HEAD', 'OPTIONS' ],
    disableQuery: false
}), async (ctx)=>{
    let title = 'hello koa2'
    await ctx.render('client/hello',{
        title,
        csrf: ctx.csrf
    })  
})

export default router;