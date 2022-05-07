import KoaRouter from "koa-router";
import config from "config";
import crypto from "crypto";
import {log} from "../../utils/api_log.js";
import { redisClient } from "../../db/redis_core.js";
import { elasticSearch } from "../../db/elastic_core.js";
const routerPrefix = config.get("routerPrefix");
const router = new KoaRouter({
    prefix: routerPrefix
});

router.get("/test_pbkdf2_encrypt", async ctx => {
    log.debug("== test_encrypt")
    let key = await pbkdf2_encrypt("zhangsan","123456");
    ctx.body = key;
})

let pbkdf2_encrypt = async (username, password) => {
    return new Promise((resolve, reject)=>{
        crypto.randomBytes(32, (err, salt) => {
            if (err) throw err;
            crypto.pbkdf2(password, salt, 4096, 512, 'sha256', (err, key) => {
                if (err) throw err;
                console.log(username, key.toString('hex'), salt.toString('hex'));
                resolve(key.toString('hex'));
            });
        });
    }) 
}

router.get("/test_redis", async ctx => {
    log.debug("== get test_redis")
    await redisClient.set('key', 'value');
    const result = await redisClient.get('key');
    ctx.body = result;
})

router.get("/test_elastic", async ctx => {
    log.debug("== get test_elastic")
    const fieldsArray = ["character", "quote"];
    const result = await elasticSearch({
        index: 'game-of-thrones',
        body: {
            query: {
                match: { quote: 'winter' }
            }
        }
    }, fieldsArray)
    ctx.body = result;
})

export default router;