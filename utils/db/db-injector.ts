const knex = require("knex");
import { Knex } from "knex";

let cachedConnection: Knex.Config;

export const getDatabaseConnector = () => {
    if (cachedConnection) {
        console.log('cachedConnection')
        return cachedConnection;
    }
    const config = {
        client: 'mysql2',
        connection: {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        }
    }

    const connection = knex(config);
    cachedConnection = connection;
    return connection;
}