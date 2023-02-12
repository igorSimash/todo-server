import {Request, Response} from "express";
const router = require('express').Router();

router.get('/logout', (req:Request, res:Response) => {
    if (req.session.authorized) {
        req.session.destroy(err => console.error(err));
        return res.status(200).send()
    }
    return res.status(204).send();
})

module.exports = router;