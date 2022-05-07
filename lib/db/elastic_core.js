import { Client } from '@elastic/elasticsearch';
import config from "config";
import {log} from "../utils/api_log.js";

const client = new Client({ node: config.get('elasticConfig.url') })

client.on('error', (err) =>{
    log.error('elastic client err:', err);
})

const hitsFilter = (hit, fieldsArray) => {
    const filtered = {};
    filtered.score = hit._score;
    fieldsArray.forEach((field) => {
        if (hit._source[field]) {
            filtered[field] = hit._source[field];
        }
    });
    return filtered;
}

export const elasticSearch = async (obj, fieldsArray) => {
    const { body } = await client.search(obj);
    return {
        total: body.hits.total.value,
        hits: body.hits.hits.map((hit)=>{
            return hitsFilter(hit, fieldsArray);
        })
    };
}