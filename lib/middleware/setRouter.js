import fs from "fs";
import path from "path";
const __dirname = path.resolve();

import {log} from "../utils/api_log.js";

const setRouter = async (app, relative_path) => {
    log.debug("== set router middleware in " + relative_path)
    let base_path = __dirname + relative_path;
    let files = fs.readdirSync(base_path);

    for (let file of files){
        let module = await import(base_path + file)
        let router = module.default;
        app.use(router.routes()).use(router.allowedMethods())
    }
}

export default setRouter;