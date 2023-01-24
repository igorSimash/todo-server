require("dotenv").config();
const express = require("express");
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session    = require('express-session');
const mysql = require('mysql');
const options = require('./sql/connection.ts')
const MySQLStore = require('express-mysql-session')(session);
const registration = require("./routes/registration/Registration.ts");
const login = require("./routes/login/Login.ts");


const app = express();

app.use(cors());



app.use(bodyParser());

// const sessionStore = new MySQLStore(options);

const sessionConnection = mysql.createConnection(options);

const sessionStore = new MySQLStore({
    expiration: 10800000,
    createDatabaseTable: true,
    schema: {
        tableName: 'session',
        columnNames: {
            session_id: 'session_id',
            expires: 'expires',
            data: 'data'
        }
    }
}, sessionConnection);

app.use(cookieParser());

app.use(session({
    key: "my key",
    secret: 'weioth2j5l23kj23j',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
}));


app.use(express.json());

app.use("/api", registration);

app.use("/api", login);

const port = process.env.PORT || 3002;
app.listen(port, () => console.log(`Listening on port ${port}...`));