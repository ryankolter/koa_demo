import path from "path";
import { log, accessLogger } from "../utils/api_log.js";
import cors from "@koa/cors";
// import helmet from "koa-helmet";
import bodyParser from "koa-bodyparser";
import session from "koa-session";
import conditional from "koa-conditional-get";
import etag from "koa-etag";
import compress from "koa-compress";
import serve from "koa-static-server";
import views from "koa-views";

const setCommon = async (app)=>{
    log.debug("== set common middleware");

    app.use(async (ctx, next) => {
        const start = new Date();
        await next();
        const ms = new Date() - start;
        accessLogger(ctx, ms);
    });
    app.use(cors());
    // app.use(helmet())

    app.use(bodyParser({
        enableTypes: ['json', 'form', 'text'],
        extendTypes: {
            text: ['text/xml', 'application/xml']
        },
        jsonLimit: '100mb',
        textLimit: '100mb',
        formLimit: '100mb'
    }));

    app.keys = [process.env.NEW_SESSION_KEY,process.env.OLD_SESSION_KEY];
    app.use(session(app))
    
    app.use(conditional());
    app.use(etag());

    let zlib = await import('zlib');
    app.use(compress({
        filter (content_type) {
            return /text|javascript|css/.test(content_type)
        },
        threshold: 512,
        gzip: {
          flush: zlib.default.constants.Z_SYNC_FLUSH
        },
        deflate: {
          flush: zlib.default.constants.Z_SYNC_FLUSH,
        }
    }));

    app.use(serve({
        rootDir:'static', 
        rootPath:'/static', 
        maxage: 10 * 1000
    }));

    app.use(views('views',{
        map: {html: 'ejs'}
    }))

    app.on('error', (err) => {
        log.error(err);
    })
}

export default setCommon;

