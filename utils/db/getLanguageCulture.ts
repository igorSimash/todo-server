import {getDatabaseConnector as db} from './db-injector';


const getLanguageCulture = async (email: string): Promise<string> => {
    return (await db()
        .from('user')
        .join('language', {'language.id': 'user.language_id'})
        .select('language.culture')
        .where({'user.email': email}))[0].culture;
}

module.exports = getLanguageCulture;