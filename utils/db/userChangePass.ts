import {getDatabaseConnector as db} from './db-injector';

const userChangePass = async (email:string, password_hash: string) => {
   await db()
    ("user")
        .where('email', '=', email)
        .update({password_hash: password_hash})
}

module.exports = userChangePass;