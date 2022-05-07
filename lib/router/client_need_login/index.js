import KoaRouter from "koa-router";
import CSRF from "koa-csrf";
import config from "config";
import {log} from "../../utils/api_log.js";
const routerPrefix = config.get("routerPrefix");
const router = new KoaRouter({
    prefix: routerPrefix
});

import {MountDBSession} from "../../db/db_core.js"
import DBUser from "../../db/db_user.js";

router.get("/find_user", async (ctx) => {
    let user = await DBUser.getUserByMobile("1")
    console.log(user)
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