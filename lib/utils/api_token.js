import { Log } from "./api_log.js";
const log = new Log("api_token");
import jwt from "jsonwebtoken";
import { responseError } from "./common.js";
import config from "config";
import { redisClient } from "../db/redis_core.js";

const OLD_JWT_TOKEN_SECRET = config.get("old_jtw_token_secret");
const NEW_JWT_TOKEN_SECRET = config.get("new_jtw_token_secret");

export const signToken = (userUuid, deviceUuid) => {
    let obj = {
        user_uuid: userUuid,
        device_uuid: deviceUuid
    };
    let options = {
        expiresIn: '1h',
    };
    return jwt.sign(obj, NEW_JWT_TOKEN_SECRET, options);
}

export const verifyToken = (ctx) => {
    const token = ctx.request.headers['x-access-token'] || ctx.request.body.token || ctx.request.query.token;
    if (!token) {
        return false;
    }

    try {
        let decoded = jwt.verify(token, NEW_JWT_TOKEN_SECRET);
        if (decoded) {
            ctx.api_user = decoded;
            return true;
        } else {
            decoded = jwt.verify(token, OLD_JWT_TOKEN_SECRET);
            if (decoded) {
                ctx.api_user = decoded;
                return true;
            } else {
                responseError(ctx, 401, "TOKEN_INVALID", "Token parse exception");
            }
        }
    } catch(err) {
        if (err.name === 'TokenExpiredError') {
            responseError(ctx, 401, "TOKEN_EXPIRED", err.message);
            log.info("Token expired");
        } else {
            responseError(ctx, 401, "TOKEN_INVALID", err.message);
            log.error("Other token exception - ", err);
        }
    }
    return false;
}

export const signRefreshToken = (userUuid, deviceUuid) => {
    let obj = {
        user_uuid: userUuid,
        device_uuid: deviceUuid
    };
    let options = {
        expiresIn: '30d',
    };
    const time = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;
    redisClient.hSet('refresh_token_expire_time', userUuid, time);
    return jwt.sign(obj, NEW_JWT_TOKEN_SECRET, options);
}

export const verifyRefreshToken = (ctx) => {
    const token = ctx.request.headers['x-access-refresh-token'] || ctx.request.body.refresh_token || ctx.request.query.refresh_token;
    if (!token) {
        log.warn("Not found refresh token in request - ", ctx.url);
        responseError(ctx, 401, "REFRESH_TOKEN_REQUIRED", "Token is needed for the request.");
        return false;
    }

    try {
        let decoded = jwt.verify(token, NEW_JWT_TOKEN_SECRET);
        if (decoded) {
            ctx.api_user = decoded;
            return true;
        } else {
            decoded = jwt.verify(token, OLD_JWT_TOKEN_SECRET);
            if (decoded) {
                ctx.api_user = decoded;
                return true;
            } else {
                responseError(ctx, 401, "REFRESH_TOKEN_INVALID", "Token parse exception");
            }
        }
    } catch(err) {
        if (err.name === 'TokenExpiredError') {
            responseError(ctx, 401, "REFRESH_TOKEN_EXPIRED", err.message);
        } else {
            responseError(ctx, 401, "REFRESH_TOKEN_INVALID", err.message);
        }
    }
    return false;
}