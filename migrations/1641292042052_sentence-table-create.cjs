/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('sentence', {
        uuid: {
            type: 'uuid',
            primaryKey: true,
        },
        word_list: {
            type: 'jsonb',
            default: '[]',
        },
        info_json: {
            type: 'jsonb',
            default: '{}',
        },
        ctime: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
        mtime: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        }
    })
    pgm.createIndex('sentence', 'word_list', {
        name: 'sentence_word_list_gin_idx',
        method: 'gin'
    })
};

exports.down = pgm => {
    pgm.dropIndex('sentence', 'word_list', {
        name: 'sentence_word_list_gin_idx'
    })
    pgm.dropTable('sentence');
};
