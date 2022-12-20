import config from "config";
import { Log } from "../../../utils/api_log.js";
const log = new Log("index");

import path from "path";
const __dirname = path.resolve();
import { AESEncrypt, AESDecrypt, RSAEncrypt, RSADecrypt } from "../../../utils/api_crypto.js";

import KoaRouter from "koa-router";
const router = new KoaRouter({
    prefix: config.get("routerPrefix") + "/v1"
});

router.get("/", async ctx => {
    log.info("get index")
    ctx.body = ctx.traceId;
})

router.get("/test/redis", async ctx => {
    log.info("test redis")
    await redisClient.set('key', 'value');
    const result = await redisClient.get('key');
    ctx.body = result;
})

router.get("/test/pbkdf2_encrypt", async ctx => {
    log.info("test pbkdf2_encrypt")
    let key = await pbkdf2_encrypt("zhangsan","123456");
    ctx.body = key;
})

let pbkdf2_encrypt = async (username, password) => {
    return new Promise((resolve, reject)=>{
        crypto.randomBytes(32, (err, salt) => {
            if (err) throw err;
            crypto.pbkdf2(password, salt, 4096, 512, 'sha256', (err, key) => {
                if (err) throw err;
                log.info(username, key.toString('hex'), salt.toString('hex'));
                resolve(key.toString('hex'));
            });
        });
    }) 
}

router.get("/test/aes_encrypt", async ctx => {
    log.info("test aes_encrypt")
    const text = "test content for aes encrypt"
    let encrypted = AESEncrypt(text);
    log.info(encrypted);
    let dectypted = AESDecrypt(encrypted);
    log.info(dectypted)
    ctx.body = encrypted;
})

router.get("/test/rsa_encrypt", async ctx => {
    log.info("test rsa_encrypt")
    const text = "test content for rsa encrypt"
    let encrypted = RSAEncrypt(text, __dirname + config.cert_common.public_key_path);
    log.info(encrypted);
    let dectypted = RSADecrypt(encrypted, __dirname + config.cert_common.private_key_path);
    log.info(dectypted)
    ctx.body = encrypted;
})

export default router;