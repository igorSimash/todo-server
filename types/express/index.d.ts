import "express";

declare module "express" {
    export interface Request {
        i18n: any;
        t: any;
    }
}