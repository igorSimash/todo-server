import {Response} from "express";
const router = require('express').Router();
const getLanguageCulture = require('../../utils/db/getLanguageCulture.ts')
const error = require('../../assets/constants/errors.json');

router.get('/todo', (req: any, res: Response) => {
    try {
        if (req.session.authorized) {
            getLanguageCulture(req.session.email)
                .then((response: string) => {
                    res.status(200).json({language: response});
                })
        }
        else
            res.status(440).json({message: error.session_expired});
    }
    catch (err) {
        console.error(err);
    }
});

module.exports = router;