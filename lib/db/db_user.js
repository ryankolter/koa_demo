import { Log } from "../utils/api_log.js";
const log = new Log("db_user");
import { pool } from "./db_core.js";

const db_user = {};

db_user.getUserByMobile = async (nation_code, mobile) => {
    log.info("getUserByMobile");
    try{
        let sql = `SELECT * FROM account WHERE nation_code = $1 AND mobile = $2`;

        let result = await pool.query(sql, [nation_code, mobile]);
        if(result.rowCount === 0) return null;
        return result.rows[0];
    }catch(e){
        log.error(e)
    }
}

db_user.insertUser = async(userUuid, mobile, password_encrypt) => {
    log.info('insertUser');

    const sql = `INSERT INTO account(uuid, mobile, password) VALUES ($1, $2, $3)`;
    const result = await pool.query(sql, [userUuid, mobile, password_encrypt]);
    return result.rowCount > 0;
};

export default db_user;