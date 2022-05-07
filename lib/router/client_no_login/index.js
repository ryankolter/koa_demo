import KoaRouter from "koa-router";
import config from "config";
import {log} from "../../utils/api_log.js";
const routerPrefix = config.get("routerPrefix");
const router = new KoaRouter({
    prefix: routerPrefix
});

router.get("/", async ctx => {
    log.debug("== get index")
    ctx.body = "index";
})

export default router;