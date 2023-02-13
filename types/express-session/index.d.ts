import 'express-session';
declare module 'express-session' {
	// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
	interface Session {
		email: string;
		authorized: boolean;
	}
}
