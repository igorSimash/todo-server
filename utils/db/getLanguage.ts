import {getDatabaseConnector as db} from './db-injector';


const getLanguage = async (email: string): Promise<{culture: string}[]> => {
    return db()
        .from('user')
        .join('language', {'language.id': 'user.language_id'})
        .select('language.culture')
        .where({'user.email': email})
}

module.exports = getLanguage;