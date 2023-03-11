import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import mysql from 'mysql';
import {sqlOptions} from './sql/connection';
import expressMysqlSession from 'express-mysql-session';
const mySqlStore = expressMysqlSession(session as any); // ????
import registration from './routes/registration/Registration';
import i18next from './multilanguage/i18n';
import middleware from 'i18next-http-middleware';
import todo from './routes/todo/Todo';
import logout from './routes/logout/Logout';
import forgotPass from './routes/forgot-pass/ForgotPass';
import login from './routes/login/Login';
import changePass from './routes/change-pass/ChangePass';
import user from './routes/user/User';

const app = express();

app.use(cors({credentials: true, origin: true}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.set('trust proxy', 1);
const sessionConnection = mysql.createPool(sqlOptions);

const sessionStore = new mySqlStore({
	createDatabaseTable: true,
	schema: {
		tableName: 'session',
		columnNames: {
			session_id: 'session_id',
			expires: 'expires',
			data: 'data',
		},
	},
}, sessionConnection);

app.use(session({
	name: 'todo-ihor-sessions-name',
	secret: process.env.SESSION_SALT!,
	store: sessionStore,
	resave: true,
	rolling: true,
	saveUninitialized: false,
	proxy: true,
	cookie: {
		maxAge: 1000 * 30 * 60 * 24 * 7 * 4, // 4 weeks
		httpOnly: true,
		sameSite: 'none',
		secure: true,
		domain: 'https://ihor-todo.vercel.app',
	},
}),
);

app.use(middleware.handle(i18next));
app.use('/api', todo, logout, forgotPass, changePass, login, registration, user);

const port = process.env.PORT || 3002;
app.listen(port, () => {
	console.log(`Listening on port ${port}...`);
});
