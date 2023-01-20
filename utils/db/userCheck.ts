import {getDatabaseConnector as db} from './db-injector'

const userCheck =  async (email: string) => {
       return db()
            .from('user')
            .select('*')
            .where({email: email})
            // .then((rows:any)=> {
            //     return rows
            // })
            // .catch((err:Error) => {
            //     return err
            // })


}

module.exports = userCheck;