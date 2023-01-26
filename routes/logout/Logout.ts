import {Response} from "express";
const router = require('express').Router();

router.get('/logout', (req:any, res:Response) => {
    if (req.session.authorized) {
        req.session.destroy();
        return res.status(200).send()
    }
    return res.status(204).send();
})

module.exports = router;