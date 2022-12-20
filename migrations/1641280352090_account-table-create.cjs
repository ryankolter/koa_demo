/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('account', {
        uuid: {
            type: 'uuid',
            primaryKey: true,
        },
        nation_code: {
            type: 'varchar(10)',
            default: '86',
        },
        mobile: {
            type: 'varchar(50)',
            unique: true,
        },
        email: {
            type: 'varchar(50)',
            unique: true,
        },
        password: {
            type: 'varchar(200)',
            notNull: true
        },
        display_name: {
            type: 'varchar(50)',
        },
        avatar: {
            type: 'text',
        },
        region: {
            type: 'text',
        },
        info_json: {
            type: 'jsonb',
            default: '{}',
        },
        balance: {
            type: 'numeric',
        },
        vip_last_day: {
            type: 'date',
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

    pgm.createIndex('account', 'mobile', {
        name: 'account_mobile_idx',
        method: 'btree'
    })

    pgm.createIndex('account', 'email', {
        name: 'account_email_idx',
        method: 'btree'
    })
};

exports.down = pgm => {
    pgm.dropTable('account');
};
