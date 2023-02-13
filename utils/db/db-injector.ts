import knex, {type Knex} from 'knex';
import {sqlOptions} from '../../sql/connection';

let cachedConnection: Knex;
export const getDatabaseConnector = (): Knex => {
	if (cachedConnection) {
		console.log('cachedConnection');
		return cachedConnection;
	}

	const config = {
		client: 'mysql',
		connection: sqlOptions,
	};
	const connection = knex(config);
	cachedConnection = connection;
	return connection;
};
