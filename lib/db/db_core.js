import config from "config";
import Pool from "pg-pool";

export const pool = new Pool(config.get("dbConfig"));

export const MountDBSession = async (ctx, next) => {
    const client = await db.pool.connect();
    ctx.defaultDBSession = client;
    try {
        await client.query('BEGIN');
        await next();
        await client.query('COMMIT');
    } catch (e) {
        await client.query('ROLLBACK');
        log.info('mount DB session error: ', e);
        throw e;
    } finally {
        await client.release();
    }
}