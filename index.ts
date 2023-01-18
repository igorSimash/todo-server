require("dotenv").config();
const express = require("express");
const cors = require('cors');
const registration = require("./routes/registration/Registration.ts");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", registration);
const port = process.env.PORT || 3002;
app.listen(port, () => console.log(`Listening on port ${port}...`));


// // const mysql = require('mysql2');
// // const connection = mysql.createConnection({
// //     host     : 'localhost',
// //     user     : 'Ihor',
// //     password : '3333',
// //     database : 'todo_db'
// // });
// //
// // connection.connect();
// //
// // const query = 'SELECT * FROM language';
// //
// // connection.query(query, (error, results, fields) => {
// //     if (error) throw error;
// //     console.log(results);
// // });
// //
// // connection.end();