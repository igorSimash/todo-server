const router = require('express').Router();
const sendEmail = require('../../utils/email/sendEmail.ts');
const userCheck = require('../../utils/db/userCheck.ts');
import {Request, Response} from "express";
const jwt = require('jsonwebtoken');
const isValidEmail = require('../../utils/email/isValidEmail.ts')
const addUser = require('../../utils/db/addUser.ts');
const getLanguageId = require('../../utils/db/getLanguageId.ts');
const error = require('../../assets/constants/errors.json');
const secret = process.env.SMTPSALT;
const isValidPassword = require("../../utils/isValidPassword.ts");

router.post('/registration', async (req: any, res:Response) => {
    try {
        if (!isValidEmail(req.body.email)){
            return res.status(400).json({message: error.invalid_email});
        }

        if((await userCheck(req.body.email)).length > 0) {
             return res.status(409).json({message: error.email_already_registered});
        }
        const jwtToken = jwt.sign({email: req.body.email, language: req.body.language}, secret, {expiresIn: '5m'});

        const emailUrl = new URL(req.protocol + '://' + req.get('host') + `/api/registration/${jwtToken}`);
        emailUrl.searchParams.append("email", req.body.email);

        try {

            req.i18n.changeLanguage(req.body.language);
            await sendEmail(req.body.email, req.t('registration', {ns: 'mail_subject'}),
                req.t('registration', {ns: 'mail_text'}), emailUrl);
            console.log('Email sent');
            return res.status(200).send();
        }
        catch(err) {
            console.log(err);
            return res.status(502).json({message: error.email_already_registered});
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
                    const URLExpired = new URL(<string> process.env.CLIENT_REG_START_410);
                    URLExpired.searchParams.append('email', <string>req.query.email)
                    return res.redirect(URLExpired.href)
                }
                else {
                    return res.status(498).json({message: error.invalid_token});
                }
            }
            else {
                const URLRegFinal = new URL(<string>process.env.CLIENT_REG_FINAL + req.params.token);
                URLRegFinal.searchParams.append('language', decoded.language);
                URLRegFinal.searchParams.append('email', decoded.email);
                return res.redirect(URLRegFinal.href);
            }
        })
    }
    catch(err) {
        console.error(err);
    }
})

router.post('/registration-final', (req: Request, res:Response) => {
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
                return res.status(400).json({message: error.invalid_email});
            if(!isValidPassword(req.body.password))
                return res.status(401).json({message: error.weak_password});
            const jwtPassword = jwt.sign({password: req.body.password}, secret);
            await addUser(req.body.email, jwtPassword, await getLanguageId(req.body.language));
            return res.status(200).send()
        }
    })
})

module.exports = router;