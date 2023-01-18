const router = require('express').Router();
const CryptoJS = require('crypto-js');
const sendEmail = require('../../utils/email/sendEmail.ts');
const userCheck = require('../../utils/db/userCheck.ts');
import {Request, Response} from "express"
router.post('/registration/start', async (req: Request, res:Response) => {
    try {

        await userCheck(req.body.email)
            .then((response: Response[]) => {
                if(response[0]){
                    console.log('You are already registered')
                }
            })

        console.log(123);
        const date = new Date();
        const dateToConfirm = new Date(date.setMinutes(date.getMinutes() + 30)).toString().slice(0, 24).replaceAll(" ", "-");
        const token = CryptoJS.SHA256(req.body.email + dateToConfirm + process.env.SMTPSALT).toString();
        const url = req.protocol + '://' + req.get('host') + `/api/registration/${req.body.email}/${dateToConfirm}/${token}`;
        // sendEmail(req.body.email, 'Your url', url);
    }
    catch(err){
        console.error(err);
    }
});

router.get('/registration/:email/:date/:token', (req: Request, res:Response) => {
    try {
        const resultToken = CryptoJS.SHA256(req.params.email + req.params.date + process.env.SMTPSALT).toString();
        console.log(new Date(req.params.date.replaceAll("-", " ")) + " and " + new Date())
        if(resultToken === req.params.token
            && new Date(req.params.date.replaceAll("-", " ")) > new Date())
            return res.redirect(`http://localhost:3000/registration/${req.params.email}/${req.params.date}/${req.params.token}`);
        else {
            res.send('Invalid token');
        }
    }
    catch(err) {
        console.error(err);
    }

})

module.exports = router;