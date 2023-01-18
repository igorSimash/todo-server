import {FieldPacket, QueryError} from "mysql2";

const mysql = require('mysql2');


const userCheck = (email: string) => {
    return new Promise((resolve, reject) => {

        const connection = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        connection.connect();

        const query =`SELECT * FROM user WHERE user.email = '${email}'`;


        connection.query(query,  (error: QueryError, results: any, fields: FieldPacket[]) => {
            if (error)
                return reject(error);
            resolve(results);
        });

        connection.end();
    });

}

module.exports = userCheck;