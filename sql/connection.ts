import Config, {type Knex} from 'knex';
import {type ConnectionConfig} from 'mysql';

export const sqlOptions: any = {
	host: process.env.DB_HOST!,
	port: Number(process.env.DB_PORT),
	user: process.env.DB_USER!,
	password: process.env.DB_PASSWORD!,
	database: process.env.DB_NAME!,
};
