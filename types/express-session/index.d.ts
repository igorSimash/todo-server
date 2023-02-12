import 'express-session';
declare module "express-session" {
    interface Session {
        email: string;
        authorized: boolean;
    }
}