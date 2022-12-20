import os from "os";
import fs from "fs";
import path from "path";
const __dirname = path.resolve();

import { Log } from "../utils/api_log.js";
const log = new Log("setRouter");

const setRouter = async (app, relative_path) => {
    log.info("middleware set router in directory", null, { relative_path });
    const platformName = os.platform().toString();
    const base_path = path.join(__dirname, relative_path);
    const files = fs.readdirSync(base_path);

    for (let file of files){
        log.info("set router", null, { file });
        const file_path_prefix = platformName.startsWith("win") ? "file://" : "";
        let module = await import(file_path_prefix + path.join(base_path, file));
        let router = module.default;
        app.use(router.routes()).use(router.allowedMethods())
    }
}

export default setRouter;