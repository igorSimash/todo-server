import {Request, Response} from "express";

const jwt = require('jsonwebtoken');
const router = require('express').Router();
const findUserPass = require('../../utils/db/findUserPass.ts');
const secret = process.env.SMTPSALT;
const error = require('../../assets/constants/errors.json');

router.get('/login', (req:Request, res: Response) => {
    if (req.session.authorized)
        return res.status(200).send();
    return res.status(204).send();
});

router.post('/login', (req: Request, res: Response) => {
    findUserPass(req.body.email)
        .then((response: any) => {
            if (response.length === 0)
                return res.status(401).json({message: error.user_not_found});
            else {
                jwt.verify(response[0].password_hash, secret, async (err: Error, decoded: any) => {
                    if (err)
                        return res.status(498).json({message: error.invalid_token});
                    else {
                        if (decoded.password === req.body.password) {
                            req.session.email = req.body.email;
                            req.session.authorized = true;
                            return res.status(201).send('');
                        }
                        else
                            return res.status(401).json({message: error.invalid_password});
                    }
                })
            }
        })
})

module.exports = router;