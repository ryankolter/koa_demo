/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('dictionary', {
        uuid: {
            type: 'uuid',
            primaryKey: true,
        },
        word: {
            type: 'varchar(50)',
            notNull: true
        },
        property: {
            type: 'varchar(10)',
        },
        explain: {
            type: 'varchar(50)',
        },
        sound: {
            type: 'jsonb',
            default: '{}',
        },
        pronounce: {
            type: 'jsonb',
            default: '{}',
        },
        difficulty: {
            type: 'integer'
        },
        order: {
            type: 'integer',
            default: 0,
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
    pgm.createIndex('dictionary', 'word', {
        name: 'dictionary_word_idx',
        method: 'btree'
    })
    pgm.createIndex('dictionary', 'difficulty', {
        name: 'dictionary_difficulty_idx',
        method: 'btree'
    })
    pgm.addConstraint('dictionary', 'dictionary_word_property_explain_unique_constraint', {"unique": ['word', 'property', 'explain']})
};

exports.down = pgm => {
    pgm.dropConstraint('dictionary', 'dictionary_word_property_explain_unique_constraint');
    pgm.dropIndex('dictionary', 'difficulty', {
        name: 'dictionary_difficulty_idx'
    })
    pgm.dropIndex('dictionary', 'word', {
        name: 'dictionary_word_idx'
    })
    pgm.dropTable('dictionary');
};
