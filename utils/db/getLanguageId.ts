import {getDatabaseConnector as db} from './db-injector';

const getLanguageId = async (culture: string):Promise<number> => {
    return (await db()
    ('language')
        .select('id')
        .where({culture}))[0].id;
}
module.exports = getLanguageId;