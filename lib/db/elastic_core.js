import { Client } from '@elastic/elasticsearch';
import config from "config";
import { Log } from "../utils/api_log.js";
const log = new Log("elastic_core");

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


// //code to generate test data, only execute once
// await client.index({
//     index: 'game-of-thrones',
//     body: {
//         character: 'Ned Stark',
//         quote: 'Winter is coming.'
//     }
// })

// await client.index({
//     index: 'game-of-thrones',
//     body: {
//         character: 'Daenerys Targaryen',
//         quote: 'I am the blood of the dragon.'
//     }
// })

// await client.index({
//     index: 'game-of-thrones',
//     body: {
//         character: 'Tyrion Lannister',
//         quote: 'A mind needs books like a sword needs a whetstone.'
//     }
// })

// await client.indices.refresh({ index: 'game-of-thrones' })