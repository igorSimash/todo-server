import {Response} from "express";
const router = require('express').Router();
const getLanguage = require('../../utils/db/getLanguage.ts')

router.get('/todo', (req: any, res: Response) => {
    try {
        if (req.session.authorized) {
            getLanguage(req.session.email)
                .then((response: {culture:string}[]) => {
                    res.status(200).json({language: response[0].culture});
                })
        }
        else
            res.status(440).json({message: 'Session expired'});
    }
    catch (err) {
        console.error(err);
    }
});

module.exports = router;