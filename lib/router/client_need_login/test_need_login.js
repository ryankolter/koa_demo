import KoaRouter from "koa-router";
import config from "config";
import path from "path";
import { AESEncrypt, AESDecrypt, RSAEncrypt, RSADecrypt } from "../../utils/api_crypto.js";
import {log} from "../../utils/api_log.js";
const routerPrefix = config.get("routerPrefix");
const router = new KoaRouter({
    prefix: routerPrefix
});
const __dirname = path.resolve();


router.get("/need_test_aes_encrypt", async ctx => {
    log.debug("== test aes encrypt")
    const text = "test content for aes encrypt"
    let encrypted = AESEncrypt(text);
    console.log(encrypted);
    let dectypted = AESDecrypt(encrypted);
    console.log(dectypted)
    ctx.body = encrypted;
})

router.get("/need_test_rsa_encrypt", async ctx => {
    log.debug("== test rsa encrypt")
    const text = "test content for rsa encrypt"
    let encrypted = RSAEncrypt(text, __dirname + config.cert_common.public_key_path);
    console.log(encrypted);
    let dectypted = RSADecrypt(encrypted, __dirname + config.cert_common.private_key_path);
    console.log(dectypted)
    ctx.body = encrypted;
})

export default router;