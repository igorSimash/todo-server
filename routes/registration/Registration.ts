const router = require('express').Router();
const sendEmail = require('../../utils/email/sendEmail.ts');
const userCheck = require('../../utils/db/userCheck.ts');
import {Request, Response} from "express";
const jwt = require('jsonwebtoken');
const isValidEmail = require('../../utils/isValidEmail.ts')
const addUser = require('../../utils/db/addUser.ts');

const secret = process.env.SMTPSALT


router.post('/registration', async (req: Request, res:Response) => {
    try {
        if (!isValidEmail(req.body.email)){
            return res.status(400).json({message: 'Email is invalid'});
        }

        if((await userCheck(req.body.email)).length > 0) {
             return res.status(409).json({message: 'Email is already registered'});
        }
        const jwtToken = jwt.sign({email: req.body.email}, secret, {expiresIn: '5m'});

        const emailUrl = new URL(req.protocol + '://' + req.get('host') + `/api/registration/${jwtToken}`);
        emailUrl.searchParams.append("email", req.body.email);

        try {
            await sendEmail(req.body.email, 'Your url', emailUrl)
            console.log('Email sent');
            return res.status(200).send();
        }
        catch(err) {
            return res.status(502).json({message: 'Failed to send the email'});
        }

    }
    catch(err){
        console.error(err);
    }
});

router.get('/registration/:token', (req: Request, res:Response) => {
    try {
        jwt.verify(req.params.token, secret, (err: Error, decoded:any) => {
            if(err){
                if (err.message === 'jwt expired') {
                    const URLExpired = new URL('http://localhost:3000/registration/start/410');
                    URLExpired.searchParams.append('email', <string>req.query.email)
                    return res.redirect(URLExpired.href)
                }
                else {
                    return res.status(404).json({message: 'Invalid token'});
                }
            }
            else {
                const URLRegFinal = new URL('http://localhost:3000/registration/final/');
                URLRegFinal.searchParams.append('email', decoded.email)
                return res.redirect(URLRegFinal.href);
            }
        })
    }
    catch(err) {
        console.error(err);
    }
})

router.post('/registration-final', (req: Request, res:Response) => {
    addUser('yeahyeah@ukr.net', 'oiuergoeigoeirhgioerhg123axd', 3);
})

module.exports = router;