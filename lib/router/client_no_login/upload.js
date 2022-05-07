import KoaRouter from "koa-router";
import config from "config";
import {log} from "../../utils/api_log.js";

const routerPrefix = config.get("routerPrefix");
const router = new KoaRouter({
    prefix: routerPrefix
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

router.post('/upload_single_file', upload.single('avatar'),
(ctx) => {
    log.debug("== upload single file")
    console.log(ctx.file);
    console.log(ctx.request.body);
    ctx.body = 'done';
})

export default router;