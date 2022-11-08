var express = require('express');

const jwt = require('jsonwebtoken')

const router= express.Router();

var dbConn = require('../../config/db');

router.get('/report-all/:staff_id', (req,res) => {
    var token = req.headers.authorization;

    if(!token){
        res.status(400).json({success: false, msg: 'Error, Token was not found'});
        return;
    }

    token = req.headers.authorization.split(' ')[1];
    const decodedTOKEN = jwt.verify(token, process.env.TOKEN_SECRET);

    var staff_id = req.params.staff_id;
    var reservation_id = req.body.reservation_id;
    var transaction_id = req.body.transaction_id;

});

module.exports = router;

