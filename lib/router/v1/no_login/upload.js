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

router.post('/upload/single_file', upload.single('avatar'),
(ctx) => {
    log.info("upload single file")
    log.info(ctx.file);
    log.info(ctx.request.body);
    ctx.body = 'done';
})

export default router;