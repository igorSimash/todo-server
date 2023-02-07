import {getDatabaseConnector as db} from './db-injector';


const getLanguage = async (email: string) => {
    return db()
        .from('user')
        .join('language', {'language.id': 'user.language_id'})
        .select('language.name_short')
        .where({'user.email': email})
}

module.exports = getLanguage;