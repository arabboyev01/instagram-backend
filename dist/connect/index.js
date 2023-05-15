import pkg from 'knex';
const { knex } = pkg;
export const dataBase = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        port: 5432,
        user: '',
        password: '',
        database: 'instagram-database'
    },
});
