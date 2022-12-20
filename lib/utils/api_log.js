import ip from "ip";
import log4js from "koa-log4";
log4js.configure('log4js-conf.json');

export class Log {
    constructor(name) {
        this.name = name;
        this.log = log4js.getLogger('log');
    }

    format(explaination, user_uuid, obj) {
        let str = `==[${this.name}]${explaination}==[${user_uuid ? user_uuid : ''}]`;
        if (obj) {
            Object.keys(obj).forEach((key) => {
                str += `[${key}]${obj[key]}`;
            })
        }
        return str;
    }

    debug(explaination, user_uuid, obj) {
        if (typeof explaination !== 'string') return;
        this.log.debug(this.format(explaination, user_uuid, obj));
    }

    info(explaination, user_uuid, obj) {
        if (typeof explaination !== 'string') return;
        this.log.info(this.format(explaination, user_uuid, obj));
    }

    warn(explaination, user_uuid, obj) {
        if (typeof explaination !== 'string') return;
        this.log.warn(this.format(explaination, user_uuid, obj));
    }

    error(explaination, user_uuid, obj) {
        if (typeof explaination !== 'string') return;
        this.log.error(this.format(explaination, user_uuid, obj));
    }
}

const formatAccess = (ctx, costTime) => {
    const user = ctx.api_user ? ctx.api_user.user_uuid : "anonymous_user";
    return `${ctx.method} ${ctx.url} ${ctx.response.status} ${costTime}ms ${user} ${ip.address()}`;
}

export const accessLogger = (ctx, costTime) => log4js.getLogger('access_log').info(formatAccess(ctx, costTime))