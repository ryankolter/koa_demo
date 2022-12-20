import config from "config";
import { Log } from "../../../utils/api_log.js";
const log = new Log("login");

import * as argon2 from "argon2";
import { signToken, signRefreshToken, verifyRefreshToken} from "../../../utils/api_token.js";
import { genUuid, responseError } from "../../../utils/common.js";
import DBUser from "../../../db/db_user.js";
import { redisClient } from "../../../db/redis_core.js";

import KoaRouter from "koa-router";
const router = new KoaRouter({
    prefix: config.get("routerPrefix") + "/v1"
});

router.post("/login/register", async ctx => {
    log.info("login register")
    const deviceUuid = ctx.request.body.device_uuid;
    if(!deviceUuid){
        responseError(ctx, 400, "NO_DEVICE_UUID", "no device uuid");
        return;
    }

    let registerType = ctx.request.body.register_type;
    if(registerType === 'mobile'){
        const nation_code = ctx.request.body.nation_code || '86';
        const mobile = ctx.request.body.mobile;
        const password = ctx.request.body.password;

        let user = await DBUser.getUserByMobile(nation_code, mobile);
        if(user){
            responseError(ctx, 400, "MOBILE_HAVE_REGISTERED", "mobile have registered");
            return;
        }else{
            //new user
            try{
                let userUuid = genUuid();
                const encrypt_password = await argon2.hash(password);
                let result = await DBUser.insertUser(userUuid, mobile, encrypt_password);
                if(!result){
                    responseError(ctx, 400, "REGISTER_FAILED", "register failed");
                    return;
                }else{
                    let refresh_token = signRefreshToken(userUuid, deviceUuid);
                    let token = signToken(userUuid, deviceUuid);
    
                    ctx.status = 200;
                    ctx.body = {
                        refresh_token: refresh_token,
                        token: token
                    };
                }
            }catch (err) {
                responseError(ctx, 400, "CREATE_NEW_USER_ACCOUNT_FAILED", "create new user account failed");
                log.error(err);
            }
        }
    }else{
        responseError(ctx, 400, "INVALID REGISTER TYPE", "invalid register_type");
    }
})

router.post("/login/login", async ctx => {
    log.info("login login")
    const deviceUuid = ctx.request.body.device_uuid;

    let loginType = ctx.request.body.login_type;
    if(loginType === 'mobile'){
        const nation_code = ctx.request.body.nation_code || '86';
        const mobile = ctx.request.body.mobile;
        const password = ctx.request.body.password;

        let user = await DBUser.getUserByMobile(nation_code, mobile);
        if(!user){
            responseError(ctx, 400, "MOBILE_NOT_REGISTERED", "mobile not registered");
            return;
        }else{
            try{
                if(await argon2.verify(user.password, password)){
                    let refresh_token = signRefreshToken(user.uuid, deviceUuid);
                    let token = signToken(user.uuid, deviceUuid);
                    ctx.status = 200;
                    ctx.body = {
                        refresh_token: refresh_token,
                        token: token
                    };
                }else{
                    responseError(ctx, 400, "PASSWORD_NOT_CORRECT", "password not correct");
                }
            }catch (err) {
                responseError(ctx, 400, "LOGIN_VERIFY_FAILED", "login verify failed");
                log.error(err);
            }
        }
    }
})

router.post('/login/refresh_token', async(ctx) => {
    log.info('login refresh_token')

    if(verifyRefreshToken(ctx)){
        let expire_time = await redisClient.hGet('refresh_token_expire_time', ctx.api_user.user_uuid);
        let now_time = Math.floor(Date.now() / 1000);
        if(!expire_time || now_time < expire_time){
            let token = signToken(ctx.api_user.user_uuid, ctx.api_user.device_uuid);
            ctx.status = 200;
            ctx.body = {
                token: token
            };
        }else{
            responseError(ctx, 400, "REFRESH_TOKEN_EXPIRED", "refresh token expired manully");
        }
    }
})

router.post('/login/logout',async(ctx) => {
    log.info('login logout')

    if(verifyRefreshToken(ctx)){
        let time = Math.floor(Date.now() / 1000);
        redisClient.hSet('refresh_token_expire_time', ctx.api_user.user_uuid, time);
        ctx.status = 200;
        ctx.body = {};
    }
})

export default router;