const sendEmail = require ("../../utils/email/sendEmail");
const userChangePass = require('../../utils/db/userChangePass.ts');
const isValidEmail = require ("../../utils/email/isValidEmail");
const isValidPassword = require("../../utils/isValidPassword.ts");
const router = require('express').Router();
const error = require('../../assets/constants/errors.json');
import {Response, Request} from "express";
const userCheck = require ("../../utils/db/userCheck");
const jwt = require('jsonwebtoken');
const secret = process.env.SMTPSALT;

router.post('/forgot-pass', async (req:Request, res: Response) => {
    try {
        if (!isValidEmail(req.body.email)){
            return res.status(400).json({message: error.invalid_email});
        }

        if((await userCheck(req.body.email)).length === 0) {
            return res.status(404).json({message: error.user_not_found});
        }

        const jwtToken = jwt.sign({email: req.body.email, language: req.body.language}, secret, {expiresIn: '5m'});
        const emailUrl = new URL(req.protocol + '://' + req.get('host') + `/api/forgot-pass/${jwtToken}`);
        emailUrl.searchParams.append("email", req.body.email);
        try {

            req.i18n.changeLanguage(req.body.language);
            await sendEmail(req.body.email, req.t('forgotPass', {ns: 'mail_subject'}),
                req.t('forgotPass', {ns: 'mail_text'}), emailUrl);
            console.log('Email sent');
            return res.status(200).send();
        }
        catch(err) {
            return res.status(502).json({message: error.send_email_fail});
        }
    }
    catch (err) {
        console.log(err);
    }
})

router.get('/forgot-pass/:token', (req: Request, res: Response) => {
    try {
        jwt.verify(req.params.token, secret, (err: Error, decoded:any) => {
            if(err){
                if (err.message === 'jwt expired') {
                    const URLExpired = new URL(<string>process.env.CLIENT_FORGOT_PASS_410);
                    URLExpired.searchParams.append('email', <string>req.query.email)
                    return res.redirect(URLExpired.href)
                }
                else {
                    return res.status(498).json({message: error.invalid_token});
                }
            }
            else {
                const URLForgPassFinal = new URL(<string>process.env.CLIENT_FORGOT_PASS_FINAL + req.params.token);
                URLForgPassFinal.searchParams.append('language', decoded.language);
                URLForgPassFinal.searchParams.append('email', decoded.email)
                return res.redirect(URLForgPassFinal.href);
            }
        })
    } catch (err) {
        console.log(err);
    }
})

router.post('/forgot-pass-final', (req:Request, res:Response) => {
    jwt.verify(req.body.token, secret, async (err: Error, decoded:any) => {
        if (err) {
            if (err.message === 'jwt expired') {
                return res.status(410).json({message: error.link_expired})
            }
            else {
                return res.status(498).json({message: error.invalid_token});
            }
        }
        else {
            if (decoded.email !== req.body.email)
                return res.status(400).json({message: error.invalid_email})
            if(!isValidPassword(req.body.password))
                return res.status(401).json({message: error.weak_password})
            const jwtPassword = jwt.sign({password: req.body.password}, secret);
            await userChangePass(decoded.email, jwtPassword);
            return res.status(200).send();
        }
    })
})

module.exports = router;