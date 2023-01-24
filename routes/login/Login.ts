import {Response} from "express";

const jwt = require('jsonwebtoken');
const router = require('express').Router();
const findUserPass = require('../../utils/db/findUserPass.ts');
const secret = process.env.SMTPSALT;

router.get('/login', (req:any, res:any) => {
    console.log(req.signedCookies);
    if(req.session.email){
        res.send("Hello "+ req.session.email + " Welcome")
    }
    else{
        res.send("Not Logged In")
    }
})

router.post('/login', (req: any, res: Response) => {

    // if (findUserPass())
    // if (req.session.user){
    //     console.log('already logged in');
    // }
    // else{
    //
    // }

    // jwt.verify(findUserPass(req.body.email), secret, async (err: Error, decoded:any) =>{
    //     if (err) {
    //         console.log(err);
    //     }
    // })

    findUserPass(req.body.email)
        .then((response: any) => {
            if (response.length === 0) {
                return res.status(401).json({message: 'Invalid Email'})
            } else {
                jwt.verify(response[0].password_hash, secret, async (err: Error, decoded: any) => {
                    if (err) {
                        return res.status(404).json({message: 'Invalid token'})
                    } else {
                        if (decoded.password === req.body.password) {
                            console.log('Passwords are equal. User can be logged in');
                            req.session.email = {
                                email: 'asdf@example.'
                            };
                            console.log(req.session);
                            return res.status(200).json({message: ''})
                        } else {
                            return res.status(401).json({message: 'Invalid password'})
                        }
                    }
                })

            }
        })
})

module.exports = router;