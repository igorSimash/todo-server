import {getDatabaseConnector as db} from './db-injector';

const findUserPass = async (email:string) => {
    return db()
        .from('user')
        .select('password_hash')
        .where({email: email});
}

module.exports = findUserPass;