import config from "config";
import { Log } from "../../../utils/api_log.js";
const log = new Log("upload");

import KoaRouter from "koa-router";
const router = new KoaRouter({
    prefix: config.get("routerPrefix") + "/v1"
});

import multer from "@koa/multer";
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/')
    },
    filename: (req, file, cb) => {
        let fileFormat = (file.originalname).split(".");
        cb(null,Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
})
const upload = multer({storage: storage});

router.post('/upload/single_file', upload.single('avatar'), async (ctx) => {
    log.info("upload single file", null, { traceId: ctx.traceId });
    log.info("body", null, { traceId: ctx.traceId, body: JSON.stringify(ctx.request.body) });
    log.info("file", null, { traceId: ctx.traceId, file: JSON.stringify(ctx.file) });
    ctx.body = 'done';
})

export default router;