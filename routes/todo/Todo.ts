import {Response} from "express";
const router = require('express').Router();
const getLanguage = require('../../utils/db/getLanguage.ts')

router.get('/todo', (req: any, res: Response) => {
    try {
        getLanguage(req.session.email)
            .then((response: any) => {
                res.status(200).json({language: response[0].name_short})
            })
    }
    catch (err) {
        console.error(err);
    }
});

module.exports = router;