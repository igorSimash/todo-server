import {getDatabaseConnector as db} from './db-injector'

const userCheck =  async (email: string) => {
       return db()
            .from('user')
            .select('id')
            .where({email: email})


}

module.exports = userCheck;