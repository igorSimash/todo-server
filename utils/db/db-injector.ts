const knex = require("knex");
const connect_sql = require('../../sql/connection.ts');
import { Knex } from "knex";

let cachedConnection: Knex.Config;

export const getDatabaseConnector = () => {
    if (cachedConnection) {
        console.log('cachedConnection')
        return cachedConnection;
    }
    const config = {
        client: 'mysql',
        connection: connect_sql
    }

    const connection = knex(config);
    cachedConnection = connection;
    return connection;
}