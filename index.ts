require("dotenv").config();
const express = require("express");
const cors = require('cors');
const bodyParser = require('body-parser');
const session    = require('express-session');
const mysql = require('mysql');
const options = require('./sql/connection.ts')
const MySQLStore = require('express-mysql-session')(session);
const registration = require("./routes/registration/Registration.ts");
const login = require("./routes/login/Login.ts");
const logout = require("./routes/logout/Logout.ts");

const app = express();

app.use(cors({credentials: true, origin: true}));

app.use(bodyParser());

const sessionConnection = mysql.createConnection(options);

const sessionStore = new MySQLStore({
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


app.use(session({
    key: "session-id",
    secret: process.env.SESSION_SALT,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
    })
);


app.use(express.json());

app.use("/api", registration);
app.use("/api", login);
app.use("/api", logout);

const port = process.env.PORT || 3002;
app.listen(port, () => console.log(`Listening on port ${port}...`));