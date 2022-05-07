import ip from "ip";
import log4js from "koa-log4";
log4js.configure('log4js-conf.json');

const formatAccess = (ctx, costTime) => {
    const user = ctx.api_user ? ctx.api_user.user_uuid : "anonymous_user";
    return `${ctx.method} ${ctx.url} ${ctx.response.status} ${costTime}ms ${user} ${ip.address()}`;
}

export const log = log4js.getLogger('log');
export const logbody = log4js.getLogger('body_log');
export const accessLogger = (ctx, costTime) => log4js.getLogger('access_log').info(formatAccess(ctx, costTime))